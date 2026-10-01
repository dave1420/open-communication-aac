// Local, text-supported line icons. Icons are optional and never replace labels.
const paths: Record<string, string> = {
  yes: '<path d="m5 12 4 4L19 6"/>',
  no: '<path d="m6 6 12 12M18 6 6 18"/>',
  wait: '<path d="M8 5v14M16 5v14"/>',
  repeat: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  understand: '<path d="m5 12 4 4L19 6"/>',
  "not-understand":
    '<path d="M9 7a3 3 0 0 1 6 1c0 2-3 2-3 5M12 18h.01"/><circle cx="12" cy="12" r="10"/>',
  bathroom:
    '<path d="M6 3h12v6H6zM8 9v4h8V9M5 13h14v2a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6zM12 5h.01"/>',
  pain: '<path d="m12 2 2 6 6-2-3 6 5 3-6 1 1 6-5-4-5 4 1-6-6-1 5-3-3-6 6 2z"/>',
  thirsty: '<path d="m6 5 2 16h8l2-16zM7 12h10M14 5l2-3"/>',
  hungry:
    '<path d="M3 12h18a9 9 0 0 1-18 0ZM6 21h12M8 3c-2 2 2 3 0 5M14 3c-2 2 2 3 0 5"/>',
  hot: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  cold: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M7 19l1-4-4-1M17 5l-1 4 4 1"/>',
  tired: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
  reposition: '<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>',
  "thank-you":
    '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 4 1 9 8 15 7-6 12-11 8-15Z"/>',
  custom:
    '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  speak:
    '<path d="M4 9v6h4l5 4V5L8 9zM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
  undo: '<path d="M4 10h10a6 6 0 0 1 0 12M9 5l-5 5 5 5"/>',
  clear: '<path d="M6 6l12 12M18 6 6 18"/>',
};

export function icon(name: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] ?? paths.custom}</svg>`;
}
