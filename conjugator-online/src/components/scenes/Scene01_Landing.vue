<template>
  <div class="container h-100 d-flex flex-column">
    <div class="content-container justify-content-center">
      <h1 class="display-1 text-center">
        <div 
          class="image-link" 
          @click="goToScene('Scene02_Settings')" 
          role="button" 
          tabindex="0"
        >
          <img 
            src="/images/conjugator.png" 
            alt="Logo" 
            class="mb-1 rounded-image" 
            style="width: 60%; height: auto;" 
          />
        </div>
        
        <span class="text-body-secondary fs-2 flaming-text">put your conjugation skills to the test</span>
      </h1>
      <div class="d-flex justify-content-center mt-2">
        <button 
          @click="goToScene('Scene02_Settings')" 
          class="btn btn-primary btn-lg hover-effect"
        >
          ENTER
        </button>
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
  height: 100%; /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Start alignment for children */
}

.content-container {
  margin-top: auto; /* Push the content to the vertical center */
  transform: translateY(5%); /* Adjust position downwards */
  text-align: center; /* Center align the text */
}
.flaming-text {
  color: #ff4500; /* Base color for the flame */
  text-shadow: 
    0 0 5px #ff4500, 
    0 0 10px #ff6347, 
    0 0 15px #ff6347, 
    0 0 20px #ffa07a, 
    0 0 25px #ffa07a, 
    0 0 30px #ff4500;
  animation: flicker 1.5s infinite alternate, vibrate 0.1s infinite;
}
@keyframes flicker {
  0% {
    text-shadow: 
      0 0 5px #ff4500, 
      0 0 10px #ff6347, 
      0 0 15px #ff6347, 
      0 0 20px #ffa07a, 
      0 0 25px #ffa07a, 
      0 0 30px #ff4500;
  }
  50% {
    text-shadow: 
      0 0 10px #ff6347, 
      0 0 15px #ffa07a, 
      0 0 20px #ffa07a, 
      0 0 25px #ff4500, 
      0 0 30px #ff4500, 
      0 0 35px #ff6347;
  }
  100% {
    text-shadow: 
      0 0 5px #ff4500, 
      0 0 10px #ff4500, 
      0 0 15px #ff6347, 
      0 0 20px #ffa07a, 
      0 0 25px #ffa07a, 
      0 0 30px #ff4500;
  }
}
@keyframes vibrate {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(1px, 1px); }
}

/* Add rounded corners to the image */
.rounded-image {
  border-radius: 15px; /* Adjust the value for more or less rounding */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth hover effect */
}

/* Hover effect for the image */
.rounded-image:hover {
  transform: scale(1.05); /* Slightly enlarge the image */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add a shadow */
  cursor: pointer;
}

/* Hover effect for the button */
.hover-effect:hover {
  background-color: #0056b3; /* Darker shade of blue */
  transform: scale(1.05); /* Slightly enlarge the button */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add a shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

@media (max-width: 576px) {
  .rounded-image {
    width: 90%; /* Adjust the image size for smaller screens */
  }
  .content-container {
    transform: translateY(25%); /* Adjust position downwards for smaller screens */
  }
}
</style>