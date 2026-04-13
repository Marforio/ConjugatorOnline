// src/assets/data/drillsDataSource.ts

/**
 * Data source for predefined drills and workout templates.
 * Teachers can select from these to quickly create student workouts.
 */

export interface DrillTemplate {
  id: string;
  type: 'pronunciation' | 'conjugation' | 'vocabulary' | 'grammar' | 'fluency' | 'listening' | 'other';
  name: string;
  description: string;
  target_reps: number;
  target_sessions: number;
  category: string; // For grouping/filtering
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes_template?: string; // Optional template for progress notes
  question_url?: string; // Optional URL to open drill questions
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  focus_area: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: string; // e.g., "30 min", "1 hour"
  drill_ids: string[]; // References to DrillTemplate IDs
  notes_template?: string; // Optional template for teacher notes
}

// ============================================================================
// DRILL TEMPLATES
// ============================================================================

export const drillTemplates: DrillTemplate[] = [
  // --- PRONUNCIATION DRILLS ---
  {
    id: 'pron_th_sounds',
    type: 'pronunciation',
    name: 'TH Sounds (θ and ð)',
    description: 'Practice voiced and unvoiced TH sounds: think, thank, that, the, those, these',
    target_reps: 10,
    target_sessions: 5,
    category: 'Pronunciation',
    difficulty: 'beginner',
    notes_template: 'Focus on tongue placement between teeth',
    question_url: '/drill-questions/th-sounds'
  },
  {
    id: 'pron_r_vs_l',
    type: 'pronunciation',
    name: 'R vs L Sounds',
    description: 'Distinguish between R and L: right/light, read/lead, rice/lice',
    target_reps: 15,
    target_sessions: 5,
    category: 'Pronunciation',
    difficulty: 'intermediate',
    notes_template: 'Pay attention to tongue position',
    question_url: '/drill-questions/r-vs-l'
  },
  {
    id: 'pron_schwa',
    type: 'pronunciation',
    name: 'Schwa Sound (ə)',
    description: 'Practice the schwa in unstressed syllables: about, banana, problem',
    target_reps: 12,
    target_sessions: 4,
    category: 'Pronunciation',
    difficulty: 'intermediate',
  },
  {
    id: 'pron_word_stress',
    type: 'pronunciation',
    name: 'Word Stress Patterns',
    description: 'Practice correct stress in multi-syllable words',
    target_reps: 10,
    target_sessions: 4,
    category: 'Pronunciation',
    difficulty: 'advanced',
  },

  // --- CONJUGATION DRILLS ---
  {
    id: 'conj_present_simple',
    type: 'conjugation',
    name: 'Present Simple 3rd Person',
    description: 'Practice adding -s/-es to 3rd person verbs (he, she, it)',
    target_reps: 20,
    target_sessions: 3,
    category: 'Verb Conjugation',
    difficulty: 'beginner',
    notes_template: 'Watch for irregular verbs: have→has, go→goes',
  },
  {
    id: 'conj_past_simple',
    type: 'conjugation',
    name: 'Past Simple Regular Verbs',
    description: 'Practice -ed endings with correct pronunciation',
    target_reps: 15,
    target_sessions: 4,
    category: 'Verb Conjugation',
    difficulty: 'beginner',
  },
  {
    id: 'conj_present_perfect',
    type: 'conjugation',
    name: 'Present Perfect',
    description: 'Have/has + past participle for unfinished time',
    target_reps: 15,
    target_sessions: 5,
    category: 'Verb Conjugation',
    difficulty: 'intermediate',
    notes_template: 'Focus on irregular past participles',
  },
  {
    id: 'conj_irregular_verbs',
    type: 'conjugation',
    name: 'Irregular Verbs Top 20',
    description: 'Practice past simple and past participle of common irregular verbs',
    target_reps: 20,
    target_sessions: 6,
    category: 'Verb Conjugation',
    difficulty: 'intermediate',
  },

  // --- GRAMMAR DRILLS ---
  {
    id: 'gram_articles',
    type: 'grammar',
    name: 'Articles (a, an, the)',
    description: 'Practice using definite and indefinite articles correctly',
    target_reps: 15,
    target_sessions: 4,
    category: 'Grammar',
    difficulty: 'beginner',
  },
  {
    id: 'gram_prepositions_time',
    type: 'grammar',
    name: 'Prepositions of Time',
    description: 'Practice in, on, at with time expressions',
    target_reps: 12,
    target_sessions: 3,
    category: 'Grammar',
    difficulty: 'beginner',
  },
  {
    id: 'gram_conditionals_1',
    type: 'grammar',
    name: 'First Conditional',
    description: 'If + present simple, will + infinitive',
    target_reps: 15,
    target_sessions: 5,
    category: 'Grammar',
    difficulty: 'intermediate',
  },
  {
    id: 'gram_conditionals_2',
    type: 'grammar',
    name: 'Second Conditional',
    description: 'If + past simple, would + infinitive',
    target_reps: 15,
    target_sessions: 5,
    category: 'Grammar',
    difficulty: 'intermediate',
  },
  {
    id: 'gram_passive_voice',
    type: 'grammar',
    name: 'Passive Voice',
    description: 'Transform active sentences to passive',
    target_reps: 12,
    target_sessions: 5,
    category: 'Grammar',
    difficulty: 'advanced',
  },

  // --- VOCABULARY DRILLS ---
  {
    id: 'vocab_compound_nouns',
    type: 'vocabulary',
    name: 'Compound Nouns',
    description: 'Practice compound nouns instead of unnecessary prepositions',
    target_reps: 10,
    target_sessions: 4,
    category: 'Nouns',
    difficulty: 'intermediate',
  },
  {
    id: 'vocab_countable_uncountable',
    type: 'vocabulary',
    name: 'Countable vs Uncountable Nouns',
    description: 'Identify and use countable/uncountable nouns correctly',
    target_reps: 15,
    target_sessions: 4,
    category: 'Nouns',
    difficulty: 'intermediate',
  },
  {
    id: 'vocab_phrasal_verbs',
    type: 'vocabulary',
    name: 'Common Phrasal Verbs',
    description: 'Practice top 20 phrasal verbs with meaning and usage',
    target_reps: 20,
    target_sessions: 6,
    category: 'Vocabulary',
    difficulty: 'intermediate',
  },
  {
    id: 'vocab_collocations',
    type: 'vocabulary',
    name: 'Common Collocations',
    description: 'Practice natural word combinations (make a decision, take a break)',
    target_reps: 15,
    target_sessions: 5,
    category: 'Vocabulary',
    difficulty: 'advanced',
  },

  // --- FLUENCY DRILLS ---
  {
    id: 'fluency_monologue_1min',
    type: 'fluency',
    name: '1-Minute Monologue',
    description: 'Speak about a topic for 1 minute without stopping',
    target_reps: 3,
    target_sessions: 3,
    category: 'Fluency',
    difficulty: 'beginner',
    notes_template: 'Count hesitations and fillers',
  },
  {
    id: 'fluency_monologue_2min',
    type: 'fluency',
    name: '2-Minute Monologue',
    description: 'Speak about a topic for 2 minutes without stopping',
    target_reps: 3,
    target_sessions: 4,
    category: 'Fluency',
    difficulty: 'intermediate',
    notes_template: 'Count hesitations and fillers',
  },
  {
    id: 'fluency_storytelling',
    type: 'fluency',
    name: 'Storytelling',
    description: 'Tell a complete story with beginning, middle, and end',
    target_reps: 3,
    target_sessions: 4,
    category: 'Fluency',
    difficulty: 'intermediate',
  },
  {
    id: 'fluency_description',
    type: 'fluency',
    name: 'Picture Description',
    description: 'Describe a picture in detail for 2 minutes',
    target_reps: 5,
    target_sessions: 3,
    category: 'Fluency',
    difficulty: 'beginner',
  },

  // --- LISTENING DRILLS ---
  {
    id: 'listen_dictation',
    type: 'listening',
    name: 'Dictation Exercise',
    description: 'Listen and write down sentences accurately',
    target_reps: 10,
    target_sessions: 4,
    category: 'Listening',
    difficulty: 'intermediate',
  },
  {
    id: 'listen_comprehension',
    type: 'listening',
    name: 'Listening Comprehension',
    description: 'Listen to short passages and answer questions',
    target_reps: 5,
    target_sessions: 4,
    category: 'Listening',
    difficulty: 'intermediate',
  },

  // ADD MORE DRILLS HERE...
];

