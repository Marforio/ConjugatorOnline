<template>
  <v-container>
    <QuantSceneManager />
  </v-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import QuantSceneManager from '@/components/QuantSceneManager.vue';
import TopNavBar from '@/components/TopNavBar.vue';

export default {
  components: { QuantSceneManager, TopNavBar }
}
</script>