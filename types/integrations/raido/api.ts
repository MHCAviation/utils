import type { IsoDate, Brand,IataAirport,IsoDateTime } from "../../utility";
import type { CrewCode } from "../../nav";

const HumanResourceUniqueIdTag = Symbol("HumanResourceUniqueId");
export type HumanResourceUniqueId = Brand<number, typeof HumanResourceUniqueIdTag>;

export type Crew = {
    "Active": true,
    "UniqueId": HumanResourceUniqueId,
    "Number": CrewCode,
    "Code1": "18201",
    "Code2": "68270",
    "Firstname": "GUENTER",
    "Middlename": "HORST",
    "Lastname": "LACHNER",
    "Nickname": "0",
    "Gender": "Male",
    "Seniority": 0,
    "Base": "BKK",
    "Rank": "CP",
    "Qualification": "B747",
    "Type": "P",
    "CreatedAt": "2024-06-20T09:21:46Z",
    "ModifiedAt": "2024-07-19T00:23:04Z",
    "DateOfEmployment": "2021-09-06T00:00:00Z",
    "DateOfBirth": "1966-03-25T00:00:00Z",
};

/** @see https://aai-apim-dev-northeu-01.developer.azure-api.net/api-details#api=abd-uat-rest-v1&operation=Roster_GetRosters&definition=RosterActivity */
export type RosterActivity = {
    "AssignedRank": "SC" | "CC" | "G2" | "OF" | "FO" | "CP" | "MX" | "LM",
    "PairingId": 0,
    /** seems to always be empty */
    "PairingName": "",
    "Code": "SV5501" | "FLT" | "GT" | "HSV" | "SBN" | "SBA" | "OFF" | "ILL" | "CFD" | "SBD" | "EML" | "8h" | "VAU" | "AV7" | "AV4" | "SCO" | "SV5461" | "SV4461" | "GTD" | "HTN" | "HTM" | "R14" | "DUT" | "CBO" | "HTL" | "S74" | "12h" | "APP" | "VAC" | "POT" | "DLRP" | "ULV" | "RLO" | "LMD" | "LEE" | "COU" | "NTS" | "PXP" | "CRM" | "DGR" | "AID" | "R12" | "ET4" | "ROF" | "WBB" | "OFN" | "SW" | "EA4" | "S77",
    "RefUniqueId": 109,
    "SftFASTActType": "Work" | "" | "Crewing",
    /** appears to always be false, probably because it's testing environment */
    "Confirmed": false,
    /** appears to always be false */
    "IsCarryOverActivity": false,
    "UniqueId": 898671,
    "ActivityType": "REFERENCEACTIVITY" | "FLIGHT",
    "ActivitySubType": "" | "Unknown" | "Transport" | "Hotel" | "StandBy" | "DayOff" | "Illness" | "Vacation" | "Shift" | "Training" | "Simulator",
    "ActivityCode": "SV5501" | "FLT" | "GT" | "HSV" | "SBN" | "SBA" | "OFF" | "ILL" | "CFD" | "SBD" | "EML" | "8h" | "VAU" | "AV7" | "AV4" | "SCO" | "SV5461" | "SV4461" | "GTD" | "HTN" | "HTM" | "R14" | "DUT" | "CBO" | "HTL" | "S74" | "12h" | "APP" | "VAC" | "POT" | "DLRP" | "ULV" | "RLO" | "LMD" | "LEE" | "COU" | "NTS" | "PXP" | "CRM" | "DGR" | "AID" | "R12" | "ET4" | "ROF" | "WBB" | "OFN" | "SW" | "EA4" | "S77",
    "StartAirportCode": IataAirport,
    "EndAirportCode": IataAirport,
    "Start": IsoDateTime,
    "End": IsoDateTime,
    "StartLocalTimeDiff": 420,
    "EndLocalTimeDiff": 180,
    "StartBaseTimeDiff": 420,
    "EndBaseTimeDiff": 420,
    "EquipmentType": "",
    "EquipmentVersion": "",
    "Complement": "",
    "RosterDesignator": "",
    "LegalException": "",
    "Credit": 0,
    "Comment": "",
};

export type RosterCrew = Crew & {
    RosterActivities: RosterActivity[],
};

export type ConfigurationData_GetReferenceActivities_RS = {
    "Name": string,
    "ShortCode": string,
    "ShortCode2": string,
    "WholeDay": true,
    "Active": true,
    "Comment": string,
    "DataType": string,
    "Filter": string,
    "Type": string,
    "DutyType": string,
    "TimeMode": string,
    "ReferenceGroup": string,
    "DefaultStartTime": 0,
    "DefaultEndTime": 0,
    "DefaultLength": 0,
    "UniqueID": string,
}[];

export type ConfigurationData_GetAircraftTypes_RS = {
    "Active": true,
    "UniqueId": 0,
    "Name": string,
    "IATA": string,
    "ICAO": string,
    "AircraftInstances": [{
        "AircraftName": string,
        "FuelConsumption": 0,
        "MaxTakeOffWeight": 0,
        "Availabilities": string[],
        "Availability": string,
        "CurrentBase": string,
        "HistoricalBases": string[],
        "AircraftVersion": string,
    }],
}[];

export type Crew_GetCrew_RQ = {
    ReferenceDate: IsoDate, // Format - date-time (as date-time in RFC3339)
    FilterID?: number, //  Format - int32.
    FilterName?: string,
    UniqueID?: string,
    OnlyActiveCrew?: boolean,
    OnlyActiveRecords?: boolean,
    empNumber?: CrewCode,
    requestData?: string[],
    offset?: number, // Format - int32.
    /** seems like you can just pass 1000 to get all 824 people that are in there and not mess with offset */
    limit?: number, // Format - int32.
};

export type Crew_GetCrew_RS = Crew[];

export type Roster_GetRosters_RQ = {
    From: IsoDate, // Format - date-time (as date-time in RFC3339).
    To: IsoDate, // Format - date-time (as date-time in RFC3339).
    FilterID?: number, // Format - int32.
    UniqueId?: HumanResourceUniqueId,
    FilterName?: string,
    RosterFilterID?: number, // Format - int32.
    RosterFilterName?: string,
    RosterType?: string,
    ReferenceActivity?: string,
    OnlyActive?: boolean,
    CrewWithActivity?: boolean,
    WithCarryOverActivities?: boolean,
    RequestData?: string[],
};

export type Roster_GetRosters_RS = RosterCrew[];