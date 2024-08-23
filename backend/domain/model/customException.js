export class CustomException extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}