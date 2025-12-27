<template>
  <v-container class="mt-5">

    <div v-if="errorEntry">

      <!-- ========================================================= -->
      <!--                       PRE-EXERCISE                       -->
      <!-- ========================================================= -->
      <div v-if="phase === 'pre'">
        <h1 class="text-h5 mb-4">Error {{ errorCode }}</h1>

        <p><strong>Description:</strong> {{ errorEntry.description }}</p>
        <p><strong>Recommendation:</strong> {{ errorEntry.recommendation }}</p>
        <p><strong>Examples:</strong> {{ errorEntry.examples }}</p>
        <div v-html="errorEntry.reference"></div>

        <v-divider class="my-6" />

        <div v-if="hasExercises">
          <v-btn color="primary" size="large" @click="startExercises">
            Start the exercises
          </v-btn>
        </div>

        <div v-else class="text-info text-body-1">
          No exercises for this error.
        </div>

        <v-divider class="my-6" />
        <RouterLink to="/exercises">Back to list</RouterLink>
      </div>



      <!-- ========================================================= -->
      <!--                     DURING-EXERCISE                       -->
      <!-- ========================================================= -->
      <div v-if="phase === 'during'" class="mt-4">

        <!-- Progress bar -->
        <v-progress-linear
          :model-value="progressPercent"
          height="10"
          color="primary"
          striped
          class="mb-4"
        />

        <v-card elevation="4" class="pa-4">

          <h2 class="text-h6 mb-3">
            Question {{ currentIndex + 1 }} of {{ shuffledExercises.length }}
          </h2>

          <p class="mb-3"><strong>{{ currentQuestion.item.question }}</strong></p>

          <!-- TEXT MONO -->
          <v-text-field
            v-if="currentQuestion.item.type === 'text_mono'"
            v-model="currentAnswer"
            variant="outlined"
            density="compact"
            hide-details
          />

          <div v-if="currentQuestion.item.type === 'text_mono' && showImmediateFeedback" class="mt-2">
            <span :class="result[currentIndex] ? 'text-success' : 'text-error'">
              {{ result[currentIndex] ? 'Correct!' : 'Incorrect.' }}
            </span>
            <div class="text-info">Correct answer: {{ currentQuestion.item.answer }}</div>
          </div>


          <!-- TEXT MULTI -->
          <v-text-field
            v-if="currentQuestion.item.type === 'text_multi'"
            v-model="currentAnswer"
            variant="outlined"
            density="compact"
            hide-details
          />
          <div v-if="currentQuestion.item.type === 'text_multi' && showImmediateFeedback" class="mt-2">
            <span :class="result[currentIndex] ? 'text-success' : 'text-error'">
              {{ result[currentIndex] ? 'Correct!' : 'Incorrect.' }}
            </span>
            <div class="text-info">Valid answers: {{ currentQuestion.item.answers.join(', ') }}</div>
          </div>

          <!-- CHECKBOX -->
          <div v-if="currentQuestion.item.type === 'checkbox'">
            <div
              v-for="(ans, i) in currentQuestion.item.answers"
              :key="i"
              :class="showImmediateFeedback
                ? (ans[1] ? 'correct-option' : 'wrong-option')
                : ''"
            >
              <v-checkbox
                v-model="currentAnswer"
                :label="ans[0]"
                :value="ans[0]"
                density="compact"
                hide-details
              />

              <!-- inline feedback -->
              <div
                v-if="showImmediateFeedback && currentAnswer === label"
                class="text-caption"
              >
                {{ ans[2] }}
              </div>
            </div>
          </div>


          <!-- RADIO -->
          <v-radio-group
            v-if="currentQuestion.item.type === 'radio'"
            v-model="currentAnswer"
            density="compact"
          >
            <div
              v-for="(label, val) in normalizeRadio(currentQuestion.item.answers)"
              :key="val"
              :class="showImmediateFeedback
                ? (isRadioCorrect(currentQuestion.item, label)
                    ? 'correct-option'
                    : 'wrong-option')
                : ''"
              class="pa-1"
            >
              <v-radio
                :label="label"
                :value="label"
                hide-details
              />

              <!-- inline feedback -->
              <div
                v-if="showImmediateFeedback && currentAnswer === label"
                class="text-caption"
              >
                {{ getRadioExplanation(currentQuestion.item, label) }}
              </div>
            </div>
          </v-radio-group>


          <!-- NEXT BUTTON -->
          <v-btn
            :color="answered ? 'info' : 'primary'"
            justify="center"
            class="mt-4 mx-auto"
            style="max-width: 220px; width: 100%;"
            @click="handleButtonClick"
          >
            {{ answered ? (isLastQuestion ? "Finish" : "Next") : "Submit Answer" }}

          </v-btn>

        </v-card>

        <!-- SNACKBAR FEEDBACK -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
          location="bottom"
        >
          {{ snackbar.text }}
        </v-snackbar>

      </div>



      <!-- ========================================================= -->
      <!--                     POST-EXERCISE                         -->
      <!-- ========================================================= -->
      <div v-if="phase === 'post'">

        <h2 class="text-h6 mb-4">Your Results</h2>

        <p class="text-h6">
          Score: <strong>{{ scorePercent }}%</strong>
        </p>

        <v-divider class="my-4" />

        <div
          v-for="(q, idx) in shuffledExercises"
          :key="'r' + q.id"
          class="mb-6 pa-4 border rounded-lg"
        >
          <p><strong>Question {{ idx + 1 }}:</strong> {{ q.item.question }}</p>

          <p>
            <strong>Your answer:</strong>
            <span :class="result[idx] ? 'text-success' : 'text-error'">
              {{ userAnswers[idx] }}
            </span>
          </p>

          <div class="mt-2">
            <div v-if="q.item.type === 'text_mono'">
              <strong>Correct answer:</strong> {{ q.item.answer }}
            </div>

            <div v-if="q.item.type === 'text_multi'">
              <strong>Valid answers:</strong> {{ q.item.answers.join(', ') }}
            </div>

            <div v-if="q.item.type === 'checkbox'">
              <strong>Correct options:</strong>
              <ul>
                <li
                  v-for="ans in q.item.answers"
                  :key="ans[0]"
                  :class="ans[1] ? 'text-success' : 'text-error'"
                >
                  {{ ans[0] }} — {{ ans[2] }}
                </li>
              </ul>
            </div>

            <div v-if="q.item.type === 'radio'">
              <strong>Correct choice:</strong>
              <div
                v-for="(label, val) in normalizeRadio(q.item.answers)"
                :key="val"
                :class="isRadioCorrect(q.item, label) ? 'text-success' : 'text-error'"
              >
                {{ label }} — {{ getRadioExplanation(q.item, label) }}
              </div>
            </div>
          </div>
        </div>

        <v-btn color="primary" @click="restart">Try again</v-btn>

        <v-divider class="my-6" />
        <RouterLink to="/exercises">Back to list</RouterLink>
      </div>
    </div>

    <!-- ERROR NOT FOUND -->
    <div v-else>
      <h2>Error not found</h2>
      <RouterLink to="/exercises">Back to list</RouterLink>
    </div>

  </v-container>
