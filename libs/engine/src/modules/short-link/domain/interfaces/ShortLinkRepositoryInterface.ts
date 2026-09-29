import { type ShortLink } from '@src/modules/short-link/domain/ShortLink';

export default interface ShortLinkRepositoryInterface {
    findByShortCode(shortCode: string): Promise<ShortLink | null>;
    create(shortLink: ShortLink): Promise<void>;
}
