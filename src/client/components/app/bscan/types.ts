import type { IsoDate, IsoDateTime, IsoDateTimeOffset } from "../../../../../types/utility.ts";

type SavedReferenceId = {
    OriginalApplicantReferenceId: number,
    ApplicantReferenceRequestId: number | null,
} | {
    OriginalApplicantReferenceId: number | null,
    ApplicantReferenceRequestId: number,
};

type UnsavedReferenceId = {
    __unsavedId: symbol,
};

export type ReferenceBase = {
    ReferenceTypeValueId: number | null,
    __changed?: boolean,
    Address?: string | null,
} & (SavedReferenceId | UnsavedReferenceId);

export type PeriodReferenceBase = ReferenceBase & {
    StartDate: IsoDate | IsoDateTimeOffset | IsoDateTime, // "2023-07-01T03:00:00+03:00"
    EndDate: IsoDate | IsoDateTimeOffset | IsoDateTime | null, // null
};

type ActualOccupationReference = PeriodReferenceBase & {
    CompanyName: string, // "Progmeistars"
    Email: string, // "kursi@progmeistars.lv"
    Phone: string | null,
    JobRole: string | null, // "Programming: 5 base courses, 3 specialized courses: Delphi/OOP, C/Data; Java"
};

export type EducationPeriodReference = ActualOccupationReference & {
    ReferenceTypeValueId: 1077,
};

export type WorkPeriodReference = ActualOccupationReference & {
    /**
     * ID in ListValues table
     * - 1078: EMPLOYMENT AGENCY REF (removed)
     * - 1079: EMPLOYMENT REF
     * - 1080: SELF EMPLOYMENT REF
     * - 1081: FAMILY BUSINESS EMPLOYMENT REF (removed)
     * - 1082: VOLUNTARY REF
     * - 1083: BENEFITS OFFICE REF
     */
    ReferenceTypeValueId: 1079 | 1080 | 1082 | 1083 | 1078 | 1081,
    RefereeName: string | null,
    ContactCurrentEmployer: boolean,
    ReasonForNotContactCurrentEmployer: string | null, // ""
    Comments: string | null, // reason for leaving
};

export type GapPeriodReference = PeriodReferenceBase & {
    ReferenceTypeValueId: 1075,
    GapReason: string,
    GapActivities?: string | null,
    GapSupport?: string | null,
};

export type NewPeriodReference = PeriodReferenceBase & {
    ReferenceTypeValueId: null,
};

export type OccupationPeriodReference = EducationPeriodReference | WorkPeriodReference | GapPeriodReference | NewPeriodReference;

export type PersonalReference = ReferenceBase & {
    ReferenceTypeValueId: 1076,
    RefereeName: string,
    Occupation: string,
    Email: string,
    Phone: string | null,
    RelationDuration: string,
    RelationType: string,
    RelationFrequency: string,
};

export type ParentsNames = {
    FatherFirstName: string | null,
    FatherLastName: string | null,
    MotherFirstName: string | null,
    MotherMaidenLastName: string | null,
};

/** @see BscanGlobalFields.cs */
export type BscanGlobalFields = ParentsNames & {
};

export type BscanFormData = BscanGlobalFields & {
    PersonalReferences: readonly PersonalReference[],
    OccupationReferences: readonly OccupationPeriodReference[],
};