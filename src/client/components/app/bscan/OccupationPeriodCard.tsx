import type { OccupationPeriodReference } from "./types";
import UnreactedPhoneNumberField from "../../PhoneNumberField.tsx";
import { BSCAN_COVERAGE_START_DATE } from "./BscanFormLogic.ts";
import type React from "../../../React";
import getForReact from "../../../getForReact.ts";

function ignoreIncompleteInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.preventDefault();
    } else {
        e.target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function propagated() {
}

export default (React: React) => function OccupationPeriodCard(props: {
    occupation: OccupationPeriodReference,
    removeReference?: () => void,
}) {
    const PhoneNumberField = getForReact(React, UnreactedPhoneNumberField);
    const { occupation, removeReference } = props;
    const startDate = !occupation.StartDate
        ? BSCAN_COVERAGE_START_DATE
        : new Date(occupation.StartDate);
    const endDate = !occupation.EndDate
        ? new Date()
        : new Date(occupation.EndDate);
    const totalYears = ((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 / 365).toFixed(1);

    let datesError = "";
    if (occupation.StartDate &&
        occupation.EndDate &&
        occupation.StartDate > occupation.EndDate
    ) {
        datesError = "Start Date must be before the End Date";
    }

    return <fieldset name="occupationPeriodReference" className="occupation-period-form section-card" data-reference-type={occupation.ReferenceTypeValueId}>
        <input name="__changed" type="hidden" onChange={propagated} value={occupation.__changed ? "true" : ""}/>
        <input name="OriginalApplicantReferenceId" type="hidden" onChange={propagated} value={"OriginalApplicantReferenceId" in occupation ? occupation.OriginalApplicantReferenceId ?? "" : ""}/>
        <input name="ApplicantReferenceRequestId" type="hidden" onChange={propagated} value={"ApplicantReferenceRequestId" in occupation ? occupation.ApplicantReferenceRequestId ?? "" : ""}/>
        <div className="occupation-period-dates-header">
            <label>
                <span>End Date</span>
                <input
                    ref={el => el && el.setCustomValidity(datesError)}
                    title={datesError || undefined}
                    name="EndDate" type="date"
                    defaultValue={occupation.EndDate?.slice(0, 10) ?? ""}
                    min={occupation.StartDate?.slice(0, 10) ?? "1900-01-01"}
                    max={"9999-12-31"}
                    placeholder="Current"
                />
            </label>
            <div className="period-total-years-panel">
                <div className="period-total-years-badge">{totalYears} years</div>
                {!removeReference ? <span></span> : <button
                    className="remove-entry-button"
                    type="button"
                    title="Delete Reference"
                    onClick={removeReference}
                >
                    <img src="/images/Icons/bin-red.svg" alt="bin-icon" />
                </button>}
            </div>
            <label>
                <span>Start Date</span>
                <input
                    ref={el => el && el.setCustomValidity(datesError)}
                    title={datesError || undefined}
                    name="StartDate" type="date"
                    defaultValue={occupation.StartDate?.slice(0, 10) ?? ""}
                    max={occupation.EndDate?.slice(0, 10) ?? "9999-12-31"}
                    min="1900-01-01"
                    onChange={ignoreIncompleteInput}
                    required={true}
                />
            </label>
        </div>
        <div className="occupation-period-details-grid" data-reference-type-value-id={occupation.ReferenceTypeValueId ?? ""}>
            <label>
                <span>Reference Kind</span>
                <select name="ReferenceTypeValueId" onChange={propagated} value={occupation.ReferenceTypeValueId ?? ""} required={true}>
                    <option value="">Not Selected</option>
                    <option value="1077">Education</option>
                    <option value="1079">Regular Employment</option>
                    <option value="1080">Self-Employment</option>
                    <option value="1082">Voluntary</option>
                    <option value="1083">Benefits Office</option>
                    <option value="1075">Gap</option>
                </select>
            </label>
            {occupation.ReferenceTypeValueId === 1075 ? <> {/* Gap */}
                <label>
                    <span>Gap Reason</span>
                    <input name="GapReason" list="gap-reason-options" type="text" onChange={propagated} value={occupation.GapReason ?? ""} required={true}/>
                </label>
                <label>
                    <span>What were you doing</span>
                    <input name="GapActivities" placeholder="I was..." type="text" onChange={propagated} value={occupation.GapActivities ?? ""}/>
                </label>
                <label>
                    <span>Where were you residing</span>
                    <textarea name="Address" placeholder="4 Privet Drive, Little Whinging, Surrey, 1234, United Kingdom" onChange={propagated} value={occupation.Address ?? ""}></textarea>
                </label>
                <label>
                    <span>How were you supporting yourself</span>
                    <input name="GapSupport" placeholder="By..." type="text" onChange={propagated} value={occupation.GapSupport ?? ""}/>
                </label>
            </> : occupation.ReferenceTypeValueId === 1077 ? <> {/* Education */}
                <label>
                    <span>Name of Institution</span>
                    <input name="CompanyName" type="text" placeholder="Example State University" onChange={propagated} value={occupation.CompanyName ?? ""} required={true}/>
                </label>
                <label>
                    <span>Contact Email</span>
                    <input name="Email" type="email" placeholder="abc@example.com" onChange={propagated} value={occupation.Email ?? ""} required={true}/>
                </label>
                <label>
                    <span>Qualification gained</span>
                    <input name="JobRole" type="text" placeholder="First Officer" onChange={propagated} value={occupation.JobRole ?? ""}/>
                </label>
                <PhoneNumberField value={occupation.Phone}/>
                <label>
                    <span>Address.</span>
                    <textarea name="Address" placeholder="4 Privet Drive, Little Whinging, Surrey, 1234, United Kingdom" onChange={propagated} value={occupation.Address ?? ""}></textarea>
                </label>
            </> : occupation.ReferenceTypeValueId === null ? <> {/* New Entry */}
                <label>
                    <span>Please, select the reference kind to proceed</span>
                </label>
            </> : <> {/* Work */}
                <label>
                    <span>Company Name</span>
                    <input name="CompanyName" type="text" placeholder="Example Airlines" onChange={propagated} value={occupation.CompanyName ?? ""} required={true}/>
                </label>
                <label>
                    <span>Contact Email</span>
                    <input name="Email" type="email" placeholder="abc@example.com" onChange={propagated} value={occupation.Email ?? ""} required={true}/>
                </label>
                <label>
                    <span>Job Title</span>
                    <input name="JobRole" type="text" placeholder="Captain" onChange={propagated} value={occupation.JobRole ?? ""}/>
                </label>
                <label>
                    <span>Contact Person's Name</span>
                    <input name="RefereeName" type="text" placeholder="John Smith" onChange={propagated} value={occupation.RefereeName ?? ""}/>
                </label>
                {!occupation.EndDate ? undefined : <label>
                    <span>Reason for Leaving</span>
                    <input name="Comments" type="text" placeholder="This job was..." onChange={propagated} value={occupation.Comments ?? ""}/>
                </label>}
                <div>
                    <label className="inline-label">
                        <span>Can we obtain a reference from your last employer?</span>
                        <input name="ContactCurrentEmployer" type="checkbox" required={!occupation.ReasonForNotContactCurrentEmployer} onChange={propagated} checked={occupation.ContactCurrentEmployer}/>
                    </label>
                    {occupation.ContactCurrentEmployer ? undefined : <label className="inline-label">
                        <span>Reason?</span>
                        <input name="ReasonForNotContactCurrentEmployer" type="text" placeholder="Because..." onChange={propagated} value={occupation.ReasonForNotContactCurrentEmployer ?? ""}/>
                    </label>}
                </div>
                <PhoneNumberField value={occupation.Phone}/>
                <label>
                    <span>Address</span>
                    <textarea name="Address" placeholder="4 Privet Drive, Little Whinging, Surrey, 1234, United Kingdom" onChange={propagated} value={occupation.Address ?? ""}></textarea>
                </label>
            </>}
        </div>
    </fieldset>;
};
