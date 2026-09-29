export class ShortLinkNotFoundError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "ShortLinkNotFoundError";
    }
}

export class ClickCreationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "ClickCreationError";
    }
}
