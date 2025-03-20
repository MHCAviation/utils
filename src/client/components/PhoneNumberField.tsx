import type { ClipboardEvent, KeyboardEvent } from "react";
import React from "../React";

/** heuristic solution, but should work fine in majority of cases */
function preventNonNumericInput(event: KeyboardEvent) {
    if (event.key.length === 1 && // "Backspace"
        !event.ctrlKey && // ctrl+v
        !event.metaKey && // mac
        (event.key < "0" || event.key > "9")
    ) {
        event.preventDefault();
    }
}

function preventNonNumericPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData.getData("text").replace(/\D/g, "");
    const input = event.currentTarget as HTMLInputElement;
    const { selectionStart, selectionEnd } = input;
    input.value = input.value.slice(0, selectionStart!) + text + input.value.slice(selectionEnd!);
    input.setSelectionRange(selectionStart! + text.length, selectionStart! + text.length);
}

export default (React: React) => function PhoneNumberField(props: { value: string | null }) {
    return <label>
        <span>Contact Telephone Number</span>
        <input
            name="Phone"
            onKeyDown={preventNonNumericInput}
            onPaste={preventNonNumericPaste}
            type="text" // setting number will erase existing records with non-numeric characters
            maxLength={15}
            minLength={4}
            max="999999999999999"
            min="1000"
            step="1"
            placeholder="0123456789..."
            value={props.value ?? ""}
        />
    </label>;
}