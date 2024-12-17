
export default class HttpStatusError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly isExpected = false
    ) {
        super(status + ": " + message);
    }
}
