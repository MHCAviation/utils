/**
 * @package -  here you'll find types related to our NAV 2009 software integration
 */ import type { Brand,CurrencyIsoCode } from "./utility";

const UpperCased = Symbol("UpperCased");
export type UpperCased<T> = T & { [k in typeof UpperCased]: undefined };

// `| string` because otherwise "TS2590: Expression produces a union type that is too complex to represent."
type Letter = "Q"|"W"|"E"|"R"|"T"|"Y"|"U"|"I"|"O"|"P"|"A"|"S"|"D"|"F"|"G"|"H"|"J"|"K"|"L"|"Z"|"X"|"C"|"V"|"B"|"N"|"M" | string;
type Digit = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9" | string;
type AlphaNum = Letter | Digit;

type PartnerCompanyCode = "F2R" | "HEL" | "D2W" | "APM" | `${AlphaNum}${AlphaNum}${AlphaNum}`;
type ClientCode = "AAI" | "LAL" | "F2R" | `${AlphaNum}${AlphaNum}${AlphaNum}`;

const CompanyNameTag = Symbol("CompanyName");
type CompanyNameLiteral = "Airborne - Malta" | "HEL - AAIUSD" | "F2R - LALEUR" | "F2R - SLYEUR" | "F2R - DATEUR" | `${PartnerCompanyCode} - ${ClientCode}${CurrencyIsoCode | string}`;
export type CompanyName = Brand<CompanyNameLiteral, typeof CompanyNameTag>;
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