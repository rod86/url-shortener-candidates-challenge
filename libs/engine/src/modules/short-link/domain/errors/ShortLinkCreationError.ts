import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class ShortLinkCreationError extends DomainError {
    readonly code = 'SHORT_LINK_CREATION_FAILED';
    readonly category: ErrorCategory = 'Internal';

    constructor(url: string, cause?: unknown) {
        super(`Short link could not be created for url: ${url}`, { cause });
    }
}
