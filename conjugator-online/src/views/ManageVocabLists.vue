<template>
  <v-container fluid class="mt-5 pa-4 px-6 max-width-management-container">
<v-row class="mb-6 d-flex align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-icon icon="mdi-bookshelf" color="indigo" class="mr-5" />
          Manage Vocab Lists
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Create, edit, and publish your vocab lists.
        </p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right d-flex justify-end align-center gap-2 flex-wrap">
        <v-btn
          color="indigo-darken-1"
          size="large"
          class="text-white font-weight-black rounded-xl text-none px-5 me-8"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Create New List
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="py-12 text-center justify-center">
      <v-progress-circular indeterminate size="50" color="indigo" width="4" />
    </v-row>

    <v-row v-else-if="vocabLists.length === 0" class="justify-center py-12">
      <v-col cols="12" max-width="500" class="text-center">
        <v-avatar color="indigo-lighten-5" size="80" class="mb-4">
          <v-icon icon="mdi-cloud-upload-outline" color="indigo" size="40" />
        </v-avatar>
        <h3 class="text-h6 font-weight-bold text-slate-700">No Vocab Lists Found</h3>
        <p class="text-caption text-slate-400 mt-1 mb-4">
          You haven't uploaded or built any customized list tracks yet.
        </p>
        <v-btn
          color="indigo"
          variant="elevated"
          class="text-white font-weight-black rounded-lg text-none"
          @click="openCreateDialog"
        >
          Get Started
        </v-btn>
      </v-col>
    </v-row>

    <!-- MAIN INTERFACE START -->
    <v-row v-else>
      <v-col cols="12">
        <v-tabs v-model="activeManagementTab" color="indigo" class="mb-6 border-b border-slate-200">
          <v-tab value="categories" class="font-weight-black text-none">
            <v-icon icon="mdi-folder-multiple-outline" class="mr-2" />
            By Category
          </v-tab>
          <v-tab value="courses" class="font-weight-black text-none">
            <v-icon icon="mdi-school-outline" class="mr-2" />
            By Course
          </v-tab>
        </v-tabs>

        <v-window v-model="activeManagementTab">
          
          <v-window-item value="categories">
            <v-expansion-panels multiple variant="accordion">
              <v-expansion-panel
                v-for="group in groupedVocabLists"
                :key="group.category"
                class="mb-3 rounded-xl overflow-hidden"
              >
                <v-expansion-panel-title class="bg-slate-50">
                  <div class="d-flex align-center justify-space-between w-100 pr-4">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-folder-multiple-outline" color="indigo" class="mr-3" />
                      <div>
                        <div class="font-weight-black text-slate-800">
                          {{ group.category }}
                        </div>
                        <div class="text-caption text-slate-500">
                          {{ group.items.length }} list{{ group.items.length === 1 ? '' : 's' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="bg-white">
                  <v-table class="text-left font-sans text-body-2">
                    <thead class="bg-slate-50 border-b border-slate-200 text-overline font-weight-bold text-slate-400 tracking-wider">
                      <tr>
                        <th class="pa-4">List Name</th>
                        <th class="pa-4">Category</th>
                        <th class="pa-4 text-center">Total Terms</th>
                        <th class="pa-4 text-center">Available To</th>
                        <th class="pa-4 text-right"><span class="me-3">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="list in group.items"
                        :key="list.id"
                        class="hover-row border-b border-slate-100"
                      >
                        <td class="pa-4 font-weight-bold text-slate-800">
                          {{ list.name }}
                          <span class="text-xxs text-slate-400 font-weight-regular block mt-0.5 font-monospace">
                            {{ list.id }}
                          </span>
                        </td>

                        <td class="pa-4">
                          <v-chip
                            size="small"
                            color="indigo-lighten-5"
                            class="font-weight-bold font-monospace text-indigo-darken-3"
                          >
                            {{ list.domain || 'UNASSIGNED' }}
                          </v-chip>
                        </td>

                        <td class="pa-4 text-center font-weight-black font-monospace text-slate-700">
                          {{ list.item_count }}
                        </td>

                        <td class="pa-4 text-center">
                          <v-btn
                            size="small"
                            variant="tonal"
                            color="indigo"
                            class="rounded-lg font-weight-bold text-none text-xs px-3"
                            prepend-icon="mdi-account-group-outline"
                            @click="openAvailabilityConsole(list)"
                          >
                            {{ list.availabilities?.length || 0 }} Target(s)
                          </v-btn>
                        </td>

                        <td class="pa-4 text-right">
                          <v-btn
                            icon="mdi-eye"
                            variant="elevated"
                            size="small"
                            color="grey-lighten-2"
                            class="text-black-lighten-2 mr-2"
                            @click="openViewListDialog(list)"
                            title="View List"
                          />
                          <v-btn
                            icon="mdi-file-pdf-box"
                            variant="elevated"
                            size="small"
                            color="deep-purple-darken-2"
                            class="text-white mr-2"
                            :loading="pdfLoadingListId === list.id"
                            @click="downloadListPdf(list)"
                            title="Download PDF"
                          />
                          <v-btn
                            icon="mdi-pencil"
                            variant="elevated"
                            size="small"
                            color="amber-darken-2"
                            class="text-white mr-2"
                            @click="openEditListDialog(list)"
                            title="Edit List Content"
                          />
                          <v-btn
                            icon="mdi-trash-can-outline"
                            variant="elevated"
                            size="small"
                            color="error"
                            class="me-3"
                            @click="confirmDeleteList(list)"
                            title="Delete List"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-window-item>

          <v-window-item value="courses">
            <v-expansion-panels multiple variant="accordion">
              <v-expansion-panel
                v-for="courseGroup in vocabListsByCourse"
                :key="courseGroup.slug"
                class="mb-3 rounded-xl overflow-hidden"
              >
                <v-expansion-panel-title class="bg-slate-50">
                  <div class="d-flex align-center justify-space-between w-100 pr-4">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-school" color="indigo" class="mr-3" />
                      <div>
                        <div class="font-weight-black text-slate-800">
                          Course: {{ courseGroup.slug.toUpperCase() }}
                        </div>
                        <div class="text-caption text-slate-500">
                          {{ courseGroup.items.length }} list{{ courseGroup.items.length === 1 ? '' : 's' }} made available
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="bg-white">
                  <v-table v-if="courseGroup.items.length" class="text-left font-sans text-body-2">
                    <thead class="bg-slate-50 border-b border-slate-200 text-overline font-weight-bold text-slate-400 tracking-wider">
                      <tr>
                        <th class="pa-4">List Name</th>
                        <th class="pa-4">Original Category</th>
                        <th class="pa-4 text-center">Total Terms</th>
                        <th class="pa-4 text-right"><span class="me-3">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="list in courseGroup.items" :key="list.id" class="hover-row border-b border-slate-100">
                        <td class="pa-4 font-weight-bold text-slate-800">{{ list.name }}</td>
                        <td class="pa-4">
                          <v-chip size="small" color="indigo-lighten-5" class="font-weight-bold font-monospace text-indigo-darken-3">
                            {{ list.domain || 'UNASSIGNED' }}
                          </v-chip>
                        </td>
                        <td class="pa-4 text-center font-weight-black font-monospace text-slate-700">
                          {{ list.item_count }}
                        </td>
                        <td class="pa-4 text-right">
                          <v-btn
                            size="small"
                            variant="tonal"
                            color="indigo"
                            class="rounded-lg font-weight-bold text-none text-xs px-3 me-3"
                            prepend-icon="mdi-account-group-outline"
                            @click="openAvailabilityConsole(list)"
                          >
                            Manage Access
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div v-else class="pa-10 text-center text-slate-400 text-caption">
                    <v-icon icon="mdi-shield-lock-outline" class="mb-2 text-slate-300 block mx-auto" size="24" />
                    No vocabulary lists have been published to this course track yet.
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-window-item>

        </v-window>
      </v-col>
    </v-row>

    <!-- CREATE / EDIT DIALOG -->
    <v-dialog v-model="createDialog" fullscreen persistent>
      <v-card class="bg-slate-50 d-flex flex-column fill-height">
        <v-toolbar color="slate-900" class="text-grey-darken-2 px-2">
          <v-btn icon="mdi-close" color="grey-darken-2" variant="text" @click="closeCreateDialog" />
          <v-toolbar-title class="font-weight-black">
            {{ isEditMode ? 'Modify Vocabulary List' : 'Create a Vocabulary List' }}
          </v-toolbar-title>
          <div class="text-caption text-slate-300 mr-4 hidden-sm-and-down">
            Configure list name, add items, upload CSV data, and attach images.
          </div>
        </v-toolbar>

        <div class="editor-shell">
          <div class="editor-main">
            <v-card flat class="rounded-xl bg-white border border-slate-200 mb-5">
              <v-card-text class="pa-5">
                <h3 class="text-overline font-weight-black text-indigo tracking-wider mb-3">
                  1. List name and category
                </h3>

                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formMetadata.name"
                      label="List Name"
                      placeholder="e.g., Engine Components Tier 1"
                      variant="outlined"
                      density="comfortable"
                      class="bg-white rounded-lg"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formMetadata.domain"
                      label="Category"
                      placeholder="e.g., Chemistry, Automotive, Hospitality"
                      variant="outlined"
                      density="comfortable"
                      class="bg-white rounded-lg"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card flat class="rounded-xl bg-white border border-slate-200">
              <v-card-text class="pa-5">
                <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-3">
                  <div>
                    <h3 class="text-overline font-weight-black text-indigo tracking-wider mb-1">
                      2. List Items
                    </h3>
                    <div class="text-caption text-slate-500">
                      Add rows manually or import a CSV file.
                    </div>
                  </div>

                  <v-tabs
                    v-model="activeIngestTab"
                    color="indigo"
                    align-tabs="start"
                    class="editor-tabs"
                  >
                    <v-tab value="manual" class="font-weight-black text-none">Add Items by Row</v-tab>
                    <v-tab value="csv" class="font-weight-black text-none">Import CSV Data</v-tab>
                  </v-tabs>
                </div>

                <v-window v-model="activeIngestTab">
                  <v-window-item value="manual">
                    <div class="d-flex justify-space-between align-center mb-4 flex-wrap ga-3">
                      <div class="text-caption text-slate-500">
                        {{ manualRows.length }} item{{ manualRows.length === 1 ? '' : 's' }} currently staged
                      </div>
                      <v-btn
                        variant="elevated"
                        color="indigo-darken-1"
                        class="text-white font-weight-black rounded-xl text-none"
                        prepend-icon="mdi-plus"
                        @click="appendNewEmptyWizardRow"
                      >
                        Add New Vocabulary Item
                      </v-btn>
                    </div>

                    <div class="manual-grid">
                      <v-card
                        v-for="(row, idx) in manualRows"
                        :key="idx"
                        variant="flat"
                        border
                        class="pa-4 rounded-xl bg-white border-slate-200 shadow-sm hover-row"
                      >
                        <div class="manual-row-card">
                          <div class="manual-row-index">
                            <v-chip size="small" color="indigo" variant="flat" class="font-monospace">
                              {{ idx + 1 }}
                            </v-chip>
                          </div>

                          <div class="manual-row-content">
                            <div class="font-weight-black text-slate-800 text-subtitle-2 text-wrap">
                              {{ row.term || '(Empty Word)' }}
                            </div>

                            <div class="text-caption text-slate-500 mt-1 text-wrap">
                              {{ row.definition || 'No description prompt assigned yet.' }}
                            </div>

                            <div v-if="row.context_usage" class="text-caption text-slate-400 mt-2 text-wrap">
                              <strong>Context:</strong> {{ row.context_usage }}
                            </div>

                            <div class="manual-row-meta mt-3">
                              <v-chip
                                size="x-small"
                                color="slate-200"
                                class="text-uppercase font-weight-bold"
                              >
                                {{ row.part_of_speech || 'noun' }}
                              </v-chip>

                              <div v-if="row.imagePreview || row.image_url" class="manual-image-status">
                                <img
                                  :src="row.imagePreview || row.image_url"
                                  alt="Vocabulary item thumbnail"
                                  class="row-thumb-img"
                                />
                                <v-chip
                                  size="x-small"
                                  color="success"
                                  class="font-weight-bold"
                                  prepend-icon="mdi-image"
                                >
                                  Photo Added
                                </v-chip>
                              </div>

                              <v-chip
                                v-else
                                size="x-small"
                                color="slate-100"
                                class="text-slate-400"
                              >
                                No Image
                              </v-chip>

                              <v-chip
                                v-if="row.French || row.German || row.Italian"
                                size="x-small"
                                color="indigo-lighten-5"
                                class="font-weight-bold text-indigo-darken-3"
                              >
                                Translations Present
                              </v-chip>
                            </div>
                          </div>

                          <div class="manual-row-actions">
                            <v-btn
                              icon="mdi-pencil"
                              size="small"
                              color="indigo"
                              class="text-white"
                              variant="elevated"
                              @click="launchRowWizard(idx)"
                              title="Edit Card Parameters"
                            />
                            <v-btn
                              icon="mdi-close"
                              size="small"
                              color="error"
                              variant="elevated"
                              :disabled="manualRows.length === 1 && !isEditMode"
                              @click="removeManualRow(idx)"
                            />
                          </div>
                        </div>
                      </v-card>
                    </div>
                  </v-window-item>

                  <v-window-item value="csv">
                    <v-alert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                      border="start"
                      color="indigo"
                    >
                      <div class="font-weight-bold mb-2">CSV format requirements</div>
                      <div class="text-body-2">
                        Required headers: <code>term</code>, <code>definition</code><br />
                        Optional headers:
                        <code>part_of_speech</code>,
                        <code>context_usage</code>,
                        <code>French</code>,
                        <code>German</code>,
                        <code>Italian</code>,
                        <code>multiple_choice</code><br />
                        Every row must include a non-empty <code>term</code> and <code>definition</code>.<br />
                        If a value contains commas, wrap it in double quotes.
                      </div>
                    </v-alert>

                    <v-alert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                      border="start"
                    >
                      <div class="font-weight-bold mb-2">Example CSV</div>
                      <pre class="csv-example mb-0">term,definition,part_of_speech,context_usage,French,German,Italian,multiple_choice
evaporate,change from liquid to vapor,verb,The water began to evaporate in the heat.,évaporer,verdampfen,evaporare,"condense, freeze, dissolve"
camshaft,a shaft in an engine that controls valve timing,noun,The mechanic replaced the camshaft during the repair.,arbre à cames,Nockenwelle,albero a camme,"piston, gearbox, radiator"</pre>
                    </v-alert>

                    <v-alert
                      v-if="csvValidationErrors.length"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                      border="start"
                    >
                      <div class="font-weight-bold mb-2">CSV validation errors</div>
                      <ul class="pl-4 mb-0">
                        <li v-for="(error, index) in csvValidationErrors" :key="index">
                          {{ error }}
                        </li>
                      </ul>
                    </v-alert>

                    <v-row class="my-4 align-center" dense>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="csvDelimiter"
                          :items="[
                            { title: 'Comma ( , )', value: ',' },
                            { title: 'Semicolon ( ; )', value: ';' },
                            { title: 'Tab Symbol ( \\t )', value: '\t' }
                          ]"
                          label="Choose the CSV delimiter used in your file"
                          variant="outlined"
                          density="comfortable"
                          class="bg-white rounded-lg"
                          hide-details
                          @update:model-value="reprocessCurrentCsv"
                        />
                      </v-col>

                      <v-col cols="12" md="8" class="text-md-right">
                        <v-btn
                          color="deep-purple-darken-1"
                          variant="tonal"
                          class="font-weight-black rounded-lg text-none"
                          prepend-icon="mdi-content-copy"
                          @click="copySuggestedAiPrompt"
                        >
                          Suggested AI Prompt
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-card
                      variant="flat"
                      border
                      class="pa-8 rounded-xl bg-white text-center border-dashed border-slate-300 d-flex flex-column align-center justify-center file-dropzone"
                      :class="{ 'dropzone-active': dragActive }"
                      @dragover.prevent="dragActive = true"
                      @dragleave.prevent="dragActive = false"
                      @drop.prevent="handleFileDrop"
                    >
                      <v-avatar color="indigo-lighten-5" size="56" class="mb-3">
                        <v-icon icon="mdi-file-delimited-outline" color="indigo" size="28" />
                      </v-avatar>

                      <div class="text-subtitle-2 font-weight-bold text-slate-700">
                        Drag & Drop your <span class="text-indigo">CSV</span> file here
                      </div>

                      <div class="text-caption text-slate-400 mt-0.5 mb-4">
                        Accepts (.csv) only
                      </div>

                      <input
                        type="file"
                        ref="fileInputRef"
                        accept=".csv"
                        class="d-none"
                        @change="handleFileSelect"
                      />

                      <v-btn
                        color="indigo"
                        size="small"
                        variant="elevated"
                        class="text-white font-weight-bold rounded-lg text-none"
                        @click="triggerCsvFilePicker"
                      >
                        Browse Local Storage
                      </v-btn>

                      <div
                        v-if="uploadedFile"
                        class="mt-4 pa-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-monospace font-weight-bold d-flex align-center"
                      >
                        <v-icon icon="mdi-check-circle" size="small" class="mr-1" />
                        Staged File: {{ uploadedFile.name }} (Estimated items parsed: {{ manualRows.length }})
                      </div>
                    </v-card>
                  </v-window-item>

                </v-window>
              </v-card-text>
            </v-card>
          </div>

          <div class="editor-sidebar">
            <v-card flat class="rounded-xl bg-white border border-slate-200 sticky-sidebar-card">
              <v-card-text class="pa-5">
                <div class="text-overline font-weight-black text-indigo tracking-wider mb-3">
                  Summary
                </div>

                <div class="summary-stat">
                  <span class="summary-label">Mode</span>
                  <span class="summary-value">{{ isEditMode ? 'Edit Existing List' : 'Create New List' }}</span>
                </div>

                <div class="summary-stat">
                  <span class="summary-label">Category</span>
                  <span class="summary-value">{{ formMetadata.domain || 'UNASSIGNED' }}</span>
                </div>

                <div class="summary-stat">
                  <span class="summary-label">Items Staged</span>
                  <span class="summary-value">{{ manualRows.length }}</span>
                </div>

                <div class="summary-stat">
                  <span class="summary-label">Rows With Images</span>
                  <span class="summary-value">{{ imageCount }}</span>
                </div>

                <div class="summary-stat">
                  <span class="summary-label">CSV Errors</span>
                  <span class="summary-value text-error">{{ csvValidationErrors.length }}</span>
                </div>

                <v-divider class="my-4" />

                <v-btn
                  block
                  color="success"
                  size="large"
                  class="text-white font-weight-black rounded-xl text-none mb-3"
                  :loading="submitting"
                  @click="submitVocabCurriculum"
                >
                  {{ isEditMode ? 'Save Modifications' : 'Save Dataset' }}
                </v-btn>

                <v-btn
                  block
                  variant="outlined"
                  color="slate-600"
                  class="font-weight-black rounded-xl text-none"
                  @click="closeCreateDialog"
                >
                  Cancel
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- VIEW DIALOG -->
    <v-dialog v-model="viewDialog" fullscreen>
      <v-card class="bg-slate-50 d-flex flex-column fill-height">
        <v-toolbar color="indigo-darken-2" class="text-white px-2">
          <v-btn icon="mdi-close" color="white" variant="text" @click="closeViewDialog" />
          <v-toolbar-title class="font-weight-black">
            View Vocabulary List
          </v-toolbar-title>
        </v-toolbar>

        <div class="pa-6 overflow-auto fill-height" v-if="selectedListForView">
          <v-card class="rounded-xl bg-white border border-slate-200 mb-5" flat>
            <v-card-text class="pa-5">
              <div class="d-flex flex-wrap justify-space-between ga-4">
                <div>
                  <div class="text-h6 font-weight-black text-slate-800">
                    {{ selectedListForView.name }}
                  </div>
                  <div class="text-caption text-slate-500 mt-1">
                    Category:
                    <strong>{{ selectedListForView.domain || 'UNASSIGNED' }}</strong>
                  </div>
                  <div class="text-caption text-slate-400 mt-1 font-monospace">
                    {{ selectedListForView.id }}
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-caption text-slate-500">
                    Total Terms: <strong>{{ selectedListItems.length }}</strong>
                  </div>
                  <div class="text-caption text-slate-500">
                    Created: <strong>{{ formatDate(selectedListForView.created_at) }}</strong>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <div class="view-grid">
            <v-card
              v-for="(item, index) in selectedListItems"
              :key="item.id || index"
              flat
              class="rounded-xl bg-white border border-slate-200"
            >
              <v-card-text class="pa-3">
                <div class="view-item-row">
                  <div class="view-item-num">
                    <v-chip size="x-small" color="indigo" variant="flat" class="font-monospace">
                      {{ index + 1 }}
                    </v-chip>
                  </div>

                  <div class="view-item-term">
                    <div class="font-weight-black text-slate-800 text-subtitle-2">
                      {{ item.term }}
                    </div>
                    <div class="text-caption text-slate-400 mt-0.5">
                      {{ item.part_of_speech || 'noun' }}
                    </div>
                  </div>

                  <div class="view-item-definition">
                    <div class="text-body-2 text-slate-700">
                      {{ item.definition }}
                    </div>
                    <div v-if="item.context_usage" class="text-caption text-slate-400 mt-1">
                      <em>{{ item.context_usage }}</em>
                    </div>
                  </div>

                  <div class="view-item-translations">
                    <div class="d-flex flex-wrap ga-1 mb-1">
                      <v-chip
                        v-if="item.additional_data?.French"
                        size="x-small"
                        color="blue-lighten-5"
                        class="font-weight-bold"
                      >
                        FR: {{ item.additional_data.French }}
                      </v-chip>
                      <v-chip
                        v-if="item.additional_data?.German"
                        size="x-small"
                        color="green-lighten-5"
                        class="font-weight-bold"
                      >
                        DE: {{ item.additional_data.German }}
                      </v-chip>
                      <v-chip
                        v-if="item.additional_data?.Italian"
                        size="x-small"
                        color="amber-lighten-5"
                        class="font-weight-bold"
                      >
                        IT: {{ item.additional_data.Italian }}
                      </v-chip>
                    </div>
                    <div
                      v-if="item.additional_data?.multiple_choice?.length"
                      class="text-caption text-slate-400"
                    >
                      <strong>Decoys:</strong> {{ item.additional_data.multiple_choice.join(", ") }}
                    </div>
                  </div>

                  <div class="view-item-image">
                    <div v-if="item.image_url" class="view-thumb-wrap">
                      <img
                        :src="item.image_url"
                        alt="Vocabulary illustration"
                        class="view-thumb-img"
                      />
                    </div>
                    <div v-else class="view-thumb-empty">
                      <v-icon icon="mdi-image-off-outline" color="slate-300" size="20" />
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- WIZARD DIALOG -->
    <v-dialog v-model="wizardDialog" fullscreen persistent>
      <v-card class="bg-slate-50 d-flex flex-column fill-height">
        <v-toolbar color="indigo" class="text-white px-2">
          <v-btn icon="mdi-close" color="white" variant="text" size="small" @click="closeWizardDialog" />
          <v-toolbar-title class="font-weight-black">
            Configure Vocabulary Card #{{ activeWizardIndex + 1 }}
          </v-toolbar-title>
        </v-toolbar>

        <div class="pa-6 overflow-auto fill-height" v-if="wizardRowData">
          <v-row dense class="wizard-form-grid">
            <v-col cols="12" md="8">
              <v-card class="rounded-xl bg-white border border-slate-200 mb-4" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Core Fields
                  </div>

                  <v-row dense>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="wizardRowData.term"
                        label="Term (Target Word)"
                        placeholder="e.g., camshaft"
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select
                        v-model="wizardRowData.part_of_speech"
                        :items="['noun', 'verb', 'phrasal verb', 'adjective', 'adverb', 'determiner', 'pronoun', 'preposition', 'linking word', 'expression']"
                        label="Part of Speech"
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="wizardRowData.definition"
                        label="Definition"
                        placeholder="Enter the core meaning, explanatory prompt, or training definition..."
                        rows="4"
                        auto-grow
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="wizardRowData.context_usage"
                        label="Example Sentence for Context (Optional)"
                        placeholder="Provide an example sentence showing realistic usage..."
                        rows="4"
                        auto-grow
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="rounded-xl bg-white border border-slate-200 mb-4" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Translations
                  </div>

                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="wizardRowData.French"
                        label="French"
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="wizardRowData.German"
                        label="German"
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="wizardRowData.Italian"
                        label="Italian"
                        variant="outlined"
                        density="comfortable"
                        class="bg-white rounded-lg"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="rounded-xl bg-white border border-slate-200" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Synonyms (Optional)
                  </div>

                  <v-text-field
                    v-model="wizardRowData.synonyms"
                    label="Synonyms"
                    placeholder="Enter synonyms separated by commas (these words will be considered correct alternative answers in assessments)"
                    variant="outlined"
                    density="comfortable"
                    class="bg-white rounded-lg"
                    prepend-inner-icon="mdi-layers-triple-outline"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
            <v-card class="rounded-xl bg-white border border-slate-200" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Comment on Usage (Optional)
                  </div>

                  <v-text-field
                    v-model="wizardRowData.comment"
                    label="Comment"
                    placeholder="Enter a comment on usage (optional)"
                    variant="outlined"
                    density="comfortable"
                    class="bg-white rounded-lg"
                    prepend-inner-icon="mdi-layers-triple-outline"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="rounded-xl bg-white border border-slate-200" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Multiple Choice Decoys
                  </div>

                  <v-text-field
                    v-model="wizardRowData.multiple_choice"
                    label="Wrong answers for multiple choice"
                    placeholder="Enter values separated by commas (e.g., crankshaft, wheel, cylinder)"
                    variant="outlined"
                    density="comfortable"
                    class="bg-white rounded-lg"
                    prepend-inner-icon="mdi-layers-triple-outline"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="rounded-xl bg-white border border-slate-200 sticky-sidebar-card" flat>
                <v-card-text class="pa-5">
                  <div class="text-overline font-weight-black text-slate-400 tracking-wider mb-4">
                    Image
                  </div>

                  <div class="wizard-image-panel">
                    <div class="wizard-large-preview border rounded-xl overflow-hidden bg-slate-50 d-flex align-center justify-center mb-4">
                      <v-img v-if="wizardRowData.imagePreview" :src="wizardRowData.imagePreview" cover class="fill-height" />
                      <v-img v-else-if="wizardRowData.image_url" :src="wizardRowData.image_url" cover class="fill-height" />
                      <v-icon v-else icon="mdi-image-off-outline" color="slate-300" size="64" />
                    </div>

                    <v-btn
                      block
                      color="indigo"
                      size="large"
                      variant="tonal"
                      class="font-weight-black text-none mb-3"
                      prepend-icon="mdi-camera-plus"
                      @click="triggerWizardFileInput"
                    >
                      {{ wizardRowData.imagePreview || wizardRowData.image_url ? 'Change Image Asset' : 'Select Illustration' }}
                    </v-btn>

                    <input
                      type="file"
                      ref="wizardFileInputRef"
                      accept="image/*"
                      class="d-none"
                      @change="handleWizardImageSelect"
                    />

                    <v-btn
                      block
                      color="success"
                      size="large"
                      class="text-white font-weight-black rounded-lg text-none"
                      @click="saveWizardRowContext"
                    >
                      Commit Changes
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>

    <!-- DELETE DIALOG -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-4 rounded-xl text-center bg-white">
        <v-avatar color="rose-50" size="56" class="mx-auto mb-3">
          <v-icon icon="mdi-alert" color="error" size="28" />
        </v-avatar>
        <h3 class="text-h6 font-weight-bold text-slate-800">Confirm Deletion</h3>
        <p class="text-caption text-slate-400 mt-1 mb-6">
          Are you absolutely sure you want to delete
          <strong>{{ selectedListForDelete?.name }}</strong>?
          This action cascades down and wipes out all associated items instantly.
        </p>
        <div class="d-flex ga-3">
          <v-btn
            variant="flat"
            color="slate-100"
            class="flex-grow-1 font-weight-bold rounded-lg text-none"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="error"
            class="flex-grow-1 text-white font-weight-bold rounded-lg text-none"
            @click="executeListDeletion"
          >
            Wipe Record
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="availabilityConsoleDialog" max-width="640" persistent scrollable>
      <v-card class="rounded-xl bg-surface text-left overflow-hidden">
        <v-toolbar color="indigo" dark class="px-4 py-2">
          <v-toolbar-title class="text-white font-weight-black d-flex flex-column">
            <span class="text-h6 font-weight-black tracking-tight">
              Publish a list: {{ selectedListForAvailability?.name || 'Loading...' }}
            </span>
          </v-toolbar-title>
          
          <v-spacer />
          
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            color="white" 
            @click="closeAvailabilityConsole" 
          />
        </v-toolbar>

        <v-card-text class="pa-6 bg-slate-50" style="max-height: 60vh;">
          <h3 class="text-overline font-weight-black text-indigo tracking-wider mb-3">Make "{{ selectedListForAvailability?.name || 'Loading...' }}" visible to students</h3>
          <v-row dense class="align-center mb-6">
            <v-col cols="12" sm="5">
              <v-select
                v-model="newAvailabilityScopeType"
                :items="[{title: 'Entire Course', value: 'course'}, {title: 'Individual Student', value: 'student'}]"
                label="Target"
                variant="outlined"
                density="compact"
                hide-details
                class="bg-white rounded-lg"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-select
                v-if="newAvailabilityScopeType === 'course'"
                v-model="newAvailabilityTargetId"
                :items="availableCourses"
                item-title="slug"
                item-value="slug"
                label="Select Course"
                variant="outlined"
                density="compact"
                hide-details
                class="bg-white rounded-lg"
              />
              <v-select
                v-else
                v-model="newAvailabilityTargetId"
                :items="availableStudents"
                :item-title="s => `${s.initials} (${s.web_id})`"
                item-value="id"
                label="Select Student"
                variant="outlined"
                density="compact"
                hide-details
                class="bg-white rounded-lg"
              />
            </v-col>
            <v-col cols="12" sm="2" class="text-sm-right">
              <v-btn
                color="indigo"
                block
                height="40"
                class="text-white font-weight-black rounded-lg text-none"
                prepend-icon="mdi-plus"
                :disabled="!newAvailabilityTargetId"
                :loading="availabilityActionLoading"
                @click="submitNewAvailabilityRule"
              >
                Grant
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-4 border-slate-200" />

          <h3 class="text-overline font-weight-black text-slate-500 tracking-wider mb-3">"{{ selectedListForAvailability?.name || 'Loading...' }}" is available to:</h3>
          
          <v-row v-if="availabilityListLoading" class="justify-center py-6">
            <v-progress-circular indeterminate color="indigo" size="24" />
          </v-row>

          <div v-else-if="!currentAvailabilities.length" class="text-center py-8 text-slate-400 text-caption bg-white border border-dashed rounded-xl border-slate-300">
            <v-icon icon="mdi-shield-lock-outline" size="28" class="mb-2 text-slate-300 block mx-auto" />
            This list is completely unassigned. Only you can view this custom dataset.
          </div>

          <div v-else class="d-flex flex-column ga-2">
            <v-card v-for="rule in currentAvailabilities" :key="rule.id" variant="flat" border class="pa-3 rounded-xl bg-white border-slate-200 shadow-sm">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-avatar :color="rule.course ? 'indigo-lighten-5' : 'emerald-lighten-5'" size="36" class="me-3">
                    <v-icon :icon="rule.course ? 'mdi-school' : 'mdi-account'" :color="rule.course ? 'indigo' : 'emerald'" size="18" />
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-slate-800 text-sm">
                      {{ rule.course ? `Course Track: ${rule.course}` : `Student: ${rule.student_initials} (${rule.student_web_id})` }}
                    </div>
                    <div class="text-xxs text-slate-400 font-monospace">Vocab list successfully made available!</div>
                  </div>
                </div>
                <v-btn
                  icon="mdi-delete-outline"
                  variant="text"
                  color="error"
                  size="small"
                  :loading="availabilityActionLoading"
                  @click="removeAvailabilityRule(rule.id)"
                />
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import api from "@/axios"
import { exportVocabListPdf } from "@/utils/vocabListPdf"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()

const vocabLists = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)

