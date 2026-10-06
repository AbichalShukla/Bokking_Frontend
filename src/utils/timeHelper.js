// src/utils/timeHelper.js
export const roundToNearest15Minutes = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  
  if (remainder !== 0) {
    if (remainder >= 7.5) {
      date.setMinutes(minutes + (15 - remainder));
    } else {
      date.setMinutes(minutes - remainder);
    }
  }
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
};