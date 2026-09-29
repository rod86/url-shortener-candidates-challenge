import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class ClickCreationError extends DomainError {
    readonly code = 'CLICK_CREATION_FAILED';
    readonly category: ErrorCategory = 'Internal';

    constructor(shortCode: string, cause?: unknown) {
        super(`Click could not be stored for short code: ${shortCode}`, { cause });
    }
}
