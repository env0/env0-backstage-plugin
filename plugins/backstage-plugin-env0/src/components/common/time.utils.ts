export const formatDatetime = (value: string | Date | undefined) =>
  value &&
  new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export const parseTimerElapsedTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const config = {
    h: true,
    m: true,
    s: true,
  };

  return [config.h && h, config.m && m, config.s && s]
    .filter(
      (maybeNumber: false | number): maybeNumber is number =>
        maybeNumber !== false,
    )
    .map(timeUnit => (timeUnit < 10 ? `0${timeUnit}` : String(timeUnit)))
    .join(':');
};
