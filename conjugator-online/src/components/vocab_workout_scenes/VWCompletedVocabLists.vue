<template>
  <v-expansion-panels>
    <v-expansion-panel class="rounded-xl border overflow-hidden">
      <v-expansion-panel-title class="bg-slate-50 font-weight-bold pa-4">
        <div class="d-flex align-center justify-space-between ga-2">
          <v-icon>mdi-check-circle</v-icon>
          <span>
            Completed Vocab Lists
            <template v-if="!store.loadingCompletedLists && !store.completedListsError">
              ({{ store.completedLists.length }})
            </template>
          </span>
          <v-btn
              variant="text"
              size="small"
              color="primary"
              class="ms-5"
              :loading="store.loadingCompletedLists"
              @click="store.fetchCompletedLists()"
            >
              Refresh
            </v-btn>
        </div>

      </v-expansion-panel-title>

      <v-expansion-panel-text class="pa-4">

        <div v-if="store.loadingCompletedLists" class="text-caption">
          Loading completed lists...
        </div>

        <v-alert
          v-else-if="store.completedListsError"
          type="warning"
          variant="tonal"
          density="compact"
        >
          {{ store.completedListsError }}
        </v-alert>

        <div v-else-if="!store.completedLists.length" class="text-caption text-medium-emphasis">
          No finished write sessions yet.
        </div>

        <v-list v-else density="compact" class="pa-0">
          <v-list-item
            v-for="row in store.completedLists"
            :key="completionKey(row)"
            class="px-0 border-b py-2"
          >
            <template #prepend>
              <v-icon color="success" size="18" class="mr-2">
                mdi-check-circle
              </v-icon>
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ row.list_name }}
              <span v-if="row.level"> · {{ row.level }}</span>
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ completionVariant(row) }}
              <span v-if="row.finished_at">
                · {{ new Date(row.finished_at).toLocaleDateString() }}
              </span>
            </v-list-item-subtitle>

            <template #append>
              <v-chip
                size="small"
                :color="row.verified ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ row.verified ? 'Completed' : 'Finished · unverified' }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useVocabWorkoutStore } from '@/stores/vocabWorkout'
import { completionKey, completionVariant } from '@/utils/vocabCompletion'

const store = useVocabWorkoutStore()

onMounted(() => {
  void store.fetchCompletedLists()
})
</script>