// ============================================================================
// WORKOUT TEMPLATES
// ============================================================================

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'workout_beginner_pronunciation',
    name: 'Beginner Pronunciation Basics',
    description: 'Foundation pronunciation drills for beginners',
    focus_area: 'Pronunciation',
    difficulty: 'beginner',
    estimated_duration: '30 min',
    drill_ids: ['pron_th_sounds', 'pron_schwa', 'fluency_description'],
    notes_template: 'Focus on clear articulation and building confidence'
  },
  {
    id: 'workout_verb_mastery',
    name: 'Verb Conjugation Mastery',
    description: 'Comprehensive verb practice for intermediate students',
    focus_area: 'Verb Conjugation',
    difficulty: 'intermediate',
    estimated_duration: '45 min',
    drill_ids: ['conj_present_simple', 'conj_past_simple', 'conj_present_perfect', 'conj_irregular_verbs'],
    notes_template: 'Work through each tense systematically'
  },
  {
    id: 'workout_fluency_building',
    name: 'Fluency Building',
    description: 'Improve speaking fluency and reduce hesitation',
    focus_area: 'Fluency',
    difficulty: 'intermediate',
    estimated_duration: '30 min',
    drill_ids: ['fluency_monologue_1min', 'fluency_monologue_2min', 'fluency_storytelling'],
    notes_template: 'Track reduction in hesitations over sessions'
  },
  {
    id: 'workout_grammar_fundamentals',
    name: 'Grammar Fundamentals',
    description: 'Essential grammar structures for beginners',
    focus_area: 'Grammar',
    difficulty: 'beginner',
    estimated_duration: '40 min',
    drill_ids: ['gram_articles', 'gram_prepositions_time', 'conj_present_simple'],
    notes_template: 'Build strong foundation before moving to advanced topics'
  },
  {
    id: 'workout_advanced_grammar',
    name: 'Advanced Grammar Structures',
    description: 'Complex grammar for advanced students',
    focus_area: 'Grammar',
    difficulty: 'advanced',
    estimated_duration: '50 min',
    drill_ids: ['gram_conditionals_1', 'gram_conditionals_2', 'gram_passive_voice'],
    notes_template: 'Focus on accuracy and natural usage'
  },
  {
    id: 'workout_pronunciation_advanced',
    name: 'Advanced Pronunciation',
    description: 'Fine-tune pronunciation and intonation',
    focus_area: 'Pronunciation',
    difficulty: 'advanced',
    estimated_duration: '35 min',
    drill_ids: ['pron_r_vs_l', 'pron_word_stress', 'fluency_monologue_2min'],
    notes_template: 'Work on naturalness and native-like pronunciation'
  },
  {
    id: 'workout_vocab_expansion',
    name: 'Vocabulary Expansion',
    description: 'Build and use advanced vocabulary',
    focus_area: 'Vocabulary',
    difficulty: 'intermediate',
    estimated_duration: '40 min',
    drill_ids: ['vocab_compound_nouns', 'vocab_phrasal_verbs', 'vocab_collocations'],
    notes_template: 'Encourage active use in speaking practice'
  },
  {
    id: 'workout_complete_beginner',
    name: 'Complete Beginner Package',
    description: 'Comprehensive workout for new students',
    focus_area: 'General',
    difficulty: 'beginner',
    estimated_duration: '60 min',
    drill_ids: [
      'pron_th_sounds',
      'conj_present_simple',
      'gram_articles',
      'fluency_description'
    ],
    notes_template: 'Cover all basics in first few sessions'
  },
  {
    id: 'workout_speaking_intensive',
    name: 'Speaking Intensive',
    description: 'Heavy focus on speaking and fluency',
    focus_area: 'Speaking & Fluency',
    difficulty: 'intermediate',
    estimated_duration: '45 min',
    drill_ids: [
      'fluency_monologue_2min',
      'fluency_storytelling',
      'pron_word_stress',
      'vocab_collocations'
    ],
    notes_template: 'Minimize corrections during speaking, note for later'
  },

  // ADD MORE WORKOUT TEMPLATES HERE...
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get drill template by ID
 */