</template>



<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { exerciseData } from "@/assets/scripts/exerciseData";
import { errorsData } from "@/assets/scripts/errorsData";

onMounted(() => {
  window.addEventListener("keydown", onEnterKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEnterKey);
});

const props = defineProps({
  errorCode: { type: String, required: true }
});

const errorEntry = errorsData[props.errorCode];

/* ------------------------------------------------------------------
   EXERCISE EXISTENCE
------------------------------------------------------------------ */
const exercises = computed(() => exerciseData[props.errorCode] || {});
const hasExercises = computed(() =>
  Object.prototype.hasOwnProperty.call(exerciseData, props.errorCode)
);


/* ------------------------------------------------------------------
   PHASES & STATE
------------------------------------------------------------------ */
const phase = ref("pre");
const shuffledExercises = ref([]);
const userAnswers = ref({});
const result = ref({});

/* SINGLE QUESTION MODE */
const currentIndex = ref(0);
const currentAnswer = ref("");

/* SNACKBAR */
const snackbar = ref({
  show: false,
  color: "info",
  text: ""
});

/* BUTTON */
const answered = ref(false); // false = showing submit button; true = showing next button

/* SHOW FEEDBACK DURING DURING PHASE */
const showImmediateFeedback = computed(() => answered.value === true);


