<template>
  <v-container fluid class="dashboard-wrapper pa-4 pa-sm-6 max-w-container">
    
    <div v-if="isMobile" class="mb-4">
      <v-select
        v-model="activeTab"
        :items="tabItems"
        item-title="label"
        item-value="value"
        label="Select Dashboard View"
        variant="outlined"
        density="comfortable"
        bg-color="white"
        hide-details
        class="rounded-xl border shadow-sm"
      />
    </div>

    <v-tabs
      v-else
      v-model="activeTab"
      class="rounded-xl elevation-1 bg-grey-lighten-4 mb-6 custom-dashboard-tabs"
      show-arrows
      grow
      color="primary"
      slider-color="primary"
    >
      <v-tab 
        v-for="item in tabItems" 
        :key="item.value" 
        :value="item.value"
        class="font-weight-bold text-subtitle-2 tracking-wide"
      >
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="mt-2" :touch="false">
      
      <v-window-item value="grammar-feedback">
        <div v-if="loading" class="text-center my-12 py-12">
          <v-progress-circular indeterminate size="48" width="4" color="primary" />
        </div>
        <v-alert v-else-if="errorsError" type="error" variant="tonal" class="rounded-xl" closable>
          {{ errorsError }}
        </v-alert>
        <div v-else class="fade-in">
          <ErrorsDataTab :key="'student'" />
        </div>
      </v-window-item>

      <v-window-item value="vocabulary">
        <VocabDataTab class="fade-in" />
      </v-window-item>

      <v-window-item value="goals">
        <GoalsDataTab class="fade-in" />
      </v-window-item>

      <v-window-item value="conjugation-game">
        <div v-if="loading" class="text-center my-12 py-12">
          <v-progress-circular indeterminate size="48" width="4" color="primary" />
        </div>
        <v-alert v-else-if="conjGameError" type="error" variant="tonal" class="rounded-xl" closable>
          {{ conjGameError }}
        </v-alert>
        
        <v-container v-else fluid class="pa-0 fade-in">
          <div v-if="!sessions.length" class="text-center my-12 py-12 opacity-60">
            <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-database-off-outline</v-icon>
            <h3 class="text-h6 font-weight-medium text-grey-darken-2">No game sessions found</h3>
            <p class="text-body-2 text-neutral mt-1">Play a game to start tracking your progress.</p>
          </div>
          
          <div v-else>
            <v-row class="align-stretch">
              
              <v-col cols="12" lg="5" class="d-flex">
                <v-card class="chart-card pa-4 py-6 w-100 rounded-xl border border-light shadow-sm flex-column" elevation="0">
                  <v-card-title class="text-h5 font-weight-black text-grey-darken-3 pb-2 d-flex align-center">
                    <v-icon class="me-2" color="teal">mdi-calculator-variant-outline</v-icon> Conjugator Stats
                  </v-card-title>
                  <v-divider class="my-3 opacity-40" />
                  <v-card-text class="d-flex flex-column align-center justify-center flex-grow-1">
                    <PieChart :data="totalRightWrongChartData" />

                    <v-chip size="small" variant="flat" color="teal-lighten-5" class="text-teal-darken-3 font-weight-bold mt-6 mb-2 px-4">
                      {{ sessions.length }} Game{{ sessions.length !== 1 ? 's' : '' }} Completed
                    </v-chip>
                    <div class="text-subtitle-1 font-weight-black text-grey-darken-3">
                      Total rounds played: <strong>{{ totalRoundsPlayed }}</strong> rounds
                    </div>
                    <div class="text-body-2 font-weight-medium text-grey-darken-2 mt-1">
                      {{ totalCorrect }} correct &bull; {{ totalIncorrect }} incorrect
                    </div>
                    <div v-if="totalTypos > 0" class="text-caption text-medium-emphasis font-weight-medium mt-1 italic-label">
                      ({{ totalTypos }} typo{{ totalTypos > 1 ? 's' : '' }})
                    </div>
                    <div class="text-subtitle-2 font-weight-bold text-indigo-darken-2 border rounded-lg px-3 py-1 mt-4 bg-indigo-lighten-5">
                      Speed: <strong>{{ avgTimePerRound }}</strong> seconds per answer on average
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" lg="7" class="d-flex">
                <v-card class="chart-card pa-4 w-100 rounded-xl border border-light shadow-sm flex-column" elevation="0">
                  <div v-if="sessionAccuracyTrend.length > 1" class="flex-grow-1 d-flex flex-column justify-space-between">
                    <v-card variant="flat" class="pa-4 bg-grey-lighten-5 rounded-lg border mb-4">
                      <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-3 d-flex align-center">
                        <v-icon class="me-2" color="blue">mdi-chart-bell-curve-cumulative</v-icon> Accuracy Over Time
                      </div>
                      <v-sparkline
                        :model-value="sessionAccuracyTrend"
                        :gradient="sparklineGradients[2]"
                        color="blue"
                        line-width="3"
                        stroke-linecap="round"
                        auto-draw
                        padding="20"
                        smooth
                        :labels="generateSparklineLabels(sessionAccuracyTrend)"
                        :show-labels="true"
                        class="mt-2 font-weight-bold"
                      />
                    </v-card>

                    <v-row dense class="mt-auto">
                      <v-col cols="12" sm="4" class="d-flex">
                        <v-card class="pa-4 flex-grow-1 text-center d-flex flex-column justify-center border rounded-xl" elevation="0">
                          <v-card-title class="text-caption font-weight-black text-uppercase text-wrap text-grey pa-0">
                            This Semester's Total
                          </v-card-title>
                          <div class="text-h4 my-2 font-weight-black text-emerald">{{ userStore.totalCorrectCurrentPeriod ?? 0 }}</div>
                          <div class="text-caption text-medium-emphasis line-height-xs">
                            Correct answers since semester start
                          </div>
                        </v-card>
                      </v-col>

                      <v-col cols="12" sm="4" class="d-flex">
                        <v-tooltip text="Algorithmic operational tier standing index matrix" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-card
                              v-bind="props"
                              class="pa-4 bg-indigo-lighten-5 border-indigo flex-grow-1 text-center d-flex flex-column justify-center border rounded-xl transition-hover"
                              elevation="0"
                            >
                              <v-card-title class="text-caption font-weight-black text-uppercase text-wrap text-indigo-darken-3 pa-0">
                                Conjugation Health Score
                              </v-card-title>
                              <div class="d-flex justify-center my-2">
                                <Gauge
                                  :key="gaugeKey"
                                  :value="userStore.healthScore ?? 0"
                                  :size="xs ? 120 : 90" 
                                />
                              </div>
                              <v-chip size="x-small" color="indigo" variant="flat" class="font-weight-bold text-uppercase mx-auto mt-1 tracking-wider">
                                {{ healthTier ?? '' }}
                              </v-chip>
                            </v-card>
                          </template>
                        </v-tooltip>
                      </v-col>

                      <v-col cols="12" sm="4" class="d-flex">
                        <v-card class="pa-4 flex-grow-1 text-center d-flex flex-column justify-center border rounded-xl" elevation="0">
                          <v-card-title class="text-caption font-weight-black text-uppercase text-wrap text-grey pa-0">
                            Last Semester's Total
                          </v-card-title>
                          <v-card-subtitle class="text-caption text-medium-emphasis font-weight-bold pa-0 mt-0">Your previous record</v-card-subtitle>
                          
                          <div class="flex-grow-1 d-flex flex-column justify-center mt-2">
                            <template v-if="userStore.previousDate">
                              <div class="text-h5 font-weight-black text-grey-darken-3 mb-1">
                                {{ userStore.previousTotalCorrectPrompts }}
                              </div>
                              <div>
                                <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                                  {{ userStore.previousHealthScore }}% Health Score
                                </v-chip>
                              </div>
                            </template>
                            <div class="text-caption text-disabled font-weight-medium py-4" v-else>
                              No historical logs found
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else class="text-center py-12 text-medium-emphasis my-auto opacity-50">
                    <v-icon size="48" class="mb-2">mdi-chart-timeline-variant</v-icon>
                    <p class="text-body-2">Play more to raise your scores.</p>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" lg="6" class="d-flex">
                <v-card class="chart-card pa-4 w-100 rounded-xl border border-light shadow-sm" elevation="0">
                  <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 pb-0">
                    <v-icon class="me-2" color="green">mdi-clock-fast</v-icon> Accuracy by Tense
                  </v-card-title>
                  <v-divider class="my-3 opacity-40" />
                  <v-card-text class="d-flex flex-column align-center flex-grow-1 justify-center">
                    <BarChart :data="tenseAccuracyData" class="w-100" />
                    <div class="text-caption font-weight-medium text-medium-emphasis mt-4 text-center">
                      Percentage of correct answers for each tense
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" lg="6" class="d-flex">
                <v-card class="chart-card pa-4 w-100 rounded-xl border border-light shadow-sm" elevation="0">
                  <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 pb-0">
                    <v-icon class="me-2" color="purple">mdi-code-brackets</v-icon> Accuracy by Sentence Type
                  </v-card-title>
                  <v-divider class="my-3 opacity-40" />
                  <v-card-text class="d-flex flex-column align-center flex-grow-1 justify-center">
                    <BarChart :data="sentenceTypeAccuracyData" class="w-100" />
                    <div class="text-caption font-weight-medium text-medium-emphasis mt-4 text-center">
                      Percentage of correct answers for each sentence type
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-6" v-if="!xs"/>

            <v-row class="mt-2 align-stretch">
              
              <v-col cols="12" md="6" class="d-flex">
                <v-card
                  class="pa-5 d-flex flex-column justify-space-between rounded-xl border-amber bg-amber-panel w-100 shadow-sm"
                  elevation="0"
                >
                  <div>
                    <v-card-title class="text-h5 font-weight-black text-amber-header d-flex align-center pb-1">
                      <v-icon class="me-3 mb-1 text-amber-icon" size="26">mdi-lightbulb-on-outline</v-icon>
                      Explain your Errors
                    </v-card-title>
                    <v-card-subtitle class="font-weight-medium text-amber-subtitle">
                      You have <strong>{{ totalIncorrect }}</strong> wrong answers
                    </v-card-subtitle>
                    <v-divider class="my-3 border-amber alpha-divider" />
                  </div>

                  <v-card-text v-if="currentError" class="flex-grow-1 d-flex flex-column justify-center pa-1">
                    <div class="text-center w-100">
                      <div class="text-body-2 font-weight-bold text-grey-darken-3 mb-3">Can you explain why this answer was wrong?</div>
                      
                      <v-sheet color="white" class="pa-4 rounded-xl border border-dashed mb-4 border-amber-light">
                        <div class="text-h4 font-weight-black text-error tracking-wide text-wrap py-2 break-word font-code">
                          <span>{{ currentError.user_answer  }}</span><span v-if="!currentError.user_answer">No answer</span>
                        </div>
                      </v-sheet>

                      <div class="d-flex flex-wrap justify-center gap-2 mt-2">
                        <v-chip size="small" variant="flat" color="amber-lighten-4" class="font-weight-bold text-brown-darken-3 text-uppercase">{{ currentError.verb }}</v-chip>
                        <v-chip size="small" variant="flat" color="amber-lighten-4" class="font-weight-bold text-brown-darken-3 text-uppercase">{{ currentError.person }}</v-chip>
                        <v-chip size="small" variant="flat" color="indigo-lighten-4" class="font-weight-bold text-indigo-darken-4 text-uppercase">{{ currentError.tense }}</v-chip>
                        <v-chip size="small" variant="flat" color="purple-lighten-4" class="font-weight-bold text-purple-darken-4 text-uppercase">{{ currentError.sentence_type }}</v-chip>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-text v-else class="text-center text-body-2 text-medium-emphasis my-auto py-8">
                    No errors to display.
                  </v-card-text>

                  <v-card-actions class="d-flex justify-end pt-3 border-top border-amber">
                    <v-btn
                      color="brown-darken-2"
                      variant="flat"
                      size="large"
                      class="rounded-lg text-button font-weight-bold px-5"
                      @click="nextError"
                      :disabled="!incorrectAnswersData.length"
                    >
                      Next
                      <v-icon size="18" class="ms-2">mdi-arrow-right-circle-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6" class="d-flex">
                <v-card
                  class="pa-5 d-flex flex-column justify-space-between bg-teal-panel rounded-xl border-teal w-100 shadow-sm"
                  elevation="0"
                >
                  <div>
                    <v-card-title class="text-h5 font-weight-black text-teal-header d-flex align-center pb-1">
                      <v-icon class="me-3 mb-1 text-teal-icon" size="26">mdi-bullhorn-variant-outline</v-icon>
                      Use your Mastered Verbs
                    </v-card-title>
                    <v-card-subtitle class="font-weight-medium text-teal-subtitle">
                      You have mastered <strong>{{ userStore.tenseStats?.mastered_verbs_ps?.length ?? 0 }} Past Simple</strong> & <strong>{{ userStore.tenseStats?.mastered_verbs_pp?.length ?? 0 }} Present Perfect</strong> irregular verb forms
                    </v-card-subtitle>
                    <v-divider class="my-3 border-teal alpha-divider" />
                  </div>

                  <v-card-text v-if="currentMasteredVerb" class="flex-grow-1 d-flex flex-column justify-center pa-1">
                    <div class="text-center w-100">
                      <div class="text-body-2 font-weight-bold text-grey-darken-3 mb-3">Can you use this verb in a sentence?</div>
                      
                      <v-sheet color="white" class="pa-4 rounded-xl border border-dashed mb-4 border-teal-light">
                        <div class="text-h3 font-weight-black text-teal-darken-4 tracking-tight py-2">
                          {{ currentMasteredVerb?.verb }}
                        </div>
                      </v-sheet>

                      <div class="text-subtitle-2 font-weight-bold text-grey-darken-2">
                        Use this tense: <v-chip size="small" color="teal" variant="flat" class="font-weight-bold font-uppercase ms-1">{{ currentMasteredVerb?.tense }}</v-chip>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-text v-else class="text-center text-body-2 text-medium-emphasis my-auto py-8">
                    Play the conjugation game with irregular verbs to master more forms.
                  </v-card-text>
                  
                  <v-card-actions v-if="currentMasteredVerb" class="d-flex justify-end pt-3 border-top border-teal">
                    <v-btn
                      color="teal-darken-3"
                      variant="flat"
                      size="large"
                      class="rounded-lg text-button font-weight-bold px-5"
                      @click="nextMasteredVerb"
                    >
                      Next
                      <v-icon size="18" class="ms-2">mdi-shuffle-variant</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

            </v-row>

            <v-divider class="my-8"/>
            <h3 class="text-h4 font-weight-black text-grey-darken-4 tracking-tight mb-4 px-2">Irregular Verb Mastery</h3>
            
            <v-row class="align-stretch mb-6">
              
              <v-col cols="12" md="6" class="d-flex">
                <v-sheet elevation="0" class="pa-5 w-100 border rounded-xl d-flex flex-column gap-4 bg-grey-fluid">
                  <h4 class="text-h6 font-weight-black text-grey-darken-3 d-flex align-center mb-1">
                    <v-icon class="me-2" color="indigo">mdi-label-outline</v-icon> Past Simple
                  </h4>
                  <v-divider class="opacity-40 mb-2" />

                  <div v-for="(tier, idx) in ['Basic 75', 'Master 110', 'All 130']" :key="tier" class="mb-4 bg-white pa-3 rounded-lg border">
                    <div class="font-weight-bold text-subtitle-2 text-grey-darken-3 mb-2">{{ tier }} Irregulars</div>
                    
                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Discovery (1x Correct)</div>
                    <v-progress-linear :model-value="userStore.tierStats?.[idx]?.discovered_pct_ps ?? 0" height="20" color="indigo-lighten-2" class="mb-2 rounded font-weight-black" striped>
                      <template #default="{ value }"><span>{{ value }}%</span></template>
                    </v-progress-linear>
                    
                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Mastery (3x Correct)</div>
                    <v-progress-linear :model-value="userStore.tierStats?.[idx]?.mastered_pct_ps ?? 0" height="20" color="indigo" class="rounded font-weight-black" striped>
                      <template #default="{ value }"><span>{{ value }}%</span></template>
                    </v-progress-linear>
                  </div>

                  <div class="mt-2 pt-2 border-top">  
                    <div class="font-weight-black text-subtitle-2 text-grey-darken-3 mb-1">Your verb pools — Past Simple</div>
                    <v-select
                      v-model="selectedPsOption"
                      :items="pastSimpleOptionsWithCounts"
                      item-title="displayLabel"
                      item-value="key"
                      label="Choose a category"
                      density="comfortable"
                      variant="outlined"
                      bg-color="white"
                      hide-details
                      class="mt-2 rounded-lg"
                    />
                    <v-sheet color="white" class="pa-3 rounded-lg border mt-3 max-h-dictionary overflow-y-auto custom-scroll-container font-code text-body-2">
                      {{ displayedPsVerbs.join(', ') || psFallbackMessage }}
                    </v-sheet>
                  </div> 
                </v-sheet>
              </v-col>

              <v-col cols="12" md="6" class="d-flex">
                <v-sheet elevation="0" class="pa-5 w-100 border rounded-xl d-flex flex-column gap-4 bg-grey-fluid">
                  <h4 class="text-h6 font-weight-black text-grey-darken-3 d-flex align-center mb-1">
                    <v-icon class="me-2" color="deep-orange">mdi-label-outline</v-icon> Present Perfect
                  </h4>
                  <v-divider class="opacity-40 mb-2" />

                  <div v-for="(tier, idx) in ['Basic 75', 'Master 110', 'All 130']" :key="tier" class="mb-4 bg-white pa-3 rounded-lg border">
                    <div class="font-weight-bold text-subtitle-2 text-grey-darken-3 mb-2">{{ tier }} Irregulars</div>
                    
                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Discovery (1x Correct)</div>
                    <v-progress-linear :model-value="userStore.tierStats?.[idx]?.discovered_pct_pp ?? 0" height="20" color="deep-orange-lighten-2" class="mb-2 rounded font-weight-black" striped>
                      <template #default="{ value }"><span>{{ value }}%</span></template>
                    </v-progress-linear>
                    
                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Mastery (3x Correct)</div>
                    <v-progress-linear :model-value="userStore.tierStats?.[idx]?.mastered_pct_pp ?? 0" height="20" color="deep-orange" class="rounded font-weight-black" striped>
                      <template #default="{ value }"><span>{{ value }}%</span></template>
                    </v-progress-linear>
                  </div>

                  <div class="mt-2 pt-2 border-top">
                    <div class="font-weight-black text-subtitle-2 text-grey-darken-3 mb-1">Your verb pools - Present Perfect</div>
                    <v-select
                      v-model="selectedPpOption"
                      :items="presentPerfectOptionsWithCounts"
                      item-title="displayLabel"
                      item-value="key"
                      label="Choose a category"
                      density="comfortable"
                      variant="outlined"
                      bg-color="white"
                      hide-details
                      class="mt-2 rounded-lg"
                    />
                    <v-sheet color="white" class="pa-3 rounded-lg border mt-3 max-h-dictionary overflow-y-auto custom-scroll-container font-code text-body-2">
                      {{ displayedPpVerbs.join(', ') || ppFallbackMessage }}
                    </v-sheet>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
            
            <v-card class="pa-4 mt-6 rounded-xl border card-fixed d-flex flex-column" elevation="1">
              <div class="text-h6 font-weight-black text-grey-darken-3 mb-3 d-flex align-center flex-shrink-0">
                <v-icon class="me-2" color="indigo">mdi-history</v-icon> Full Game Logs
                <v-chip size="small" class="ms-2 font-weight-bold" color="indigo" variant="tonal">
                  {{ sessions.length }} Game{{ sessions.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
              
              <v-card-text class="flex-grow-1 overflow-y-auto custom-scroll-container pa-1">
                <v-expansion-panels variant="accordion" class="historical-panels border-none">
                  <v-expansion-panel
                    v-for="session in sessions"
                    :key="session.session_id"
                    class="border-panel-item mb-2 rounded-lg border"
                  >
                    <v-expansion-panel-title class="font-weight-bold">
                      <template #default>
                        <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between w-100 pe-4 gap-2">
                          <span class="text-subtitle-2 font-weight-black text-indigo-darken-3">
                            🎯 {{ session.correct_count }} correct out of {{ session.total_rounds }}
                          </span>
                          <span class="text-caption text-medium-emphasis">
                            {{ new Date(session.started_at).toLocaleString() }} &bull; 
                            <strong class="text-grey-darken-2 ms-1 text-wrap font-code">{{ session.tenses.join(', ').slice(0, 100) }}</strong>
                          </span>
                        </div>
                      </template>
                    </v-expansion-panel-title>
                    
                    <v-expansion-panel-text class="bg-grey-fluid pa-0">
                      <div v-if="session.rounds?.length" class="table-responsive">
                        <v-table class="bg-white rounded-lg custom-data-table border">
                          <thead>
                            <tr>
                              <th class="font-weight-black text-grey-darken-3 text-center">#</th>
                              <th class="font-weight-black text-grey-darken-3">Verb</th>
                              <th class="font-weight-black text-grey-darken-3">Tense</th>
                              <th class="font-weight-black text-grey-darken-3">Sentence</th>
                              <th class="font-weight-black text-grey-darken-3">User Answer</th>
                              <th class="font-weight-black text-grey-darken-3">Acceptable Answers</th>
                              <th class="font-weight-black text-grey-darken-3 text-center">Correct?</th>
                              <th class="font-weight-black text-grey-darken-3 text-center">AI Tutor</th>
                              <th class="font-weight-black text-grey-darken-3 text-center">Typo?</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="round in session.rounds" :key="`${session.session_id}-${round.prompt_number}`">
                              <td class="text-caption font-weight-bold text-center text-medium-emphasis">{{ round.prompt_number }}</td>
                              <td class="font-weight-black text-body-2 text-uppercase text-grey-darken-4">{{ round.verb }}</td>
                              <td class="text-caption font-weight-medium text-grey-darken-2">{{ round.tense }}</td>
                              <td class="text-caption font-weight-medium text-grey-darken-1">{{ round.sentence_type }}</td>
                              <td class="font-code text-body-2 font-weight-bold text-error-underlined">{{ round.user_answer || '—' }}</td>
                              <td class="font-code text-caption text-success font-weight-bold text-wrap max-w-text">{{ round.acceptable_answers?.join(' / ') }}</td>
                              <td class="text-center">
                                <v-icon :color="round.typo ? 'grey' : round.is_correct ? 'success' : 'error'" size="20">
                                  {{ round.typo_requested ? 'mdi-help-circle-outline' : round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                              </td>
                              <td class="text-center">
                                <template v-if="round.is_correct === false && round.typo !== true">
                                  <v-btn icon variant="text" size="x-small" color="indigo-darken-1" @click.stop="openConjRoundTutor(session, round)">
                                    <v-icon size="18">mdi-robot-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span v-else class="text-caption text-grey">—</span>
                              </td>
                              <td class="text-center">
                                <v-chip v-if="round.typo === true" size="x-small" color="success" variant="flat" class="font-weight-bold">Accepted</v-chip>
                                <v-chip v-else-if="round.typo_accepted === false" size="x-small" color="error" variant="flat" class="font-weight-bold">Denied</v-chip>
                                <v-chip v-else-if="round.typo_requested === true" size="x-small" color="warning" variant="flat" class="font-weight-bold text-dark">Pending</v-chip>
                                <v-btn v-else-if="!round.is_correct && !userStore.isStaff" size="x-small" color="primary" variant="tonal" class="font-weight-bold" :disabled="typoRequests.has(round.id)" @click="requestTypo(round)">
                                  Flag Typo
                                </v-btn>
                                <span v-else class="text-caption text-grey">—</span>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                      <div v-else class="text-center py-4 text-caption text-disabled">No data available.</div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>

          </div>
        </v-container>
      </v-window-item>

      <v-window-item value="other-games">
        <OtherGamesDash class="fade-in" />
      </v-window-item>

      <v-window-item value="exercises">
        <ExerciseDataTab class="fade-in" />
      </v-window-item>
    </v-window>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right" elevation="4">
      <div class="d-flex align-center font-weight-bold">
        <v-icon size="18" class="me-2">{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>

    <AiTutorChatDialog
      v-model="tutorOpen"
      title="AI Tutor — Why is this conjugation wrong?"
      :context="tutorContext"
      :system-message="conjTutorSystemMessage"
      :build-initial-user-message="buildConjTutorInitialUserMessage"
      :show-context-preview="false"
      :reset-on-context-change="true"
      api-url="/llm/chat/"
      :max-tokens="250"
      :temperature="0.4"
    >
      <template #context-summary="{ ctx }">
        <div class="my-2 pa-2 bg-grey-lighten-4 rounded-xl border border-dashed">
          <div class="text-body-2 font-weight-bold text-grey-darken-3">
            <span class="text-indigo-darken-3 font-weight-black">Prompt:</span>
            verb={{ ctx?.verb }} | person={{ ctx?.person }} | tense={{ ctx?.tense }} | format={{ ctx?.sentence_type }}
          </div>
          <div class="mt-1 text-body-2 text-error font-weight-bold">
            <span class="text-grey-darken-2 font-weight-medium">Your answer:</span> "{{ ctx?.student_answer ?? "—" }}"
          </div>
          <div class="mt-1 text-body-2 text-success font-weight-bold">
            <span class="text-grey-darken-2 font-weight-medium">Acceptable answers:</span> {{ (ctx?.acceptable_answers ?? []).join(" / ") || "—" }}
          </div>
        </div>
        <v-divider class="my-3" />
      </template>
    </AiTutorChatDialog>

  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute } from 'vue-router';
import { useDisplay } from "vuetify";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useNotificationStore } from '@/stores/notifications';

// Dynamic Component Registrations via Setup context scoping rules
import PieChart from "@/components/charts/PieChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import ErrorsDataTab from "@/components/ErrorsDataTab.vue";
import OtherGamesDash from "@/components/OtherGamesDash.vue";
import VocabDataTab from "@/components/VocabDataTab.vue";
import GoalsDataTab from "@/components/GoalsDataTab.vue";
import ExerciseDataTab from "@/components/ExerciseDataTab.vue";
import Gauge from "@/components/Gauge.vue";
import AiTutorChatDialog from "@/components/AiTutorChatDialog.vue";

// ----- Interfaces Definitions -----
interface Round {
  id: number;
  is_correct: boolean;
  typo: boolean | null;
  typo_requested: boolean;
  typo_accepted: boolean | null;
  tense?: string;
  sentence_type?: string;
  prompt_number?: number;
  person?: string;
  verb?: string;
  acceptable_answers?: string[];
  elapsed_time?: number;
  user_answer?: string;
}

interface GameSession {
  session_id: number;
  student: number;
  verb_set: string;
  sentence_types: string[];
  tenses: string[];
  started_at: string;
  total_rounds: number;
  correct_count: number;
  wrong_count: number;
  avg_time_per_prompt: number;
  rounds: Round[];
}

interface TenseStats {
  discovered_verbs_ps: string[];
  discovered_verbs_pp: string[];
  mastered_verbs_ps: string[];
  mastered_verbs_pp: string[];
}

type VerbField =
  | 'undiscovered_verbs_ps'
  | 'unmastered_verbs_ps'
  | 'discovered_verbs_ps'
  | 'mastered_verbs_ps'
  | 'undiscovered_verbs_pp'
  | 'unmastered_verbs_pp'
  | 'discovered_verbs_pp'
  | 'mastered_verbs_pp';

// ----- Composable Integrations Hooks -----
const route = useRoute();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const { xs, smAndDown, lgAndUp } = useDisplay();

// ----- Core Reactive State Variables -----
const sessions = ref<GameSession[]>([]);
const loading = ref<boolean>(true);
const errorsError = ref<string | null>(null);
const conjGameError = ref<string | null>(null);
const verbUsage = ref<any[]>([]);
const currentError = ref<any | null>(null);
const currentMasteredVerb = ref<any | null>(null);
const tutorOpen = ref(false);
const tutorContext = ref<any>({});
const gaugeKey = ref(0);
const typoRequests = ref<Set<number>>(new Set());

const activeTab = ref("grammar-feedback");
const snackbar = ref({ show: false, text: '', color: 'success' });

// ----- Static Reference Configurations Dictionary Maps -----
const HEALTH_TIERS: Record<string, [number, number]> = {
  "Getting started": [0, 9],
  "Warming up": [10, 19],
  "Jeune espoir": [20, 29],
  "Haut potentiel": [30, 39],
  "Professional": [40, 49],
  "Super League": [50, 59],
  "National Team": [60, 69],
  "Champions League": [70, 79],
  "Hall of Fame": [80, 89],
  "Ballon d'Or": [90, 98],
  "Conjugation Messi": [99, 100]
};

const tabItems = [
  { value: "grammar-feedback", label: "Errors" },
  { value: "vocabulary", label: "Vocab" },
  { value: "conjugation-game", label: "Conjugator" },
  { value: "other-games", label: "Other Games" },
  { value: "exercises", label: "Exercises" },
  { value: "goals", label: "Trophies" }
];

const pastSimpleOptions = [
  { key: 'Discovered_verbs_ps', label: 'Discovered verbs' },
  { key: 'Mastered_verbs_ps', label: 'Mastered verbs' },
  { key: 'Basic 75_undiscovered_verbs_ps', label: 'Basic 75 – Undiscovered' },
  { key: 'Basic 75_unmastered_verbs_ps', label: 'Basic 75 – Unmastered' },
  { key: 'Master 110_undiscovered_verbs_ps', label: 'Master 110 – Undiscovered' },
  { key: 'Master 110_unmastered_verbs_ps', label: 'Master 110 – Unmastered' },
  { key: 'All Irregular_undiscovered_verbs_ps', label: 'All Irregular – Undiscovered' },
  { key: 'All Irregular_unmastered_verbs_ps', label: 'All Irregular – Unmastered' },
];

const presentPerfectOptions = [
  { key: 'Discovered_verbs_pp', label: 'Discovered verbs' },
  { key: 'Mastered_verbs_pp', label: 'Mastered verbs' },
  { key: 'Basic 75_undiscovered_verbs_pp', label: 'Basic 75 – Undiscovered' },
  { key: 'Basic 75_unmastered_verbs_pp', label: 'Basic 75 – Unmastered' },
  { key: 'Master 110_undiscovered_verbs_pp', label: 'Master 110 – Undiscovered' },
  { key: 'Master 110_unmastered_verbs_pp', label: 'Master 110 – Unmastered' },
  { key: 'All Irregular_undiscovered_verbs_pp', label: 'All Irregular – Undiscovered' },
  { key: 'All Irregular_unmastered_verbs_pp', label: 'All Irregular – Unmastered' },
];

const selectedPsOption = ref(pastSimpleOptions[0].key);
const selectedPpOption = ref(presentPerfectOptions[0].key);

const BarchartColorPalette = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722"];
const sparklineGradients = [['#222'], ['#42b3f4'], ['green', 'yellow', 'red']];

const conjTutorSystemMessage = [
  "You are an English grammar tutor.",
  "Return exactly:",
  "1. One concise paragraph explaining why the student's answer is wrong and how to fix it.",
  "",
  "2. Add one line saying exactly this: Write 'more' for more examples. Write 'oui'/'ja'/'si' for the same explanation in French/German/Italian.",
].join("\n");

// ----- Computed Functional Transformations Layout Properties -----
const isMobile = computed(() => smAndDown.value);

const healthTier = computed(() => {
  const score = userStore.healthScore ?? 0;
  for (const [tier, [min, max]] of Object.entries(HEALTH_TIERS)) {
    if (score >= min && score <= max) return tier;
  }
  return "Unknown";
});

const avgTimePerRound = computed(() => {
  const total = sessions.value.reduce((sum, s) => sum + s.avg_time_per_prompt, 0);
  return sessions.value.length > 0 ? (total / sessions.value.length).toFixed(1) : 0;
});

const totalRoundsPlayed = computed(() =>
  sessions.value.reduce((sum, s) => sum + s.rounds.filter((r: Round) => !r.typo).length, 0)
);

const totalTypos = computed(() =>
  sessions.value.reduce((sum, s) => sum + s.rounds.filter((r: Round) => r.typo).length, 0)
);

const totalCorrect = computed(() =>
  sessions.value.reduce((sum, s) => sum + s.rounds.filter((r: Round) => r.is_correct && !r.typo).length, 0)
);

const totalIncorrect = computed(() =>
  sessions.value.reduce((sum, s) => sum + s.rounds.filter((r: Round) => !r.is_correct && !r.typo).length, 0)
);

const totalRightWrongChartData = computed(() => {
  const total = totalRoundsPlayed.value;
  const correctPct = total > 0 ? Number(((totalCorrect.value / total) * 100).toFixed(0)) : 0;
  const incorrectPct = total > 0 ? Number(((totalIncorrect.value / total) * 100).toFixed(0)) : 0;
  return [
    { label: "Correct", value: correctPct },
    { label: "Incorrect", value: incorrectPct }
  ];
});

const sessionAccuracyTrend = computed(() => {
  return sessions.value
    .slice()
    .reverse()
    .map(s => s.total_rounds ? Number(((s.correct_count / s.total_rounds) * 100).toFixed(0)) : null)
    .filter((x): x is number => x !== null);
});

const incorrectAnswersData = computed(() => {
  return sessions.value.flatMap(s => (s.rounds || [])
    .filter(r => !r.is_correct && !r.typo)
    .map(r => ({
      user_answer: r.user_answer || "",
      verb: r.verb || "unknown",
      tense: r.tense || "unknown",
      person: r.person || "unknown",
      sentence_type: r.sentence_type || "unknown",
      acceptable_answers: r.acceptable_answers || [],
      prompt_number: r.prompt_number,
      session_id: s.session_id,
    }))
  );
});

const displayedPsVerbs = computed(() => getVerbsForKey(selectedPsOption.value));
const displayedPpVerbs = computed(() => getVerbsForKey(selectedPpOption.value));
const psFallbackMessage = computed(() => getVerbsForKey(selectedPsOption.value).length > 0 ? "" : "None! Great job!");
const ppFallbackMessage = computed(() => getVerbsForKey(selectedPpOption.value).length > 0 ? "" : "None! Great job!");

const pastSimpleOptionsWithCounts = computed(() => withCounts(pastSimpleOptions));
const presentPerfectOptionsWithCounts = computed(() => withCounts(presentPerfectOptions));

const cardStyle = computed(() => ({
  minWidth: xs.value ? "100%" : "300px",
  maxWidth: xs.value ? "100%" : "95%",
  marginLeft: xs.value ? "0px" : "15px",
  marginRight: xs.value ? "0px" : "15px",
}));

const tenseAccuracyData = computed(() => {
  const rList = sessions.value.flatMap(s => s.rounds ?? []);
  const tenseGroups: Record<string, { correct: number; total: number }> = {};
  for (const round of rList) {
    const tense = round.tense ?? "unknown";
    if (!tenseGroups[tense]) tenseGroups[tense] = { correct: 0, total: 0 };
    tenseGroups[tense].total += 1;
    if (round.is_correct) tenseGroups[tense].correct += 1;
  }
  return Object.entries(tenseGroups).map(([tense, stats], i) => ({
    label: tense,
    value: stats.total ? parseFloat(((stats.correct / stats.total) * 100).toFixed(0)) : 0,
    correct: stats.correct,
    total: stats.total,
    color: BarchartColorPalette[i % BarchartColorPalette.length],
  }));
});

const sentenceTypeAccuracyData = computed(() => {
  const rList = sessions.value.flatMap(s => s.rounds ?? []);
  const typeGroups: Record<string, { correct: number; total: number }> = {};
  for (const round of rList) {
    const type = round.sentence_type ?? "unknown";
    if (!typeGroups[type]) typeGroups[type] = { correct: 0, total: 0 };
    typeGroups[type].total += 1;
    if (round.is_correct) typeGroups[type].correct += 1;
  }
  return Object.entries(typeGroups).map(([type, stats], i) => ({
    label: type,
    value: stats.total ? parseFloat(((stats.correct / stats.total) * 100).toFixed(0)) : 0,
    correct: stats.correct,
    total: stats.total,
    color: BarchartColorPalette[i % BarchartColorPalette.length],
  }));
});

// ----- Observer Watchers Sync Layers -----
watch(() => lgAndUp.value, () => { gaugeKey.value++; });

// ----- Action Helper Methods Blocks -----
const showSnackbar = (text: string, color = 'success') => {
  snackbar.value = { text, color, show: true };
};

function parseKey(key: string): { tierName: string | null; field: VerbField | null } {
  if (key.startsWith('Discovered_') || key.startsWith('Mastered_')) {
    const field = (key.charAt(0).toLowerCase() + key.slice(1)) as VerbField;
    return { tierName: null, field };
  }
  const idx = key.indexOf('_');
  if (idx === -1) return { tierName: null, field: null };
  return { tierName: key.slice(0, idx), field: key.slice(idx + 1) as VerbField };
}

function getVerbsForKey(key: string): string[] {
  const { tierName, field } = parseKey(key);
  if (!field) return [];

  if (!tierName && (field.startsWith('discovered') || field.startsWith('mastered'))) {
    const stats = userStore.tenseStats as TenseStats | undefined;
    return stats && Array.isArray((stats as any)[field]) ? [...(stats as any)[field]] : [];
  }
  const tier = (userStore.tierStats || []).find((t: any) => t.tier_name === tierName);
  return tier && Array.isArray((tier as any)[field]) ? [...(tier as any)[field]] : [];
}

function withCounts(options: { key: string; label: string }[]) {
  return options.map(opt => {
    const count = getVerbsForKey(opt.key).length;
    return { ...opt, displayLabel: `${opt.label} (${count ?? 0})` };
  });
}

function generateSparklineLabels(arr: number[]): string[] {
  if (arr.length <= 8) return arr.map(val => `${val}%`);
  const lastIndex = arr.length - 1;
  const showIndices = [0, Math.floor(arr.length * 0.25), Math.floor(arr.length * 0.5), Math.floor(arr.length * 0.75), lastIndex];
  return arr.map((val, i) => showIndices.includes(i) ? `${val}%` : "\u00A0");
}

function pickRandomError() {
  if (!incorrectAnswersData.value.length) {
    currentError.value = null;
    return;
  }
  const idx = Math.floor(Math.random() * incorrectAnswersData.value.length);
  currentError.value = incorrectAnswersData.value[idx];
}

const nextError = () => { pickRandomError(); };

function nextMasteredVerb() {
  const verbsPs: string[] = userStore.tenseStats?.mastered_verbs_ps ?? [];
  const verbsPp: string[] = userStore.tenseStats?.mastered_verbs_pp ?? [];
  const allVerbs = [
    ...verbsPs.map(v => ({ verb: v, tense: "Past Simple" })),
    ...verbsPp.map(v => ({ verb: v, tense: "Present Perfect" }))
  ];

  if (!allVerbs.length) {
    currentMasteredVerb.value = null;
    return;
  }
  currentMasteredVerb.value = allVerbs[Math.floor(Math.random() * allVerbs.length)];
}

// ----- Async API Communication Sequencers -----
const fetchConjGameSessionsDashboardData = async (): Promise<void> => {
  loading.value = true;
  conjGameError.value = null;
  try {
    const params: any = {};
    if (userStore.isStaff) {
      params.student = userStore.studentId;
    }
    const response = await api.get<GameSession[]>("/conj-game-sessions/", { params });
    sessions.value = response.data;
  } catch (err: any) {
    console.error("Conjugator sessions load crashed:", err);
    conjGameError.value = "Failed to load conjugator timeline history datasets.";
  } finally {
    loading.value = false;
  }
};

const requestTypo = async (round: Round): Promise<void> => {
  if (typoRequests.value.has(round.id)) return;
  typoRequests.value.add(round.id);
  try {
    await api.patch(`/conj-game-rounds/${round.id}/request-typo/`, { typo_requested: true });
    round.typo_requested = true;
    round.typo_accepted = null;
    showSnackbar("Typo revision request logged.");
  } catch (err) {
    console.error(err);
    typoRequests.value.delete(round.id);
    showSnackbar("Failed to post classification flags.", "error");
  }
};

const acceptTypo = async (round: Round): Promise<void> => {
  try {
    await api.patch(`/conj-game-rounds/${round.id}/accept-typo/`);
    round.typo = true;
    round.is_correct = true;
    round.typo_requested = false;
    round.typo_accepted = true;
    showSnackbar("Typo baseline correction approved.");
  } catch (err) {
    console.error(err);
    showSnackbar("Moderation dispatch block error.", "error");
  }
};

const denyTypo = async (round: Round): Promise<void> => {
  try {
    await api.patch(`/conj-game-rounds/${round.id}/deny-typo/`);
    round.typo = false;
    round.typo_requested = false;
    round.typo_accepted = false;
    showSnackbar("Typo status overrule denied.");
  } catch (err) {
    console.error(err);
    showSnackbar("Failed to deny parameter.", "error");
  }
};

async function openConjRoundTutor(session: GameSession, round: Round) {
  tutorOpen.value = false;
  await nextTick();
  tutorContext.value = {
    game: "conjugation",
    session_id: session.session_id,
    started_at: session.started_at,
    prompt_number: round.prompt_number,
    verb: round.verb,
    person: round.person,
    tense: round.tense,
    sentence_type: round.sentence_type,
    student_answer: round.user_answer || "",
    acceptable_answers: round.acceptable_answers || [],
    elapsed_time: round.elapsed_time,
  };
  await nextTick();
  tutorOpen.value = true;
}

function buildConjTutorInitialUserMessage(ctx: any) {
  return [
    `verb=${ctx?.verb ?? ""}`,
    `person=${ctx?.person ?? ""}`,
    `tense=${ctx?.tense ?? ""}`,
    `sentence_type=${ctx?.sentence_type ?? ""}`,
    `Student answer: ${ctx?.student_answer ?? ""}`,
    `Acceptable answers: ${(ctx?.acceptable_answers ?? []).join(" / ")}`,
  ].filter(Boolean).join("\n");
}

// ----- Component Lifecycle Hooks -----
onMounted(async () => {
  try {
    await userStore.fetchUserData();
    await fetchConjGameSessionsDashboardData();
    userStore.fetchVerbUsageDashboardData?.();
    
    const validTab = typeof route.query.tab === "string" && tabItems.some(t => t.value === route.query.tab);
    activeTab.value = validTab ? (route.query.tab as string) : tabItems[0].value;
    
    pickRandomError();
    nextMasteredVerb();
    notificationStore.checkNow?.();
  } catch (initErr) {
    console.error("Dashboard primary boot context failure:", initErr);
  }
});
</script>

<style scoped>
.max-w-container {
  max-width: 1440px;
  margin: 0 auto;
}

.chart-card {
  min-height: 440px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff !important;
}

.custom-dashboard-tabs {
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.custom-dashboard-tabs :deep(.v-tab--selected) {
  background-color: #ffffff !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.bg-grey-fluid {
  background-color: #f8fafc !important;
}

.border-light {
  border: 1px solid #e2e8f0 !important;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03) !important;
}

/* Scoped Panels Functional Themes definitions */
.bg-amber-panel {
  background-color: #fffbeb !important;
  border: 1px solid rgba(217, 119, 6, 0.2) !important;
}
.text-amber-header { color: #78350f !important; }
.text-amber-icon { color: #d97706 !important; }
.text-amber-subtitle { color: #b45309 !important; }
.border-amber { border-color: rgba(217, 119, 6, 0.15) !important; }
.border-amber-light { border-color: rgba(217, 119, 6, 0.1) !important; }

.bg-teal-panel {
  background-color: #f0fdf4 !important;
  border: 1px solid rgba(13, 148, 136, 0.2) !important;
}
.text-teal-header { color: #115e59 !important; }
.text-teal-icon { color: #0d9488 !important; }
.text-teal-subtitle { color: #0f766e !important; }
.border-teal { border-color: rgba(13, 148, 136, 0.15) !important; }
.border-teal-light { border-color: rgba(13, 148, 136, 0.1) !important; }

.font-code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

.text-error-underlined {
  font-weight: 700;
}

.max-h-dictionary {
  max-height: 110px;
}

.max-h-summary-scroller {
  max-height: 480px;
}

.card-fixed {
  height: 560px !important;
}

.custom-scroll-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.historical-panels :deep(.v-expansion-panel-title) {
  padding: 14px 20px !important;
  background-color: #ffffff;
}

.border-panel-item {
  border: 1px solid #e2e8f0 !important;
  box-shadow: none !important;
  overflow: hidden;
}

.custom-data-table {
  border-radius: 0 0 8px 8px !important;
  overflow: hidden;
}

.max-w-text {
  max-width: 220px;
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }

.italic-label { font-style: italic; }
.break-word { word-break: break-all; }

.fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile responsive alignment hacks overrides */
@media (max-width: 600px) {
  .chart-card {
    min-height: auto !important;
    margin-bottom: 12px;
  }
  .text-h4 { font-size: 1.5rem !important; }
  .text-h5 { font-size: 1.2rem !important; }
}
</style>