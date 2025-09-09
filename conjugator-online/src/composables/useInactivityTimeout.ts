import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

let timeoutId: ReturnType<typeof setTimeout>;

export function useInactivityTimeout() {
  const auth = useAuthStore();

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      auth.logout();
      window.location.href = "/login"; // or use router.push
    }, INACTIVITY_LIMIT);
  };

  const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];

  onMounted(() => {
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer(); // start timer on mount
  });

  onUnmounted(() => {
    activityEvents.forEach((event) =>
      window.removeEventListener(event, resetTimer)
    );
    clearTimeout(timeoutId);
  });
}
