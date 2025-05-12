import type { BscanFormData,BscanGlobalFields,OccupationPeriodReference, PeriodReferenceBase,PersonalReference, ReferenceBase } from "./types.ts";
import type { FormEvent } from "react";
import { getRefUid } from "../../../../utils/ReferenceUid.ts";

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const BSCAN_COVERAGE_START_DATE = new Date(TODAY_ISO);
BSCAN_COVERAGE_START_DATE.setUTCFullYear(BSCAN_COVERAGE_START_DATE.getUTCFullYear() - 5);

export { TODAY_ISO, BSCAN_COVERAGE_START_DATE };

export function ensureArray(value: NodeList | Element | null) {
    if (!value) {
        return [];
    } else if (Symbol.iterator in value && typeof value[Symbol.iterator] === "function") {
        return [...value];
    } else {
        return [value];
    }
}

type KeysOfUnion<T> = T extends T ? keyof T: never;

function getAnyFormValues(fieldset: HTMLFieldSetElement) {
    const result: Record<string, unknown> = {};
    for (const element of fieldset.elements) {
        if ("disabled" in element && element.disabled ||
            !("name" in element) ||
            !("value" in element)
        ) {
            continue;
        }
        const name = element.name as KeysOfUnion<BscanGlobalFields>;
        let value;
        if (element instanceof HTMLInputElement) {
            if (element.type === "checkbox") {
                value = element.checked;
            } else if (element.type === "date") {
                value = !element.value ? null : element.value;
            } else {
                value = element.value;
            }
        } else {
            value = element.value;
        }
        result[name] = value;
    }
    return result;
}

function getRefFormValues<T extends ReferenceBase>(fieldset: HTMLFieldSetElement, changedInput: HTMLElement): T {
    const result = getAnyFormValues(fieldset);

    result["ReferenceTypeValueId"] = !result["ReferenceTypeValueId"]
        ? null : Number(result["ReferenceTypeValueId"]);
    result["OriginalApplicantReferenceId"] = !result["OriginalApplicantReferenceId"]
        ? null : Number(result["OriginalApplicantReferenceId"]);
    result["ApplicantReferenceRequestId"] = !result["ApplicantReferenceRequestId"]
        ? null : Number(result["ApplicantReferenceRequestId"]);
    result["__unsavedId"] = !result["__unsavedId"]
        ? null : Number(result["__unsavedId"]);

    if ([...fieldset.elements].includes(changedInput)) {
        result.__changed = true;
    }

    return result as T;
}

type StateValue<S> = [S, (s: S) => void];

const getPeriodStartDate = (period: PeriodReferenceBase) => {
    if (!period.StartDate) {
        return new Date(BSCAN_COVERAGE_START_DATE.toISOString());
    } else if (period.EndDate && period.EndDate < period.StartDate) {
        // sometimes users confuse start date input for end date input because the form
        // goes chronologically from bottom to top which is sometimes not intuitive
        // this mistake is handled in the dates inputs validation, but here we consider the
        // least of the two dates to be the start date just to not make gap calculation go crazy
        return new Date(period.EndDate.slice(0, 10));
    } else {
        return new Date(period.StartDate.slice(0, 10));
    }
};

const getPeriodEndDate = (period: PeriodReferenceBase) => {
    if (!period.EndDate) {
        return new Date(TODAY_ISO);
    } else if (period.StartDate && period.StartDate > period.EndDate) {
        // sometimes users confuse start date input for end date input because the form
        // goes chronologically from bottom to top which is sometimes not intuitive
        // this mistake is handled in the dates inputs validation, but here we consider the
        // greatest of the two dates to be the end date just to not make gap calculation go crazy
        return new Date(period.StartDate.slice(0, 10));
    } else {
        return new Date(period.EndDate.slice(0, 10));
    }
};

export function BscanFormLogic(
    formDataState: StateValue<BscanFormData>
) {
    const [formData, setFormData] = formDataState;

    const getGlobalFields = (): BscanGlobalFields => {
        return formData;
    };

    const getOrderedOccupations = () => {
        return [...formData.OccupationReferences].sort((a, b) => {
            return getPeriodStartDate(b).getTime() - getPeriodStartDate(a).getTime();
        });
    };

    const getPersons = () => {
        return formData.PersonalReferences;
    };

    const addOccupation = (reference: PeriodReferenceBase) => {
        setFormData({
            ...formData,
            OccupationReferences: [
                ...formData.OccupationReferences,
                { ...reference, __changed: true, ReferenceTypeValueId: null },
            ],
        });
    };

    const removeOccupation = (occupation: OccupationPeriodReference) => {
        if ("CompanyName" in occupation && occupation.CompanyName &&
            !confirm("Are you sure you want to remove the " + occupation.CompanyName + " reference?")
        ) {
            return;
        }
        setFormData({
            ...formData,
            OccupationReferences: formData.OccupationReferences
                .filter(o => o !== occupation),
        });
    };

    const addPerson = () => {
        setFormData({
            ...formData,
            PersonalReferences: [
                ...formData.PersonalReferences,
                {
                    ReferenceTypeValueId: 1076,
                    __unsavedId: getRefUid(Symbol("New Person")),
                    __changed: true,
                } as PersonalReference,
            ],
        });
    };

    const removePerson = (person: PersonalReference) => {
        if (person.RefereeName &&
            !confirm("Are you sure you want to remove " + person.RefereeName + "?")
        ) {
            return;
        }
        setFormData({
            ...formData,
            PersonalReferences: formData.PersonalReferences
                .filter(p => p !== person),
        });
    };

    const getFollowingGapStartDate = () => {
        const occupations = getOrderedOccupations();
        const lastGapStartDate = !occupations || occupations.length === 0
            ? new Date(BSCAN_COVERAGE_START_DATE.toISOString())
            : getPeriodEndDate(occupations[0]);
        lastGapStartDate.setUTCDate(lastGapStartDate.getUTCDate() + 1);
        return lastGapStartDate;
    };

    const getPrecedingGap = (occupation: OccupationPeriodReference, i: number) => {
        const occupations = getOrderedOccupations();
        let gapStartDate;
        if (i + 1 >= occupations.length) {
            gapStartDate = BSCAN_COVERAGE_START_DATE;
        } else {
            gapStartDate = getPeriodEndDate(occupations[i + 1]);
        }
        gapStartDate.setUTCDate(gapStartDate.getUTCDate() + 1);
        const gapEndDate = getPeriodStartDate(occupation);
        gapEndDate.setUTCDate(gapEndDate.getUTCDate() - 1);
        return { gapStartDate, gapEndDate };
    };

    const onFormInput = (event: FormEvent<HTMLElement>) => {
        const input = event.target as HTMLElement;
        const form = event.currentTarget as HTMLFormElement;
        const globalCard = form.elements.namedItem("globalFields") as HTMLFieldSetElement | null;
        const periodCards = ensureArray(form.elements.namedItem("occupationPeriodReference")) as HTMLFieldSetElement[];
        const personCards = ensureArray(form.elements.namedItem("personalReference")) as HTMLFieldSetElement[];
        setFormData({
            ...formData,
            ...globalCard ? getAnyFormValues(globalCard) : {},
            PersonalReferences: personCards.map(fs => getRefFormValues(fs, input)),
            OccupationReferences: periodCards.map(fs => getRefFormValues(fs, input)),
        });
    };

    return {
        getGlobalFields,
        getOrderedOccupations,
        getPersons,
        addOccupation,
        removeOccupation,
        addPerson,
        removePerson,
        onFormInput,
        getFollowingGapStartDate,
        getPrecedingGap,
    };
}