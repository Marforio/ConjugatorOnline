<template>
  <v-container fluid class="pa-4 d-flex justify-center">
    
    <div v-if="showFloatingFeedback" class="floating-feedback success bg-success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card width="520" min-height="650" elevation="3" class="d-flex flex-column pa-4">
      
      <div v-if="gameState === 'PLAYING'" class="d-flex flex-column justify-space-between h-100 flex-grow-1">
        <div>
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-subtitle-1">Round {{ currentRound + 1 }} / {{ totalRounds }}</div>
            <div class="text-subtitle-2 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
          </div>

          <v-card class="pa-3 my-2" elevation="2" color="grey-lighten-4">
            
            <div v-if="gameName === 'Pronoun Practice'" class="text-center">
              <div class="text-uppercase text-body-1 mb-1 font-weight-medium">"{{ activePrompt.subject }}"</div>
              <div class="mb-3 d-flex justify-center">
                <v-img 
                  v-if="activePrompt.image" 
                  :src="`/images/pronoun_pics_resized/${activePrompt.image}`" 
                  max-width="180" 
                  aspect-ratio="1" 
                  cover 
                  class="rounded-lg border-md" 
                />
              </div>
              <div class="text-h6 mb-4">{{ activePrompt.question }}</div>
            </div>

            <div v-else-if="gameName === 'Uses Of Auxiliaries'" class="mb-4">
              <div class="text-caption text-center font-weight-medium text-grey-darken-2 mb-2">
                💡 {{ activePrompt.mode?.toUpperCase() }}: {{ getAuxiliaryModeLabel(activePrompt.mode) }}
              </div>

              <div class="d-flex align-center ga-3 mb-2">
                <div class="speaker-col text-center">
                  <v-avatar size="80" class="border shadow-sm">
                    <v-img src="/images/speaker_pics_resized/bob.jpg" cover />
                  </v-avatar>
                  <div class="text-caption font-weight-bold mt-1 text-grey-darken-3">Bob</div>
                </div>

                <div class="bubble-wrap">
                  <svg class="bubble-svg" viewBox="0 0 520 200" preserveAspectRatio="none">
                    <path d="M40 18 H480 Q502 18 502 40 V130 Q502 152 480 152 H170 L120 182 L125 152 H40 Q18 152 18 130 V40 Q18 18 40 18 Z" fill="#ffffff" stroke="rgba(0,0,0,0.12)" stroke-width="3" />
                  </svg>
                  <div class="bubble-text font-italic">
                    {{ activePrompt.mode === 'tag' ? "Go ahead, I'm listening..." : activePrompt.prompt }}
                  </div>
                </div>
              </div>

              <v-divider class="my-3" variant="dashed" />

              <div class="d-flex align-center justify-end ga-3">
                <div class="player-bubble-wrap flex-grow-1">
                  <svg class="player-bubble-svg" viewBox="0 0 520 200" preserveAspectRatio="none">
                    <path d="M40 18 H480 Q502 18 502 40 V130 Q502 152 480 152 H250 L310 188 L300 152 H40 Q18 152 18 130 V40 Q18 18 40 18 Z" fill="#fff" stroke="rgba(0,0,0,0.12)" stroke-width="3" />
                  </svg>
                  <div class="player-bubble-content pl-4 pr-6">
                    <span v-if="activePrompt.mode === 'echo'" class="font-italic text-body-2 me-2">Really?</span>
                    <span v-else-if="activePrompt.mode === 'agreement'" class="font-italic text-body-2 me-2">Right.</span>
                    <span v-else-if="activePrompt.mode === 'tag'" class="font-medium text-body-2 text-wrap pr-4">"{{ activePrompt.prompt }}" ...</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="gameName === 'Regret Machine'">
              <div class="text-subtitle-2 text-grey-darken-1 mb-1">Situation:</div>
              <div class="text-body-1 text-center font-italic mb-4" v-html="highlightedRegretPrompt" />
              <v-divider class="my-2" />
              <div class="d-flex justify-center align-center my-3" style="gap: 12px;">
                <v-chip color="primary" variant="flat" size="small">{{ activePrompt.modal }}</v-chip>
                <v-chip color="secondary" variant="flat" size="small">{{ activePrompt.verb }}</v-chip>
                <v-chip v-if="activePrompt.negative" color="error" variant="flat" size="small">Negative</v-chip>
              </div>
              <div class="text-h6 text-center font-italic mb-2">"{{ activePrompt.sentence }}"</div>
            </div>

            <div v-else-if="gameName === 'Quantifier Quest'" class="mb-2">
              <div class="d-flex justify-center my-2">
                <v-chip
                  size="small"
                  color="secondary"
                  variant="flat"
                  class="text-uppercase"
                >
                  {{ activePrompt.subject }}

                  <v-tooltip activator="parent" location="top">
                    {{ activePrompt.countable ? 'Countable' : 'Uncountable' }}
                  </v-tooltip>
                </v-chip>
              </div>

              
              <div class="d-flex justify-center mb-4 my-3">
                <v-img
                  v-if="activePrompt.image"
                  :src="`/images/quant_pics_resized/${activePrompt.image}`"
                  class="rounded-lg border-md elevation-2"
                  max-width="190"
                  aspect-ratio="1"
                  cover
                />
              </div>

              <div class="d-flex justify-center align-center ga-3 mb-6 my-3 flex-wrap">
                <v-card v-if="activePrompt.displayed_intensifier" variant="tonal" color="purple" class="px-2 py-0">
                  <v-card-title class="text-caption text-uppercase font-weight-bold pa-1">
                    {{ activePrompt.displayed_intensifier }}
                  </v-card-title>
                </v-card>
                
                <v-card variant="flat" color="blue-lighten-5" class="px-2 py-0 border">
                  <v-card-title class="text-caption text-uppercase text-blue-darken-4 font-weight-bold pa-1">
                    {{ activePrompt.displayed_quantity }}
                  </v-card-title>
                </v-card>
              </div>

              <div class="text-center text-h6 font-italic mb-4 text-grey-darken-3 px-3 mb-5">
                " {{ activePrompt.displayed_sentence }} <span class="text-primary font-weight-black">________</span> . "
              </div>
            </div>

            <div v-else-if="gameName === 'Passive Party'" class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2 py-5">
                <div class="text-caption text-grey-darken-1">Convert to Passive Voice:</div>
                <v-chip color="secondary" size="x-small" variant="flat" class="text-caption">⏱ Tense: {{ activePrompt.tense }}</v-chip>
              </div>
              
              <v-card variant="outlined" class="pa-3 mb-3 bg-white py-5">
                <div class="text-caption text-uppercase font-weight-bold text-grey">Active</div>
                <div class="text-body-1 font-italic mb-2" v-html="highlightedPassiveText" />
                
                <v-divider class="my-2 my-4" />
                
                <div class="text-caption text-uppercase font-weight-bold text-grey">Passive</div>
                <div class="text-body-1 font-weight-medium text-blue-darken-3">"{{ activePrompt.passive }}"</div>
              </v-card>
            </div>

            <div v-else-if="gameName === 'Parallel Universe'" class="mb-2">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">
                  🌌 Clause Focus: {{ activePrompt.condition ? 'IF CLAUSE' : 'MAIN CLAUSE' }}
                </div>
                <v-chip color="secondary" size="x-small" class="text-uppercase font-weight-bold">
                  {{ activePrompt.conditional_type }} conditional
                </v-chip>
              </div>

              <v-card variant="outlined" class="pa-4 bg-white rounded-lg text-center mb-2">
                <div class="d-flex justify-center align-center ga-2 mb-3">
                  <v-chip color="primary" variant="flat" size="small" class="text-uppercase font-weight-bold">
                    {{ activePrompt.verb }}
                  </v-chip>
                  <v-chip v-if="activePrompt.negative" color="error" variant="flat" size="small" class="font-weight-bold">
                    NEGATIVE
                  </v-chip>
                  <v-chip variant="outlined" size="small" color="grey-darken-2" class="text-lowercase font-italic">
                    {{ 
                      activePrompt.conditional_type === 'first' ? 'REALITY' : 
                      activePrompt.conditional_type === 'second' ? 'unreal present/future' : 'unreal past' 
                    }}
                  </v-chip>
                </div>

                <div class="text-h6 font-weight-medium text-wrap font-italic text-grey-darken-4 px-2 py-2">
                  {{ activePrompt.sentence }}
                </div>
              </v-card>
            </div>

            <!-- VERB MIXER CORE INTERACTIVE ROW -->
            <div v-else-if="gameName === 'Verb Mixer'" class="mb-2">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">
                  🏷 Category Class: {{ activePrompt.category?.replace('_', ' ') }}
                </div>
                <v-chip color="primary" size="x-small" label class="font-weight-black">
                  BASE: {{ activePrompt.key }}
                </v-chip>
              </div>

              <v-card variant="outlined" class="pa-4 bg-white rounded-lg text-center mb-3">
                <div class="mb-3">
                  <v-chip color="blue-darken-3" class="text-white font-weight-bold" variant="flat" size="large">
                    🎯 {{ activePrompt.answer_verb }}
                  </v-chip>
                </div>
                
                <div class="text-h6 font-weight-medium text-grey-darken-4 font-italic px-1 py-1">
                  {{ activePrompt.sentence }}
                </div>
              </v-card>
            </div>

            <!-- YEAR 2040 WORKSPACE CARD -->
            <div v-else-if="gameName === 'Year 2040'" class="mb-2">
              <div class="d-flex justify-space-between align-center mb-3">
                <div class="text-caption text-uppercase text-grey-darken-1 font-weight-bold">
                  ⏱ aspect: {{ activePrompt.tense }}
                </div>
                
                <!-- Timeline Status Vector Graphics Widget -->
                <div class="d-flex align-center ga-2">
                  <span class="text-caption text-grey-darken-1 font-weight-medium">State:</span>
                  <v-progress-circular
                    v-if="activePrompt.tense?.includes('continuous')"
                    indeterminate
                    size="20"
                    width="2"
                    color="purple"
                  />
                  <v-icon
                    v-else
                    icon="mdi-check-circle-outline"
                    size="20"
                    color="success"
                  />
                </div>
              </div>

              <v-card variant="outlined" class="pa-4 bg-white rounded-lg text-center mb-3">
                <div class="d-flex justify-center align-center ga-2 mb-3">
                  <v-chip color="secondary" size="small" variant="flat" class="text-uppercase font-weight-bold">
                    {{ activePrompt.verb }}
                  </v-chip>
                  <v-chip v-if="activePrompt.negative" color="error" size="small" variant="flat" class="text-uppercase font-weight-bold">
                    NEGATIVE
                  </v-chip>
                </div>

                <!-- Interactive Sentence Display Row -->
                <div class="text-h6 font-weight-medium text-grey-darken-4 font-italic px-1 py-1 text-wrap">
                  " {{ activePrompt.tense?.includes('continuous') ? 'In' : 'By' }} 2040, {{ activePrompt.sentence }} "
                </div>
              </v-card>
            </div>

            
            <!-- 11. TRICKY TRANSLATOR LIVE INTERACTIVE WORKSPACE CARD -->
            <div v-else-if="gameName === 'Tricky Translator'" class="mb-2 w-100">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-uppercase font-weight-bold text-grey">
                  📂 Topic focus: {{ activePrompt.category }}
                </div>
                <v-chip size="x-small" color="purple" variant="flat" class="text-uppercase font-weight-bold">
                  {{ activePrompt.source_language }}
                </v-chip>
              </div>

              <v-card variant="flat" color="purple-lighten-5" class="pa-4 rounded-lg border text-center mb-4">
                <div class="text-caption text-purple font-weight-bold mb-1">TRANSLATE THE UNDERLINED PART:</div>
                <div 
                  class="text-h5 font-weight-medium text-grey-darken-4"
                  v-html="highlightTranslationTargetHtml(activePrompt.source_sentence, activePrompt.source_highlight)"
                ></div>
              </v-card>

              <v-card variant="outlined" class="pa-4 bg-white rounded-lg text-center mb-2">
                <div class="text-caption text-grey font-weight-bold mb-1">TARGET SYNTAX STRUCTURE CONTEXT:</div>
                <div class="text-h6 font-weight-regular text-grey-darken-3 font-italic">
                  " {{ activePrompt.target_sentence }} "
                </div>
              </v-card>
            </div>

            <!-- 12. IDEA LINKER LIVE INTERACTIVE WORKSPACE CARD -->
            <div v-else-if="gameName === 'Idea Linker'" class="mb-2 w-100">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="d-flex ga-1 align-center">
                  <v-chip size="x-small" color="primary" class="font-weight-bold text-uppercase">
                    ⛓ {{ activePrompt.variant || activePrompt.category }}
                  </v-chip>
                  <v-chip size="x-small" :color="getBehaviorColor(activePrompt.behavior)" class="font-weight-bold text-uppercase">
                    {{ activePrompt.behavior }}
                  </v-chip>
                </div>
                
                <v-chip v-if="activePrompt.excluded_linkers?.length" size="x-small" color="red-lighten-4" class="text-red-darken-4 font-weight-bold">
                  🚫 Not Allowed: {{ activePrompt.excluded_linkers.join(', ') }}
                </v-chip>
              </div>

              <v-card variant="flat" class="pa-5 bg-grey-lighten-4 border rounded-xl text-center mb-3">
                <div class="text-h6 font-weight-medium text-grey-darken-4 font-italic line-height-2">
                  " {{ activePrompt.sentence }} "
                </div>
                
                <div v-if="activePrompt.translations" class="mt-3 d-flex justify-center ga-3 border-t pt-2 text-caption text-grey-darken-1">
                  <span v-if="activePrompt.translations.French">🇫🇷 {{ activePrompt.translations.French.join(', ') }}</span>
                  <span v-if="activePrompt.translations.German">🇩🇪 {{ activePrompt.translations.German.join(', ') }}</span>
                  <span v-if="activePrompt.translations.Italian">🇮🇹 {{ activePrompt.translations.Italian.join(', ') }}</span>
                </div>
              </v-card>

              <div v-if="ilUsedWords.length" class="mb-2 transition-all">
                <div class="text-caption text-grey-darken-1 mb-1">⚠️ Already used linkers (cannot be repeated):</div>
                <div class="d-flex flex-wrap ga-1 bg-amber-lighten-5 pa-2 rounded-lg border border-amber-lighten-3">
                  <v-chip v-for="w in ilUsedWords" :key="w" size="x-small" color="amber-darken-3" variant="outlined" class="font-weight-bold">
                    {{ w }}
                  </v-chip>
                </div>
              </div>
            </div>
            
            <!-- 9. REPORTED SPEECH  -->
            <div v-else-if="gameName === 'Reported Speech'" class="mb-2">
              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-2">
                🗣 Yesterday's Statement
              </div>

              <v-card variant="flat" class="pa-3 bg-grey-lighten-4 rounded-lg border mb-4">
                <div class="d-flex align-center ga-3 flex-wrap flex-sm-nowrap">
                  <div>
                    <v-avatar size="100" class="border elevation-1">
                      <v-img :src="resolveSpeakerAvatar(activePrompt.speaker)" cover />
                    </v-avatar>
                    <div class="text-center text-caption font-weight-bold text-grey-darken-2 mt-1">
                      {{ activePrompt.speaker }}
                    </div>
                  </div>

                  <!-- Vector Inline SVGs Speech Bubble Component wrapper -->
                  <div class="position-relative flex-grow-1 min-height-100 bg-white border pa-3 rounded-xl shadow-sm">
                    <div 
                      class="font-italic text-body-1 text-grey-darken-3" 
                      v-html="computeHighlightedBubbleHtml(activePrompt.direct, activePrompt.highlight)"
                    ></div>
                  </div>
                </div>
              </v-card>

              <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-1">
                📰 Today's News
              </div>
              <v-card variant="outlined" class="pa-4 bg-white rounded-lg text-center mb-2">
                <div class="text-h6 font-weight-medium font-italic text-grey-darken-4 text-wrap px-1 py-1">
                  " Yesterday, {{ activePrompt.speaker }} {{ activePrompt.reporting_verb }} {{ activePrompt.reported }} "
                </div>
              </v-card>
            </div>

            <div v-else-if="gameName === 'Comparison'">
              <div class="d-flex justify-center align-center ga-4 my-2">
                <div class="d-flex flex-column align-center">
                  <v-avatar size="130" rounded="lg" class="border elevation-1 bg-white">
                    <v-img :src="getPicPath(activePrompt.person_A)" cover alt="Subject A" />
                  </v-avatar>
                  <div class="text-caption font-weight-bold mt-1 text-grey-darken-3">{{ activePrompt.person_A }}</div>
                </div>

                <div v-if="displayedCompSecondChip" class="d-flex flex-column align-center justify-center">
                  <v-avatar color="primary-lighten-5" size="44" class="border">
                    <v-icon color="primary" size="large">{{ displayedCompSecondChip }}</v-icon>
                  </v-avatar>
                </div>

                <div v-if="showSecondPerson" class="d-flex flex-column align-center">
                  <v-avatar size="130" rounded="lg" class="border elevation-1 bg-white">
                    <v-img :src="getPicPath(activePrompt.person_B)" cover alt="Subject B" />
                  </v-avatar>
                  <div class="text-caption font-weight-bold mt-1 text-grey-darken-3">{{ activePrompt.person_B }}</div>
                </div>
              </div>

              <div class="px-3 d-flex justify-center align-center my-3 flex-wrap ga-2">
                <v-chip
                  v-if="gameSettings?.intensifiers && activePrompt.target_form !== 'equality'"
                  size="x-small"
                  color="error"
                  variant="flat"
                  label
                  class="font-weight-black"
                >
                  INTENSIFY
                </v-chip>
                <v-chip v-if="displayedCompSecondChip" size="small" variant="tonal" color="secondary">
                  <v-icon start size="small">{{ displayedCompSecondChip }}</v-icon>
                  {{ activePrompt.target_form?.replace('_', ' ') }}
                </v-chip>
                <v-chip v-if="displayedSuperSecondChip" size="small" variant="flat" color="amber-darken-2" class="text-white font-weight-bold">
                  {{ displayedSuperSecondChip }}
                </v-chip>
                <v-chip variant="elevated" color="info" size="small" class="text-uppercase font-weight-bold">
                  {{ activePrompt.word }}
                </v-chip>
              </div>

              <div class="text-center text-body-1 font-italic px-2 my-4 text-grey-darken-4">
                <div v-if="activePrompt.part_of_speech === 'adverb'">
                  <span v-if="activePrompt.target_form === 'comparative' || activePrompt.target_form === 'comparison_less' || activePrompt.target_form === 'equality'">
                    {{ activePrompt.person_A }} {{ activePrompt.prompt }} ________ {{ activePrompt.person_B }}.
                  </span>
                  <span v-else>
                    {{ activePrompt.person_A }} {{ activePrompt.prompt }} ________.
                  </span>
                </div>
                <div v-else>
                  <span v-if="activePrompt.target_form === 'comparative' || activePrompt.target_form === 'comparison_less' || activePrompt.target_form === 'equality'">
                    {{ activePrompt.person_A }} is ________ {{ activePrompt.person_B }}.
                  </span>
                  <span v-else>
                    {{ activePrompt.person_A }} is ________.
                  </span>
                </div>
              </div>
            </div>

            <div style="position: absolute; overflow: hidden; width: 0; height: 0; opacity: 0; z-index: -100;" aria-hidden="true">
              <input 
                v-model="gameB.Answer" 
                type="text" 
                autocomplete="off" 
                tabindex="-1" 
                placeholder="Enter your answer..." 
              />
              <button 
                type="button" 
                tabindex="-1" 
                @click="gameB.onClick++"
              >
                Submit answer here
              </button>
            </div>

            <div ref="inputWrapper" class="mt-12">
              <v-text-field
                v-model="userAnswer"
                :label="inputPlaceholderLabel"
                variant="outlined"
                density="compact"
                hide-details
                :disabled="inputLocked"
                @keydown.enter.prevent.stop="handleKeyboardEnterEvent"
              />
            </div>

            <div class="d-flex justify-center my-8">
              <v-btn color="primary" @click="handleAnswerSubmission" :disabled="inputLocked">Submit Answer</v-btn>
            </div>
          </v-card>
        </div>

        <div>
          <v-progress-linear :model-value="progressPercentage" height="8" color="primary" class="mb-3 rounded-sm" />
          <div class="d-flex justify-space-between align-center">
            <v-btn icon elevation="0" size="small" @click="quitSession">
              <v-icon color="grey-darken-1">mdi-close-circle</v-icon>
            </v-btn>
            <div class="d-flex text-body-2" style="gap: 16px;">
              <span class="text-success">✅ {{ rightCount }}</span>
              <span class="text-error">❌ {{ wrongCount }}</span>
              <span class="text-grey-darken-2">📦 Remaining: {{ totalRounds - currentRound }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 10. WORD FAMILIES MULTI-ASPECT WORKSPACE CARD -->
        <div v-else-if="gameName === 'Word Families'" class="mb-2 w-100">
          <div class="text-subtitle-2 text-uppercase text-grey-darken-1 font-weight-bold mb-2">
            🔑 Root Lemma Family: <span class="text-primary font-weight-black">{{ activePrompt.key }}</span>
          </div>

          <!-- WRITING INTERACTION MODE -->
          <v-card v-if="gameSettings?.mode === 'writing'" variant="flat" class="pa-2 bg-white">
            <v-row v-for="it in activePrompt.items" :key="it.pos" class="align-center border-b py-2 ma-0">
              <v-col cols="12" sm="8" class="pa-1">
                <v-chip size="x-small" color="secondary" label class="font-weight-black text-uppercase mr-2 mb-1">{{ it.pos }}</v-chip>
                <span class="text-body-1 text-grey-darken-3 font-italic">{{ it.sentence }}</span>
              </v-col>
              <v-col cols="12" sm="4" class="pa-1">
                <v-text-field
                  v-model="wfAnswers[it.pos]"
                  :label="`Type the ${it.pos} variant`"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :disabled="inputLocked"
                  @keyup.enter="handleEnter"
                />
              </v-col>
            </v-row>
          </v-card>

          <!-- MATCHING INTERACTION MODE -->
          <v-card v-else variant="flat" class="pa-2 bg-white">
            <div class="d-flex flex-column ga-2 mb-3">
              <div 
                v-for="it in activePrompt.items" 
                :key="it.pos" 
                class="d-flex align-center justify-space-between pa-2 border rounded-lg cursor-pointer transition-all"
                :class="{ 'bg-blue-thin border-primary': selectedWfPos === it.pos }"
                @click="selectedWfPos = it.pos"
              >
                <div class="flex-grow-1 pr-3">
                  <v-chip size="x-small" color="grey" label class="font-weight-bold text-uppercase mb-1">{{ it.pos }}</v-chip>
                  <div class="font-italic text-body-2">{{ it.sentence }}</div>
                </div>
                
                <div class="min-width-150">
                  <draggable :list="wfSlots[it.pos]" group="wfGroup" class="border dashed rounded pa-1 d-flex align-center min-height-40">
                    <template #item="{ element }">
                      <v-chip color="primary" variant="flat" size="small" closable @click.stop="clearWfSlot(it.pos)">
                        {{ element.text }}
                      </v-chip>
                    </template>
                  </draggable>
                </div>
              </div>
            </div>

            <!-- Draggable Chip Bank Row Block -->
            <div class="text-caption text-grey mb-1 text-center">Available options bank:</div>
            <draggable :list="wfBank" group="wfGroup" class="d-flex justify-center flex-wrap ga-2 border rounded pa-2 bg-grey-lighten-4">
              <template #item="{ element }">
                <v-chip variant="outlined" color="secondary" class="cursor-pointer" @click="tapWfChip(element)">
                  {{ element.text }}
                </v-chip>
              </template>
            </draggable>
          </v-card>
        </div>

        <!-- Inside your RESULTS template block in OtherGamePlay.vue -->
        <div v-else-if="gameState === 'RESULTS'" class="d-flex flex-column justify-space-between h-100 flex-grow-1">
          <div>
            <h3 class="text-h4 mb-2 font-weight-bold d-flex align-center">
              <v-icon icon="mdi-finance" color="primary" class="me-2" />
              Summary
            </h3>
            
            <p class="text-h6 mb-1">
              Accuracy: <strong class="text-primary">{{ accuracyScore || 0 }}%</strong> 
              ({{ rightCount }} / {{ totalRounds }})
            </p>
            
            <p class="text-caption text-grey-darken-1 mb-4">
              ⏱ Average Response Speed: <strong>{{ avgResponseTime || "0.00" }}s</strong>
            </p>
            
            <v-divider class="my-3" />

            <!-- Corrected Loop using roundTelemetryBatch -->
            <div class="results-scroll pr-1" style="max-height: 400px; overflow-y: auto;">
              <div v-for="r in roundTelemetryBatch" :key="r.prompt_number" class="mb-3 border-b pb-2">
                <div>
                  <strong>Round {{ r.prompt_number }}:</strong> 
                  <!-- Binds cleanly to the string built by logRoundMetrics -->
                  <span class="font-italic text-grey-darken-3">
                    " {{ r.display_question }} "
                  </span>
                </div>
                
                <div class="text-caption mt-1">
                  Your Answer: 
                  <span :class="r.is_correct ? 'text-success font-weight-bold' : 'text-error font-weight-bold'">
                    {{ r.user_answer || '—' }}
                  </span>
                  <span v-if="!r.is_correct" class="text-grey-darken-1"> 
                    • Correct: 
                    <strong class="text-success font-mono">
                      {{ r.correct_answer_revealed || 'Correct answers available in the dashboard' }}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <v-card-actions class="pt-3 border-t mt-4">
            <v-spacer />
            <v-btn color="primary" variant="flat" rounded="pill" size="large" @click="$emit('restart')">
              Play Again
            </v-btn>
            <RouterLink :to="{ name: 'student-data' }" class="text-decoration-none">
              <v-btn color="secondary" variant="flat" rounded="pill" size="large">
                Dashboard
              </v-btn>
            </RouterLink>
          </v-card-actions>
        </div>
    </v-card>

    <v-dialog v-model="showWrongDialog" persistent max-width="480">
      <v-card color="yellow-lighten-2" class="pa-3" @keydown.enter.prevent.stop="handleKeyboardEnterEvent">
        <v-card-title class="text-h6 font-weight-bold mt-2">
          {{ lastRoundTimeout ? "Time expired!" : "Not Quite Right" }}
          <v-icon class="ms-1" :icon="lastRoundTimeout ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>
        
        <v-card-text class="text-body-1 py-2">
          
          <div v-if="gameName === 'Reported Speech'" class="d-flex align-start ga-3 mb-4 bg-white/50 pa-2 rounded">
            <v-avatar size="44" class="border">
              <v-img :src="resolveSpeakerAvatar(activePrompt.speaker)" cover />
            </v-avatar>
            <div class="text-caption">
              <div class="font-weight-bold">{{ activePrompt.speaker }} said:</div>
              <div class="font-italic" v-html="computeHighlightedBubbleHtml(activePrompt.direct, activePrompt.highlight)"></div>
            </div>
          </div>

          <div class="mb-2">Your Answer: <strong class="text-error font-mono">{{ userAnswerLog || '—' }}</strong></div>
          
          <div v-if="gameName === 'Comparison'" class="text-caption text-grey-darken-3 mt-2">
            Target Form
          </div>
          
          <div class="mt-2 text-body-2">
            Correct Answer: 
            <strong class="text-success font-mono">
              {{ 
                activePrompt?.blueprint?.accepted_pool?.join(' / ') || 
                activePrompt?.blueprint?.answers?.join(' / ') || 
                activePrompt?.blueprint?.correct_map ? Object.values(activePrompt.blueprint.correct_map).join(' | ') : 'Available in the dashboard'
              }}
            </strong>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer/>
          <v-btn ref="wrongOkButton" color="secondary" variant="flat" @click="advanceNextRound">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import api from "@/axios";
import draggable from "vuedraggable";

const props = defineProps({
  session_id: { type: Number, required: true },
  prompts: { type: Array, required: true },
  gameSettings: { type: Object, default: null },
  gameName: { type: String, required: true }
});

const emit = defineEmits(["restart"]);

// Anti-Bounce Keyboard Lock State Variables
const ignoreEnterUntil = ref(0);
const ENTER_GUARD_DELAY_MS = 500; // Half-second protective block window

// Lifecycle states
const gameState = ref("PLAYING"); 
const currentRound = ref(0);
const userAnswer = ref("");
const inputLocked = ref(false);

const rightCount = ref(0);
const wrongCount = ref(0);
const startTimestamp = ref(Date.now());

// Feedback mechanics
const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const lastRoundTimeout = ref(false);
const userAnswerLog = ref("");
const wrongOkButton = ref(null);

const roundTelemetryBatch = ref([]);

const SECONDS_PER_ROUND = props.gameName === "Pronoun Practice" ? 15 : 20;
const timeLeft = ref(SECONDS_PER_ROUND);
let timerInterval = null;

const totalRounds = computed(() => props.prompts.length);
const activePrompt = computed(() => props.prompts[currentRound.value] || {});
const progressPercentage = computed(() => (currentRound.value / totalRounds.value) * 100);

// ============================================================================
// HONEYPOT & TELEMETRY TRACKERS
// ============================================================================
const roundStartTime = ref(Date.now());
const formStartTime = ref(Date.now());

// Honeypot interaction telemetry object
const gameB = ref({
  Answer: "",           // Bound to an invisible input field
  onClick: 0,          // Bound to an invisible button click
  mouseMovements: 0,   // General mouse moving counts
  keystrokes: 0,       // Keystrokes registered on active answer container
  focusEvents: 0       // Focus tracking registered on active text fields
});

// Reset indicators at the exact launch point of every round sequence
function resetHoneypotMetrics() {
  roundStartTime.value = Date.now();
  gameB.value = {
    Answer: "",
    onClick: 0,
    mouseMovements: 0,
    keystrokes: 0,
    focusEvents: 0
  };
}

// Track movements securely across the primary interface boundaries
function trackMouseMove() {
  gameB.value.mouseMovements++;
}

// Listen to keyboard interaction paths dynamically
function trackKeystroke() {
  gameB.value.keystrokes++;
}

// Track explicit text focus updates
function trackFocus() {
  gameB.value.focusEvents++;
}

// Hook these global listeners up during initialization cycles safely
onMounted(() => {
  window.addEventListener("mousemove", trackMouseMove);
  // Reset timestamps on component launch
  formStartTime.value = Date.now();
  resetHoneypotMetrics();
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", trackMouseMove);
});

// Trigger a metrics scrub whenever your active round mutations roll over
watch(currentRound, () => {
  resetHoneypotMetrics();
});



// Reported speech data / helpers
const REPORTED_SPEECH_SPEAKERS = {
  "Luka": "/images/speaker_pics_resized/Luka.jpg",
  "Lebron": "/images/speaker_pics_resized/Lebron.jpg",
  "Wemby": "/images/speaker_pics_resized/Wemby.jpg",
  "the team": "/images/speaker_pics_resized/team.jpg",
  "the fans": "/images/speaker_pics_resized/fans.jpg",
  "the experts": "/images/speaker_pics_resized/experts.jpg",
  "the politician": "/images/speaker_pics_resized/Gavin.jpg",
  "the president": "/images/speaker_pics_resized/Merkel.jpg",
  "the CEO": "/images/speaker_pics_resized/CEO.jpg",
  "Audrey": "/images/speaker_pics_resized/Werro.jpg"
};

const resolveSpeakerAvatar = (name) => {
  return REPORTED_SPEECH_SPEAKERS[name] || "/images/speaker_pics_resized/team.jpg";
};

const computeHighlightedBubbleHtml = (text, highlight) => {
  if (!text || !highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return text;
  
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);
  
  return `${before}&nbsp;<span class="font-weight-black text-primary">${match}</span>&nbsp;${after}`;
};

// Word Families 
// --- REACTIVE STATE DESCRIPTORS ---
const wfAnswers = ref({ verb: "", noun: "", adjective: "", adverb: "" });
const selectedWfPos = ref(null);
const wfBank = ref([]);
const wfSlots = ref({ verb: [], noun: [], adjective: [], adverb: [] });

// --- DYNAMIC SWITCH SWAP SWEEPERS ---
const resetWfState = () => {
  selectedWfPos.value = null;
  wfAnswers.value = { verb: "", noun: "", adjective: "", adverb: "" };
  wfSlots.value = { verb: [], noun: [], adjective: [], adverb: [] };
  
  if (props.gameName === "Word Families" && activePrompt.value) {
    wfBank.value = activePrompt.value.items.map((it) => ({
      id: `${it.pos}-${Math.random()}`,
      text: it.answer,
      pos: it.pos
    }));
  }
};

const tapWfChip = (chip) => {
  if (!selectedWfPos.value) return;
  const targetPos = selectedWfPos.value;
  
  // Splice from target reactive bank wrapper array safely
  const idx = wfBank.value.findIndex(w => w.id === chip.id);
  if (idx !== -1) wfBank.value.splice(idx, 1);
  
  // If targeted slot array partition is occupied, return element back to base bank
  if (wfSlots.value[targetPos].length > 0) {
    const existing = wfSlots.value[targetPos].pop();
    if (existing) wfBank.value.push(existing);
  }
  
  wfSlots.value[targetPos].push(chip);
};

const clearWfSlot = (pos) => {
  const existing = wfSlots.value[pos].pop(); // Fixed: changed from valueOf to value
  if (existing) wfBank.value.push(existing);  // Fixed: changed from valueOf to value
};


// Tricky Translator
const highlightTranslationTargetHtml = (sentence, targetSubstr) => {
  if (!sentence || !targetSubstr) return sentence;
  
  // Handle discontinuous ellipses strings if passed from backend configurations safely
  if (targetSubstr.includes("...")) {
    let parts = targetSubstr.split("...");
    let processed = sentence;
    parts.forEach(part => {
      const pTrim = part.trim();
      if (pTrim) {
        processed = processed.replace(pTrim, `<span class="text-decoration-underline font-weight-black text-purple-darken-3">${pTrim}</span>`);
      }
    });
    return processed;
  }

  const idx = sentence.toLowerCase().indexOf(targetSubstr.toLowerCase());
  if (idx === -1) return sentence;
  
  const before = sentence.slice(0, idx);
  const match = sentence.slice(idx, idx + targetSubstr.length);
  const after = sentence.slice(idx + targetSubstr.length);
  
  return `${before}<span class="text-decoration-underline font-weight-black text-purple-darken-3">${match}</span>${after}`;
};

// Idea Linker
const ilUsedWords = ref([]);
const currentIlCorrectTrack = ref([]);

const getBehaviorColor = (b) => {
  if (b === "sentence modifier") return "error";
  if (b === "+ noun phrase") return "info";
  return "success";
};

// Comparison Engine Layout Computed States
const showSecondPerson = computed(() => {
  const tf = activePrompt.value?.target_form;
  return tf === "comparative" || tf === "comparison_less" || tf === "equality";
});

const displayedCompSecondChip = computed(() => {
  const tf = activePrompt.value?.target_form;
  if (tf === "comparison_less") return "mdi-code-less-than";
  if (tf === "comparative") return "mdi-code-greater-than";
  if (tf === "equality") return "mdi-equal";
  return null;
});

const displayedSuperSecondChip = computed(() => {
  const tf = activePrompt.value?.target_form;
  if (tf === "superlative_least") return "MIN";
  if (tf === "superlative") return "MAX";
  return null;
});

const getPicPath = (item) => {
  if (!item) return "";
  return `/images/vocab/${item.toLowerCase()}.jpg`;
};

const inputPlaceholderLabel = computed(() => {
  if (props.gameName === "Regret Machine") return "Type the missing past modal";
  if (props.gameName === "Quantifier Quest") return "Type the quantifier + noun (e.g., many cars)";
  if (props.gameName === "Comparison") return "Type the correct form";
  if (props.gameName === "Passive Party") return "Type the passive conversion";
  if (props.gameName === "Parallel Universe") return "Type the missing conditional phrase";
  if (props.gameName === "Verb Mixer") return "Type the verb complement (e.g., to go / going / go)";
  if (props.gameName === "Reported Speech") return "Type correct indirect shifted clause phrase (e.g., had finished)";
  if (props.gameName === "Year 2040") return "Type correct future conjugation (e.g., will have gone / will be sleeping)";
  if (props.gameName === "Tricky Translator") return "Provide only the missing word(s)...";
  if (props.gameName === "Idea Linker") return "Type an unused linking word... (e.g., therefore)";
  return "Type your response here...";
});

const timerClass = computed(() => {
  if (timeLeft.value <= 3) return "timer-danger";
  if (timeLeft.value <= 7) return "timer-warn";
  return "timer-ok";
});

const highlightedPassiveText = computed(() => {
  const p = activePrompt.value;
  if (!p || !p.active || !p.highlight) return "";
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return p.active.replace(new RegExp(escapeRegex(p.highlight), "g"), `<span class="font-weight-bold text-error">${p.highlight}</span>`);
});

const highlightedRegretPrompt = computed(() => {
  const p = activePrompt.value;
  if (!p || !p.prompt) return "";
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return p.prompt.replace(new RegExp(escapeRegex(p.highlight), "g"), `<span class="font-weight-bold text-primary">${p.highlight}</span>`);
});

function getAuxiliaryModeLabel(mode) {
  if (mode === "echo") return "Echo Bob's comment to show interest or surprise";
  if (mode === "agreement") return "Use 'so' or 'neither' to agree with Bob";
  if (mode === "tag") return "Add the missing tag to your question to Bob";
  return "";
}

const accuracyScore = computed(() => Math.round((rightCount.value / totalRounds.value) * 100));
const avgResponseTime = computed(() => {
  const totalSec = roundTelemetryBatch.value.reduce((acc, curr) => acc + curr.elapsed_time, 0);
  return totalRounds.value ? (totalSec / totalRounds.value).toFixed(2) : "0.00";
});

const inputWrapper = ref(null);
async function focusInputField() {
  await nextTick();
  const input = inputWrapper.value?.querySelector("input");
  input?.focus();
}

// Dialog focus monitor with keyboard entry guard synchronization hooks
watch(showWrongDialog, async (isOpened, wasOpened) => {
  if (isOpened) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  } else if (wasOpened) {
    // Inject custom macro latch block immediately on window closing transformations
    triggerKeyboardGuardLock(ENTER_GUARD_DELAY_MS);
    await focusInputField();
  }
});
watch(currentRound, async () => {
  if (activePrompt.value) {
    if (props.gameName === "Word Families") resetWfState();
    if (props.gameName === "Idea Linker") {
      textInputString.value = ""; // clear text field
    }
    await nextTick();
    focusInputField();
  }
});

