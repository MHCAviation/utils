import type { IsoDate,MonthStr,Pad2 } from "../types/utility";

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

function pad2(value: number): Pad2 {
    if (value < 10) {
        return `0${value}` as const;
    } else {
        return value;
    }
}

export function getMonthStr({ year, month }: AbsoluteMonth): MonthStr {
    return `${year}-${pad2(month)}` as const;
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