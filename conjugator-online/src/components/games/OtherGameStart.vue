<template>
  <v-container class="pa-6">
    <div style="display: none; background: #222; color: #0f0; padding: 10px; font-family: monospace; font-size: 11px; margin-bottom: 10px; border-radius: 4px;">
      [TEMPLATE HUD] gameName: {{ gameName }} | fixedRounds: {{ fixedRounds }} | isValid: {{ isValid }}
    </div>

    <v-card class="mx-auto my-auto px-6 py-1 mt-6" max-width="720" elevation="3">
      <v-card-title class="mb-4">
        <div class="w-100">
          <div class="d-flex justify-center mb-4">
            <v-img :src="bannerSrc" max-width="320" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">Configure your game</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-card-title class="font-weight-medium px-0">Game Mode</v-card-title>
            
            <v-select
              v-if="gameName === 'Regret Machine'"
              v-model="selections.settings.level"
              :items="[
                { title: 'Essential verbs', value: 'essential' },
                { title: 'Advanced verbs', value: 'advanced' },
                { title: 'All', value: 'both' }
              ]"
              item-title="title"
              item-value="value"
              label="Choose set"
              density="compact"
              variant="outlined"
            />

            <div v-else-if="gameName === 'Uses Of Auxiliaries'">
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Select Active Modes:</div>
              <div class="ms-2">
                <v-checkbox
                  v-model="selections.settings.modes.echo"
                  label="Echo questions (do you?)"
                  density="compact"
                  hide-details
                />
                <v-checkbox
                  v-model="selections.settings.modes.agreement"
                  label="Agreement (so do I / neither do I)"
                  density="compact"
                  hide-details
                />
                <v-checkbox
                  v-model="selections.settings.modes.tag"
                  label="Tag questions (..., isn't it?)"
                  density="compact"
                  hide-details
                />
              </div>
              <div class="text-caption text-error mt-2 ms-6">
                *Note: All three modes are required to get the trophy
              </div>
            </div>

            <div v-else-if="gameName === 'Passive Party'">
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Verb Difficulty Level:</div>
              <v-radio-group v-model="selections.settings.level" inline class="mb-3">
                <v-radio label="Essential" value="essential" />
                <v-radio label="Advanced" value="advanced" />
              </v-radio-group>

              <v-select
                v-model="selections.settings.tenseGroup"
                :items="[
                  { title: 'Group 1 (Simple, Modals, Future)', value: 'group1' },
                  { title: 'Group 2 (Continuous, Perfect)', value: 'group2' },
                  { title: 'All Tenses', value: 'both' }
                ]"
                item-title="title"
                item-value="value"
                label="Choose Tense Selection Group"
                density="compact"
                variant="outlined"
              />
            </div>

            <div v-else-if="gameName === 'Word Families'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Strengthen your vocabulary by modifying single lemmas across multiple parts of speech.
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Assessment Engine Type:</div>
              <v-radio-group v-model="selections.settings.mode" inline class="mb-1">
                <v-radio label="Matching Mode (Easy Activation)" value="matching" />
                <v-radio label="Writing Mode (Memory Challenge)" value="writing" />
              </v-radio-group>

              <v-select
                v-model="selections.settings.track"
                :items="[
                  { title: 'All Vocab Sets', value: 'all' },
                  { title: 'Architecture', value: 'architecture' },
                  { title: 'Business', value: 'business' },
                  { title: 'Chemistry', value: 'chemistry' },
                  { title: 'Civil Engineering', value: 'civil' },
                  { title: 'Computer Science', value: 'computer_science' },
                  { title: 'Mechanical Engineering', value: 'mechanical' },
                  { title: 'Electrical Engineering', value: 'electrical' }
                ]"
                label="Vocab Focus Domain Set"
                density="compact"
                variant="outlined"
                class="mt-2"
              />
            </div>

            <div v-else-if="gameName === 'Quantifier Quest'">

              <v-radio-group v-model="selections.settings.variant" class="ms-2">
                <v-radio label="Countable nouns only — for practice" value="countable" />
                <v-radio label="Uncountable nouns only — for practice" value="uncountable" />
                <v-radio label="All nouns (mixed) — the real challenge" value="all" />
              </v-radio-group>

            </div>

            <div v-else-if="gameName === 'Comparison'">
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Practice Pool:</div>
              <v-radio-group v-model="selections.settings.partOfSpeech" inline class="mb-2">
                <v-radio label="Adjectives only" value="adjectives" />
                <v-radio label="Adverbs only" value="adverbs" />
                <v-radio label="Mix" value="mix" />
              </v-radio-group>

              <v-switch
                v-model="selections.settings.intensifiers"
                label="Require grammatical intensifiers"
                color="primary"
                inset
                density="compact"
              />
            </div>

            <div v-else-if="gameName === 'Idea Linker'">
              <p class="text-body-2 text-grey-darken-3 mb-2">
                Expand your writing syntax fluency! Connect arguments using varied linking words without repeating identical terms throughout the session.
              </p>
              <div class="mt-2 text-caption text-grey-darken-1">
                ⏱ Round sequence locked to <strong>24 prompts</strong> (60s timer limit).
              </div>
            </div>

            <div v-else-if="gameName === 'Verb Mixer'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Practice choosing the right category of verb complement (infinitive versus gerund).
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Mix Category Strategy:</div>
              <v-radio-group v-model="selections.settings.mode" inline class="mb-1">
                <v-radio label="Both categories (recommended)" value="mixed" />
                <v-radio label="One category split mode" value="single" />
              </v-radio-group>

              <v-select
                v-if="selections.settings.mode === 'single'"
                v-model="selections.settings.singleCategory"
                :items="[
                  { title: 'Infinitive Forms', value: 'infinitive' },
                  { title: 'Gerund (-ing) Forms', value: 'gerund' }
                ]"
                label="Active target complement category focus"
                density="compact"
                variant="outlined"
                class="mt-2"
              />
            </div>

            <div v-else-if="gameName === 'Year 2040'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Master complex upcoming timelines by manipulating Future Continuous and Future Perfect aspects.
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Difficulty Filter:</div>
              <v-radio-group v-model="selections.settings.mode" inline class="mb-1">
                <v-radio label="Regular + Essential Irregs" value="essential_mix" />
                <v-radio label="Regular + Advanced Irregs" value="advanced_mix" />
                <v-radio label="All Prompts Included" value="all" />
              </v-radio-group>
            </div>

            <div v-else-if="gameName === 'Parallel Universe'">
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Verb Difficulty Set:</div>
              <v-radio-group v-model="selections.settings.verbSet" inline class="mb-2">
                <v-radio label="Regular + Essential" value="regular_essential" />
                <v-radio label="Regular + Advanced" value="regular_advanced" />
                <v-radio label="All Prompts" value="all" />
              </v-radio-group>

              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Conditional Structures:</div>
              <div class="ms-2">
                <v-checkbox
                  v-model="selections.settings.conditionalTypes"
                  label="First Conditional (Reality)"
                  value="first"
                  density="compact"
                  hide-details
                />
                <v-checkbox
                  v-model="selections.settings.conditionalTypes"
                  label="Second Conditional (Unreal Present)"
                  value="second"
                  density="compact"
                  hide-details
                />
                <v-checkbox
                  v-model="selections.settings.conditionalTypes"
                  label="Third Conditional (Unreal Past)"
                  value="third"
                  density="compact"
                  hide-details
                />
              </div>
            </div>

            <div v-else-if="gameName === 'Tricky Translator'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Isolate translation errors by rendering complex conceptual structures across multiple prompt dialects.
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Prompt Source Dialect:</div>
              <v-select
                v-model="selections.settings.sourceLanguage"
                :items="[
                  { title: 'French (Français)', value: 'french' },
                  { title: 'German (Deutsch)', value: 'german' },
                  { title: 'Italian (Italiano)', value: 'italian' }
                ]"
                item-title="title"
                item-value="value"
                label="Active Translation Input"
                density="compact"
                variant="outlined"
                class="mb-2"
              />

              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Grammar Category:</div>
              <v-select
                v-model="selections.settings.categoryFilter"
                :items="[
                  { title: 'All Structural Topics Combined', value: 'all' },
                  { title: 'Past Tense Variations', value: 'past tenses' },
                  { title: 'Quantifiers and Uncountables', value: 'quantifiers and uncountable words' }
                ]"
                item-title="title"
                item-value="value"
                label="Target Domain"
                density="compact"
                variant="outlined"
              />
            </div>

            <div v-else-if="gameName === 'Reported Speech'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Practice backshifting by converting direct speech into reported speech.
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Irregular Verb Set:</div>
              <v-radio-group v-model="selections.settings.irregMode" class="ms-2">
                <v-radio label="Essential irregular verbs mixed setup" value="essential" />
                <v-radio label="Advanced irregular verbs mixed setup" value="advanced" />
                <v-radio label="Both essential and advanced categories combined" value="both" />
              </v-radio-group>
            </div>

            <div v-else-if="gameName === 'Pronoun Practice'" class="text-body-1 mt-2 text-grey-darken-2">
              <v-icon icon="mdi-account-switch" class="me-2" /> Pronoun review.
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium px-0">Rounds</v-card-title>
            <div class="mt-2 text-body-2">
              Fixed to <strong>{{ fixedRounds }} rounds</strong>
            </div>
            <div class="mt-2 text-body-2">Be careful with the time limit!</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-4">
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large">
              <v-icon color="grey-darken-3" size="large">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>

          <v-btn 
            color="success" 
            variant="flat" 
            size="large" 
            :loading="loading" 
            :disabled="!isValid"
            @click="handleStart"
          >
            Start Game
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <!-- ========================================================================= -->
    <!-- UNIVERSAL GRAMMAR RULES INTERCEPTOR DIALOG GUARD -->
    <!-- ========================================================================= -->
    <v-dialog v-model="showGrammarDialog" max-width="680" persistent scrollable>
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h5 font-weight-bold d-flex align-center border-b pb-3">
          <v-icon icon="mdi-book-open-page-variant" color="cyan-darken-2" class="me-2" />
          Grammar Reference & Rules
        </v-card-title>

        <v-card-text class="py-4">
          <!-- CASE A: QUANTIFIER QUEST RULES SHEET -->
          <div v-if="gameName === 'Quantifier Quest'">
            <p class="text-body-1 mb-3">
              <v-icon color="warning" class="me-1">mdi-alert-outline</v-icon>
              Please note that the game expects you to use these quantifiers:
            </p>
            
            <v-table class="text-center border rounded-lg overflow-hidden mb-4" density="compact">
              <thead>
                <tr class="bg-grey-lighten-4">
                  <th class="text-left font-weight-bold"></th>
                  <th class="text-center font-weight-bold">Countable Noun</th>
                  <th class="text-center font-weight-bold">Uncountable Noun</th>
                </tr>
              </thead>
              <tbody style="font-size: 0.85rem;">
                <tr>
                  <td class="font-weight-bold text-left">Big quantity</td>
                  <td>many</td>
                  <td>a lot of **</td>
                </tr>
                <tr>
                  <td class="text-left"><span class="text-decoration-underline">Impressive</span> big quantity</td>
                  <td>so many</td>
                  <td>so much</td>
                </tr>
                <tr>
                  <td class="text-left"><span class="text-decoration-underline">Excessive</span> big quantity</td>
                  <td>too many</td>
                  <td>too much</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-left">Small quantity</td>
                  <td>a few</td>
                  <td>a little</td>
                </tr>
                <tr>
                  <td class="text-left"><span class="text-decoration-underline">Impressive</span> small quantity</td>
                  <td>so few</td>
                  <td>so little</td>
                </tr>
                <tr>
                  <td class="text-left"><span class="text-decoration-underline">Excessive</span> small quantity</td>
                  <td>too few</td>
                  <td>too little</td>
                </tr>
              </tbody>
            </v-table>

            <div class="text-caption text-grey-darken-2 bg-cyan-lighten-5 pa-3 rounded-lg border mb-3">
              ** <strong>A lot of</strong> is used in declarative sentences only. 
              <strong>Much</strong> is preferred the rest of the time, especially with 'too' and 'so' 
              and when the syntax context is negative. Example: <em>"I have a lot of time"</em> vs 
              <em>"I don't have much time"</em>. This is what the game checks for.
            </div>
            
            <p class="text-caption text-grey mt-2">
              For further study, see the grammar book: 
              <a href="https://book.language-labs.ch/ch1#quantifiers" target="_blank" class="text-primary text-decoration-none">Quantifiers</a> and 
              <a href="https://book.language-labs.ch/ch1#countable-vs-uncountable" target="_blank" class="text-primary text-decoration-none">Countable/Uncountable Rules</a>.
            </p>
          </div>

          <!-- CASE B: VERB MIXER RULES SHEET -->
          <div v-else-if="gameName === 'Verb Mixer'">
            <p class="text-body-1 font-weight-medium mb-2">Gerund or Infinitive?</p>
            <p class="text-body-2 text-grey-darken-3 mb-2">
              Verbs complements can be <strong>infinitive</strong> (e.g., <em>decide to go, refuse to talk</em>) or <strong>gerund</strong> (e.g., <em>enjoy dancing, avoid crashing</em>). Review the rules on how to choose the correct verb complement in <a href="https://book.language-labs.ch/ch11" target="_blank" class="text-primary text-decoration-none">Verb Complements</a>.
            </p>
          </div>

          <!-- CASE C: DEFAULT FALLBACK WRAPPER SHEET -->
          <div v-else>
            <p class="text-body-1 mb-2 font-weight-medium">Before playing:</p>
              <p v-if="gameName === 'Passive Party'" class="text-body-2 text-grey-darken-3">
                Review the rules on how to convert sentences in <a href="https://book.language-labs.ch/ch8" target="_blank" class="text-primary text-decoration-none">active voice to passive voice</a>.
              </p>
              <p v-else-if="gameName === 'Pronoun Practice'" class="text-body-2 text-grey-darken-3">
              Review the <a href="https://book.language-labs.ch/ch9" target="_blank" class="text-primary text-decoration-none">table of English Pronouns</a>.
            </p>
            <p v-else-if="gameName === 'Regret Machine'" class="text-body-2 text-grey-darken-3">
              Review the <a href="https://book.language-labs.ch/ch5#should-could" target="_blank" class="text-primary text-decoration-none">use of should or could for criticism of past actions</a>.
            </p>
            <p v-else-if="gameName === 'Year 2040'" class="text-body-2 text-grey-darken-3">
              Review the <a href="https://book.language-labs.ch/ch4#future-tenses" target="_blank" class="text-primary text-decoration-none">use of advanced future tenses</a>.
            </p>
            <p v-else-if="gameName === 'Comparison'" class="text-body-2 text-grey-darken-3">
              Review <a href="https://book.language-labs.ch/ch2#comparative-and-superlative" target="_blank" class="text-primary text-decoration-none">comparative and superlative forms</a>.
            </p>
            <p v-else-if="gameName === 'Parallel Universe'" class="text-body-2 text-grey-darken-3">
              Review <a href="https://book.language-labs.ch/ch4#1st-2nd-conditionals" target="_blank" class="text-primary text-decoration-none">first and second conditional sentences for real and unreal situations,</a> as well as <a href="https://book.language-labs.ch/ch4#past-perfect" target="_blank" class="text-primary text-decoration-none">third conditional sentences for hypothetical past situations</a>.
            </p>
            <p v-else-if="gameName === 'Reported Speech'" class="text-body-2 text-grey-darken-3">
              Review the rules for tense backshifting and <a href="https://book.language-labs.ch/ch4#reported-speech" target="_blank" class="text-primary text-decoration-none">reported speech</a>.
            </p>
            <p v-else-if="gameName === 'Uses Of Auxiliaries'" class="text-body-2 text-grey-darken-3">
              Review the ways auxiliary verbs are used as discourse markers to <a href="https://book.language-labs.ch/ch13" target="_blank" class="text-primary text-decoration-none">show interest, agreement or willingness to participate in a conversation</a>.
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 border-t d-flex justify-space-between">
          <v-btn color="grey-darken-1" variant="text" size="large" @click="showGrammarDialog = false">
            Go Back
          </v-btn>
          <v-btn color="success" variant="flat" size="large" class="px-6 rounded-pill" @click="executeActualGameLaunch">
            Launch Game
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import api from "@/axios";

