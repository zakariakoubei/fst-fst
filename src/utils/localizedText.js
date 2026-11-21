export function getLocalizedValue(value, language = 'en', fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return (
      value[language] ||
      value.en ||
      value.fr ||
      value.ar ||
      Object.values(value).find((v) => typeof v === 'string') ||
      fallback
    );
  }
  return String(value);
}