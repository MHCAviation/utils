/**
 * @package -  here you'll find types related to our NAV 2009 software integration
 */ import type { AbsoluteMonth } from "../src/dates";
import type { Brand } from "./utility";


export type PayrollLocator = AbsoluteMonth & {
    company: CompanyName,
};

const UpperCased = Symbol("UpperCased");
export type UpperCased<T> = T & { [k in typeof UpperCased]: undefined };

const CompanyNameTag = Symbol("CompanyName");
export type CompanyName = Brand<"Airborne - Malta" | "HEL - AAIUSD" | "F2R - LALEUR" | "F2R - SLYEUR" | "F2R - DATEUR" | string, typeof CompanyNameTag>;
export type COMPANYNAME = UpperCased<CompanyName>;

/**
 * aka 3/4 letter code (though it may sometimes be longer than 4 characters)
 * aka employee code
 * aka No_
 * aka Kennitala
 * aka Payroll No
 */
const CrewCode = Symbol("CrewCode");
export type CrewCode = Brand<"MVS" | "KAR" | "GIRE" | "UPC" | "JNM" | "AAD" | "klar" | string, typeof CrewCode>;
export type CREWCODE = UpperCased<CrewCode>;