const props = defineProps<{
  gameName: "Pronoun Practice" | "Regret Machine" | "Passive Party" | "Uses Of Auxiliaries" | "Comparison" | "Parallel Universe" | "Quantifier Quest" | "Verb Mixer" | "Word Families" | "Reported Speech" | "Year 2040" | "Tricky Translator" | "Idea Linker";
}>();

const emit = defineEmits<{
  (e: "initialized", payload: { session_id: number; prompts: any[]; settings: any; game_name: string }): void;
}>();

const loading = ref(false);

const fixedRounds = computed(() => {
  const rounds = (props.gameName === "Pronoun Practice" || props.gameName === "Uses Of Auxiliaries") ? 30 : 24;
  console.log(`[DEBUG] Computed property [fixedRounds] re-evaluated to: ${rounds} (Based on gameName: ${props.gameName})`);
  return rounds;
});

const bannerSrc = computed(() => {
  let path = "/images/banners/PronounPractice.png";
  if (props.gameName === "Regret Machine") path = "/images/banners/RegretMachine.png";
  else if (props.gameName === "Passive Party") path = "/images/banners/PassiveParty.png";
  else if (props.gameName === "Uses Of Auxiliaries") path = "/images/banners/UsesOfAuxiliaries.png";
  else if (props.gameName === "Comparison") path = "/images/banners/Comparison.png";
  else if (props.gameName === "Parallel Universe") path = "/images/banners/ParallelUniverse.png";
  else if (props.gameName === "Quantifier Quest") path = "/images/banners/QuantifierQuest.png";
  else if (props.gameName === "Verb Mixer") path = "/images/banners/VerbMixer.png";
  else if (props.gameName === "Word Families") path = "/images/banners/WordFamilies.png";
  else if (props.gameName === "Reported Speech") path = "/images/banners/ReportedSpeech.png";
  else if (props.gameName === "Year 2040") path = "/images/banners/Year2040.png";
  else if (props.gameName === "Tricky Translator") path = "/images/banners/TrickyTranslator.png";
  else if (props.gameName === "Idea Linker") path = "/images/banners/IdeaLinker.png";

  return path;
});

