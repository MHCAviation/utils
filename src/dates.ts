import type { IsoDate,MonthStr,NumericString,Pad2 } from "../types/utility";

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

export function decrementDay(date: IsoDate): IsoDate {
    const dateObj = new Date(date);
    dateObj.setUTCDate(dateObj.getUTCDate() - 1);
    return getDatePart(dateObj);
}

export function incrementDay(date: IsoDate): IsoDate {
    const dateObj = new Date(date);
    dateObj.setUTCDate(dateObj.getUTCDate() + 1);
    return getDatePart(dateObj);
}

/** 0 = Sunday */
export function getWeekDayName(weekDay: number) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekDay];
}

export function getMonthShortName(month: number) {
    return [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec",
    ][month - 1];
}

export function getMonthFullName(month: number) {
    return [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ][month - 1];
}