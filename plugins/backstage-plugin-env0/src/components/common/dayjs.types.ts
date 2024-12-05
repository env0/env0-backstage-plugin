import dayjs from 'dayjs';
import type { Dayjs, UnitType, QUnitType, OpUnitType, ManipulateType } from 'dayjs';
import type locale from 'dayjs/locale/en';
import durationPlugin, { type Duration, type DurationUnitType } from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import quarterPlugin from 'dayjs/plugin/quarterOfYear';
import weekPlugin from 'dayjs/plugin/weekOfYear';
import utcPlugin from 'dayjs/plugin/utc';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import objectSupportPlugin from 'dayjs/plugin/objectSupport';
import pluralGetSetPlugin from 'dayjs/plugin/pluralGetSet';

type LocaleSpecification = typeof locale;

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);
dayjs.extend(quarterPlugin);
dayjs.extend(weekPlugin);
dayjs.extend(utcPlugin);
dayjs.extend(advancedFormatPlugin);
dayjs.extend(objectSupportPlugin);
dayjs.extend(pluralGetSetPlugin);

// Moment used to support this, but dayjs doesn't which breaks direct comparison (<, >, <=, >=) of durations
const DurationClass = Object.getPrototypeOf(dayjs.duration(1, 'day'));
DurationClass.valueOf = function () {
  return this.asMilliseconds();
};

export default dayjs;
export type { Dayjs, Duration, LocaleSpecification, UnitType, QUnitType, OpUnitType, ManipulateType, DurationUnitType };