const createDialog = ref(false)
const deleteDialog = ref(false)
const wizardDialog = ref(false)
const viewDialog = ref(false)

const availabilityConsoleDialog = ref(false)
const availabilityListLoading = ref(false)
const availabilityActionLoading = ref(false)
const selectedListForAvailability = ref<any>(null)

const currentAvailabilities = ref<any[]>([])
const availableCourses = computed(() => userStore.availableTeacherCourses)
const availableStudents = computed(() => userStore.availableTeacherStudents)

const newAvailabilityScopeType = ref<"course" | "student">("course")
const newAvailabilityTargetId = ref<string | null>(null)

const dragActive = ref(false)
const activeIngestTab = ref("manual")
const uploadedFile = ref<File | null>(null)

const selectedListForDelete = ref<any>(null)
const selectedListForView = ref<any>(null)
const selectedListItems = ref<any[]>([])

const fileInputRef = ref<HTMLInputElement | null>(null)
const wizardFileInputRef = ref<HTMLInputElement | null>(null)

const isEditMode = ref(false)
const editingListId = ref<string | null>(null)
const deletedItemIdsOnEdit = ref<string[]>([])

const csvDelimiter = ref(",")
const csvValidationErrors = ref<string[]>([])

const activeWizardIndex = ref(0)
const wizardRowData = ref<ManualVocabRow | null>(null)

