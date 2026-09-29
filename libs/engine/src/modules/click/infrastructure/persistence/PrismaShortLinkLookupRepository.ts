import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";
import type ShortLinkLookupInterface from "@src/modules/click/domain/interfaces/ShortLinkLookupInterface";
import type { ShortLinkLookup } from "@src/modules/click/domain/ShortLinkLookup";


export class PrismaShortLinkLookupRepository implements ShortLinkLookupInterface {
    constructor(
        private readonly databaseClient: PrismaDatabaseClient
    ) {}

    async findByShortCode(shortCode: string): Promise<ShortLinkLookup | null> {
        const db = this.databaseClient.connect();
        const shortLink = await db.shortLink.findUnique({
            where: { shortCode },
        });

        if (!shortLink) {
            return null;
        }

        return {
            id: shortLink.id,
            originalUrl: shortLink.originalUrl,
        };
    }
}
