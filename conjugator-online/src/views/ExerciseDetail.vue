<template>
  <TopNavBar />
  <v-container class="mt-5">
    <div v-if="errorEntry">
      <h1>Error {{ errorCode }}</h1>
      <p><strong>Description:</strong> {{ errorEntry.description }}</p>
      <p><strong>Recommendation:</strong> {{ errorEntry.recommendation }}</p>
      <p><strong>Examples:</strong> {{ errorEntry.examples }}</p>
      <div v-html="errorEntry.reference"></div>
    </div>
    <div v-else>
      <h2>Error not found</h2>
      <RouterLink to="/exercises">Back to list</RouterLink>
    </div>
  </v-container>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { errorsData } from "@/assets/scripts/errorsData";
import TopNavBar from '@/components/TopNavBar.vue';

const route = useRoute();
const errorCode = route.params.errorCode;
const errorEntry = errorsData[errorCode];
</script>
