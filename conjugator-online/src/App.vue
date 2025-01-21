<!-- src/App.vue -->
<template>
  <div id="app">
    <SceneManager />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import SceneManager from './components/SceneManager.vue';

export default {
  components: { SceneManager }
};
</script>