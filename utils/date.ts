export function convertToMilliseconds(
  date: string,
  hour: number,
  minutes: number,
  timePeriod: 'am' | 'pm'
): number {
  // Parse date string (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-based
  const day = parseInt(dayStr, 10);

  // Convert hour to 24-hour format
  let adjustedHour = hour;
  if (timePeriod === 'pm' && hour < 12) adjustedHour += 12;
  if (timePeriod === 'am' && hour === 12) adjustedHour = 0;

  // Create the Date object
  const dateObj = new Date(year, month, day, adjustedHour, minutes);

  // Return time in milliseconds
  return dateObj.getTime();
}

export function formatMilliseconds(ms: number, withoutTime?: boolean): string {
  const date = new Date(ms);

  const day = date.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const timePeriod = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return withoutTime
    ? `${day} ${month} ${year}`
    : `${day} ${month} ${year}, ${hours}:${formattedMinutes} ${timePeriod}`
}

export function getWeekRange(date?: Date) {
  const start = new Date(date ?? new Date());
  const day = start.getDay();

  // Monday as the first day of the week
  const diff = (day + 6) % 7;

  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function timeAgo(date: number): string {
  const now = Date.now();
  const past = new Date(date).getTime();

  if (Number.isNaN(past)) return "Invalid date";

  const seconds = Math.max(0, Math.floor((now - past) / 1000));

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
