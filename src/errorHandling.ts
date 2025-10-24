function stringifyErrorShallow(error: unknown) {
    if (!error) {
        return "(empty error)";
    } else if (error && typeof error === "object"
            && "message" in error
            && typeof error.message === "string"
    ) {
        return String(error.message);
    } else if (typeof error === "string") {
        return error;
    } else if (error + "" !== "[object Object]") {
        return error + "";
    } else {
        return "Unknown format error: " + JSON.stringify(error);
    }
}

/**
 * many libraries throw objects that do not extend Error, this function attempts
 * to extract the message from any kind of error object using popular conventions
 * like having `toString()` implementation or `message` property
 * @return {string}
 */
export function stringifyError(error: unknown) {
    if (error instanceof AggregateError) {
        return error.errors.map(stringifyErrorShallow).join("\n");
    } else {
        return stringifyErrorShallow(error);
    }
}