const selections = ref({
  num_prompts: 24,
  settings: {} as any
});

const isValid = computed(() => {
  if (props.gameName === "Uses Of Auxiliaries") {
    const m = selections.value.settings?.modes;
    return !!(m?.echo || m?.agreement || m?.tag);
  }
  if (props.gameName === "Parallel Universe") {
    const t = selections.value.settings?.conditionalTypes;
    return Array.isArray(t) && t.length > 0;
  }
  return true;
});

// 🚨 Add this state variable near your other refs
const showGrammarDialog = ref(false);

// 🚨 Modify handleStart to act as the Gateway, and add executeActualGameLaunch
async function handleStart() {
  if (!isValid.value) return;
  
  // Step 1: Intercept launch to display grammar rules first
  showGrammarDialog.value = true;
}

async function executeActualGameLaunch() {
  // Step 2: Close the dialog, start the loading spinner, and trigger the backend request
  showGrammarDialog.value = false;
  loading.value = true;

  const targetSettings = { ...selections.value.settings };

  if (props.gameName === "Verb Mixer" && targetSettings.mode === "mixed") {
    delete targetSettings.singleCategory; 
  }
  
  const payload = {
    game_name: props.gameName,
    num_prompts: selections.value.num_prompts,
    settings: targetSettings
  };

  try {
    const response = await api.post("/other-games/start/", payload);
    const emitPayload = {
      session_id: response.data.session_id,
      prompts: response.data.prompts,
      settings: targetSettings,
      game_name: props.gameName
    };
    emit("initialized", emitPayload);
  } catch (error: any) {
    console.error("Critical Exception caught during API initialization:", error);
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  console.log("%c[DEBUG] OtherGameStart lifecycle hook: component mounted to DOM.", "background: #1a237e; color: #fff; padding: 2px 4px;");
  console.log("[DEBUG] Props validation context check. gameName prop is currently:", props.gameName);
  console.log("[DEBUG] Initial mounted reactive selections tree shape reference:", JSON.stringify(selections.value, null, 2));
});

