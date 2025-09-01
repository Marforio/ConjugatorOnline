<template>
  <v-container>
    <SceneManager />
  </v-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import SceneManager from '@/components/SceneManager.vue';
import TopNavBar from '@/components/TopNavBar.vue';

export default {
  components: { SceneManager, TopNavBar }
}
</script>