const formMetadata = reactive({ name: "", domain: "" })

const pdfLoadingListId = ref<string | null>(null)

// SEARCH FOR YOUR TOP-LEVEL COMPONENT STATE VARIABLES, AND ADD:
const activeManagementTab = ref("categories")
  
interface ManualVocabRow {
  id?: string
  term: string
  definition: string
  part_of_speech: string
  context_usage: string
  French: string
  German: string
  Italian: string
  multiple_choice: string   
  synonyms?: string | null
  comment?: string | null
  imageFile: File | null
  imagePreview: string
  image_url?: string
  past_simple?: string
  present_perfect?: string
  level?: string
  multiple_choice_ps?: string
  multiple_choice_pp?: string
}

const createBlankRow = (): ManualVocabRow => ({
  term: "",
  definition: "",
  part_of_speech: "noun",
  context_usage: "",
  French: "",
  German: "",
  Italian: "",
  multiple_choice: "",
  imageFile: null,
  imagePreview: "",
})


const manualRows = ref<ManualVocabRow[]>([createBlankRow()])

const groupedVocabLists = computed(() => {
  const groups: Record<string, any[]> = {}

  for (const list of vocabLists.value) {
    const category = list.domain?.trim() || "UNASSIGNED"
    if (!groups[category]) groups[category] = []
    groups[category].push(list)
  }

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.name.localeCompare(b.name))
    }))
})

