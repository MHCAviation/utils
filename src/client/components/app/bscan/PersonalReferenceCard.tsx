import type React from "../../../React.d.ts";
import UnreactedPhoneNumberField from "../../PhoneNumberField.tsx";
import getForReact from "../../../getForReact.ts";
import type { PersonalReference } from "./types.ts";

export default (React: React) => function PersonalReferenceCard(props: { person: PersonalReference, removeReference: () => void }) {
    const PhoneNumberField = getForReact(React, UnreactedPhoneNumberField);
    const { person, removeReference } = props;
    return <fieldset name="personalReference">
        <div className="personal-reference-card-header">
            <button className="remove-entry-button" type="button" title="Delete Reference" onClick={removeReference}>
                <img src="/images/Icons/bin-red.svg" alt="bin-icon" />
            </button>
        </div>
        <input name="__changed" type="hidden" value={person.__changed ? "true" : ""}/>
        <input name="ReferenceTypeValueId" type="hidden" value="1076"/>
        <input name="OriginalApplicantReferenceId" type="hidden" value={person.OriginalApplicantReferenceId ?? ""}/>
        <input name="ApplicantReferenceRequestId" type="hidden" value={person.ApplicantReferenceRequestId ?? ""}/>
        <div className="personal-reference-card-body">
            <label>
                <span>Name</span>
                <input name="RefereeName" type="text" placeholder="John Smith" required={true} value={person.RefereeName ?? ""}/>
            </label>
            <label>
                <span>Occupation</span>
                <input name="Occupation" type="text" placeholder="Elementary School Teacher" required={true} value={person.Occupation ?? ""}/>
            </label>
            <label>
                <span>How long have you known the above?</span>
                <input name="RelationDuration" placeholder="N years" type="text" required={true} value={person.RelationDuration ?? ""}/>
            </label>
            <label>
                <span>In what capacity have you known the above?</span>
                <input name="RelationType" placeholder="School Friend" required={true} type="text" value={person.RelationType ?? ""}/>
            </label>
            <label>
                <span>How frequent are you in contact?</span>
                <input name="RelationFrequency" type="text" placeholder="Twice a month" required={true} value={person.RelationFrequency ?? ""}/>
            </label>
            <label>
                <span>E-Mail</span>
                <input name="Email" type="email" placeholder="abc@example.com" required={true} value={person.Email ?? ""}/>
            </label>
            <PhoneNumberField value={person.Phone}/>
            <label>
                <span>Address</span>
                <textarea name="Address" placeholder="4 Privet Drive, Little Whinging, Surrey, 1234, United Kingdom" value={person.Address ?? ""}/>
            </label>
        </div>
    </fieldset>;
};