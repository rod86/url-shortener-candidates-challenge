import {AbstractFixture} from "@tests/lib/fixtures/AbstractFixture";
import type {ShortLink} from "@src/modules/short-link/domain/ShortLink";
import type {ShortLinkModelFactory} from "@tests/lib/modelFactories/ShortLinkModelFactory";
import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";


export class ShortLinkFixture extends AbstractFixture<ShortLink> {
    constructor(
        databaseClient: PrismaDatabaseClient,
        private readonly modelFactory: ShortLinkModelFactory
    ) {
        super(databaseClient);
    }

    public async insert(data?: Partial<ShortLink>): Promise<ShortLink> {
        const shortLink = this.modelFactory.create(data);
        await this.db.shortLink.create({
            data: {
                id: shortLink.id,
                shortCode: shortLink.shortCode,
                originalUrl: shortLink.originalUrl,
                createdAt: shortLink.createdAt,
            }
        });
        this.register(shortLink.id);
        return shortLink;
    }

    public async cleanup(): Promise<void> {
        if (this.ids.size === 0) {
            return;
        }
        await this.db.shortLink.deleteMany({
            where: {
                id: { in: [...this.ids] }
            }
        });
        this.ids.clear();
    }
}