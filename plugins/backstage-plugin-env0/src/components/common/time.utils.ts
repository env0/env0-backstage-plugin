export const formatDatetime = (value: string | Date | undefined) =>
  value &&
  new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export const parseTimerElapsedTime = (elapsedTimeInSeconds: number) => {
  const elapsedHours = Math.floor(elapsedTimeInSeconds / 3600);
  const elapsedMinutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const elapsedSeconds = Math.floor(elapsedTimeInSeconds % 60);

  return [elapsedHours, elapsedMinutes, elapsedSeconds]
    .map(timeUnit => (timeUnit < 10 ? `0${timeUnit}` : String(timeUnit)))
    .join(':');
};
