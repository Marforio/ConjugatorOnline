export const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);

/** HTML-escape the text and wrap the first match of `needle` in a styled span. */
export function highlight(text?: string, needle?: string, cls = 'font-weight-black text-primary') {
  const t = String(text ?? '');
  if (!needle) return esc(t);
  const i = t.toLowerCase().indexOf(needle.toLowerCase());
  if (i === -1) return esc(t);
  return `${esc(t.slice(0, i))}<span class="${cls}">${esc(t.slice(i, i + needle.length))}</span>${esc(t.slice(i + needle.length))}`;
}

export const SPEAKERS: Record<string, string> = {
  Luka: 'Luka.jpg', Lebron: 'Lebron.jpg', Wemby: 'Wemby.jpg', 'the team': 'team.jpg',
  'the fans': 'fans.jpg', 'the experts': 'experts.jpg', 'the politician': 'Gavin.jpg',
  'the president': 'Merkel.jpg', 'the CEO': 'CEO.jpg', Audrey: 'Werro.jpg',
};
export const speakerPic = (n?: string) => `/images/speaker_pics_resized/${SPEAKERS[n ?? ''] ?? 'team.jpg'}`;