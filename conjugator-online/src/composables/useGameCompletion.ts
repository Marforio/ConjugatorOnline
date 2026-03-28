// composables/useGameCompletion.ts

import { useNotificationStore } from '@/stores/notifications';

export function useGameCompletion() {
  const notificationStore = useNotificationStore();
  
  /**
   * Call this function after a game/exercise session is completed and saved.
   * It will schedule a notification check after 10 seconds.
   */
  function onGameCompleted() {
    console.log('Game completed - scheduling notification check...');
    notificationStore.scheduleCheck(15000); // 15 seconds
  }
  
  return {
    onGameCompleted,
  };
}