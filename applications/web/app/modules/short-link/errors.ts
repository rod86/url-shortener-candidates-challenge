export class InvalidUrlError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "InvalidUrlError";
    }
}

export class ShortLinkCreationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "ShortLinkCreationError";
    }
}
