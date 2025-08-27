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
        
        <span class="text-body-secondary fs-2 beating-text">Put your conjugation to the test!</span>
      </h1>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

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
.beating-text {
  display: inline-block;
  color: #134376; /* Base blue color */
  animation: beat 2.5s infinite ease-in-out;
}
@keyframes beat {
  0%, 100% {
    transform: scale(1); /* Normal size */
  }
  50% {
    transform: scale(1.1); /* Enlarged size */
  }
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
    width: 100%; /* Adjust the image size for smaller screens */
  }
  .content-container {
    transform: translateY(25%); /* Adjust position downwards for smaller screens */
  }
}
</style>