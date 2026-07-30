export const parseFirebaseDate = (rawDate: any): Date | null => {
  if (!rawDate) return null;

  // If it's already a JS Date object
  if (rawDate instanceof Date) return rawDate;

  // If it has a toDate() method (actual Firestore Timestamp object)
  if (typeof rawDate.toDate === 'function') {
    return rawDate.toDate();
  }

  // If it's a serialised Firestore Timestamp object with seconds
  if (typeof rawDate.seconds === 'number') {
    return new Date(rawDate.seconds * 1000);
  }

  // If it's an ISO string or a number (milliseconds)
  if (typeof rawDate === 'string' || typeof rawDate === 'number') {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Fallback for empty objects or unknown formats
  return null;
};

export const formatFirebaseDate = (rawDate: any, fallback = 'Unknown Date'): string => {
  const date = parseFirebaseDate(rawDate);
  if (!date) return fallback;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
