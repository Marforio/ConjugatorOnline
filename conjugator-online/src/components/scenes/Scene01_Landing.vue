<template>
  <div class="container h-100 d-flex flex-column">
    <div class="content-container justify-content-center">
      <h1 class="display-1 text-center">
        <span class="border rounded-pill p-3 px-5">CONJUGATOR</span>
        <br>
        <span class="text-body-secondary fs-2">test your conjugation skills</span>
      </h1>
      <div class="d-flex justify-content-center mt-5">
        <button @click="goToScene('Scene02_Settings')" class="btn btn-primary btn-lg">ENTER</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToScene(sceneName) {
      this.$emit('changeScene', sceneName);
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Start alignment for children */
}

.content-container {
  margin-top: auto; /* Push the content to the vertical center */
  transform: translateY(50%); /* Adjust position downwards */
  text-align: center; /* Center align the text */
}
</style>
