<template>
    <SceneManager />
    <LoggedInFooter />
    
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import SceneManager from '@/components/SceneManager.vue';
import LoggedInFooter from '@/components/LoggedInFooter.vue';

export default {
  components: { SceneManager, LoggedInFooter }
}
</script>