<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center" fluid>
    <!-- Main Title Centered -->
    <v-row justify="center" align="center" class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="display-1 font-weight-bold">Language Labs</h1>
      </v-col>
    </v-row>

    <!-- Tiles with Icon Buttons for Navigation -->
    <v-row justify="center" align="center" dense>

      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <v-btn
          elevation
          large
          class="d-flex flex-column align-center pa-6"
          color="secondary"
          href="https://book.language-labs.ch"
        >
          <v-icon large >mdi-book-open-variant</v-icon>
          <span class="subtitle-1 font-weight-medium px-2">Grammar Book</span>
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <v-btn
          elevation
          large
          class="d-flex flex-column align-center pa-6"
          color="primary"
          :to="{ name: 'conjugator' }"
        >
          <v-icon large>mdi-controller</v-icon>
          <span class="subtitle-1 font-weight-medium px-2">Conjugator</span>
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
        <v-btn
          elevation
          large
          class="d-flex flex-column align-center pa-6"
          color="success"
          :to="{ name: 'dashboard' }"
        >
          <v-icon large >mdi-chart-bar</v-icon>
          <span class="subtitle-1 font-weight-medium px-2">Dashboard</span>
        </v-btn>
      </v-col>
      
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>
