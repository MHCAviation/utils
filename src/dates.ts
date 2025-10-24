import type { IsoDate,IsoTimeUpToMinutes,MonthStr,NumericString,Pad2 } from "../types/utility";

export type AbsoluteMonth = {
    year: number,
    month: number,
};

export function getDatePart(dateTime: Date | `${IsoDate}${string}`): IsoDate {
    if (dateTime instanceof Date) {
        return dateTime.toISOString().slice(0, 10) as IsoDate;
    } else {
        return dateTime.slice(0, 10) as IsoDate;
    }
}

export function getTimePart(datetime: `${IsoDate}${" " | "T"}${IsoTimeUpToMinutes}${string}`): IsoTimeUpToMinutes {
    return datetime.slice(11, 16) as IsoTimeUpToMinutes;
}

function pad4(value: number): NumericString {
    return String(value).padStart(4, "0") as NumericString;
}

export function pad2(value: number): Pad2 {
    if (value < 10) {
        return `0${value}` as const;
    } else {
        return value;
    }
}

export function getMonthStr({ year, month }: AbsoluteMonth): MonthStr {
    return `${pad4(year)}-${pad2(month)}` as const;
}

export function getMonthDate(yearMonth: AbsoluteMonth, day: number): IsoDate {
    return `${getMonthStr(yearMonth)}-${pad2(day)}` as const;
}

export function getMonthStartDate(yearMonth: AbsoluteMonth): IsoDate {
    return getMonthDate(yearMonth, 1);
}

export function getMonthEndDate(yearMonth: AbsoluteMonth): IsoDate {
    const lastDay = getNumberOfDays(yearMonth);
    return getMonthDate(yearMonth, lastDay);
}

export function* getMonthDates(yearMonth: AbsoluteMonth): Iterable<IsoDate> {
    const daysInMonth = getNumberOfDays(yearMonth);
    for (let dayIndex = 0; dayIndex < daysInMonth; ++dayIndex) {
        yield getMonthDate(yearMonth, dayIndex + 1);
    }
}

function getMonthStartDateObj({ year, month }: AbsoluteMonth) {
    return new Date(getMonthStartDate({ year, month }));
}

function getMonthEndDateObj({ year, month }: AbsoluteMonth): Date {
    const endDateObj = getMonthStartDateObj({ year, month });
    endDateObj.setUTCMonth(endDateObj.getUTCMonth() + 1);
    endDateObj.setUTCDate(endDateObj.getUTCDate() - 1);
    return endDateObj;
}

export function getNumberOfDays({ year, month }: AbsoluteMonth) {
    const endDateObj = getMonthStartDateObj({ year, month });
    endDateObj.setUTCMonth(endDateObj.getUTCMonth() + 1);
    endDateObj.setUTCDate(endDateObj.getUTCDate() - 1);
    return endDateObj.getUTCDate();
}

/**
 * 2025-01-25 - 2025-01-10 = 15
 * 2025-01-25 - 2025-01-25 = 0
 * 2025-03-01 - 2025-02-28 = 1
 * 2024-03-01 - 2024-02-28 = 2
 */
export function daysBetween(endDate: IsoDate, startDate: IsoDate) {
    endDate = getDatePart(endDate); // just in case we somehow receive DateTime string here
    startDate = getDatePart(startDate);
    const endDateObj = new Date(endDate);
    const startDateObj = new Date(startDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const msDiff = endDateObj.getTime() - startDateObj.getTime();
    // God bless UTC for not observing the goddamn DST
    return msDiff / msPerDay;
}

export function getPastMonth(baseDate: Date): AbsoluteMonth {
    const endDateObj = new Date(baseDate.getTime());
    endDateObj.setUTCDate(0);
    return {
        year: endDateObj.getUTCFullYear(),
        month: endDateObj.getUTCMonth() + 1,
    };
}

export function decrementMonth({ year, month }: AbsoluteMonth) {
    const dateObj = getMonthStartDateObj({ year, month });
    return getPastMonth(dateObj);
}

export function incrementMonth({ year, month }: AbsoluteMonth) {
    const dateObj = getMonthStartDateObj({ year, month });
    dateObj.setUTCMonth(dateObj.getUTCMonth() + 1);
    return {
        year: dateObj.getUTCFullYear(),
        month: dateObj.getUTCMonth() + 1,
    };
}

export function incrementDay(date: IsoDate, step = 1): IsoDate {
    const dateObj = new Date(date);
    dateObj.setUTCDate(dateObj.getUTCDate() + step);
    return getDatePart(dateObj);
}

export function incrementYear(date: IsoDate, value = 1): IsoDate {
    const dateObj = new Date(date);
    dateObj.setUTCFullYear(dateObj.getUTCFullYear() + value);
    return getDatePart(dateObj);
}

export function decrementDay(date: IsoDate): IsoDate {
    return incrementDay(date, -1);
}

/** 0 = Sunday */
export function getWeekDayName(weekDay: number) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekDay];
}

const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
] as const;

export type MonthShortName = (typeof MONTH_SHORT_NAMES)[number];

export function getMonthShortName(month: number): MonthShortName {
    return MONTH_SHORT_NAMES[month - 1];
}

/** @return 1-12 */
export function getMonthFromShortName(shortName: MonthShortName | string): number {
    const index = MONTH_SHORT_NAMES
        .map(cs => cs.toUpperCase())
        .indexOf(shortName.toUpperCase());
    if (index > -1) {
        return index + 1;
    } else {
        throw new Error("Unexpected month short name: " + shortName);
    }
}

export function getMonthFullName(month: number) {
    return [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ][month - 1];
}

export function formatDuration(totalMinutes: number): IsoTimeUpToMinutes {
    const hh = Math.floor(totalMinutes / 60);
    const mm = pad2(Math.floor(totalMinutes % 60));
    return `${hh}:${mm}`;
}

export function unformatDuration(duration: IsoTimeUpToMinutes): number {
    if (!duration.trim()) {
        return 0;
    }
    const [hours, minutes] = duration.split(":");
    return +hours * 60 + Number(minutes ?? "00");
}