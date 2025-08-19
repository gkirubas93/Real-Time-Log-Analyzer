import { format } from 'date-fns';
export function formatDate(value, useUtc = false) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  if (useUtc) {
    return [
      d.getUTCFullYear(),
      String(d.getUTCMonth() + 1).padStart(2, '0'),
      String(d.getUTCDate()).padStart(2, '0')
    ].join('-') + ' ' +
    [
      String(d.getUTCHours()).padStart(2, '0'),
      String(d.getUTCMinutes()).padStart(2, '0'),
      String(d.getUTCSeconds()).padStart(2, '0')
    ].join(':') + '.' + String(d.getUTCMilliseconds()).padStart(3, '0');
  }
  return format(d, 'yyyy-MM-dd HH:mm:ss.SSS');
}