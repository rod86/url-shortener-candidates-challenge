import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class InvalidShortCodeLengthError extends DomainError {
    readonly code = 'INVALID_SHORT_CODE_LENGTH';
    readonly category: ErrorCategory = 'Unprocessable';

    constructor(length: number, minLength: number) {
        super(`Invalid short code length: ${length}. It must be an integer of at least ${minLength}`);
    }
}
