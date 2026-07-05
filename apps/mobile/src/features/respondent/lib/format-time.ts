export function formatVideoTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const padded = (value: number) => String(value).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${padded(minutes)}:${padded(secs)}`;
  }
  return `${minutes}:${padded(secs)}`;
}