/**
 *  Re-maps vocab list assets 
 * straight into their matching assigned course deployment rows.
 */
const vocabListsByCourse = computed(() => {
  const courseMap: Record<string, any[]> = {}
  
  // 1. Initialize empty arrays for the true structural courses loaded from your store
  if (userStore.availableTeacherCourses && Array.isArray(userStore.availableTeacherCourses)) {
    userStore.availableTeacherCourses.forEach((course: any) => {
      if (course && course.slug) {
        // Enforce lowercase lookups for matching safety across the mapping table
        courseMap[course.slug.trim().toLowerCase()] = []
      }
    })
  }

  // 2. Distribute vocabulary datasets by evaluating their VocabListAvailability rules
  vocabLists.value.forEach(list => {
    if (list.availabilities && Array.isArray(list.availabilities)) {
      list.availabilities.forEach((availability: any) => {
        if (availability.course) {
          const targetSlug = availability.course.trim().toLowerCase()
          
          // Verify that this course bucket actually exists in the teacher's current scope
          if (courseMap[targetSlug] !== undefined) {
            // Deduplicate lists so we don't accidentally display duplicates in a single course panel
            if (!courseMap[targetSlug].some(item => item.id === list.id)) {
              courseMap[targetSlug].push(list)
            }
          }
        }
      })
    }
  })

  // 3. Output standard structured objects designed for reactive UI table rendering
  return Object.entries(courseMap)
    .map(([slug, items]) => ({
      slug: slug,
      items: items.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})


async function openAvailabilityConsole(list: any) {
  selectedListForAvailability.value = list
  availabilityConsoleDialog.value = true
  newAvailabilityTargetId.value = null
  
  // The store already holds your course and student lists,
  // so we only need to fetch the access records for this specific list.
  await fetchAvailabilitiesForList(list.id)
}
// 1. UPDATE THE FETCH CALL
async function fetchAvailabilitiesForList(listId: string) {
  availabilityListLoading.value = true
  try {
    // 🌟 Changed endpoint to singular 'vocab-list-availability'
    const res = await api.get('/vocab-list-availability/', {
      params: { vocab_list: listId }
    })
    currentAvailabilities.value = res.data || []
  } catch (err) {
    console.error("Failed loading list permission logs:", err)
  } finally {
    availabilityListLoading.value = false
  }
}

// 2. UPDATE THE POST CALL
async function submitNewAvailabilityRule() {
  if (!selectedListForAvailability.value || !newAvailabilityTargetId.value) return
  
  availabilityActionLoading.value = true
  try {
    const payload: Record<string, any> = {
      vocab_list: selectedListForAvailability.value.id
    }
    
    if (newAvailabilityScopeType.value === 'course') {
      payload.course = newAvailabilityTargetId.value
    } else {
      payload.student = newAvailabilityTargetId.value
    }

    // 🌟 Changed endpoint to singular 'vocab-list-availability'
    await api.post("/vocab-list-availability/", payload)
    newAvailabilityTargetId.value = null
    
    await fetchAvailabilitiesForList(selectedListForAvailability.value.id)
    await fetchVocabLists() 
  } catch (err: any) {
    console.error("Failed executing permission rule insertion:", err)
    alert(err.response?.data?.detail || "Could not authorize this permission.")
  } finally {
    availabilityActionLoading.value = false
  }
}

// 3. UPDATE THE DELETE CALL
async function removeAvailabilityRule(ruleId: string) {
  if (!selectedListForAvailability.value) return
  
  availabilityActionLoading.value = true
  try {
    // 🌟 Changed endpoint to singular 'vocab-list-availability'
    await api.delete(`/vocab-list-availability/${ruleId}/`)
    await fetchAvailabilitiesForList(selectedListForAvailability.value.id)
    await fetchVocabLists()
  } catch (err) {
    console.error("Failed wiping selected list visibility parameters:", err)
  } finally {
    availabilityActionLoading.value = false
  }
}

function closeAvailabilityConsole() {
  availabilityConsoleDialog.value = false
  selectedListForAvailability.value = null
  currentAvailabilities.value = []
}


const imageCount = computed(() =>
  manualRows.value.filter(row => row.imageFile || row.image_url).length
)

function normalizeHeader(header: string) {
  return header.trim().replace(/^["']|["']$/g, "").toLowerCase()
}

function isIrregularVerbList(items: any[]) {
  return items.some(item =>
    item?.additional_data?.past_simple || item?.additional_data?.present_perfect
  )
}

async function downloadListPdf(list: any) {
  pdfLoadingListId.value = list.id
  try {
    const res = await api.get(`/vocab-lists/${list.id}/prompts/`)
    const items = res.data || []

    const irregular = items.some((item: any) =>
      item?.additional_data?.past_simple || item?.additional_data?.present_perfect
    )

    await exportVocabListPdf({
      title: list.name,
      items,
      isIrregularVerbs: irregular
    })
  } catch (err) {
    console.error("Failed to generate PDF:", err)
    alert("Failed to generate the PDF for this vocabulary list.")
  } finally {
    pdfLoadingListId.value = null
  }
}

function appendNewEmptyWizardRow() {
  const newRow = createBlankRow()
  manualRows.value.push(newRow)
  launchRowWizard(manualRows.value.length - 1)
}

function removeManualRow(idx: number) {
  const targetedRow = manualRows.value[idx]
  if (targetedRow?.id) {
    deletedItemIdsOnEdit.value.push(targetedRow.id)
  }
  if (targetedRow?.imagePreview) URL.revokeObjectURL(targetedRow.imagePreview)
  manualRows.value.splice(idx, 1)

  if (manualRows.value.length === 0) {
    manualRows.value = [createBlankRow()]
  }
}

function launchRowWizard(idx: number) {
  activeWizardIndex.value = idx
  wizardRowData.value = JSON.parse(JSON.stringify(manualRows.value[idx])) as ManualVocabRow
  if (wizardRowData.value) {
    wizardRowData.value.imageFile = manualRows.value[idx].imageFile
    wizardRowData.value.imagePreview = manualRows.value[idx].imagePreview
    wizardRowData.value.image_url = manualRows.value[idx].image_url
  }
  wizardDialog.value = true
}

function triggerWizardFileInput() {
  wizardFileInputRef.value?.click()
}

function handleWizardImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0 && wizardRowData.value) {
    const file = target.files[0]
    if (wizardRowData.value.imagePreview) {
      URL.revokeObjectURL(wizardRowData.value.imagePreview)
    }
    wizardRowData.value.imageFile = file
    wizardRowData.value.imagePreview = URL.createObjectURL(file)
  }
}

function saveWizardRowContext() {
  if (wizardRowData.value) {
    manualRows.value[activeWizardIndex.value] = { ...wizardRowData.value }
  }
  wizardDialog.value = false
}

function closeWizardDialog() {
  wizardDialog.value = false
}

function triggerCsvFilePicker() {
  fileInputRef.value?.click()
}


async function fetchVocabLists() {
  loading.value = true
  try {
    const res = await api.get("/vocab-lists/")
    vocabLists.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditMode.value = false
  editingListId.value = null
  deletedItemIdsOnEdit.value = []
  csvValidationErrors.value = []
  formMetadata.name = ""
  formMetadata.domain = ""
  uploadedFile.value = null
  activeIngestTab.value = "manual"
  manualRows.value = [createBlankRow()]
  createDialog.value = true
}

async function openEditListDialog(list: any) {
  isEditMode.value = true
  editingListId.value = list.id
  deletedItemIdsOnEdit.value = []
  csvValidationErrors.value = []
  formMetadata.name = list.name
  formMetadata.domain = list.domain || ""
  activeIngestTab.value = "manual"

  loading.value = true
  try {
    const res = await api.get(`/vocab-lists/${list.id}/prompts/`)
    const items = res.data

    manualRows.value = items.map((item: any) => {
      const additional = item.additional_data || {}
      const choicesArray = additional.multiple_choice || []

      return {
        id: item.id,
        term: item.term,
        definition: item.definition,
        part_of_speech: item.part_of_speech || "noun",
        context_usage: item.context_usage || "",
        French: additional.French || "",
        German: additional.German || "",
        Italian: additional.Italian || "",
        multiple_choice: choicesArray.join(", "),
        imageFile: null,
        imagePreview: "",
        image_url: item.image_url || ""
      }
    })

    if (manualRows.value.length === 0) {
      manualRows.value = [createBlankRow()]
    }

    createDialog.value = true
  } catch (err) {
    console.error("Failed unpacking list cards content fields:", err)
  } finally {
    loading.value = false
  }
}

async function openViewListDialog(list: any) {
  selectedListForView.value = list
  selectedListItems.value = []
  loading.value = true
  try {
    const res = await api.get(`/vocab-lists/${list.id}/prompts/`)
    selectedListItems.value = res.data
    viewDialog.value = true
  } catch (err) {
    console.error("Failed loading vocabulary list for viewing:", err)
    alert("Failed to load the selected vocabulary list.")
  } finally {
    loading.value = false
  }
}

function closeViewDialog() {
  viewDialog.value = false
  selectedListForView.value = null
  selectedListItems.value = []
}

function closeCreateDialog() {
  manualRows.value.forEach(row => {
    if (row.imagePreview) URL.revokeObjectURL(row.imagePreview)
  })
  createDialog.value = false
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
    reprocessCurrentCsv()
  }
}

function handleFileDrop(e: DragEvent) {
  dragActive.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    uploadedFile.value = e.dataTransfer.files[0]
    reprocessCurrentCsv()
  }
}

function reprocessCurrentCsv() {
  csvValidationErrors.value = []

  if (!uploadedFile.value) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const text = event.target?.result as string
    if (!text) return

    const lines = text.split(/\r?\n/).filter(line => line.trim())
    if (lines.length < 2) {
      csvValidationErrors.value = ["The CSV file must include a header row and at least one data row."]
      return
    }

    const delimiterSymbol = csvDelimiter.value
    const rawHeaders = lines[0].split(delimiterSymbol)
    const headers = rawHeaders.map(normalizeHeader)

    const requiredHeaders = ["term", "definition"]
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))

    if (missingHeaders.length > 0) {
      csvValidationErrors.value = [
        `Missing required header(s): ${missingHeaders.join(", ")}.`,
        "Required headers are: term, definition."
      ]
      manualRows.value = [createBlankRow()]
      return
    }

    const parsedRows: ManualVocabRow[] = []
    const rowErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const escapedRegex = new RegExp(`\\${delimiterSymbol}(?=(?:(?:[^"]*"){2})*[^"]*$)`)
      const columns = line.split(escapedRegex).map(c => c.trim().replace(/^["']|["']$/g, ""))

      const rowData: Record<string, string> = {}
      headers.forEach((header, index) => {
        rowData[header] = columns[index] ?? ""
      })

      const row: ManualVocabRow = {
        term: rowData.term || "",
        definition: rowData.definition || "",
        part_of_speech: rowData.part_of_speech || "noun",
        context_usage: rowData.context_usage || "",
        French: rowData.french || "",
        German: rowData.german || "",
        Italian: rowData.italian || "",
        multiple_choice: rowData.multiple_choice || "",
        imageFile: null,
        imagePreview: ""
      }

      if (!row.term.trim() || !row.definition.trim()) {
        rowErrors.push(`Row ${i + 1} is missing a required term or definition.`)
      }

      parsedRows.push(row)
    }

    if (rowErrors.length > 0) {
      csvValidationErrors.value = rowErrors
    }

    manualRows.value = parsedRows.length > 0 ? parsedRows : [createBlankRow()]
  }

  reader.readAsText(uploadedFile.value)
}

async function copySuggestedAiPrompt() {
  const prompt = `Take this vocabulary list and complete any missing fields. Make sure the CSV headers are exactly:

term,definition,part_of_speech,context_usage,French,German,Italian,multiple_choice

Rules:
- Fill in any missing definitions.
- Fill in missing translations where appropriate.
- Fill in example sentences in the context_usage column.
- Fill in multiple_choice with plausible wrong answers that are close in meaning or category, but not synonyms and not correct answers.
- Preserve the original term.
- Return only CSV output.
- If any field contains commas, wrap it in double quotes.`

  try {
    await navigator.clipboard.writeText(prompt)
    alert("Suggested AI prompt copied to clipboard.")
  } catch (err) {
    console.error("Clipboard copy failed:", err)
    alert("Failed to copy the suggested AI prompt.")
  }
}

async function submitVocabCurriculum() {
  if (csvValidationErrors.value.length > 0) {
    alert("Please fix the CSV format errors before saving the dataset.")
    return
  }

  for (const [index, row] of manualRows.value.entries()) {
    if (!row.term.trim() || !row.definition.trim()) {
      alert(`Row ${index + 1} is missing a required term or definition.`)
      return
    }
  }

  if (!formMetadata.name.trim()) {
    alert("List name is required.")
    return
  }

  submitting.value = true
  try {
    let targetListUuid = editingListId.value

    const parentPayload = {
      name: formMetadata.name,
      domain: formMetadata.domain || null,
      description: `Managed multi-tenant dataset collection tracks containing ${manualRows.value.length} prompts.`
    }

    if (isEditMode.value && targetListUuid) {
      await api.put(`/vocab-lists/${targetListUuid}/`, parentPayload)

      for (const removeId of deletedItemIdsOnEdit.value) {
        await api.delete(`/vocab-items/${removeId}/`)
      }
    } else {
      const parentRes = await api.post("/vocab-lists/", parentPayload)
      targetListUuid = parentRes.data.id
    }

    for (const row of manualRows.value) {
      const choicesArray = row.multiple_choice
        ? row.multiple_choice.split(",").map(item => item.trim()).filter(Boolean)
        : []

      const itemPayload = {
        vocab_list: targetListUuid,
        term: row.term,
        definition: row.definition,
        part_of_speech: row.part_of_speech || null,
        context_usage: row.context_usage || null,
        additional_data: {
          French: row.French || null,
          German: row.German || null,
          Italian: row.Italian || null,
          multiple_choice: choicesArray,
          past_simple: row.past_simple
            ? row.past_simple.split(",").map(item => item.trim()).filter(Boolean)
            : [],
          present_perfect: row.present_perfect
            ? row.present_perfect.split(",").map(item => item.trim()).filter(Boolean)
            : [],
          level: row.level || null,
          multiple_choice_ps: row.multiple_choice_ps
            ? row.multiple_choice_ps.split(",").map(item => item.trim()).filter(Boolean)
            : [],
          multiple_choice_pp: row.multiple_choice_pp
            ? row.multiple_choice_pp.split(",").map(item => item.trim()).filter(Boolean)
            : []
        }
      }

      let activeItemUuid = row.id

      if (isEditMode.value && activeItemUuid) {
        await api.put(`/vocab-items/${activeItemUuid}/`, itemPayload)
      } else {
        const itemRes = await api.post("/vocab-items/", itemPayload)
        activeItemUuid = itemRes.data.id
      }

      if (row.imageFile && activeItemUuid) {
        const imageMultipartFormData = new FormData()
        imageMultipartFormData.append("image", row.imageFile)

        await api.post(`/vocab-items/${activeItemUuid}/upload-image/`, imageMultipartFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }
    }

    createDialog.value = false
    await fetchVocabLists()
  } catch (err) {
    console.error("Error while processing the list:", err)
    alert("An error occurred while saving the dataset.")
  } finally {
    submitting.value = false
  }
}

function confirmDeleteList(list: any) {
  selectedListForDelete.value = list
  deleteDialog.value = true
}

async function executeListDeletion() {
  if (!selectedListForDelete.value) return
  try {
    await api.delete(`/vocab-lists/${selectedListForDelete.value.id}/`)
    deleteDialog.value = false
    await fetchVocabLists()
  } catch (err) {
    console.error(err)
  }
}

function formatDate(isoString: string) {
  if (!isoString) return ""
  return new Date(isoString).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

onMounted(() => fetchVocabLists())
</script>

<style scoped>
.max-width-management-container {
  max-width: 100%;
  margin: 0 auto;
}

.editor-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.editor-main {
  overflow: auto;
  min-width: 0;
}

.editor-sidebar {
  overflow: auto;
}

.sticky-sidebar-card {
  position: sticky;
  top: 0;
}

.manual-grid,
.view-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.wizard-form-grid {
  align-items: start;
}

.wizard-image-panel {
  display: flex;
  flex-direction: column;
}

.wizard-large-preview {
  width: 100%;
  min-height: 280px;
  height: 280px;
  border: 1px solid #cbd5e1;
}

.file-dropzone {
  border-style: dashed !important;
  transition: all 0.25s ease-in-out;
}

.file-dropzone.dropzone-active {
  border-color: #4f46e5 !important;
  background-color: #f5f3ff !important;
}

.hover-row:hover {
  background-color: #f8fafc !important;
}

.text-xxs {
  font-size: 0.65rem !important;
}

.csv-example {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8rem;
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
}

.summary-stat {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.summary-label {
  color: #64748b;
  font-weight: 700;
}

.summary-value {
  color: #0f172a;
  font-weight: 800;
  text-align: right;
}

.min-width-0 {
  min-width: 0;
}

.text-wrap {
  white-space: normal;
  word-break: break-word;
}

@media (max-width: 1100px) {
  .editor-shell {
    grid-template-columns: 1fr;
    height: auto;
  }

  .editor-sidebar {
    overflow: visible;
  }

  .sticky-sidebar-card {
    position: static;
  }
}

.manual-row-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
}

.manual-row-index {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
}

.manual-row-content {
  min-width: 0;
}

.manual-row-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.manual-image-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.row-thumb-img {
  width: 36px;
  height: 36px;
  min-width: 36px;
  max-width: 36px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  display: block;
}

.manual-row-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-end;
}

@media (max-width: 520px) {
  .manual-row-card {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 88px;
  gap: 16px;
  align-items: start;
}

  .manual-row-index {
    justify-content: flex-start;
    padding-top: 0;
  }

  .manual-row-actions {
    justify-content: flex-start;
  }
}
.view-item-row {
  display: grid;
  grid-template-columns: 36px 150px minmax(0, 1fr) minmax(0, 1fr) 64px;
  gap: 16px;
  align-items: center;
  min-width: 0;
}

.view-item-num {
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-item-term {
  min-width: 0;
  word-break: break-word;
}

.view-item-definition {
  min-width: 0;
  word-break: break-word;
}

.view-item-translations {
  min-width: 0;
}

.view-item-image {
  width: 64px;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-thumb-wrap {
  width: 56px;
  height: 56px;
  min-width: 56px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}

.view-thumb-img {
  width: 56px;
  height: 56px;
  display: block;
  object-fit: cover;
}

.view-thumb-empty {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

@media (max-width: 900px) {
  .view-item-row {
    grid-template-columns: 36px minmax(0, 1fr) auto;
    grid-template-rows: auto auto auto;
  }
  .view-item-num    { grid-row: 1; grid-column: 1; }
  .view-item-term   { grid-row: 1; grid-column: 2; }
  .view-item-image  { grid-row: 1; grid-column: 3; }
  .view-item-definition   { grid-row: 2; grid-column: 1 / 4; }
  .view-item-translations { grid-row: 3; grid-column: 1 / 4; }
}
</style>