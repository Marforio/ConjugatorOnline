<template>
    <div class="settings-scene">
      <h1>VOCAB AND CONJUGATION TESTER</h1>

      <button @click="goToScene('Scene02_Settings')">PLAY</button>
    </div>
</template>

<script>

export default {
  methods: {
    goToScene(sceneName) {
      this.$emit('changeScene', sceneName);
    }
  }
}
</script>