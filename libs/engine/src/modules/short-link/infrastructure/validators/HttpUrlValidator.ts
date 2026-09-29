import type UrlValidatorInterface from '@src/modules/short-link/domain/interfaces/UrlValidatorInterface';

export class HttpUrlValidator implements UrlValidatorInterface {
    private readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];

    public isValid(url: string): boolean {
        if (!URL.canParse(url)) {
            return false;
        }

        return this.ALLOWED_PROTOCOLS.includes(new URL(url).protocol);
    }
}