export function getDrillById(id: string): DrillTemplate | undefined {
  return drillTemplates.find(d => d.id === id);
}

/**
 * Get drills by category
 */
export function getDrillsByCategory(category: string): DrillTemplate[] {
  return drillTemplates.filter(d => d.category === category);
}

/**
 * Get drills by type
 */
export function getDrillsByType(type: DrillTemplate['type']): DrillTemplate[] {
  return drillTemplates.filter(d => d.type === type);
}

/**
 * Get drills by difficulty
 */
export function getDrillsByDifficulty(difficulty: DrillTemplate['difficulty']): DrillTemplate[] {
  return drillTemplates.filter(d => d.difficulty === difficulty);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(drillTemplates.map(d => d.category))).sort();
}

/**
 * Get workout template by ID
 */
export function getWorkoutById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find(w => w.id === id);
}

/**
 * Get workouts by difficulty
 */
export function getWorkoutsByDifficulty(difficulty: WorkoutTemplate['difficulty']): WorkoutTemplate[] {
  return workoutTemplates.filter(w => w.difficulty === difficulty);
}

/**
 * Get full workout with populated drills
 */
export function getWorkoutWithDrills(workoutId: string): {
  workout: WorkoutTemplate;
  drills: DrillTemplate[];
} | null {
  const workout = getWorkoutById(workoutId);
  if (!workout) return null;

  const drills = workout.drill_ids
    .map(id => getDrillById(id))
    .filter((d): d is DrillTemplate => d !== undefined);

  return { workout, drills };
}

/**
 * Convert drill template to workout drill format
 */
export function drillTemplateToWorkoutDrill(template: DrillTemplate, customizations?: {
  target_reps?: number;
  target_sessions?: number;
  completed_sessions?: number;
  notes?: string;
}) {
  return {
    id: Date.now() + Math.random(), // Generate unique ID for workout drill instance
    type: template.type,
    name: template.name,
    description: template.description,
    target_reps: customizations?.target_reps ?? template.target_reps,
    target_sessions: customizations?.target_sessions ?? template.target_sessions,
    completed_sessions: customizations?.completed_sessions ?? 0,
    notes: customizations?.notes ?? template.notes_template ?? '',
  };
}

/**
 * Convert workout template to API format
 */
export function workoutTemplateToApiFormat(
  template: WorkoutTemplate,
  studentId: number
): {
  student: number;
  focus_area: string;
  notes: string;
  drills: any[];
} {
  const drills = template.drill_ids
    .map(id => getDrillById(id))
    .filter((d): d is DrillTemplate => d !== undefined)
    .map(drill => drillTemplateToWorkoutDrill(drill));

  return {
    student: studentId,
    focus_area: template.focus_area,
    notes: template.notes_template || `Workout: ${template.name}. ${template.description}`,
    drills,
  };
}