<template>
  <v-card class="pa-4 pa-md-6 mb-6 text-slate-800 border bg-white rounded-xl" flat>
    <div class="d-flex align-center justify-space-between mb-6 pb-4 border-b">
      <div>
        <div class="text-h5 font-weight-black text-slate-900 tracking-tight d-flex align-center">
          <v-icon
            class="mr-2"
            :color="isWsConnected ? 'success' : (isPolling ? 'warning' : 'slate-300')"
            size="26"
          >
            {{ isWsConnected ? 'mdi-access-point' : (isPolling ? 'mdi-wifi-strength-alert-outline' : 'mdi-wifi-off') }}
          </v-icon>
          Live Activity Monitor
        </div>

        <div class="text-caption text-slate-500 font-weight-medium mt-0.5">
          Mode:
          <span class="font-weight-bold">{{ isWsConnected ? 'Live Feed' : 'Fallback' }}</span>
          • Last update: <span class="font-mono text-slate-700">{{ formatLastUpdate }}</span>
        </div>
      </div>

    </div>

    <v-row>
      <v-col cols="12" md="7" class="pr-md-4 border-md-r">
        <v-alert
          :type="onlineStudents.length > 0 ? 'success' : 'info'"
          variant="tonal"
          class="rounded-xl mb-5 border border-opacity-20"
          density="comfortable"
        >
          <div class="d-flex align-center py-0.5">
            <v-icon size="28" class="mr-3">mdi-account-multiple</v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-black leading-none mb-1">
                {{ onlineStudents.length }} Student{{ onlineStudents.length !== 1 ? 's' : '' }} Online
              </div>

            </div>
          </div>
        </v-alert>

        <div v-if="onlineStudents.length > 0">
          <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-3">
            Currently Active Students
          </div>

          <v-row dense>
            <v-col
              v-for="student in onlineStudents"
              :key="student.student_id"
              cols="12"
              sm="6"
              lg="4"
            >
              <v-card
                variant="outlined"
                :class="[
                  'student-card bg-slate-50 border rounded-xl overflow-hidden shadow-sm-hover',
                  getActivityClass(student.seconds_ago),
                ]"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex align-center">
                    <v-avatar
                      :color="getActivityColor(student.last_activity_type)"
                      size="36"
                      class="mr-3 shadow-sm flex-shrink-0"
                    >
                      <span class="text-white font-weight-black text-caption">
                        {{ student.initials }}
                      </span>
                    </v-avatar>

                    <div class="flex-grow-1 min-width-0 pr-1">
                      <div class="text-body-2 font-weight-black text-slate-800 text-truncate leading-tight">
                        {{ student.initials }}
                      </div>
                      <div class="text-xxs font-mono text-slate-400 text-truncate mt-0.5">
                        {{ student.web_id.slice(0, 10) }}
                      </div>
                    </div>

                    <v-tooltip location="top" offset="4">
                      <template #activator="{ props: tProps }">
                        <div v-bind="tProps" class="flex-shrink-0">
                          <v-avatar color="white" size="28" class="border shadow-sm">
                            <v-icon :color="getActivityColor(student.last_activity_type)" size="16">
                              {{ getActivityIcon(student.last_activity_type) }}
                            </v-icon>
                          </v-avatar>
                        </div>
                      </template>
                      <span class="font-weight-bold text-caption">{{ student.last_activity_name }}</span>
                    </v-tooltip>
                  </div>

                  <div class="mt-3 d-flex align-center justify-space-between">
                    <v-chip
                      size="x-small"
                      :color="getTimeChipColor(student.seconds_ago)"
                      variant="flat"
                      class="font-weight-black rounded px-2"
                      height="18"
                    >
                      <v-icon start size="10" class="mr-1">mdi-clock-outline</v-icon>
                      {{ formatSecondsAgo(student.seconds_ago) }}
                    </v-chip>
                  </div>

                  <div
                    class="text-xxs text-slate-500 font-weight-bold font-italic mt-2 pt-2 border-t text-truncate w-100"
                  >
                    {{ student.last_activity_name }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div
          v-else
          class="text-center pa-10 border rounded-xl border-dashed bg-slate-50 my-4 animate-fade-in"
        >
          <v-avatar size="56" color="slate-100" class="mb-3 text-slate-300">
            <v-icon size="28">mdi-account-off</v-icon>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-black text-slate-700 leading-none mb-1">
            No Students Online
          </div>
          <div class="text-caption text-slate-400 max-w-280 mx-auto font-weight-medium">
            Tracking starts automatically when students become active.
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="5" class="pl-md-4 mt-6 mt-md-0">
        <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4 px-1">
          Latest events
        </div>

        <v-text-field
          v-model="activitySearchQuery"
          placeholder="Search logs by initials or action..."
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          class="mb-4 rounded-lg bg-slate-50 text-caption"
        />

        <div v-if="filteredActivities.length > 0" class="max-h-timeline overflow-y-auto style-custom-scroll pr-1">
          <v-timeline density="compact" side="end" class="compact-clean-timeline">
            <v-timeline-item
              v-for="(activity, i) in filteredActivities.slice(0, 20)"
              :key="`${activity.id}-${i}`"
              :dot-color="getActivityColor(activity.activity_type)"
              size="x-small"
              class="mb-3"
            >
              <template #icon>
                <v-icon size="10" color="white">{{ getActivityIcon(activity.activity_type) }}</v-icon>
              </template>

              <div class="d-flex align-start justify-space-between ga-2 text-xxs leading-tight pr-1">
                <div class="text-slate-700">
                  <strong class="text-slate-900 font-weight-black mr-1">
                    {{ activity.student_initials }}
                  </strong>
                  <span class="opacity-90">{{ prettyActivityDescription(activity) }}</span>
                </div>
                <div class="text-slate-400 font-mono text-right flex-shrink-0 font-weight-bold pl-1">
                  {{ formatTimeAgo(activity.timestamp) }}
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>

        <div
          v-else
          class="text-center pa-6 rounded-xl border border-dashed bg-slate-50 text-caption font-weight-bold text-slate-400"
        >
          <v-icon size="16" class="mr-1">mdi-history-off</v-icon> No logs available.
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useTeacherLiveMonitor } from "@/composables/useTeacherLiveMonitor";

