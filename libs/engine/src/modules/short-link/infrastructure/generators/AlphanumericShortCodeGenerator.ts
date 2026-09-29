import { randomInt } from 'node:crypto';
import { InvalidShortCodeLengthError } from '@src/modules/short-link/domain/errors/InvalidShortCodeLengthError';
import type ShortCodeGeneratorInterface from '@src/modules/short-link/domain/interfaces/ShortCodeGeneratorInterface';


export class AlphanumericShortCodeGenerator implements ShortCodeGeneratorInterface {
    private readonly MIN_SHORT_CODE_LENGTH = 5;
    private readonly ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    constructor(private readonly length: number) {
        if (!Number.isInteger(length) || length < this.MIN_SHORT_CODE_LENGTH) {
            throw new InvalidShortCodeLengthError(length, this.MIN_SHORT_CODE_LENGTH);
        }
    }

    public generate(): string {
        let shortCode = '';

        for (let i = 0; i < this.length; i++) {
            shortCode += this.ALPHABET[randomInt(this.ALPHABET.length)];
        }

        return shortCode;
    }
}