function triggerKeyboardGuardLock(ms) {
  ignoreEnterUntil.value = Date.now() + ms;
}

function checkIsKeyboardLocked() {
  return Date.now() < ignoreEnterUntil.value;
}

function startCountdown() {
  clearInterval(timerInterval);
  timeLeft.value = SECONDS_PER_ROUND;
  timerInterval = setInterval(() => {
    if (showWrongDialog.value || inputLocked.value) return;
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      handleTimeoutGate();
    }
  }, 1000);
}

function handleTimeoutGate() {
  if (inputLocked.value) return;
  inputLocked.value = true;
  clearInterval(timerInterval);
  lastRoundTimeout.value = true;
  userAnswerLog.value = "[Timeout]";
  logRoundMetrics("", false, true);
  showWrongDialog.value = true;
}


// Central Interceptor for Enter key presses across all sub-components
function handleKeyboardEnterEvent(event) {
  if (checkIsKeyboardLocked()) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    return;
  }

  if (showWrongDialog.value) {
    advanceNextRound();
    return;
  }

  handleAnswerSubmission();
}

// ============================================================================
// BOT INTERCEPTION EVALUATORS
// ============================================================================
function evaluateHoneypotTelemetry() {
  const reasons = [];
  let score = 0;

  // 1. Invisible field value populated
  if (gameB.value.Answer.trim()) {
    reasons.push("hp_answer_field_filled");
    score += 50;
  }

  // 2. Trapped hidden button triggers
  if (gameB.value.onClick > 0) {
    reasons.push("hp_button_clicked");
    score += 50;
  }

  // 3. Script-injected posts running bypassing navigation frames
  if (gameB.value.mouseMovements === 0) {
    reasons.push("no_mouse_movements");
    score += 15;
  }

  // 4. Missing typing interaction chains
  if (gameB.value.keystrokes === 0) {
    reasons.push("no_keystroke_events");
    score += 30;
  }

  // 5. Speed evaluations (< 1.2s round execution threshold flags)
  const timeTaken = Date.now() - roundStartTime.value;
  if (timeTaken < 1200) {
    reasons.push("form_filled_too_fast");
    score += 30;
  }

  // 6. Direct value assignments avoiding standard focus hooks
  if (gameB.value.focusEvents === 0) {
    reasons.push("no_focus_on_answer_field");
    score += 10;
  }

  return {
    flagged: score >= 50,
    score: score,
    reasons
  };
}

