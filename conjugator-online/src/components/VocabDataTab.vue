<template>
  <v-container fluid>
    <v-row>
      <!-- Vocab Table -->
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h5 mb-5"><v-icon class="me-3">mdi-notebook</v-icon>My vocabulary notebook</v-card-title>
          <v-card-text>
            <v-data-table
                :items="userStore.processedVocab"
                :columns="userStore.vocabTableHeaders"
                :loading="userStore.loadingVocab"
                class="elevation-1"
                loading-text="Loading vocab entries..."
                item-value="vocab_id"
                dense
                >
            </v-data-table>


            <div v-if="userStore.vocabError" class="text-error mt-4">
              {{ userStore.vocabError }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add Vocab Form -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h5"><v-icon class="me-3 mb-2">mdi-notebook-plus</v-icon>Add New Vocab</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitNewVocab">
              <v-text-field
                v-model="newVocab.correct"
                label="Correct"
                required
              />
              <v-text-field
                v-model="newVocab.incorrect"
                label="Incorrect"
              />
              <v-textarea
                v-model="newVocab.comment"
                label="Comment"
                rows="2"
              />
              <v-btn type="submit" color="primary" class="mt-3">Submit</v-btn>
            </v-form>
            <div v-if="formError" class="text-error mt-2">{{ formError }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import api from "@/axios";
import { useDisplay } from 'vuetify';
import { useUserStore } from "@/stores/user";



export default defineComponent({
  name: "VocabDashboard",
  components: { },

  setup() {
    const userStore = useUserStore();
    const { xs, smAndDown } = useDisplay();

    

    const newVocab = ref({
        correct: '',
        incorrect: '',
        comment: '',
        });

        const formError = ref<string | null>(null);

        const submitNewVocab = async () => {
        formError.value = null;
        try {
            await api.post('/vocab/', {
            feedback: null,
            student_web_id: userStore.student?.web_id ?? null,
            correct: newVocab.value.correct,
            incorrect: newVocab.value.incorrect,
            comment: newVocab.value.comment,
            times: 1
            });;
            newVocab.value = { correct: '', incorrect: '', comment: '' };
            userStore.fetchVocabDashboardData();
        } catch (err: any) {
            console.error("Failed to submit vocab:", err);
            formError.value = "Failed to submit vocab entry.";
        }
        };



    onMounted(() => {
      userStore.fetchVocabDashboardData();
    });

    return {
      userStore,
      xs,
        smAndDown,
        newVocab,
        formError,
        submitNewVocab,
            };
  },
});
</script>
