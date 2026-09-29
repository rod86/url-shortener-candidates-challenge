import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError';

export class ShortLinkNotFoundError extends DomainError {
    readonly code = 'SHORT_LINK_NOT_FOUND';
    readonly category: ErrorCategory = 'NotFound';

    constructor(shortCode: string) {
        super(`Short link not found for short code: ${shortCode}`);
    }
}