async function computeSha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function normalizeString(text) {
  let s = String(text || "").trim().toLowerCase();
  while (s && [".", ",", "!", "?", ";", ":"].includes(s[s.length - 1])) {
    s = s.slice(0, -1);
  }
  return s.replace(/\s+/g, " ");
}

async function handleAnswerSubmission() {
  if (inputLocked.value || showWrongDialog.value) return;
  inputLocked.value = true;
  clearInterval(timerInterval);

  const rawInput = userAnswer.value;
  const cleanedInput = normalizeString(rawInput);
  
  // Calculate round duration safely using local tracking tickers
  const elapsedMs = Date.now() - roundStartTime.value;
  const elapsedSeconds = parseFloat((elapsedMs / 1000).toFixed(1));
  
  // Run bot detection scan evaluations
  const hpResult = evaluateHoneypotTelemetry();

  let isCorrect = false;
  let serverAcceptedPool = null;

  // ==========================================
  // CASE A: IDEA LINKER (Requires State/API)
  // ==========================================
  if (props.gameName === "Idea Linker") {
    try {
      const response = await api.post("/other-games/verify-answer/", {
        session_id: props.session_id,
        prompt_number: activePrompt.value.prompt_number,
        user_answer: JSON.stringify({
          answer: rawInput,
          used: ilUsedWords.value
        })
      });

      isCorrect = response.data.is_correct;
      serverAcceptedPool = response.data.accepted_pool;
      
      if (isCorrect) {
        ilUsedWords.value.push(rawInput.trim().toLowerCase());
      }
    } catch (error) {
      console.error("Idea Linker validation pipeline failed:", error);
      inputLocked.value = false;
      startTimer();
      return;
    }

  // ==========================================
  // CASE B: ALL OTHER GAMES (Fast Local Hashes)
  // ==========================================
  } else {
    const userHash = await computeSha256(cleanedInput);
    isCorrect = activePrompt.value.answer_hashes?.includes(userHash) || false;
  }

  // ==========================================
  // TELEMETRY REPLICATOR METRICS COMPILER
  // ==========================================
  // Pass the newly captured bot parameters directly into your logging cache matrices
  logRoundMetrics(
    rawInput, 
    isCorrect, 
    false, 
    elapsedSeconds, 
    hpResult.flagged, 
    hpResult.score, 
    hpResult.reasons
  );

  if (isCorrect) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 800);
    advanceNextRound();
  } else {
    lastRoundTimeout.value = false;
    userAnswerLog.value = rawInput;
    
    if (serverAcceptedPool) {
      currentIlCorrectTrack.value = serverAcceptedPool;
    }
    
    showWrongDialog.value = true;
  }
}

