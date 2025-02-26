import type { Brand } from "./utility";

/**
 * @package -  here you'll find types related to our NAV 2009 software integration
 */

const UpperCased = Symbol("UpperCased");
export type UpperCased<T> = T & { [k in typeof UpperCased]: undefined };

const CompanyNameTag = Symbol("CompanyName");
export type CompanyNameLiteral = "Airborne - Malta" | "HEL - AAIUSD" | "F2R - LALEUR" | "F2R - SLYEUR" | "F2R - DATEUR" | `${string} - ${string}`;
export type CompanyName = Brand<CompanyNameLiteral, typeof CompanyNameTag>;
export const CompanyName = (value: string): CompanyName => {
    if (!value.match(/^(\w+\s*)+-\s*\w+$/) &&
        value.toUpperCase() !== "LSN - NVD EUR EMPL" &&
        value.toUpperCase() !== "MHCAVIATION SIA"
    ) {
        throw new Error("Supplied COMPANYNAME has invalid format: " + value);
    }
    return value as CompanyName;
};
export type COMPANYNAME = UpperCased<CompanyName>;
/** for whatever reason using `${string} - ${string}` instead of string makes typescript not recognize regular `===` comparison */
export function isSameCompany(actual: CompanyName, expected: CompanyNameLiteral) {
    return toCOMPANYNAMEUC(actual) === toUpperCase(expected);
}

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
    const unprefixed = value.replace(/^\w+-/, ""); // AM-PICO in Air Atlanta
    if (unprefixed.length < 3) {
        throw new Error("CrewCode can not be less than 3 characters");
    }
    if (unprefixed.length > 6) {
        throw new Error("CrewCode is not expected to be longer than 6 characters");
    }
    if (!unprefixed.match(/^[A-Z][A-Z0-9]+$/)) {
        throw new Error("CrewCode is expected to start with a letter and be followed only by alpha-numeric characters");
    }
    return value as CrewCode;
};

export type CREWCODE = UpperCased<CrewCode>;

export function toUpperCase<T extends string>(value: T): UpperCased<T> {
    return value.toUpperCase() as UpperCased<T>;
}

export function toCrewCodeUc(crewCode: CrewCode): CREWCODE {
    return toUpperCase(crewCode);
}

export function toCOMPANYNAMEUC(companyName: CompanyName): COMPANYNAME {
    return toUpperCase(companyName);
}