watch(
  () => props.gameName,
  (newGameName) => {
    console.log("%c[DEBUG] Watch execution target fired! gameName changed to:", "background: #e65100; color: #fff; padding: 2px 4px;", newGameName);
    
    selections.value.num_prompts = fixedRounds.value;
    console.log(`[DEBUG] Synced selections.num_prompts to fixedRounds: ${selections.value.num_prompts}`);

    if (newGameName === "Parallel Universe") {
      selections.value.settings = {
        verbSet: "regular_essential",
        conditionalTypes: ["first", "second", "third"]
          }; 
    } else if (newGameName === "Uses Of Auxiliaries") {
      selections.value.settings = {
        modes: { echo: true, agreement: true, tag: true }
      };
    } else if (newGameName === "Quantifier Quest") {
        selections.value.settings = { variant: "all" };
    } else if (newGameName === "Passive Party") {
      selections.value.settings = { level: "essential", tenseGroup: "both" };
    } else if (newGameName === "Regret Machine") {
      selections.value.settings = { level: "essential" };
    } else if (newGameName === "Comparison") {
      selections.value.settings = { partOfSpeech: "mix", intensifiers: false };
    } else if (newGameName === "Reported Speech") {
      selections.value.num_prompts = 24;
      selections.value.settings = { irregMode: "essential" };
    } else if (newGameName === "Idea Linker") {
      selections.value.num_prompts = 24;
      selections.value.settings = {};
    } else if (newGameName === "Tricky Translator") {
        selections.value.num_prompts = 24;
        selections.value.settings = {
          sourceLanguage: "french",
          categoryFilter: "all"
        };
      } else if (newGameName === "Word Families") {
      selections.value.num_prompts = 20; // Override default 24
      selections.value.settings = {
        mode: "writing",
        track: "all"
      };
    } else if (newGameName === "Verb Mixer") {
      selections.value.num_prompts = 30; // Override default 24
      selections.value.settings = {
        mode: "mixed",
        singleCategory: "infinitive"
      };
    } else if (newGameName === "Year 2040") {
      selections.value.num_prompts = 24;
      selections.value.settings = { mode: "essential_mix" };
    } else if (newGameName === "Pronoun Practice") {
      // ✅ Added requested baseline hook tracking for Pronouns
      selections.value.settings = { reviewMode: "comprehensive" };
      console.log("[DEBUG] Initialized custom setup profile map for Pronoun Practice.");
    } else {
      console.log("[DEBUG] Unmatched custom game option found. Initializing with fallback empty settings block.");
      selections.value.settings = {};
    }
    
    console.log("[DEBUG] Target selections object structure configuration is now fully bound:", JSON.stringify(selections.value, null, 2));
  },
  { immediate: true }
);

// Inside <script setup> in OtherGameStart.vue

// Monitor changes to the Verb Mixer selection strategy mode toggle
watch(
  () => selections.value.settings.mode,
  (newMode) => {
    if (props.gameName === "Verb Mixer") {
      if (newMode === "mixed") {
        // Clear out the selection modifier so it doesn't leak into the API call
        selections.value.settings.singleCategory = null; 
      } else if (newMode === "single") {
        // Provide a default fallback value ONLY if they explicitly select single-mode
        selections.value.settings.singleCategory = "infinitive";
      }
    }
  }
);

</script>