function logRoundMetrics(answer, isCorrect, timedOut) {
  const secondsElapsed = SECONDS_PER_ROUND - timeLeft.value;
  
  let questionString = activePrompt.value.question || "Unknown prompt scenario context";
  if (props.gameName === "Regret Machine") {
    questionString = `${activePrompt.value.prompt} || ${activePrompt.value.sentence}`;
  } else if (props.gameName === "Comparison") {
    questionString = `Compare [${activePrompt.value.word}] (${activePrompt.value.target_form}): ${activePrompt.value.person_A} vs ${activePrompt.value.person_B}`;
  } else if (props.gameName === "Quantifier Quest") {
  questionString = `[${activePrompt.value.countable ? 'COUNTABLE' : 'UNCOUNTABLE'}] Prefix: "${activePrompt.value.displayed_sentence}" || Word: ${activePrompt.value.subject}`;
  } else if (props.gameName === "Reported Speech") {
    questionString = `[REPORTED SPEECH] Speaker: "${activePrompt.value.speaker}" || Context Clue: ${activePrompt.value.direct} -> Output: ${activePrompt.value.reported}`;
  } else if (props.gameName === "Year 2040") {
  questionString = `[${activePrompt.value.tense.toUpperCase()}] Verb: "${activePrompt.value.verb}" || Context: ${activePrompt.value.sentence}`;
  } else if (props.gameName === "Verb Mixer") {
    questionString = `[${activePrompt.value.category.toUpperCase()}] Verb: "${activePrompt.value.answer_verb}" || Target: ${activePrompt.value.sentence}`;
  } else if (props.gameName === "Tricky Translator") {
  questionString = `[TRICKY TRANSLATOR - ${activePrompt.value.source_language?.toUpperCase()}] Input: "${activePrompt.value.source_sentence}" || Context: ${activePrompt.value.target_sentence}`;
  } else if (props.gameName === "Parallel Universe") {
      const focusClause = activePrompt.value.condition ? "IF" : "MAIN";
      questionString = `[${activePrompt.value.conditional_type.toUpperCase()}] (${focusClause}) || ${activePrompt.value.sentence}`;
    } else if (props.gameName === "Passive Party") {
    questionString = `"${activePrompt.value.active}" ➔ "${activePrompt.value.passive}"`;
  }

  roundTelemetryBatch.value.push({
    prompt_number: activePrompt.value.prompt_number,
    user_answer: answer,
    elapsed_time: secondsElapsed,
    out_of_time: timedOut,
    is_correct: isCorrect,
    display_question: questionString
  });

  isCorrect ? rightCount.value++ : wrongCount.value++;
}

