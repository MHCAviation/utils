import type { CompanyName } from "../../types/nav.ts";

export function parseCOMPANYNAME(COMPANYNAME: CompanyName) {
    if (COMPANYNAME.toUpperCase() === "AIRBORNE - MALTA") {
        return {
            partnerCompany: "APM",
            client: "AAI",
            currency: "USD",
        };
    } else if (COMPANYNAME.toUpperCase() === "_TEST EUR") {
        return {
            partnerCompany: "F2R",
            client: "TEST",
            currency: "EUR",
        };
    }
    // CRM IR - ABBEUR
    // F2R - EAFEUR
    // Airborne - Malta
    const match = COMPANYNAME.match(/^(\w*\s*\w+)\s*-\s*(\w+)([A-Z]{3})$/);
    if (!match) {
        return null;
    }
    const [, partnerCompany, client, currency] = match;
    return { partnerCompany, client, currency };
}