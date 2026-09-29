import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class ShortCodeGenerationError extends DomainError {
    readonly code = 'SHORT_CODE_GENERATION_FAILED';
    readonly category: ErrorCategory = 'Internal';

    constructor(attempts: number) {
        super(`Could not generate a unique short code after ${attempts} attempts`);
    }
}
