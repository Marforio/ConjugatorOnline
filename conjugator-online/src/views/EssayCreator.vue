<template>
  <v-container>
    <!-- HEADER -->
    <v-row>
      <v-col cols="12" class="mt-6">
        <h1 class="text-h4 font-weight-bold">Essay Creator</h1>
        <div class="text-subtitle-1 mb-6">
          Create a simple essay using linking words
        </div>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-space-between align-top">
      <v-text-field
        v-model="essayTitle"
        label="Essay Title"
        density="compact"
        variant="outlined"
        class="ms-4 mb-4"
        max-width="700px"
      />
       <v-text-field
        v-model="essayAuthor"
        label="Author"
        density="compact"
        variant="outlined"
        class="ms-4 mb-4"
        max-width="200px"
      /> 

      <div class="text-right text-overline mb-2 me-6">
        Word count: {{ wordCount }}
      </div>
    </v-row>

    <!-- MODEL SELECT -->
    <v-row class="d-flex justify-space-between">
      <v-col cols="12" md="4">
        <v-select
          label="Text model"
          :items="textModels"
          v-model="selectedModel"
          density="compact"
          class="ms-3"
        />
      </v-col>

      <v-col v-if="selectedModel === 'Pros and cons'" cols="12" md="4">
        <v-switch
          v-model="negativeFirst"
          label="Negative points first"
          color="primary"
        />
      </v-col>
    </v-row>
    

    <template v-if="selectedModel === 'Pros and cons'">
      <!-- INTRODUCTION -->
    <v-card class="pa-4 mb-6" elevation="3">
      <div class="text-h6 mb-3">I. Introduction</div>
    
      <v-row>
        <v-textarea
            key="intro1"
            label="Explain why the area of discussion is important or interesting"
            v-model="intro[0]"
            auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
            class="mx-8 mt-4"
        />
      </v-row>
      <v-row class="mt-2 mx-4">
        <v-col cols="3" >
          <v-select
            :items="availableCounter"
            label="Counter-expectation"
            v-model="introCounterLinker"
            density="compact"
            max-width="220"
          />
        </v-col>
        <v-col>
          <v-textarea
            key="intro2"
            label="Introduce a complication or tension related to the topic"
            v-model="intro[1]"
            auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
          />
          <div v-if="introCounterLinker" :class="['text-caption mt-1', getHintClass('counter-expectation')]">
            {{ getBehaviorHint(introCounterLinker) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
         <v-textarea
          key="intro3"
          label="State the purpose of the essay or ask a rhetorical question to set up the contrast"
          v-model="intro[2]"
          auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
          class="mx-8"
        />
      </v-row>
    </v-card>
    <!-- FIRST SECTION (Positive or Negative based on switch) -->
    <v-card class="pa-4 mb-6" elevation="3">
      <div class="text-h6 mb-3">{{ negativeFirst ? 'II. Negative points' : 'II. Positive points' }}</div>

      <v-textarea 
        :label="'Write a sentence to say that there are many ' + (negativeFirst ? 'negative' : 'positive') + ' points to consider'" 
        v-model="indication" 
        auto-grow 
        rows="1" 
        max-rows="2" 
        density="compact" 
        variant="outlined" 
        class="mt-4 mx-6"
      />
      
      <v-row
        v-for="i in 3"
        :key="'first-'+i"
        class="mx-4"
        align="start"
      >
        <v-col cols="6">
          <!-- Sequence connector -->
          <v-row class="mt-2">
            <v-col cols="4">
              <v-select
                :items="availableSequence"
                label="Sequence"
                v-model="firstSection[i-1].seqLinker"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-textarea 
                v-model="firstSection[i-1].seq" 
                :label="'Argument ' + i"
                auto-grow 
                rows="1" 
                max-rows="2" 
                density="compact" 
                variant="outlined" 
              />
              <div v-if="firstSection[i-1].seqLinker" :class="['text-caption mt-1', getHintClass('sequence')]">
                {{ getBehaviorHint(firstSection[i-1].seqLinker) }}
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="6">
          <!-- Expansion connector -->
          <v-row class="mt-2">
            <v-col cols="4">
              <v-select
                :items="availableExpansion"
                label="Expansion"
                v-model="firstSection[i-1].expLinker"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-textarea 
                v-model="firstSection[i-1].exp" 
                :label="'Evidence ' + i"
                auto-grow 
                rows="1" 
                max-rows="2" 
                density="compact" 
                variant="outlined" 
              />
              <div v-if="firstSection[i-1].expLinker" :class="['text-caption mt-1', getHintClass('expansion')]">
                {{ getBehaviorHint(firstSection[i-1].expLinker) }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- SECOND SECTION (opposite of first) -->
    <v-card class="pa-4 mb-6" elevation="3">
      <div class="text-h6 mb-3">{{ negativeFirst ? 'III. Positive points' : 'III. Negative points' }}</div>

      <!-- TRANSITION -->
      <v-row class="mt-3 mx-6">
        <v-col cols="3">
          <v-select
            :items="[...availableContrast, ...availableCounter]"
            label="Contrast"
            v-model="transition.linker"
            density="compact"
            max-width="220"
          />
        </v-col>
        <v-col >
          <v-textarea 
            v-model="transition.text" 
            label="Transition: contrast the previous paragraph with this one"
            auto-grow 
            rows="1" 
            max-rows="2" 
            density="compact" 
            variant="outlined" 
          />
          <div v-if="transition.linker && transitionBehaviorHint" :class="['text-caption mt-1', getHintClass('comparison')]">
            {{ transitionBehaviorHint }}
          </div>
        </v-col>
      </v-row>

      <v-row
        v-for="i in 3"
        :key="'second-'+i"
        class="mx-6"
        align="start"
      >
        <v-col cols="6">
          <!-- Sequence connector -->
          <v-row class="mt-2">
            <v-col cols="4">
              <v-select
                :items="availableSequence"
                label="Sequence"
                v-model="secondSection[i-1].seqLinker"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-textarea 
                v-model="secondSection[i-1].seq" 
                auto-grow 
                rows="1" 
                max-rows="2" 
                density="compact" 
                variant="outlined" 
                :label="'Argument ' + i"
              />
              <div v-if="secondSection[i-1].seqLinker" :class="['text-caption mt-1', getHintClass('sequence')]">
                {{ getBehaviorHint(secondSection[i-1].seqLinker) }}
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="6">
          <!-- Expansion connector -->
          <v-row class="mt-2">
            <v-col cols="4">
              <v-select
                :items="availableExpansion"
                label="Expansion"
                v-model="secondSection[i-1].expLinker"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-textarea 
                v-model="secondSection[i-1].exp" 
                auto-grow 
                rows="1" 
                max-rows="2" 
                density="compact" 
                variant="outlined" 
                :label="'Evidence ' + i"
              />
              <div v-if="secondSection[i-1].expLinker" :class="['text-caption mt-1', getHintClass('expansion')]">
                {{ getBehaviorHint(secondSection[i-1].expLinker) }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

        <!-- CONCLUSION -->
    <v-card class="pa-4 mb-6" elevation="3">
      <div class="text-h6 mb-3">IV. Conclusion</div>

      <v-row class="mt-2 mx-6">
        <v-col cols="3" max-width="220">
          <v-select
            :items="availableContrast"
            label="Contrast"
            v-model="conclusionContrastLinker"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-textarea
            label="Restate the contrast in one sentence"
            v-model="conclusion.contrast"
            hint="Summarize the balance between positive and negative points"
            auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
          />
          <div v-if="conclusionContrastLinker" :class="['text-caption mt-1', getHintClass('comparison')]">
            {{ getBehaviorHint(conclusionContrastLinker) }}
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-2 mx-6">
        <v-col cols="3" max-width="220">
          <v-select
            :items="availableEffect"
            label="Effect"
            v-model="conclusion.effectLinker"
            density="compact"
            
          />
        </v-col>
        <v-col>
          <v-textarea
            label="Draw the conclusion"
            v-model="conclusion.effectText"
            auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
            hint="Write the conclusion that follows logically from the previous sentence"
          />
          <div v-if="conclusion.effectLinker && effectBehaviorHint" :class="['text-caption mt-1', getHintClass('cause and effect')]">
            {{ effectBehaviorHint }}
          </div>
        </v-col>
      </v-row>

      <v-textarea
        label="Final statement or recommendation"
        v-model="conclusion.final"
        auto-grow rows="1" max-rows="3" density="compact" variant="outlined"
        class="mt-2 mx-8"
      />
    </v-card>
    </template>

<!-- POINT-BY-POINT MODEL -->
<template v-else-if="selectedModel === 'Point-by-point'">
  <!-- OPTIONS + CRITERIA SETUP -->
  <v-card class="pa-4 mb-6" elevation="3">
    <div class="text-h6 mb-3">0. Setup: Options & Criteria</div>

    <v-row class="mx-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="optionA"
          label="Option A (e.g., Coca-Cola)"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="optionB"
          label="Option B (e.g., Pepsi)"
          density="compact"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row class="mx-4">
      <v-col cols="12">
        <div class="text-subtitle-2 mb-2">Criteria (3)</div>
      </v-col>

      <v-col
        v-for="(row, idx) in criteria"
        :key="'criteria-title-'+idx"
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="row.title"
          :label="`Criterion ${idx + 1} (single word/short phrase)`"
          density="compact"
          variant="outlined"
        />
      </v-col>
    </v-row>
  </v-card>

  <!-- INTRODUCTION -->
  <v-card class="pa-4 mb-6" elevation="3">
    <div class="text-h6 mb-3">I. Introduction</div>

    <v-row>
      <v-textarea
        key="intro1"
        label="Explain why the area of discussion is important or interesting"
        v-model="intro[0]"
        auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
        class="mx-8 mt-4"
      />
    </v-row>

    <v-row class="mt-2 mx-4">
      <v-col cols="3">
        <v-select
          :items="availableCounter"
          label="Counter-expectation"
          v-model="introCounterLinker"
          density="compact"
          max-width="220"
        />
      </v-col>

      <v-col>
        <v-textarea
          key="intro2"
          label="Introduce a complication or tension related to the topic"
          v-model="intro[1]"
          auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
        />
        <div
          v-if="introCounterLinker"
          :class="['text-caption mt-1', getHintClass('counter-expectation')]"
        >
          {{ getBehaviorHint(introCounterLinker) }}
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-textarea
        key="intro3"
        label="Introduce the two options that will be compared in the essay (e.g., two products, two choices, two perspectives)"
        v-model="intro[2]"
        auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
        class="mx-8"
      />
    </v-row>

    <v-row>
      <v-textarea
        key="intro4"
        label="State that the essay will compare these two options based on three specific criteria"
        v-model="intro[3]"
        auto-grow rows="1" max-rows="2" density="compact" variant="outlined"
        class="mx-8"
      />
    </v-row>
  </v-card>

  <!-- ANALYSIS -->
  <v-card class="pa-4 mb-6" elevation="3">
    <div class="text-h6 mb-3">II. Point-by-point analysis</div>

    <v-row
      v-for="(row, idx) in criteria"
      :key="'crit-'+idx"
      class="mx-4"
      align="start"
    >
      <v-col cols="12" class="mt-4">
        <div class="text-h6">
          {{ row.title?.trim() ? row.title : `Criterion ${idx + 1}` }}
        </div>
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="row.introText"
          label="Intro sentence for this criterion paragraph (full sentence)"
          auto-grow
          rows="1"
          max-rows="3"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <!-- Comparison 1 -->
      <v-col cols="3">
        <v-select
          :items="[...availableContrast, ...availableCounter]"
          label="Comparison"
          v-model="row.comparison1Linker"
          density="compact"
        />
      </v-col>

      <v-col cols="9">
        <v-textarea
          v-model="row.comparison1Text"
          label="Compare the two options based on this criterion."
          auto-grow rows="1" max-rows="3"
          density="compact" variant="outlined"
        />
      </v-col>

      <!-- Expansion -->
      <v-col cols="3">
        <v-select
          :items="availableExpansion"
          label="Expansion"
          v-model="row.expansionLinker"
          density="compact"
          />
      </v-col>

      <v-col cols="9">
        <v-textarea
          v-model="row.expansionText"
          label="Add details or examples."
          auto-grow rows="1" max-rows="3"
          density="compact" variant="outlined"
        />
      </v-col>

      <!-- Sequence -->
      <v-col cols="3">
        <v-select
          :items="availableSequence"
          label="Sequence"
          v-model="row.sequenceLinker"
          density="compact"
        />
      </v-col>

      <v-col cols="9">
        <v-textarea
          v-model="row.comparison2Text"
          label="Compare the two options again based on this criterion."
          auto-grow rows="1" max-rows="3"
          density="compact" variant="outlined"
        />
      </v-col>

      <!-- Comparison 2 -->
      <v-col cols="3">
        <v-select
          :items="[...availableContrast, ...availableCounter]"
          label="Comparison"
          v-model="row.comparison2Linker"
          density="compact"
        />
      </v-col>

      <v-col cols="9">
        <v-textarea
          v-model="row.finalComparisonText"
          label="Finish the comparison."
          auto-grow rows="1" max-rows="3"
          density="compact" variant="outlined"
        />
      </v-col>
    </v-row>
  </v-card>

  <!-- CONCLUSION -->
  <v-card class="pa-4 mb-6" elevation="3">
    <div class="text-h6 mb-3">IV. Conclusion</div>

    <v-row class="mt-2 mx-6">
      <v-col cols="3" max-width="220">
        <v-select
          :items="['Overall', 'On balance', 'On the whole', 'In summary', 'In conclusion', 'Summing up']"
          label="Sequence >> Conclusion"
          v-model="conclusionContrastLinker"
          density="compact"
        />
      </v-col>

      <v-col>
        <v-textarea
          label="Restate the contrast in one sentence"
          v-model="conclusion.contrast"
          auto-grow rows="1" max-rows="2"
          density="compact" variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row class="mt-2 mx-6">
      <v-col cols="3" max-width="220">
        <v-select
          :items="availableEffect"
          label="Effect"
          v-model="conclusion.effectLinker"
          density="compact"
        />
      </v-col>

      <v-col>
        <v-textarea
          label="Draw the conclusion"
          v-model="conclusion.effectText"
          auto-grow rows="1" max-rows="2"
          density="compact" variant="outlined"
        />
      </v-col>
    </v-row>

    <v-textarea
      label="Final statement or recommendation"
      v-model="conclusion.final"
      auto-grow rows="1" max-rows="3"
      density="compact" variant="outlined"
      class="mt-2 mx-8"
    />
  </v-card>
</template>



    <!-- EXPORT -->
    <v-row>
      <v-col cols="12" class="d-flex justify-end gap-2">
        <v-btn color="secondary" size="large" @click="generatePresentationPdf">
          Create Presentation Cards
        </v-btn>
        <v-btn color="primary" size="large" @click="generateEssayPdf">
          Create Essay PDF
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { ideaLinkerPrompts } from "@/assets/scripts/idea_linker/IdeaLinkerPrompts"
import { jsPDF } from 'jspdf'

// =====================
// CONNECTOR POOLS
// =====================

function pool(category, variant = null) {
  if (variant === null) {
    return Object.values(ideaLinkerPrompts)
      .filter(e => e.category === category)
      .flatMap(e => e.possibleLinkers || [])
  }
  if (Array.isArray(variant)) {
    return Object.values(ideaLinkerPrompts)
      .filter(e => e.category === category && variant.includes(e.variant))
      .flatMap(e => e.possibleLinkers || [])
  }
  return Object.values(ideaLinkerPrompts)
    .filter(e => e.category === category && e.variant === variant)
    .flatMap(e => e.possibleLinkers || [])
}

// Helper function to capitalize first letter of each word
function capitalizeLinkers(linkers) {
  return linkers.map(linker => {
    if (!linker) return linker

    const trimmed = linker.trim()

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  })
}


// track used linkers globally
const usedLinkers = ref([])

// Function to mark a linker as used (with old value to unmark)
function markLinkerUsed(newLinker, oldLinker) {
  // Unmark old linker
  if (oldLinker && oldLinker !== newLinker) {
    const index = usedLinkers.value.indexOf(oldLinker)
    if (index > -1) {
      usedLinkers.value.splice(index, 1)
    }
  }
  // Mark new linker
  if (newLinker && !usedLinkers.value.includes(newLinker)) {
    usedLinkers.value.push(newLinker)
  }
}

// Helper function to get behavior for a linker
function getLinkerBehavior(linker) {
  if (!linker) return null
  const lowerLinker = linker.toLowerCase()
  const entry = Object.values(ideaLinkerPrompts).find(e => 
    e.possibleLinkers?.some(l => l.toLowerCase() === lowerLinker)
  )
  return entry?.behavior || null
}

// Helper function to get CSS class for hint based on category
function getHintClass(category) {
  const lowerCategory = category?.toLowerCase() || ''
  
  // Determine behavior from category
  if (lowerCategory.includes('sequence') || lowerCategory.includes('expansion') || 
      lowerCategory.includes('comparison') || lowerCategory.includes('counter') || 
      lowerCategory.includes('effect')) {
    // We need to look at actual linker behavior
    return 'hint-default'
  }
  return 'hint-default'
}

// Helper function to get hint class based on actual linker
function getLinkerHintClass(linker) {
  const behavior = getLinkerBehavior(linker)
  if (!behavior) return 'hint-default'
  
  switch (behavior) {
    case "sentence modifier":
      return "hint-sentence-modifier"
    case "+ subordinate clause":
      return "hint-subordinate"
    case "+ noun phrase":
      return "hint-noun-phrase"
    default:
      return "hint-default"
  }
}

// Helper function to get behavior hint for a linker
function getBehaviorHint(linker) {
  if (!linker) return null
  
  const lowerLinker = linker.toLowerCase()
  
  const entry = Object.values(ideaLinkerPrompts).find(e => 
    e.possibleLinkers?.some(l => l.toLowerCase() === lowerLinker)
  )
  
  if (!entry) return null
  
  switch (entry.behavior) {
    case "sentence modifier":
      return "Usage: this linker is a sentence modifier, so add a comma, then write a complete sentence."
    case "+ subordinate clause":
      return "Usage: this linking word needs a complete sentence (no comma)."
    case "+ noun phrase":
      return "Usage: this linking word needs a noun phrase only."
    default:
      return null
  }
}

// Override getHintClass to use actual linker behavior
const getHintClassOverride = (linker) => {
  return getLinkerHintClass(linker)
}

// pools used in this component - CAPITALIZE THEN DEDUPLICATE
const sequencePoolRaw = ["first", "firstly", "one of the main benefits", "one clear advantage", "another key point", "one of the drawbacks", "one clear disadvantage", ...pool("sequence")]
const sequencePool = [...new Set(capitalizeLinkers(sequencePoolRaw))]

const expansionPoolRaw = pool("expansion", ["exemplification", "add details or rephrase"])
const expansionPool = [...new Set(capitalizeLinkers(expansionPoolRaw))]

const contrastPoolRaw = pool("comparison", "contrast")
const contrastPool = [...new Set(capitalizeLinkers(contrastPoolRaw))]

const counterPoolRaw = pool("counter-expectation")
const counterPool = [...new Set(capitalizeLinkers(counterPoolRaw))]

const effectPoolRaw = pool("cause and effect", "effect")
const effectPool = [...new Set(capitalizeLinkers(effectPoolRaw))]

// Available computed properties (filter out used linkers)
const availableSequence = computed(() => 
  sequencePool.filter(linker => !usedLinkers.value.includes(linker))
)

const availableExpansion = computed(() => 
  expansionPool.filter(linker => !usedLinkers.value.includes(linker))
)

const availableContrast = computed(() => 
  contrastPool.filter(linker => !usedLinkers.value.includes(linker))
)

const availableCounter = computed(() => 
  counterPool.filter(linker => !usedLinkers.value.includes(linker))
)

const availableEffect = computed(() => 
  effectPool.filter(linker => !usedLinkers.value.includes(linker))
)

// Computed hints for transition and effect linkers
const transitionBehaviorHint = computed(() => getBehaviorHint(transition.value.linker))
const effectBehaviorHint = computed(() => getBehaviorHint(conclusion.value.effectLinker))

// =====================
// STATE
// =====================

const essayTitle = ref("")
const essayAuthor = ref("")
const indication = ref("")
const introCounterLinker = ref(null)
const conclusionContrastLinker = ref(null)
const textModels = ["Pros and cons", "Point-by-point"]
const selectedModel = ref(textModels[0])
const negativeFirst = ref(false)

const intro = ref(["", "", ""])

// First section (positive or negative depending on switch)
const firstSection = ref([
  { seq: "", exp: "", seqLinker: null, expLinker: null },
  { seq: "", exp: "", seqLinker: null, expLinker: null },
  { seq: "", exp: "", seqLinker: null, expLinker: null }
])

// Second section (opposite of first)
const secondSection = ref([
  { seq: "", exp: "", seqLinker: null, expLinker: null },
  { seq: "", exp: "", seqLinker: null, expLinker: null },
  { seq: "", exp: "", seqLinker: null, expLinker: null }
])

const transition = ref({
  linker: null,
  text: ""
})

const conclusion = ref({
  contrast: "",
  effectLinker: null,
  effectText: "",
  final: ""
})

// Point-by-point specific state
const optionA = ref("")
const optionB = ref("")

const criteria = ref([
  { title: "",
    introText: "",
    comparison1Linker: null,
    comparison1Text: "",       
    expansionLinker: null,
    expansionText: "",
    sequenceLinker: null,
    comparison2Text: "",
    comparison2Linker: null,
    finalComparisonText: "",
  },
  {
    title: "",                
    introText: "",
    comparison1Linker: null,
    comparison1Text: "",       
    expansionLinker: null,
    expansionText: "",
    sequenceLinker: null,
    comparison2Text: "",
    comparison2Linker: null,
    finalComparisonText: "",
  },
  {
    title: "",                
    introText: "",
    comparison1Linker: null,
    comparison1Text: "",      
    expansionLinker: null,
    expansionText: "",
    sequenceLinker: null,
    comparison2Text: "",
    comparison2Linker: null,
    finalComparisonText: "",
  }
])

watch(
  () => criteria.value,
  () => {
    const next = []

    for (const row of criteria.value) {
      if (row.comparison1Linker) next.push(row.comparison1Linker)
      if (row.expansionLinker) next.push(row.expansionLinker)
      if (row.sequenceLinker) next.push(row.sequenceLinker)
      if (row.comparison2Linker) next.push(row.comparison2Linker)
    }

    // include the other single linkers you already track
    if (introCounterLinker.value) next.push(introCounterLinker.value)
    if (transition.value.linker) next.push(transition.value.linker)
    if (conclusionContrastLinker.value) next.push(conclusionContrastLinker.value)
    if (conclusion.value.effectLinker) next.push(conclusion.value.effectLinker)

    usedLinkers.value = [...new Set(next)]
  },
  { deep: true }
)

// Watch intro counter linker
watch(() => introCounterLinker.value, (newVal, oldVal) => {
  if (oldVal) {
    const index = usedLinkers.value.indexOf(oldVal)
    if (index > -1) usedLinkers.value.splice(index, 1)
  }
  if (newVal && !usedLinkers.value.includes(newVal)) {
    usedLinkers.value.push(newVal)
  }
})

// Watch conclusion contrast linker
watch(() => conclusionContrastLinker.value, (newVal, oldVal) => {
  if (oldVal) {
    const index = usedLinkers.value.indexOf(oldVal)
    if (index > -1) usedLinkers.value.splice(index, 1)
  }
  if (newVal && !usedLinkers.value.includes(newVal)) {
    usedLinkers.value.push(newVal)
  }
})

// Watch transition linker and mark/unmark as used
watch(() => transition.value.linker, (newVal, oldVal) => {
  if (oldVal) {
    const index = usedLinkers.value.indexOf(oldVal)
    if (index > -1) usedLinkers.value.splice(index, 1)
  }
  if (newVal && !usedLinkers.value.includes(newVal)) {
    usedLinkers.value.push(newVal)
  }
})

// Watch conclusion effect linker and mark/unmark as used
watch(() => conclusion.value.effectLinker, (newVal, oldVal) => {
  if (oldVal) {
    const index = usedLinkers.value.indexOf(oldVal)
    if (index > -1) usedLinkers.value.splice(index, 1)
  }
  if (newVal && !usedLinkers.value.includes(newVal)) {
    usedLinkers.value.push(newVal)
  }
})

//////////////////////////////////// DEBUG PRINTS //////////////////////////////////

onMounted(() => {
  console.log('🚀 Essay Creator mounted')
  console.log('Available contrast connectors:', availableContrast.value)
  console.log('Raw contrast pool:', contrastPoolRaw)

})  


// =====================
// PDF GENERATION
// =====================

// Get RGB color based on behavior
function getBehaviorColor(linker) {
  const behavior = getLinkerBehavior(linker)
  switch (behavior) {
    case "sentence modifier":
      return { r: 220, g: 53, b: 69 } // Red
    case "+ subordinate clause":
      return { r: 40, g: 167, b: 69 } // Green
    case "+ noun phrase":
      return { r: 13, g: 110, b: 253 } // Blue
    default:
      return { r: 0, g: 0, b: 0 } // Black
  }
}

// Get light background color
function getLightBehaviorColor(linker) {
  const behavior = getLinkerBehavior(linker)
  switch (behavior) {
    case "sentence modifier":
      return { r: 255, g: 230, b: 230 } // Light red
    case "+ subordinate clause":
      return { r: 230, g: 255, b: 230 } // Light green
    case "+ noun phrase":
      return { r: 230, g: 240, b: 255 } // Light blue
    default:
      return null
  }
}

// Helper function to format a row WITHOUT automatically adding commas
function formatRow(row) {
  const parts = []
  
  if (row.seq?.trim()) {
    if (row.seqLinker) {
      parts.push({ linker: row.seqLinker, text: row.seq })
    } else {
      parts.push({ linker: null, text: row.seq })
    }
  }
  
  if (row.exp?.trim()) {
    if (row.expLinker) {
      parts.push({ linker: row.expLinker, text: row.exp })
    } else {
      parts.push({ linker: null, text: row.exp })
    }
  }
  
  return parts
}

// Computed property for essay paragraphs
const essayParagraphs = computed(() => {
  const paragraphs = []
  
  // Introduction paragraph - construct with intro counter linker
  const introParts = []
  if (intro.value[0]?.trim()) introParts.push({ linker: null, text: intro.value[0] })
  if (intro.value[1]?.trim()) {
    introParts.push({ linker: introCounterLinker.value, text: intro.value[1] })
  }
  if (intro.value[2]?.trim()) introParts.push({ linker: null, text: intro.value[2] })
  
  if (introParts.length > 0) {
    paragraphs.push(introParts)
  }
  
  // Indication + First section paragraph
  const firstSectionParts = []
  if (indication.value?.trim()) {
    firstSectionParts.push({ linker: null, text: indication.value })
  }
  firstSection.value.forEach(row => {
    firstSectionParts.push(...formatRow(row))
  })
  if (firstSectionParts.length > 0) {
    paragraphs.push(firstSectionParts)
  }
  
  // Transition + Second section
  const secondSectionParts = []
  if (transition.value?.text?.trim()) {
    secondSectionParts.push({ linker: transition.value.linker, text: transition.value.text })
  }
  secondSection.value.forEach(row => {
    secondSectionParts.push(...formatRow(row))
  })
  if (secondSectionParts.length > 0) {
    paragraphs.push(secondSectionParts)
  }
  
  // Conclusion paragraph
  const conclusionParts = []
  if (conclusion.value?.contrast?.trim()) {
    conclusionParts.push({ linker: conclusionContrastLinker.value, text: conclusion.value.contrast })
  }
  if (conclusion.value?.effectText?.trim()) {
    conclusionParts.push({ linker: conclusion.value.effectLinker, text: conclusion.value.effectText })
  }
  if (conclusion.value?.final?.trim()) {
    conclusionParts.push({ linker: null, text: conclusion.value.final })
  }
  if (conclusionParts.length > 0) {
    paragraphs.push(conclusionParts)
  }
  
  return paragraphs
})


// FOR POINT by point model
function formatCriterionRow(row) {
  const parts = []

  // 1) Intro sentence (no linker)
  if (row.introText?.trim()) {
    parts.push({ linker: null, text: row.introText })
  }

  // 2) Comparison 1 (with comparison/counter linker)
  if (row.comparison1Text?.trim()) {
    parts.push({ linker: row.comparison1Linker, text: row.comparison1Text })
  }

  // 3) Expansion (examples/details)
  if (row.expansionText?.trim()) {
    parts.push({ linker: row.expansionLinker, text: row.expansionText })
  }

  // 4) Second comparison introduced by a sequence linker
  if (row.comparison2Text?.trim()) {
    parts.push({ linker: row.sequenceLinker, text: row.comparison2Text })
  }

  // 5) Finish the comparison (with comparison/counter linker)
  if (row.finalComparisonText?.trim()) {
    parts.push({ linker: row.comparison2Linker, text: row.finalComparisonText })
  }

  return parts
}

const essayBlocks = computed(() => {
  const blocks = []

  if (selectedModel.value === "Pros and cons") {
    // Convert existing paragraphs into paragraph-blocks
    for (const paraParts of essayParagraphs.value) {
      blocks.push({ type: "paragraph", parts: paraParts })
    }
    return blocks
  }

  if (selectedModel.value === "Point-by-point") {
    // ----- Introduction (note intro[3] exists in point-by-point) -----
    const introParts = []
    if (intro.value[0]?.trim()) introParts.push({ linker: null, text: intro.value[0] })
    if (intro.value[1]?.trim()) introParts.push({ linker: introCounterLinker.value, text: intro.value[1] })
    if (intro.value[2]?.trim()) introParts.push({ linker: null, text: intro.value[2] })
    if (intro.value[3]?.trim()) introParts.push({ linker: null, text: intro.value[3] })
    if (introParts.length) blocks.push({ type: "paragraph", parts: introParts })

    // ----- Criteria: header + paragraph for each criterion -----
    criteria.value.forEach((row, idx) => {
      const header = row.title?.trim() ? row.title.trim() : `Criterion ${idx + 1}`
      blocks.push({ type: "header", text: header })

      const parts = formatCriterionRow(row)
      if (parts.length) blocks.push({ type: "paragraph", parts })
    })

    // ----- Conclusion -----
    const conclusionParts = []
    if (conclusion.value?.contrast?.trim()) {
      conclusionParts.push({ linker: conclusionContrastLinker.value, text: conclusion.value.contrast })
    }
    if (conclusion.value?.effectText?.trim()) {
      conclusionParts.push({ linker: conclusion.value.effectLinker, text: conclusion.value.effectText })
    }
    if (conclusion.value?.final?.trim()) {
      conclusionParts.push({ linker: null, text: conclusion.value.final })
    }
    if (conclusionParts.length) blocks.push({ type: "paragraph", parts: conclusionParts })

    return blocks
  }

  return blocks
})

function renderParagraphParts(doc, parts, {
  margin,
  pageWidth,
  pageHeight,
  lineHeight,
  getBehaviorColor,
  getLightBehaviorColor
}, state) {
  // state: { yPosition } passed by reference-like object
  let { yPosition } = state
  let xPosition = margin + 10

  for (let partIdx = 0; partIdx < parts.length; partIdx++) {
    const part = parts[partIdx]

    // space between parts
    if (partIdx > 0) {
      xPosition += doc.getTextWidth(" ")
      if (xPosition > pageWidth - margin - 5) {
        yPosition += lineHeight
        xPosition = margin + 10
        if (yPosition > pageHeight - margin - 5) {
          doc.addPage()
          yPosition = margin
        }
      }
    }

    if (part.linker) {
      const color = getBehaviorColor(part.linker)
      const bgColor = getLightBehaviorColor(part.linker)

      // linker
      doc.setFont("courier", "bold")
      doc.setTextColor(color.r, color.g, color.b)

      for (const word of part.linker.split(" ")) {
        const w = doc.getTextWidth(word)
        if (xPosition + w > pageWidth - margin - 5) {
          yPosition += lineHeight
          xPosition = margin + 10
          if (yPosition > pageHeight - margin - 5) {
            doc.addPage()
            yPosition = margin
          }
        }
        doc.text(word, xPosition, yPosition)
        xPosition += w + doc.getTextWidth(" ")
      }

      // text
      doc.setFont("courier", "normal")
      doc.setTextColor(0)

      for (const word of part.text.split(" ")) {
        const w = doc.getTextWidth(word)
        if (xPosition + w > pageWidth - margin - 5) {
          yPosition += lineHeight
          xPosition = margin + 10
          if (yPosition > pageHeight - margin - 5) {
            doc.addPage()
            yPosition = margin
          }
        }

        if (bgColor) {
          doc.setFillColor(bgColor.r, bgColor.g, bgColor.b)
          doc.rect(xPosition - 0.5, yPosition - 3.5, w + 1, 4.5, "F")
        }

        doc.text(word, xPosition, yPosition)
        xPosition += w + doc.getTextWidth(" ")
      }
    } else {
      // normal text
      doc.setFont("courier", "normal")
      doc.setTextColor(0)

      for (const word of part.text.split(" ")) {
        const w = doc.getTextWidth(word)
        if (xPosition + w > pageWidth - margin - 5) {
          yPosition += lineHeight
          xPosition = margin + 10
          if (yPosition > pageHeight - margin - 5) {
            doc.addPage()
            yPosition = margin
          }
        }
        doc.text(word, xPosition, yPosition)
        xPosition += w + doc.getTextWidth(" ")
      }
    }
  }

  state.yPosition = yPosition
}


function generateEssayPdf() {
  console.log('🎯 Starting essay PDF generation...')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 25
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin
  
  // Decorative header line
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)
  
  // Title
  doc.setFontSize(18)
  doc.setFont('courier', 'bold')
  const title = essayTitle.value || 'Untitled Essay'
  const titleLines = doc.splitTextToSize(title, maxWidth)
  doc.text(titleLines, pageWidth / 2, yPosition + 5, { align: 'center' })
  yPosition += titleLines.length * 8 + 10
  
  // Decorative line under title
  doc.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3)
  
  // Author name (where word count was)
  doc.setFontSize(10)
  doc.setFont('courier', 'italic')
  doc.setTextColor(100)
  if (essayAuthor.value) {
    doc.text(`By ${essayAuthor.value}`, pageWidth / 2, yPosition + 3, { align: 'center' })
  }
  yPosition += 15
  doc.setTextColor(0)
  
  // Monospace font for essay body
  doc.setFontSize(10)
  doc.setFont('courier', 'normal')
  
const blocks = essayBlocks.value
const lineHeight = 5

for (const block of blocks) {
  // page break check
  if (yPosition > pageHeight - margin - 20) {
    doc.addPage()
    yPosition = margin
  }

  if (block.type === "header") {
    doc.setFontSize(12)
    doc.setFont("courier", "bold")
    doc.setTextColor(20)

    const headerLines = doc.splitTextToSize(block.text, maxWidth)
    doc.text(headerLines, margin, yPosition)
    yPosition += headerLines.length * 6 + 3

    // reset body font
    doc.setFontSize(10)
    doc.setFont("courier", "normal")
    doc.setTextColor(0)

    continue
  }

  // paragraph
  const state = { yPosition }
  renderParagraphParts(
    doc,
    block.parts,
    { margin, pageWidth, pageHeight, lineHeight, getBehaviorColor, getLightBehaviorColor },
    state
  )
  yPosition = state.yPosition

  // paragraph spacing
  yPosition += lineHeight * 2
}
  // Add extra space before word count
  yPosition += lineHeight * 3
  
  // Check if we need a new page for word count
  if (yPosition > pageHeight - margin - 10) {
    doc.addPage()
    yPosition = margin
  }
  
  // Word count at the end
  doc.setFontSize(9)
  doc.setFont('courier', 'italic')
  doc.setTextColor(100)
  doc.text(`Word count: ${wordCount.value}`, pageWidth / 2, yPosition, { align: 'center' })
  
  // Footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont('courier', 'normal')
    doc.setTextColor(150)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
  }
  
  // Save
  const filename = `essay-${essayTitle.value.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled'}.pdf`
  doc.save(filename)
  console.log('✅ PDF saved:', filename)
}

function generatePresentationPdf() {
  console.log('🎯 Starting presentation PDF generation...')

  if (selectedModel.value === "Point-by-point") {
    return generatePointByPointPresentationPdf()
  }
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 25
  const maxWidth = pageWidth - (margin * 2)
  
  let slideCreated = false
  function newSlide() {
    if (doc.getNumberOfPages() > 1 || slideCreated) {
      doc.addPage()
    }
    slideCreated = true
  }
  
  // Title Slide with gradient effect (simulated)
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Add decorative circles
  doc.setFillColor(118, 75, 162)
  doc.circle(20, 20, 40, 'F')
  doc.circle(pageWidth - 20, pageHeight - 20, 50, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(essayTitle.value || 'Untitled Essay', maxWidth)
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 15, { align: 'center' })
  
  doc.setFontSize(20)
  doc.setFont('helvetica', 'normal')
  doc.text('Analytical Text Presentation', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' })
  
  // Introduction Slide
  newSlide()
  doc.setFillColor(248, 249, 250)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Header bar
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, pageWidth, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Introduction', margin, 13)
  
  let yPos = margin + 15
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(44, 62, 80)
  
  // Intro items with color-coded linkers
  if (intro.value[0]?.trim()) {
    // Draw bullet - smaller and black
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    const lines = doc.splitTextToSize(intro.value[0], maxWidth - 10)
    doc.text(lines, margin + 8, yPos)
    yPos += lines.length * 8 + 4
  }
  
  if (intro.value[1]?.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    
    if (introCounterLinker.value) {
      const color = getBehaviorColor(introCounterLinker.value)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(color.r, color.g, color.b)
      doc.text(introCounterLinker.value, margin + 8, yPos)
      
      const linkerWidth = doc.getTextWidth(introCounterLinker.value + ' ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      const lines = doc.splitTextToSize(intro.value[1], maxWidth - 10 - linkerWidth)
      doc.text(lines, margin + 8 + linkerWidth, yPos)
      yPos += Math.max(1, lines.length) * 8 + 4
    } else {
      const lines = doc.splitTextToSize(intro.value[1], maxWidth - 10)
      doc.text(lines, margin + 8, yPos)
      yPos += lines.length * 8 + 4
    }
  }
  
  if (intro.value[2]?.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    const lines = doc.splitTextToSize(intro.value[2], maxWidth - 10)
    doc.text(lines, margin + 8, yPos)
    yPos += lines.length * 8 + 4
  }
  
  if (indication.value?.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    const lines = doc.splitTextToSize(indication.value, maxWidth - 10)
    doc.text(lines, margin + 8, yPos)
  }
  
  // First Section Slide
  newSlide()
  doc.setFillColor(248, 249, 250)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, pageWidth, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(negativeFirst.value ? 'Negative Points' : 'Positive Points', margin, 13)
  
  yPos = margin + 15
  doc.setFontSize(15)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(44, 62, 80)
  
  firstSection.value.forEach(row => {
    if (row.seq && row.seq.trim()) {
      doc.setFillColor(44, 62, 80)
      doc.circle(margin + 2, yPos - 2, 1, 'F')
      
      if (row.seqLinker) {
        const color = getBehaviorColor(row.seqLinker)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(color.r, color.g, color.b)
        doc.text(row.seqLinker, margin + 8, yPos)
        
        const linkerWidth = doc.getTextWidth(row.seqLinker + ' ')
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(44, 62, 80)
        const lines = doc.splitTextToSize(row.seq, maxWidth - 15 - linkerWidth)
        doc.text(lines, margin + 8 + linkerWidth, yPos)
        yPos += Math.max(1, lines.length) * 7 + 3
      } else {
        const lines = doc.splitTextToSize(row.seq, maxWidth - 15)
        doc.text(lines, margin + 8, yPos)
        yPos += lines.length * 7 + 3
      }
    }
    
    if (row.exp && row.exp.trim()) {
      // Sub-bullet (smaller circle)
      doc.setFillColor(44, 62, 80)
      doc.circle(margin + 10, yPos - 2, 0.8, 'F')
      
      if (row.expLinker) {
        const color = getBehaviorColor(row.expLinker)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(color.r, color.g, color.b)
        doc.text(row.expLinker, margin + 15, yPos)
        
        const linkerWidth = doc.getTextWidth(row.expLinker + ' ')
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(90, 108, 125)
        const lines = doc.splitTextToSize(row.exp, maxWidth - 25 - linkerWidth)
        doc.text(lines, margin + 15 + linkerWidth, yPos)
        yPos += Math.max(1, lines.length) * 7 + 2
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(90, 108, 125)
        const lines = doc.splitTextToSize(row.exp, maxWidth - 25)
        doc.text(lines, margin + 15, yPos)
        yPos += lines.length * 7 + 2
      }
    }
  })
  
  // Transition Slide (if exists)
if (transition.value.text && transition.value.text.trim()) {
  newSlide()
  doc.setFillColor(255, 245, 235)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  doc.setFillColor(231, 76, 60)
  doc.rect(0, 0, pageWidth, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Transition', pageWidth / 2, 13, { align: 'center' })
  
  // Draw decorative box
  const boxX = margin + 20
  const boxY = pageHeight / 2 - 30
  const boxWidth = maxWidth - 40
  const boxHeight = 50
  
  doc.setDrawColor(231, 76, 60)
  doc.setLineWidth(2)
  doc.rect(boxX, boxY, boxWidth, boxHeight)
  
  doc.setFontSize(16)
  doc.setTextColor(44, 62, 80)
  
  const boxPadding = 5
  const textMaxWidth = boxWidth - (boxPadding * 2)
  
  if (transition.value.linker) {
    const color = getBehaviorColor(transition.value.linker)
    const fullText = `${transition.value.linker} ${transition.value.text}`
    
    // Split the full text to fit within the box
    const allLines = doc.splitTextToSize(fullText, textMaxWidth)
    
    // Calculate starting Y position to center text vertically in box
    const lineHeight = 6
    const totalTextHeight = allLines.length * lineHeight
    let textY = boxY + (boxHeight - totalTextHeight) / 2 + 4
    
    // For the first line, we need to handle linker coloring
    const linkerWords = transition.value.linker.split(' ')
    const firstLineWords = allLines[0].split(' ')
    
    // Find where linker ends in the first line
    let linkerEndIndex = linkerWords.length
    let currentX = boxX + boxPadding
    
    // Print first line with linker in bold color
    for (let i = 0; i < firstLineWords.length; i++) {
      const word = firstLineWords[i]
      
      if (i < linkerEndIndex) {
        // This is part of the linker
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(color.r, color.g, color.b)
      } else {
        // This is the modified text
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(44, 62, 80)
      }
      
      doc.text(word, currentX, textY)
      currentX += doc.getTextWidth(word + ' ')
    }
    
    // Print remaining lines in normal font
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(44, 62, 80)
    for (let i = 1; i < allLines.length; i++) {
      textY += lineHeight
      doc.text(allLines[i], boxX + boxPadding, textY)
    }
  } else {
    // No linker, just split and center the text
    const lines = doc.splitTextToSize(transition.value.text, textMaxWidth)
    const lineHeight = 6
    const totalTextHeight = lines.length * lineHeight
    let textY = boxY + (boxHeight - totalTextHeight) / 2 + 4
    
    doc.setFont('helvetica', 'normal')
    
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], boxX + boxPadding, textY)
      textY += lineHeight
    }
  }
}
  
  // Second Section Slide
  newSlide()
  doc.setFillColor(248, 249, 250)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, pageWidth, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(negativeFirst.value ? 'Positive Points' : 'Negative Points', margin, 13)
  
  yPos = margin + 15
  doc.setFontSize(15)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(44, 62, 80)
  
  secondSection.value.forEach(row => {
    if (row.seq && row.seq.trim()) {
      doc.setFillColor(44, 62, 80)
      doc.circle(margin + 2, yPos - 2, 1, 'F')
      
      if (row.seqLinker) {
        const color = getBehaviorColor(row.seqLinker)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(color.r, color.g, color.b)
        doc.text(row.seqLinker, margin + 8, yPos)
        
        const linkerWidth = doc.getTextWidth(row.seqLinker + ' ')
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(44, 62, 80)
        const lines = doc.splitTextToSize(row.seq, maxWidth - 15 - linkerWidth)
        doc.text(lines, margin + 8 + linkerWidth, yPos)
        yPos += Math.max(1, lines.length) * 7 + 3
      } else {
        const lines = doc.splitTextToSize(row.seq, maxWidth - 15)
        doc.text(lines, margin + 8, yPos)
        yPos += lines.length * 7 + 3
      }
    }
    
    if (row.exp && row.exp.trim()) {
      doc.setFillColor(44, 62, 80)
      doc.circle(margin + 10, yPos - 2, 0.8, 'F')
      
      if (row.expLinker) {
        const color = getBehaviorColor(row.expLinker)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(color.r, color.g, color.b)
        doc.text(row.expLinker, margin + 15, yPos)
        
        const linkerWidth = doc.getTextWidth(row.expLinker + ' ')
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(90, 108, 125)
        const lines = doc.splitTextToSize(row.exp, maxWidth - 25 - linkerWidth)
        doc.text(lines, margin + 15 + linkerWidth, yPos)
        yPos += Math.max(1, lines.length) * 7 + 2
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(90, 108, 125)
        const lines = doc.splitTextToSize(row.exp, maxWidth - 25)
        doc.text(lines, margin + 15, yPos)
        yPos += lines.length * 7 + 2
      }
    }
  })
  
  // Conclusion Slide
  newSlide()
  doc.setFillColor(248, 249, 250)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  doc.setFillColor(39, 174, 96)
  doc.rect(0, 0, pageWidth, 20, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Conclusion', margin, 13)
  
  yPos = margin + 15
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(44, 62, 80)
  
  if (conclusion.value.contrast && conclusion.value.contrast.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    
    if (conclusionContrastLinker.value) {
      const color = getBehaviorColor(conclusionContrastLinker.value)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(color.r, color.g, color.b)
      doc.text(conclusionContrastLinker.value, margin + 8, yPos)
      
      const linkerWidth = doc.getTextWidth(conclusionContrastLinker.value + ' ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      const lines = doc.splitTextToSize(conclusion.value.contrast, maxWidth - 15 - linkerWidth)
      doc.text(lines, margin + 8 + linkerWidth, yPos)
      yPos += Math.max(1, lines.length) * 8 + 4
    } else {
      const lines = doc.splitTextToSize(conclusion.value.contrast, maxWidth - 15)
      doc.text(lines, margin + 8, yPos)
      yPos += lines.length * 8 + 4
    }
  }
  
  if (conclusion.value.effectText && conclusion.value.effectText.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    
    if (conclusion.value.effectLinker) {
      const color = getBehaviorColor(conclusion.value.effectLinker)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(color.r, color.g, color.b)
      doc.text(conclusion.value.effectLinker, margin + 8, yPos)
      
      const linkerWidth = doc.getTextWidth(conclusion.value.effectLinker + ' ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      const lines = doc.splitTextToSize(conclusion.value.effectText, maxWidth - 15 - linkerWidth)
      doc.text(lines, margin + 8 + linkerWidth, yPos)
      yPos += Math.max(1, lines.length) * 8 + 4
    } else {
      const lines = doc.splitTextToSize(conclusion.value.effectText, maxWidth - 15)
      doc.text(lines, margin + 8, yPos)
      yPos += lines.length * 8 + 4
    }
  }
  
  if (conclusion.value.final && conclusion.value.final.trim()) {
    doc.setFillColor(44, 62, 80)
    doc.circle(margin + 2, yPos - 2, 1, 'F')
    const lines = doc.splitTextToSize(conclusion.value.final, maxWidth - 15)
    doc.text(lines, margin + 8, yPos)
  }
  
  // Save
  const filename = `presentation-${essayTitle.value.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled'}.pdf`
  doc.save(filename)
  console.log('✅ PDF saved:', filename)
}

const wordCount = computed(() => {
  const textBlocks = [
    essayTitle.value || "",
    ...(intro.value || []),
    indication.value || "",
    transition.value?.text || "",
    conclusion.value?.contrast || "",
    conclusion.value?.effectText || "",
    conclusion.value?.final || ""
  ]

  // Add section content
  firstSection.value.forEach(row => {
    textBlocks.push(row.seq || "", row.exp || "")
  })
  
  secondSection.value.forEach(row => {
    textBlocks.push(row.seq || "", row.exp || "")
  })

  const text = textBlocks.join(" ").trim()
  if (!text) return 0
  
  return text.split(/\s+/).filter(w => w.length > 0).length
})

function generatePointByPointPresentationPdf() {
  console.log("🎯 Starting point-by-point presentation PDF generation...")

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 25
  const maxWidth = pageWidth - margin * 2

  let slideCreated = false
  function newSlide(bg = { r: 248, g: 249, b: 250 }, bar = { r: 102, g: 126, b: 234 }) {
    if (doc.getNumberOfPages() > 1 || slideCreated) doc.addPage()
    slideCreated = true

    // background
    doc.setFillColor(bg.r, bg.g, bg.b)
    doc.rect(0, 0, pageWidth, pageHeight, "F")

    // header bar
    doc.setFillColor(bar.r, bar.g, bar.b)
    doc.rect(0, 0, pageWidth, 20, "F")
  }

  function headerText(text, color = { r: 255, g: 255, b: 255 }) {
    doc.setTextColor(color.r, color.g, color.b)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(text, margin, 13)
  }

  function bulletDot(x, y, radius = 1, color = { r: 44, g: 62, b: 80 }) {
    doc.setFillColor(color.r, color.g, color.b)
    doc.circle(x, y - 2, radius, "F")
  }

  // Renders one bullet line, coloring the linker if present
  function renderBullet({ linker, text }, yPos, {
    indent = 8,
    sub = false,
  } = {}) {
    const dotX = margin + (sub ? 10 : 2)
    const textX = margin + (sub ? 15 : indent)
    const available = maxWidth - (textX - margin)

    bulletDot(dotX, yPos, sub ? 0.8 : 1)

    // If no linker, just render text
    if (!linker) {
      doc.setFont("helvetica", "normal")
      doc.setTextColor(sub ? 90 : 44, sub ? 108 : 62, sub ? 125 : 80)
      const lines = doc.splitTextToSize(text, available)
      doc.text(lines, textX, yPos)
      return yPos + Math.max(1, lines.length) * 8 + (sub ? 2 : 4)
    }

    // Linker + text, linker colored
    const color = getBehaviorColor(linker)

    doc.setFont("helvetica", "bold")
    doc.setTextColor(color.r, color.g, color.b)
    doc.text(linker, textX, yPos)

    const linkerWidth = doc.getTextWidth(linker + " ")

    doc.setFont("helvetica", "normal")
    doc.setTextColor(sub ? 90 : 44, sub ? 108 : 62, sub ? 125 : 80)

    const lines = doc.splitTextToSize(text, available - linkerWidth)
    doc.text(lines, textX + linkerWidth, yPos)

    return yPos + Math.max(1, lines.length) * 8 + (sub ? 2 : 4)
  }

  // --------------------
  // 1) Title Slide
  // --------------------
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, pageWidth, pageHeight, "F")

  doc.setFillColor(118, 75, 162)
  doc.circle(20, 20, 40, "F")
  doc.circle(pageWidth - 20, pageHeight - 20, 50, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(34)
  doc.setFont("helvetica", "bold")
  const titleLines = doc.splitTextToSize(essayTitle.value || "Untitled Essay", maxWidth)
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 15, { align: "center" })

  doc.setFontSize(18)
  doc.setFont("helvetica", "normal")
  const subtitle = "Point-by-point Analytical Text Presentation"
  doc.text(subtitle, pageWidth / 2, pageHeight / 2 + 10, { align: "center" })

  // --------------------
  // 2) Introduction Slide
  // --------------------
  newSlide()
  headerText("Introduction")

  let yPos = margin + 15
  doc.setFontSize(16)

  // intro[0..3]
  if (intro.value[0]?.trim()) {
    yPos = renderBullet({ linker: null, text: intro.value[0] }, yPos)
  }
  if (intro.value[1]?.trim()) {
    yPos = renderBullet({ linker: introCounterLinker.value, text: intro.value[1] }, yPos)
  }
  if (intro.value[2]?.trim()) {
    yPos = renderBullet({ linker: null, text: intro.value[2] }, yPos)
  }
  if (intro.value[3]?.trim()) {
    yPos = renderBullet({ linker: null, text: intro.value[3] }, yPos)
  }

  // optional “setup” info as small bullets
  if (optionA.value?.trim() || optionB.value?.trim()) {
    yPos += 4
    const setupLine = `Options: ${optionA.value || "A"} vs ${optionB.value || "B"}`
    doc.setFontSize(14)
    yPos = renderBullet({ linker: null, text: setupLine }, yPos, { sub: true })
    doc.setFontSize(16)
  }

  // --------------------
  // 3) One slide per criterion
  // --------------------
  for (let idx = 0; idx < criteria.value.length; idx++) {
    const row = criteria.value[idx]
    const critTitle = row.title?.trim() ? row.title.trim() : `Criterion ${idx + 1}`

    newSlide({ r: 248, g: 249, b: 250 }, { r: 102, g: 126, b: 234 })
    headerText(critTitle)

    yPos = margin + 15
    doc.setFontSize(15)

    // Build bullet list in the same order as the essay paragraph
    if (row.introText?.trim()) {
      yPos = renderBullet({ linker: null, text: row.introText }, yPos)
    }
    if (row.comparison1Text?.trim()) {
      yPos = renderBullet({ linker: row.comparison1Linker, text: row.comparison1Text }, yPos)
    }
    if (row.expansionText?.trim()) {
      // treat expansion as a sub-bullet (optional stylistic choice)
      yPos = renderBullet({ linker: row.expansionLinker, text: row.expansionText }, yPos, { sub: true })
    }
    if (row.comparison2Text?.trim()) {
      yPos = renderBullet({ linker: row.sequenceLinker, text: row.comparison2Text }, yPos)
    }
    if (row.finalComparisonText?.trim()) {
      yPos = renderBullet({ linker: row.comparison2Linker, text: row.finalComparisonText }, yPos)
    }
  }

  // --------------------
  // 4) Conclusion Slide
  // --------------------
  newSlide({ r: 248, g: 249, b: 250 }, { r: 39, g: 174, b: 96 })
  headerText("Conclusion")

  yPos = margin + 15
  doc.setFontSize(16)

  if (conclusion.value.contrast?.trim()) {
    yPos = renderBullet({ linker: conclusionContrastLinker.value, text: conclusion.value.contrast }, yPos)
  }
  if (conclusion.value.effectText?.trim()) {
    yPos = renderBullet({ linker: conclusion.value.effectLinker, text: conclusion.value.effectText }, yPos)
  }
  if (conclusion.value.final?.trim()) {
    yPos = renderBullet({ linker: null, text: conclusion.value.final }, yPos)
  }

  const filename = `presentation-${(essayTitle.value || "untitled")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-point-by-point.pdf`

  doc.save(filename)
  console.log("✅ PDF saved:", filename)
}

</script>

<style scoped>
.hint-sentence-modifier {
  background-color: #ffe6e6;
  color: #dc3545;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.hint-subordinate {
  background-color: #e6ffe6;
  color: #28a745;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.hint-noun-phrase {
  background-color: #e6f0ff;
  color: #0d6efd;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.hint-default {
  color: #666;
  padding: 4px 8px;
}
</style>