/* ------------------------------------------------------------------
   SHUFFLE
------------------------------------------------------------------ */
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


/* ------------------------------------------------------------------
   START
------------------------------------------------------------------ */
const startExercises = () => {
  const entries = Object.entries(exercises.value).map(([id, item]) => ({
    id,
    item
  }));

  shuffledExercises.value = shuffleArray(entries);

  userAnswers.value = {};
  result.value = {};
  currentIndex.value = 0;

  initializeCurrentAnswer();

  phase.value = "during";
};


/* ------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------ */
const currentQuestion = computed(() => shuffledExercises.value[currentIndex.value]);

const isLastQuestion = computed(() =>
  currentIndex.value === shuffledExercises.value.length - 1
);

const progressPercent = computed(() =>
  ((currentIndex.value) / shuffledExercises.value.length) * 100
);


/* INIT CURRENT ANSWER */
function initializeCurrentAnswer() {
  const item = currentQuestion.value.item;
  if (item.type === "checkbox") currentAnswer.value = [];
  else currentAnswer.value = "";
}


/* RADIO HELPERS */
const normalizeRadio = answers => {
  if (Array.isArray(answers)) {
    const o = {};
    answers.forEach(a => (o[a[0]] = a[0]));
    return o;
  }
  return answers;
};

const isRadioCorrect = (item, value) => {
  if (Array.isArray(item.answers)) {
    return item.answers.find(a => a[0] === value)?.[1] === true;
  }
  return item.answers[value] === true;
};

const getRadioExplanation = (item, value) => {
  if (Array.isArray(item.answers)) {
    return item.answers.find(a => a[0] === value)?.[2] || "";
  }
  return "";
};


/* ------------------------------------------------------------------
   SUBMIT / NEXT BUTTON
------------------------------------------------------------------ */
function onEnterKey(e) {
  
  if (e.key === "Enter") {
    e.preventDefault();
    handleButtonClick();
  }
}

const handleButtonClick = () => {
  if (!answered.value) {
    submitSingleAnswer();     // grade answer + show snackbar
    answered.value = true;
  } else {
    goToNextQuestion();       // move on
  }
};


const submitSingleAnswer = () => {
  const item = currentQuestion.value.item;
  const idx = currentIndex.value;
  const ans = currentAnswer.value;

  let correct = false;

  if (item.type === "text_mono") {
    correct = ans.trim().toLowerCase() === item.answer.toLowerCase();
  }
  else if (item.type === "text_multi") {
    correct = item.answers.map(a => a.toLowerCase())
      .includes(ans.trim().toLowerCase());
  }
  else if (item.type === "checkbox") {
    const correctList = item.answers.filter(a => a[1]).map(a => a[0]);
    const user = Array.isArray(ans) ? ans.slice().sort() : [];
    correct = JSON.stringify(user) === JSON.stringify(correctList.sort());
  }
  else if (item.type === "radio") {
    correct = isRadioCorrect(item, ans);
  }

  result.value[idx] = correct;
  userAnswers.value[idx] = ans;

  snackbar.value = {
    show: true,
    color: correct ? "green" : "red",
    text: correct ? "Correct!" : "Incorrect!"
  };
};

  const goToNextQuestion = () => {
  // last question?
  if (isLastQuestion.value) {
    phase.value = "post";
    return;
  }

  currentIndex.value++;
  initializeCurrentAnswer();
  answered.value = false; // reset for next question
};


/* ------------------------------------------------------------------
   SCORE
------------------------------------------------------------------ */
const scorePercent = computed(() => {
  const vals = Object.values(result.value);
  if (!vals.length) return 0;
  return Math.round((vals.filter(v => v).length / vals.length) * 100);
});


/* ------------------------------------------------------------------
   RESTART
------------------------------------------------------------------ */
const restart = () => {
  phase.value = "pre";
};
</script>


<style scoped>
.border {
  border: 1px solid #ddd;
}

.correct-option {
  border: 2px solid #4caf50;   /* green */
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 4px;
}

.wrong-option {
  border: 2px solid #f44336;   /* red */
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 4px;
}

</style>
