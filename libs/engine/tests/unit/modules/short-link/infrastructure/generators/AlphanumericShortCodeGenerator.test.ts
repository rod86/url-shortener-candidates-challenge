import { describe, expect, it } from 'vitest';
import { InvalidShortCodeLengthError } from '@src/modules/short-link/domain/errors/InvalidShortCodeLengthError.js';
import { AlphanumericShortCodeGenerator } from '@src/modules/short-link/infrastructure/generators/AlphanumericShortCodeGenerator.js';

describe('AlphanumericShortCodeGenerator', () => {
    it('generates a code with the configured length', () => {
        const generator = new AlphanumericShortCodeGenerator(8);

        expect(generator.generate()).toHaveLength(8);
    });

    it('generates a code with only letters and digits', () => {
        const generator = new AlphanumericShortCodeGenerator(200);

        expect(generator.generate()).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('generates different codes on each call', () => {
        const generator = new AlphanumericShortCodeGenerator(16);

        expect(generator.generate()).not.toBe(generator.generate());
    });

    it('accepts the minimum length of 5', () => {
        expect(() => new AlphanumericShortCodeGenerator(5)).not.toThrow();
    });

    it('rejects a length shorter than 5', () => {
        expect(() => new AlphanumericShortCodeGenerator(4)).toThrow(new InvalidShortCodeLengthError(4, 5));
    });
});