interface OnlineStudent {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  last_seen: string;
  seconds_ago: number;
}

interface RecentActivity {
  id: number;
  student: number;
  student_initials: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp: string;
}

interface WsPresence {
  student_id: number;
  initials: string;
  web_id: string;
  teacher_id?: number;
  last_activity_type: string;
  last_activity_name: string;
  page?: string;
  seconds_ago: number;
  last_seen?: number;
}

interface WsActivityEvent {
  teacher_id?: number;
  student_id: number;
  student_initials: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp?: string | null;
  durable?: boolean;
}

const userStore = useUserStore();

const {
  isWsConnected,
  wsError,
  presenceMap,
  liveEvents,
  connect,
  disconnect,
  requestSnapshot,
  init,
  destroy,
} = useTeacherLiveMonitor();

const onlineStudents = ref<OnlineStudent[]>([]);
const recentActivities = ref<RecentActivity[]>([]);
const activitySearchQuery = ref("");
const lastUpdate = ref<Date | null>(null);

// Keep your existing toggle semantics (monitor on/off)
const isPolling = ref(true);

// REST fallback / hydration interval
const pollInterval = ref(60000);

let pollTimer: number | null = null;
let localClockTimer: number | null = null;

const MAX_EVENTS = 200;

const formatLastUpdate = computed(() => {
  if (!lastUpdate.value) return "Never";
  const now = new Date();
  const diff = Math.floor((now.getTime() - lastUpdate.value.getTime()) / 1000);

  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff} seconds ago`;
  return lastUpdate.value.toLocaleTimeString();
});

const customListNameMap = ref<Record<string, string>>({});

const filteredActivities = computed(() => {
  const currentStudentId = userStore.student?.id;

  let activities = recentActivities.value.filter(
    (activity) => Number(activity.student) !== Number(currentStudentId)
  );

  // Staff-only exclusion: hide feedback items in teacher monitor
  if (userStore.isStaff) {
    activities = activities.filter(
      (activity) => activity.activity_type !== "feedback"
    );
  }

  const query = activitySearchQuery.value.trim().toLowerCase();
  if (!query) return activities;

  return activities.filter((activity) => {
    return (
      (activity.student_initials &&
        activity.student_initials.toLowerCase().includes(query)) ||
      (activity.description &&
        activity.description.toLowerCase().includes(query)) ||
      (activity.activity_name &&
        activity.activity_name.toLowerCase().includes(query))
    );
  });
});
// ---- WS -> UI mapping --------------------------------------------------------

function mapPresenceToOnlineStudent(s: WsPresence): OnlineStudent {
  return {
    student_id: s.student_id,
    initials: s.initials,
    web_id: s.web_id,
    last_activity_type: s.last_activity_type || "heartbeat",
    last_activity_name: s.last_activity_name || "Active",
    last_seen: s.last_seen
      ? new Date(s.last_seen * 1000).toISOString()
      : new Date().toISOString(),
    seconds_ago: Number(s.seconds_ago || 0),
  };
}


function syncOnlineFromPresenceMap() {
  const students = Object.values(presenceMap.value as Record<number, WsPresence>)
    .map(mapPresenceToOnlineStudent)
    .sort((a, b) => a.seconds_ago - b.seconds_ago);

  onlineStudents.value = students;
  lastUpdate.value = new Date();
}


// React to composable websocket state
watch(
  presenceMap,
  () => {
    syncOnlineFromPresenceMap();
  },
  { deep: true }
);


// ---- Custom list name mapping -----------------------------------------------
async function fetchCustomListNames() {
  try {
    // adjust endpoint if yours differs
    const res = await api.get("/vocab-lists/");
    const rows = Array.isArray(res.data) ? res.data : (res.data?.results || []);
    const map: Record<string, string> = {};
    for (const r of rows) {
      const id = String(r.id ?? "").trim();
      const name = String(r.name ?? "").trim();
      if (id && name) map[id] = name;
    }
    customListNameMap.value = map;
  } catch (e) {
    console.warn("Could not load custom list names", e);
  }
}

function isUuidLike(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function normalizeKey(v: string): string {
  return String(v ?? "").trim();
}

function humanizeListKey(raw: string): string {
  const k = normalizeKey(raw);
  if (!k) return "Unknown list";

  // direct exact key lookup
  if (customListNameMap.value[k]) return customListNameMap.value[k];

  // composite "<listKey>::<term>"
  if (k.includes("::")) {
    const [left] = k.split("::");
    const leftKey = normalizeKey(left);
    if (customListNameMap.value[leftKey]) return customListNameMap.value[leftKey];
    // for hardcoded list keys in composite
    if (!isUuidLike(leftKey)) return leftKey.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  // UUID with no match (map may be filtered by teacher scope)
  if (isUuidLike(k)) return k; // keep as-is if unknown, avoids bad beautification

  // hardcoded key prettify
  return k.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Replace any UUID present in a sentence with friendly custom list name.
 * Also handles "<uuid>::term" fragments.
 */
function replaceListIdsInText(text: string): string {
  let out = String(text ?? "");
  if (!out) return out;

  // replace composite first: "<uuid>::something"
  out = out.replace(
    /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})::([^\s,;]+)/gi,
    (_m, uuid, tail) => {
      const pretty = humanizeListKey(uuid);
      return `${pretty}::${tail}`;
    }
  );

  // replace standalone UUIDs
  out = out.replace(
    /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/gi,
    (m) => humanizeListKey(m)
  );

  return out;
}

function prettyActivityDescription(a: RecentActivity): string {
  // 1) start from backend text
  let d = String(a.description ?? "");

  // 2) replace any UUIDs embedded in description
  d = replaceListIdsInText(d);

  // 3) if activity_name itself is a list key/id and appears in text, replace it
  const rawName = String(a.activity_name ?? "").trim();
  if (rawName) {
    const prettyName = humanizeListKey(rawName);
    if (prettyName !== rawName) {
      d = d.split(rawName).join(prettyName);
    }
  }

  // 4) fallback: if description is empty, at least show pretty activity_name
  if (!d && rawName) return humanizeListKey(rawName);

  return d;
}


// ---- REST fallback / hydration ----------------------------------------------

async function fetchPresenceSnapshot() {
  try {
    const response = await api.get("/presence/snapshot/");
    if (response.data && Array.isArray(response.data.students)) {
      // Only apply REST snapshot as fallback when WS has not yet populated anything
      if (Object.keys(presenceMap.value).length === 0) {
        onlineStudents.value = response.data.students
          .map((s: WsPresence) => mapPresenceToOnlineStudent(s))
          .sort((a: OnlineStudent, b: OnlineStudent) => a.seconds_ago - b.seconds_ago);
      }
      lastUpdate.value = new Date();
    }
  } catch {
    // optional endpoint
  }
}

async function fetchOnlineStudents() {
  try {
    const params: any = {};
    if (userStore.isStaff) params.teacher_view = "true";

    const response = await api.get("/online-students/", { params });
    const incoming: OnlineStudent[] = response.data.students || [];

    // Use fallback only if WS disconnected
    if (!isWsConnected.value) {
      onlineStudents.value = incoming;
      lastUpdate.value = new Date();
    }
  } catch (error) {
    console.error("Failed to fetch online students:", error);
  }
}

async function fetchRecentActivities() {
  try {
    const params: any = {
      limit: 100,
      include_heartbeats: "true",
    };

    if (userStore.isStaff) params.managed_only = "true";

    const response = await api.get("/student-activities/", { params });
    const incoming = response.data?.results ? response.data.results : response.data || [];

    if (Array.isArray(incoming)) {
      // Keep WS-injected events at top; backfill with REST rows
      const existing = [...recentActivities.value];
      for (const row of incoming) {
        const duplicate = existing.find(
          (m) =>
            m.student === row.student &&
            m.activity_type === row.activity_type &&
            m.activity_name === row.activity_name &&
            m.timestamp === row.timestamp
        );
        if (!duplicate) existing.push(row);
      }
      recentActivities.value = existing.slice(0, MAX_EVENTS);
      lastUpdate.value = new Date();
    }
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
  }
}

function startLocalClocks() {
  if (localClockTimer) clearInterval(localClockTimer);
  localClockTimer = window.setInterval(() => {
    onlineStudents.value.forEach((student) => {
      student.seconds_ago += 1;
    });
  }, 1000);
}

async function poll() {
  if (!isPolling.value) return;

  // WS connected -> only backfill timeline
  if (isWsConnected.value) {
    await fetchRecentActivities();
    return;
  }

  // WS down -> full REST fallback
  await Promise.all([fetchOnlineStudents(), fetchRecentActivities()]);
}

function startPolling() {
  isPolling.value = true;

  // start composable WS lifecycle
  init();
  void connect();
  requestSnapshot();

  // optional bootstrap REST snapshot
  void fetchPresenceSnapshot();

  // start fallback polling
  void poll();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = window.setInterval(() => {
    void poll();
  }, pollInterval.value);

  startLocalClocks();
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  if (localClockTimer) {
    clearInterval(localClockTimer);
    localClockTimer = null;
  }

  disconnect();
  destroy();

  isPolling.value = false;
}

function togglePolling() {
  if (isPolling.value) stopPolling();
  else startPolling();
}

// ---- UI helpers --------------------------------------------------------------

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    conjugation: "mdi-controller",
    other_game: "mdi-gamepad-variant",
    exercise: "mdi-weight-lifter",
    vocab_workout: "mdi-cards-outline",
    achievement: "mdi-trophy",
    workout_drill: "mdi-clipboard-check",
    feedback: "mdi-comment-alert",
    profile_update: "mdi-account-voice",
    page_view: "mdi-file-document-outline",
    heartbeat: "mdi-pulse",
    presence_join: "mdi-connection",
  };
  return icons[type] || "mdi-circle";
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    conjugation: "blue",
    other_game: "purple",
    exercise: "orange",
    vocab_workout: "teal",
    achievement: "amber",
    workout_drill: "green",
    feedback: "red",
    profile_update: "indigo",
    page_view: "cyan",
    heartbeat: "grey",
    presence_join: "light-green",
  };
  return colors[type] || "grey";
}

function getActivityClass(secondsAgo: number): string {
  if (secondsAgo < 60) return "active-now";
  if (secondsAgo < 180) return "active-recent";
  return "active-idle";
}

function getTimeChipColor(secondsAgo: number): string {
  if (secondsAgo < 60) return "success";
  if (secondsAgo < 180) return "warning";
  return "grey";
}

function formatSecondsAgo(seconds: number): string {
  if (seconds < 10) return "now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 300) return `${Math.floor(diffSec / 60)}m ago`;

  return date.toLocaleTimeString();
}

// ---- lifecycle ---------------------------------------------------------------

onMounted(() => {
  void fetchCustomListNames();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});

</script>

<style scoped>
.text-xxs {
  font-size: 0.72rem !important;
}

.max-w-280 {
  max-width: 280px;
  width: 100%;
}

.max-h-timeline {
  max-height: 520px;
}

@media (min-width: 960px) {
  .border-md-r {
    border-right: 1px solid #e2e8f0 !important;
  }
}

.student-card {
  transition: all 0.22s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-color: #e2e8f0 !important;
}

.shadow-sm-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05) !important;
  border-color: #cbd5e1 !important;
}

.compact-clean-timeline :deep(.v-timeline-item__body) {
  padding-inline-start: 12px !important;
  width: 100%;
}

.compact-clean-timeline :deep(.v-timeline-item__inner-dot) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.style-custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.style-custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.style-custom-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }

.animate-fade-in {
  animation: setup-fade 0.25s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}
@keyframes setup-fade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>