async function advanceNextRound() {
  // Lock entry loop inputs briefly to eliminate double tap events leaking into next prompt
  triggerKeyboardGuardLock(ENTER_GUARD_DELAY_MS);
  
  showWrongDialog.value = false;
  userAnswer.value = "";

  if (currentRound.value >= totalRounds.value - 1) {
    await commitBulkTelemetryBatch();
  } else {
    currentRound.value++;
    inputLocked.value = false;
    startCountdown();
    focusInputField();
  }
}

async function commitBulkTelemetryBatch() {
  gameState.value = "RESULTS";
  const mode = props.gameSettings?.mode ?? 'mixed';
  const finalGameNameHeader = mode === 'mixed' ? 'Verb Mixer' : 'Verb Mixer Practice';
  
  try {
    const payload = {
      session_id: props.session_id,
      game_name: props.gameName === 'Verb Mixer' ? finalGameNameHeader : props.gameName,
      rounds: roundTelemetryBatch.value.map(r => ({
        prompt_number: r.prompt_number,
        user_answer: r.user_answer,
        elapsed_time: r.elapsed_time,
        out_of_time: r.out_of_time
      }))
    };
    
    const response = await api.post("/other-games/submit-results/", payload);
    
    // MERGE SERVER CORRECT ANSWERS INTO LOCAL TELEMETRY ROWS
    if (response.data && Array.isArray(response.data.rounds)) {
      response.data.rounds.forEach(serverRound => {
        const localRound = roundTelemetryBatch.value.find(
          r => r.prompt_number === serverRound.prompt_number
        );
        if (localRound) {
          // Format the array or string coming back from the backend cleanly
          const ans = serverRound.correct_answer;
          localRound.correct_answer_revealed = Array.isArray(ans) ? ans.join(' / ') : ans;
        }
      });
    }
  } catch (error) {
    console.error("Telemetry reporting pipeline failure:", error);
  }
}

function quitSession() {
  clearInterval(timerInterval);
  window.location.reload();
}

onMounted(() => {
  startCountdown();
  focusInputField();
});

onBeforeUnmount(() => clearInterval(timerInterval));
</script>

<style scoped>
.floating-feedback {
  position: fixed; top: 12vh; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; border-radius: 8px; font-size: 1.1rem; color: white; z-index: 9999;
}
.timer-pill { padding: 4px 12px; border-radius: 12px; font-weight: bold; }
.timer-ok { background: #e8f5e9; color: #2e7d32; }
.timer-warn { background: #fff8e1; color: #f57f17; }
.timer-danger { background: #ffebee; color: #c62828; }
.results-scroll { max-height: 380px; overflow-y: auto; }
.result-card { border-radius: 6px; margin-bottom: 8px; }
.success-card { border-left: 5px solid #4caf50; background: #e8f5e9; }
.error-card { border-left: 5px solid #f44336; background: #ffebee; }
.font-mono { font-family: monospace; }
.ga-2 { gap: 8px; }
.ga-3 { gap: 12px; }
.ga-4 { gap: 16px; }
</style>