import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

type WsLike = WebSocket | null;

export function useStudentPresence() {
  const auth = useAuthStore();
  const route = useRoute();

  let ws: WsLike = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;
  let reconnectAttempts = 0;
  let lastToken = "";
  let authBlocked = false;

  const PING_MS = 25000;
  const MAX_BACKOFF_MS = 10000;

  function getToken() {
    // single source of truth
    return auth.access || "";
  }

  function wsBase() {
    return (import.meta.env.VITE_WS_BASE_URL || "").replace(/\/+$/, "");
  }

  function wsUrl(token: string) {
    return `${wsBase()}/ws/student/presence/?token=${encodeURIComponent(token)}`;
  }

  async function ensureValidToken(): Promise<string | null> {
    const token = getToken();
    if (!token) return null;

    if (!auth.isAccessTokenExpired()) return token;

    try {
      await auth.refreshAccessToken();
      return auth.access || null;
    } catch {
      return null;
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

  function cleanupSocketOnly() {
    if (!ws) return;
    try {
      intentionalClose = true;
      ws.close(1000, "cleanup");
    } catch {}
    ws = null;
  }

  function stopReconnect(reason: string) {
    authBlocked = true;
    clearTimers();
    console.warn("STUDENT_WS reconnect stopped:", reason);
  }

  function scheduleReconnect() {
    if (intentionalClose || authBlocked) return;
    const backoff = Math.min(1000 * 2 ** reconnectAttempts, MAX_BACKOFF_MS);
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(() => {
      connect();
    }, backoff + Math.floor(Math.random() * 250));
  }

  async function connect() {
    if (authBlocked) return;

    // prevent duplicates
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = await ensureValidToken();
    if (!token) {
      stopReconnect("no valid token");
      return;
    }

    intentionalClose = false;
    lastToken = token;
    ws = new WebSocket(wsUrl(token));

    ws.onopen = () => {
      reconnectAttempts = 0;
      authBlocked = false;
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
      console.warn("STUDENT_WS close", { code: evt.code, reason: evt.reason, wasClean: evt.wasClean, url: ws?.url });
      clearTimers();
      ws = null;

      if (evt.code === 4403 || evt.code === 1008) {
        stopReconnect(`server rejected (${evt.code})`);
        return;
      }

      scheduleReconnect();
    };
  }

  function disconnect() {
    clearTimers();
    cleanupSocketOnly();
  }

  function onRouteChanged() {
    sendPage(route.fullPath || "");
  }

  function onTokenRefreshed() {
    const current = getToken();
    if (!current) return;
    authBlocked = false;

    if (current !== lastToken) {
      disconnect();
      connect();
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