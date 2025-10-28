<template>
  <v-container>
    <PronounSceneManager />
  </v-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import PronounSceneManager from '@/components/PronounSceneManager.vue';
import TopNavBar from '@/components/TopNavBar.vue';

export default {
  components: { PronounSceneManager, TopNavBar }
}
</script>