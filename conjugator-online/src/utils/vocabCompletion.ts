export interface CompletedVocabList {
  student_id: number
  list_key: string
  list_name: string
  level: string | null
  front_field: string | null
  back_field: string | null
  finished_at: string | null
  verified: boolean
}

const fieldNames: Record<string, string> = {
  term: 'Term',
  definition: 'Definition',
  French: 'French',
  German: 'German',
  Italian: 'Italian',
  past_simple: 'Past simple',
  present_perfect: 'Past participle',
  past_forms: 'Both past forms',
}

export function completionVariant(row: CompletedVocabList): string {
  const field = (value: string | null) =>
    value ? (fieldNames[value] || value.replace(/_/g, ' ')) : 'Unknown'

  const isIrregular = row.list_key.startsWith('irregular_verbs')
  const front = isIrregular && row.front_field === 'term'
    ? 'Infinitive'
    : field(row.front_field)
  const back = isIrregular && row.back_field === 'term'
    ? 'Infinitive'
    : field(row.back_field)

  return `${front} → ${back}`
}

export function completionKey(row: CompletedVocabList): string {
  return JSON.stringify([
    row.student_id,
    row.list_key,
    row.level,
    row.front_field,
    row.back_field,
  ])
}