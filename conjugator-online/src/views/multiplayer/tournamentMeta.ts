export const prettySlug = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const LABELS: Record<string, string> = {
  registration: 'Registration', ready: 'Bracket ready', in_progress: 'Round live',
  awaiting_round: 'Waiting for next round', finished: 'Finished', cancelled: 'Cancelled',
};
const COLORS: Record<string, string> = {
  registration: 'info', ready: 'primary', in_progress: 'success',
  awaiting_round: 'warning', finished: 'grey', cancelled: 'error',
};
export const statusLabel = (s: string) => LABELS[s] ?? s;
export const statusColor = (s: string) => COLORS[s] ?? 'grey';