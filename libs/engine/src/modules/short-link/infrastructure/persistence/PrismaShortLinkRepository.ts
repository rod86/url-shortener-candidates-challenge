import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";
import type ShortLinkRepositoryInterface from "@src/modules/short-link/domain/interfaces/ShortLinkRepositoryInterface";
import type { ShortLink } from "@src/modules/short-link/domain/ShortLink";


export class PrismaShortLinkRepository implements ShortLinkRepositoryInterface {
    constructor(
        private readonly databaseClient: PrismaDatabaseClient
    ) {}

    async findByShortCode(shortCode: string): Promise<ShortLink | null> {
        const db = this.databaseClient.connect();
        const shortLink = await db.shortLink.findUnique({
            where: { shortCode },
        });

        if (!shortLink) {
            return null;
        }

        return {
            id: shortLink.id,
            shortCode: shortLink.shortCode,
            originalUrl: shortLink.originalUrl,
            createdAt: shortLink.createdAt,
        };
    }

    async create(shortLink: ShortLink): Promise<void> {
        const db = this.databaseClient.connect();
        await db.shortLink.create({ data: shortLink });
    }
}