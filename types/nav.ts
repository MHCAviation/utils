/**
 * @package -  here you'll find types related to our NAV 2009 software integration
 */ import type { Brand } from "./utility";

const UpperCased = Symbol("UpperCased");
export type UpperCased<T> = T & { [k in typeof UpperCased]: undefined };

const CompanyNameTag = Symbol("CompanyName");
type CompanyNameLiteral = "Airborne - Malta" | "HEL - AAIUSD" | "F2R - LALEUR" | "F2R - SLYEUR" | "F2R - DATEUR" | string;
export type CompanyName = Brand<CompanyNameLiteral, typeof CompanyNameTag>;
export const CompanyName = (value: string): CompanyName => {
    if (!value.match(/^\w+\s*-\s*\w+$/) &&
        value.toUpperCase() !== "LSN - NVD EUR EMPL"
    ) {
        throw new Error("Supplied COMPANYNAME has invalid format");
    }
    return value as CompanyName;
};
export type COMPANYNAME = UpperCased<CompanyName>;

/**
 * aka 3/4 letter code (though it may sometimes be longer than 4 characters)
 * aka employee code
 * aka No_
 * aka Kennitala
 * aka Payroll No
 */
const CrewCodeTag = Symbol("CrewCode");
export type CrewCode = Brand<"MVS" | "KAR" | "GIRE" | "UPC" | "JNM" | "AAD" | "klar" | string, typeof CrewCodeTag>;
export const CrewCode = (value: string): CrewCode => {
    value = value.trim().toUpperCase();
    if (value.length < 3) {
        throw new Error("CrewCode can not be less than 3 characters");
    }
    if (value.length > 6) {
        throw new Error("CrewCode is not expected to be longer than 6 characters");
    }
    if (!value.match(/^[A-Z]+$/)) {
        throw new Error("CrewCode is expected to consist only of letters");
    }
    return value as CrewCode;
};

export type CREWCODE = UpperCased<CrewCode>;