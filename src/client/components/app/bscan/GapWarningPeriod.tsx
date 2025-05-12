import type { PeriodReferenceBase } from "./types.ts";
import type React from "../../../React";

function getDaysBetween(gapStartDate: Date, gapEndDate: Date) {
    const gapMs = gapEndDate.getTime() - gapStartDate.getTime();
    return gapMs / 1000 / 60 / 60 / 24 + 1;
}

export default (React: React) => function GapWarningPeriod(props: {
    gapStartDate: Date,
    gapEndDate: Date,
    addReference: (reference: PeriodReferenceBase) => void,
}) {
    const { gapStartDate, gapEndDate, addReference } = props;
    const gapDays = getDaysBetween(gapStartDate, gapEndDate);
    return gapDays < 28 ? undefined : <li className="gap-warning-period">
        <div className="gap-days-holder">
            {gapDays} days gap
        </div>
        <label className="add-entry-button text-button">
            <div>Add Reference</div>
            <input className="plus-icon" type="checkbox" name="Add missing Reference for the gap" onChange={() => {}} checked={false} required={true} onInput={() => {
                addReference({
                    ReferenceTypeValueId: 0,
                    StartDate: gapStartDate.toISOString(),
                    EndDate: gapEndDate.toISOString(),
                    __unsavedId: Symbol("New Occupation"),
                });
            }}/>
        </label>
    </li>;
};