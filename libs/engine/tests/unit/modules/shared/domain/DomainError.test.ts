import { describe, expect, it } from 'vitest';
import { DomainError, type ErrorCategory } from '@src/modules/shared/domain/DomainError.js';

class StubDomainError extends DomainError {
    readonly code = 'STUB_ERROR';
    readonly category: ErrorCategory = 'Unprocessable';

    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

describe('DomainError', () => {
    it('derives the name from the concrete subclass', () => {
        const error = new StubDomainError('boom');

        expect(error.name).toBe('StubDomainError');
        expect(error.message).toBe('boom');
        expect(error.code).toBe('STUB_ERROR');
        expect(error.category).toBe('Unprocessable');
        expect(error).toBeInstanceOf(DomainError);
        expect(error).toBeInstanceOf(Error);
        expect(error.cause).toBeUndefined();
    });

    it('forwards the cause', () => {
        const cause = new Error('root cause');

        expect(new StubDomainError('boom', { cause }).cause).toBe(cause);
    });
});
