import { format, isValid } from 'date-fns';

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function formatTimestampWithOrdinal(timestamp: unknown): string {
  if (typeof timestamp !== 'number') {
    return 'Date not available';
  }

  const date = new Date(timestamp);

  if (!isValid(date)) {
    return 'Date not available';
  }

  const day = date.getDate();
  const ordinalDay = `${day}${getOrdinal(day)}`;
  const rest = format(date, 'MMM yyyy');

  return `${ordinalDay} ${rest}`;
}
