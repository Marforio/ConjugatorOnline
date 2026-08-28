import { onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 min (set what you want)

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let bound = false;

export function useInactivityTimeout() {
  const auth = useAuthStore();

  const clearTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const triggerLogout = () => {
    if (!auth.isLoggedIn) return;
    auth.logout();
    window.location.href = "/login";
  };

  const resetTimer = () => {
    if (!auth.isLoggedIn) return; // pause when logged out
    clearTimer();
    timeoutId = setTimeout(triggerLogout, INACTIVITY_LIMIT);
  };

  const onUserActivity = () => resetTimer();

  const onVisibilityChange = () => {
    // when user comes back to tab, give fresh window
    if (document.visibilityState === "visible") {
      resetTimer();
    }
  };

  const activityEvents = ["mousemove", "keydown", "scroll", "touchstart", "click"];

  onMounted(() => {
    if (!bound) {
      activityEvents.forEach((event) =>
        window.addEventListener(event, onUserActivity, { passive: true })
      );
      document.addEventListener("visibilitychange", onVisibilityChange);
      bound = true;
    }

    // start only if logged in
    if (auth.isLoggedIn) resetTimer();
  });

  // restart on login, clear on logout
  const stopWatch = watch(
    () => auth.isLoggedIn,
    (loggedIn) => {
      if (loggedIn) resetTimer();
      else clearTimer();
    },
    { immediate: true }
  );

  onUnmounted(() => {
    clearTimer();
    stopWatch();

    if (bound) {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, onUserActivity)
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
      bound = false;
    }
  });

  return { resetTimer };
}