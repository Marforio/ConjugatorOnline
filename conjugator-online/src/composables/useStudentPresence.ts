import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

type WsLike = WebSocket | null;

let ws: WsLike = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let intentionalClose = false;
let reconnectAttempts = 0;
let lastToken = "";
let authBlocked = false;

// single-flight guards
let connectInFlight: Promise<void> | null = null;
let refreshInFlight: Promise<string | null> | null = null;
let lastAuthFailureAt = 0;

const PING_MS = 25000;
const MAX_BACKOFF_MS = 10000;
const AUTH_FAILURE_COOLDOWN_MS = 15000;

function nowMs() {
  return Date.now();
}

function clearTimers() {
  if (pingTimer) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function stopReconnect(reason: string) {
  authBlocked = true;
  clearTimers();
  console.warn("STUDENT_WS reconnect stopped:", reason);
}

function inAuthCooldown() {
  return nowMs() - lastAuthFailureAt < AUTH_FAILURE_COOLDOWN_MS;
}

function markAuthFailure(reason: string) {
  lastAuthFailureAt = nowMs();
  stopReconnect(reason);
}

export function useStudentPresence() {
  const auth = useAuthStore();
  const route = useRoute();

  function getToken() {
    return auth.access || "";
  }

  function wsBase() {
    return (import.meta.env.VITE_WS_BASE_URL || "").replace(/\/+$/, "");
  }

  function wsUrl(token: string) {
    return `${wsBase()}/ws/student/presence/?token=${encodeURIComponent(token)}`;
  }

  async function ensureFreshAccessSingleFlight(): Promise<string | null> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
      const current = getToken();
      if (!current) return null;
      if (!auth.isAccessTokenExpired()) return current;

      try {
        await auth.refreshAccessToken();
        return auth.access || null;
      } catch {
        return null;
      }
    })();

    try {
      return await refreshInFlight;
    } finally {
      refreshInFlight = null;
    }
  }

  function sendJson(payload: Record<string, any>) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(payload));
  }

  function sendPing() {
    sendJson({
      type: "presence.ping",
      page: route.fullPath || "",
      timestamp: Date.now(),
    });
  }

  function sendPage(page?: string) {
    sendJson({
      type: "presence.page",
      page: page ?? route.fullPath ?? "",
      timestamp: Date.now(),
    });
  }

  function cleanupSocketOnly() {
    if (!ws) return;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    try {
      intentionalClose = true;
      ws.close(1000, "cleanup");
    } catch {}
    ws = null;
  }

  function scheduleReconnect() {
    if (intentionalClose || authBlocked) return;
    if (reconnectTimer) return;
    if (inAuthCooldown()) return;

    const backoff = Math.min(1000 * 2 ** reconnectAttempts, MAX_BACKOFF_MS);
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void connect();
    }, backoff + Math.floor(Math.random() * 250));
  }

  async function connectInternal() {
    if (authBlocked || inAuthCooldown()) return;

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    const token = await ensureFreshAccessSingleFlight();
    if (!token) {
      markAuthFailure("no valid token (refresh failed)");
      return;
    }

    intentionalClose = false;
    lastToken = token;
    ws = new WebSocket(wsUrl(token));

    ws.onopen = () => {
      reconnectAttempts = 0;
      authBlocked = false;
      lastAuthFailureAt = 0;
      sendPage(route.fullPath || "app_boot");
      sendPing();
      pingTimer = setInterval(sendPing, PING_MS);
      console.log("STUDENT_WS open", ws?.url);
    };

    ws.onmessage = () => {};

    ws.onerror = (evt) => {
      console.warn("STUDENT_WS error", evt, "url=", ws?.url);
    };

    ws.onclose = (evt) => {
      console.warn("STUDENT_WS close", {
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean,
        url: ws?.url,
      });

      clearTimers();
      ws = null;

      if (evt.code === 4403 || evt.code === 1008) {
        markAuthFailure(`server rejected (${evt.code})`);
        return;
      }

      if (evt.code === 1006 && auth.isAccessTokenExpired()) {
        markAuthFailure("abnormal close (1006) with expired auth");
        return;
      }

      scheduleReconnect();
    };
  }

  async function connect() {
    if (connectInFlight) return connectInFlight;
    connectInFlight = (async () => {
      await connectInternal();
    })();
    try {
      await connectInFlight;
    } finally {
      connectInFlight = null;
    }
  }

  function disconnect() {
    intentionalClose = true;
    clearTimers();
    cleanupSocketOnly();
  }

  function onRouteChanged() {
    sendPage(route.fullPath || "");
  }

  async function onTokenRefreshed() {
    const current = getToken();
    if (!current) return;

    authBlocked = false;

    if (current !== lastToken) {
      disconnect();
      await connect();
    }
  }

  return {
    connect,
    disconnect,
    sendPing,
    sendPage,
    onRouteChanged,
    onTokenRefreshed,
  };
}