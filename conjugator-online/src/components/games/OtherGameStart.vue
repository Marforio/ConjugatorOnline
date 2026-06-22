<template>
  <v-container class="pa-6">
    <div style="display: none; background: #222; color: #0f0; padding: 10px; font-family: monospace; font-size: 11px; margin-bottom: 10px; border-radius: 4px;">
      [TEMPLATE HUD] gameName: {{ gameName }} | fixedRounds: {{ fixedRounds }} | isValid: {{ isValid }}
    </div>

    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-4">
        <div class="w-100">
          <div class="d-flex justify-center mb-4">
            <v-img :src="bannerSrc" max-width="420" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">Configure your practice session</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
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
              <div class="text-caption text-error mt-2">
                *Note: All three modes are required to trigger special game achievements.
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

            <div v-else-if="gameName === 'Quantifier Quest'">
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Noun Variant Selection Set:</div>
              <v-radio-group v-model="selections.settings.variant" class="ms-2">
                <v-radio label="Countable nouns only — for practice" value="countable" />
                <v-radio label="Uncountable nouns only — for practice" value="uncountable" />
                <v-radio label="All nouns (mixed) — the real challenge" value="all" />
              </v-radio-group>
              <div class="text-caption text-info mt-2 ml-2">
                💡 Note: Countable nouns need many/few, Uncountable nouns require much/little.
              </div>
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
              
              <div class="mt-2 text-caption text-grey-darken-1">
                ⏱ Session set to <strong>30 rounds</strong>.
              </div>
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

              <div class="mt-2 text-caption text-grey-darken-1">
                ⏱ Session scale locked to <strong>24 target rounds</strong>.
              </div>
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

            <div v-else-if="gameName === 'Reported Speech'">
              <p class="text-body-2 text-grey-darken-3 mb-3">
                Practice backshifting by converting direct speech into reported speech.
              </p>
              
              <div class="text-subtitle-2 mb-1 text-grey-darken-1">Irregular Verb Set Allocation:</div>
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

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium px-0">Rounds</v-card-title>
            <div class="mt-2 text-body-1">
              Fixed to <strong>{{ fixedRounds }} rounds</strong>
            </div>
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
            Start Practice
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import api from "@/axios";

const props = defineProps<{
  gameName: "Pronoun Practice" | "Regret Machine" | "Passive Party" | "Uses Of Auxiliaries" | "Comparison" | "Parallel Universe" | "Quantifier Quest" | "Verb Mixer" | "Word Families" | "Reported Speech" | "Year 2040";
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
  
  console.log(`[DEBUG] Computed property [bannerSrc] evaluated to: "${path}"`);
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

async function handleStart() {
  console.log("%c[DEBUG] Action Triggered: handleStart click execution thread open.", "background: #1b5e20; color: #fff; padding: 2px 4px;");
  console.log("[DEBUG] Checking snapshot validation parameter state (isValid value):", isValid.value);
  
  if (!isValid.value) {
    console.error("[DEBUG] Click execution halted. Form validation parameter state is false!");
    return;
  }
  
  loading.value = true;
  
  const payload = {
    game_name: props.gameName,
    num_prompts: selections.value.num_prompts,
    settings: selections.value.settings
  };

  console.log("[DEBUG] Outbound request envelope carefully compiled.");
  console.log("👉 Destination API Endpoint: POST /api/other-games/start/");
  console.log("👉 Outbound Payload Object Data Tree Structure:", JSON.stringify(payload, null, 2));

  try {
    console.log("[DEBUG] Dispatching asynchronous network request thread via Axios instance...");
    const response = await api.post("/other-games/start/", payload);
    
    console.log("%c[DEBUG] Network Transmission Completed Successfully!", "background: #4caf50; color: #000; padding: 2px 4px;");
    console.log(`[DEBUG] Received HTTP Status Code from Backend Server: ${response.status}`);
    console.log("[DEBUG] Complete Unwrapped Response Body Data Data-Tree Payload:", JSON.stringify(response.data, null, 2));
    
    console.log("[DEBUG] Preparing to emit 'initialized' event with parameters up to Parent container View level...");
    const emitPayload = {
      session_id: response.data.session_id,
      prompts: response.data.prompts,
      settings: selections.value.settings,
      game_name: props.gameName
    };
    console.log("[DEBUG] Exact payload metadata map structure being dispatched inside emit payload object:", JSON.stringify(emitPayload, null, 2));
    
    emit("initialized", emitPayload);
    console.log("[DEBUG] Event emit function executed successfully.");
    
  } catch (error: any) {
    console.error("%c[DEBUG] Critical Exception caught during API initialization transmission flow!", "background: #b71c1c; color: #fff; padding: 2px 4px;");
    
    if (error.response) {
      console.error(`❌ Django Container Server Rejected Payload with Code: ${error.response.status}`);
      console.error("❌ Diagnostic Serializer Error Mappings Object List directly from backend environment:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("❌ Network payload left browser environment, but no response sequence was returned.", error.request);
    } else {
      console.error("❌ Axios request pipeline processing error message encountered:", error.message);
    }
  } finally {
    loading.value = false;
    console.log("[DEBUG] handleStart processing thread closed down. loading.value reset back to false.");
  }
}
</script>