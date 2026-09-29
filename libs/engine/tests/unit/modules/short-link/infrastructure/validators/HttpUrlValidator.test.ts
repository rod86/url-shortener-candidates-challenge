import { describe, expect, it } from 'vitest';
import { HttpUrlValidator } from '@src/modules/short-link/infrastructure/validators/HttpUrlValidator.js';

describe('HttpUrlValidator', () => {
    const validator = new HttpUrlValidator();

    it.each([
        'http://example.com',
        'https://example.com/path?query=1#hash',
        'HTTPS://example.com',
    ])('accepts %s', (url) => {
        expect(validator.isValid(url)).toBeTruthy();
    });

    it.each([
        'ftp://example.com',
        'javascript:alert(1)',
        'example.com',
        'https://',
        '',
    ])('rejects "%s"', (url) => {
        expect(validator.isValid(url)).toBeFalsy();
    });
});
