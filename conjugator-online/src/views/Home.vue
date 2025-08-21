<template>

 <h1>This is home baby </h1>

 <RouterLink to="/conjugator">Go to Conjugator</RouterLink>
 <br></br>
 <RouterLink to="/login">Go to Login</RouterLink>
 <br></br>
  <RouterLink to="/dashboard">Go to Dashboard</RouterLink>

</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: 'Home'
}
</script>