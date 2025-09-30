<template>
  <v-container fluid>
    <v-row>
      <!-- Vocab Table -->
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h5 mb-5">
            <v-icon class="me-3">mdi-notebook</v-icon>My vocabulary notebook
          </v-card-title>
          <v-card-text>
            <v-data-table
              :items="userStore.processedVocab"
              :columns="userStore.vocabTableHeaders"
              :loading="userStore.loadingVocab"
              class="elevation-1"
              loading-text="Loading vocab entries..."
              item-value="vocab_id"
              dense
            />
            <div v-if="userStore.vocabError" class="text-error mt-4">
              {{ userStore.vocabError }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add Vocab Form -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h5">
            <v-icon class="me-3 mb-2">mdi-notebook-plus</v-icon>Add New Vocab
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitNewVocab">
              <v-text-field v-model="newVocab.correct" label="Correct" required />
              <v-text-field v-model="newVocab.incorrect" label="Incorrect" />
              <v-textarea v-model="newVocab.comment" label="Comment" rows="2" />
              <v-btn type="submit" color="primary" class="mt-3">Submit</v-btn>
            </v-form>
            <div v-if="formError" class="text-error mt-2">{{ formError }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider style="margin-top: 100px; margin-bottom: 50px;" />


    <!-- Flip Card -->
    <v-row justify="center" style="margin-bottom: 200px;">
      <v-col cols="8" lg="6" xl="5">
        <h3 class="text-h4 text-center mb-6"><v-icon class="me-3 mb-2">mdi-repeat</v-icon>Use your vocabulary</h3>
        <div class="flip-container" :class="{ flipped: isFlipped }" @click="flipCard">
          <div class="flipper">
            <!-- Front side -->
            <v-card
              class="front pa-4 d-flex flex-column justify-space-between bg-cyan-lighten-4"
              elevation="2"
              style="min-height: 430px;"
            >

              <v-card-text
                v-if="currentVocabItem"
                class="d-flex flex-column align-center justify-center text-center"
                style="flex-grow: 1;"
              >
                <div class="text-caption text-muted mb-2">What is the correct way to say this?</div>
                <div class="text-h2 font-weight-light font-italic mb-4">
                  {{ currentVocabItem.incorrect }}
                </div>
                <div class="text-caption text-muted">Can you use this word in a sentence about your life?</div>
              </v-card-text>


              <v-card-text v-else class="text-center text-caption text-muted mt-6">
                No vocabulary entries yet.
              </v-card-text>

              <v-card-actions class="d-flex justify-end">
                <v-btn color="black" size="large" @click.stop="nextVocabItem" :disabled="!userStore.vocab.length">
                  Next word
                  <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Back side -->
            <v-card
              class="back pa-4 d-flex flex-column justify-space-between bg-cyan-lighten-4"
              elevation="2"
              style="min-height: 430px;"
            >
              <v-card-text v-if="currentVocabItem" class="d-flex flex-column align-center justify-center text-center text-caption" style="flex-grow: 1;">
                <div class="text-caption text-muted mb-2">The correct form of the word is:</div>
                <div class="text-h2">{{ currentVocabItem.correct }}</div>
              </v-card-text>


              <v-card-text v-else class="text-center text-caption text-muted mt-6">
                No vocabulary entries yet.
              </v-card-text>

              <v-card-actions class="d-flex justify-end">
                <v-btn color="black" size="large" @click.stop="nextVocabItem" :disabled="!userStore.vocab.length">
                  Next word
                  <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/axios";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "VocabDashboard",
  setup() {
    const userStore = useUserStore();
    const { xs, smAndDown } = useDisplay();

    const currentVocabItem = ref<{ correct: string; incorrect: string } | null>(null);
    const isFlipped = ref(false);

    const newVocab = ref({
      correct: "",
      incorrect: "",
      comment: "",
    });

    const formError = ref<string | null>(null);

    const submitNewVocab = async () => {
      formError.value = null;
      try {
        await api.post("/vocab/", {
          feedback: null,
          student_web_id: userStore.student?.web_id ?? null,
          correct: newVocab.value.correct,
          incorrect: newVocab.value.incorrect,
          comment: newVocab.value.comment,
          times: 1,
        });
        newVocab.value = { correct: "", incorrect: "", comment: "" };
        userStore.fetchVocabDashboardData();
      } catch (err: any) {
        console.error("Failed to submit vocab:", err);
        formError.value = "Failed to submit vocab entry.";
      }
    };

    function nextVocabItem() {
      const vocabList = userStore.vocab ?? [];
      if (!vocabList.length) {
        currentVocabItem.value = null;
        return;
      }
      const randomIndex = Math.floor(Math.random() * vocabList.length);
      const selected = vocabList[randomIndex];
      currentVocabItem.value = {
        correct: selected.correct ?? "",
        incorrect: selected.incorrect ?? "",
      };
    }

    function flipCard() {
      isFlipped.value = !isFlipped.value;
    }

    onMounted(async () => {
      await userStore.fetchVocabDashboardData();
      nextVocabItem();
    });

    return {
      userStore,
      xs,
      smAndDown,
      newVocab,
      formError,
      submitNewVocab,
      isFlipped,
      currentVocabItem,
      nextVocabItem,
      flipCard,
    };
  },
});
</script>


<style scoped>
.flip-container {
  perspective: 1000px;
  position: relative;
  height: 430px;
}
.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.flipped .flipper {
  transform: rotateY(180deg);
}
.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.back {
  transform: rotateY(180deg);
}
</style>
