const DEFAULT_HISTORY_LIMIT = 50;

export function createHistory(limit = DEFAULT_HISTORY_LIMIT) {
  let entries: number[] = [];
  let index = -1;

  return {
    get canGoBack() {
      return index > 0;
    },
    get canGoForward() {
      return index >= 0 && index < entries.length - 1;
    },
    get current() {
      return entries[index];
    },
    get position() {
      return { index: index + 1, total: entries.length };
    },
    back() {
      if (index > 0) index--;

      return entries[index];
    },
    forward() {
      if (index < entries.length - 1) index++;

      return entries[index];
    },
    push(seed: number) {
      if (seed === entries[index]) return seed;

      entries = [...entries.slice(0, index + 1), seed].slice(-limit);
      index = entries.length - 1;

      return seed;
    },
  };
}
