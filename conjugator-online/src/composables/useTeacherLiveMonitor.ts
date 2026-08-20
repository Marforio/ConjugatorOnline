import { ref } from 'vue';

type PresenceStudent = {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  page?: string;
  seconds_ago: number;
  last_seen?: number;
};

type ActivityEvent = {
  teacher_id?: number;
  student_id: number;
  student_initials: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp?: string | null;
  durable?: boolean;
};

export function useTeacherLiveMonitor() {
  const socket = ref<WebSocket | null>(null);
  const isWsConnected = ref(false);
  const wsError = ref<string | null>(null);

  const presenceMap = ref<Record<number, PresenceStudent>>({});
  const liveEvents = ref<ActivityEvent[]>([]);

  let reconnectTimer: number | null = null;
  let reconnectAttempts = 0;

  const maxEvents = 200;

  function wsBase(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${window.location.host}`;
  }

  function connect() {
    cleanupSocketOnly();

    const url = `${wsBase()}/ws/teacher/live/`;
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      isWsConnected.value = true;
      wsError.value = null;
      reconnectAttempts = 0;
    };

    socket.value.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        if (msg.type === 'presence.snapshot') {
          const next: Record<number, PresenceStudent> = {};
          for (const s of msg.students || []) {
            next[s.student_id] = s;
          }
          presenceMap.value = next;
          return;
        }

        if (msg.type === 'presence.upsert' && msg.presence) {
          presenceMap.value[msg.presence.student_id] = msg.presence;
          return;
        }

        if (msg.type === 'presence.remove' && typeof msg.student_id === 'number') {
          delete presenceMap.value[msg.student_id];
          return;
        }

        if (msg.type === 'activity.event' && msg.event) {
          liveEvents.value.unshift(msg.event);
          if (liveEvents.value.length > maxEvents) {
            liveEvents.value = liveEvents.value.slice(0, maxEvents);
          }
          return;
        }
      } catch {
        // no-op
      }
    };

    socket.value.onclose = () => {
      isWsConnected.value = false;
      scheduleReconnect();
    };

    socket.value.onerror = () => {
      wsError.value = 'WebSocket connection error';
    };
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectAttempts += 1;
    const backoff = Math.min(10000, 1000 * Math.pow(2, Math.min(reconnectAttempts, 4)));
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, backoff);
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    cleanupSocketOnly();
    isWsConnected.value = false;
  }

  function cleanupSocketOnly() {
    if (!socket.value) return;
    socket.value.onopen = null;
    socket.value.onmessage = null;
    socket.value.onclose = null;
    socket.value.onerror = null;
    try {
      socket.value.close();
    } catch {
      // no-op
    }
    socket.value = null;
  }

  function requestSnapshot() {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ type: 'presence.snapshot.request' }));
    }
  }

  return {
    isWsConnected,
    wsError,
    presenceMap,
    liveEvents,
    connect,
    disconnect,
    requestSnapshot,
  };
}