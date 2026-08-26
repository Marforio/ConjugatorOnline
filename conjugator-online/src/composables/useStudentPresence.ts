import { onBeforeUnmount } from "vue";
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

  const PING_MS = 25000;
  const MAX_BACKOFF_MS = 10000;

  function getToken() {
    return auth.access || localStorage.getItem("access_token") || "";
  }

  function wsBase() {
    return (import.meta.env.VITE_WS_BASE_URL || "").replace(/\/+$/, "");
  }

  function wsUrl() {
    const token = getToken();
    return `${wsBase()}/ws/student/presence/?token=${encodeURIComponent(token)}`;
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
    } catch (_) {}
    ws = null;
  }

  function scheduleReconnect() {
    if (intentionalClose) return;
    const backoff = Math.min(1000 * 2 ** reconnectAttempts, MAX_BACKOFF_MS);
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(() => {
      connect();
    }, backoff + Math.floor(Math.random() * 250));
  }

  function connect() {
    const token = getToken();
    if (!token) {
      // no auth yet
      return;
    }

    // prevent duplicate sockets
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    intentionalClose = false;
    lastToken = token;

    ws = new WebSocket(wsUrl());

    ws.onopen = () => {
      reconnectAttempts = 0;
      sendPage(route.fullPath || "app_boot");
      sendPing();
      pingTimer = setInterval(sendPing, PING_MS);
      console.log("STUDENT_WS open", ws?.url);
    };

    ws.onmessage = (evt) => {
      // optional: handle server ack/messages if you later add them
      // console.log("STUDENT_WS message", evt.data);
    };

    ws.onerror = (evt) => {
      console.warn("STUDENT_WS error", evt, "url=", ws?.url);
    };

    ws.onclose = (evt) => {
      console.warn("STUDENT_WS close", { code: evt.code, reason: evt.reason, wasClean: evt.wasClean, url: ws?.url });
      clearTimers();
      ws = null;
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
    if (!current || current === lastToken) return;
    // reconnect with new JWT
    disconnect();
    connect();
  }

  // public API
  return {
    connect,
    disconnect,
    sendPing,
    sendPage,
    onRouteChanged,
    onTokenRefreshed,
  };
}