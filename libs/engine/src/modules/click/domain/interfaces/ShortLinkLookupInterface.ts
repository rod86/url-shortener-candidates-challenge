import { type ShortLinkLookup } from '@src/modules/click/domain/ShortLinkLookup';

export default interface ShortLinkLookupInterface {
    findByShortCode(shortCode: string): Promise<ShortLinkLookup | null>;
}

