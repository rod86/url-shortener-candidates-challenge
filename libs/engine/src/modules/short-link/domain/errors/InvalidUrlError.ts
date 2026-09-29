import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class InvalidUrlError extends DomainError {
    readonly code = 'INVALID_URL';
    readonly category: ErrorCategory = 'Unprocessable';

    constructor(url: string) {
        super(`Invalid url: ${url}`);
    }
}
