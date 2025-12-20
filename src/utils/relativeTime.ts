import i18next from 'i18next';

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return i18next.t('relativeTime.justNow', 'just now');
  } else if (minutes < 60) {
    return i18next.t('relativeTime.minutesAgo', '{{count}} minutes ago', {
      count: minutes,
    });
  } else if (hours < 24) {
    return i18next.t('relativeTime.hoursAgo', '{{count}} hours ago', {
      count: hours,
    });
  } else if (days < 7) {
    return i18next.t('relativeTime.daysAgo', '{{count}} days ago', {
      count: days,
    });
  } else if (weeks < 4) {
    return i18next.t('relativeTime.weeksAgo', '{{count}} weeks ago', {
      count: weeks,
    });
  } else if (months < 12) {
    return i18next.t('relativeTime.monthsAgo', '{{count}} months ago', {
      count: months,
    });
  } else {
    return i18next.t('relativeTime.yearsAgo', '{{count}} years ago', {
      count: years,
    });
  }
}
