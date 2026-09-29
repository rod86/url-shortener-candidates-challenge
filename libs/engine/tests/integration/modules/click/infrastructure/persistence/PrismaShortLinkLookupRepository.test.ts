import {afterEach, beforeAll, describe, expect, it} from "vitest";
import {createShortLinkFixture} from "@tests/lib/config";
import {
    PrismaShortLinkLookupRepository
} from "@src/modules/click/infrastructure/persistence/PrismaShortLinkLookupRepository";
import {databaseClient} from "@src/modules/shared/services";
import * as localFaker from "@tests/lib/local-faker";


describe('PrismaShortLinkLookupRepository', () => {
    const shortLinkFixture = createShortLinkFixture();
    let lookup: PrismaShortLinkLookupRepository;

    beforeAll(() => {
        lookup = new PrismaShortLinkLookupRepository(databaseClient);
    });

    afterEach(async () => {
        await shortLinkFixture.cleanup();
    });

    describe('findByShortCode', () => {
        it('returns the short link matching the short code', async () => {
            const shortLink = await shortLinkFixture.insert();

            const result = await lookup.findByShortCode(shortLink.shortCode);

            expect(result).toEqual({
                id: shortLink.id,
                originalUrl: shortLink.originalUrl,
            });
        });

        it('returns null when no link is found', async () => {
            const shortCode = localFaker.shortCode();

            const result = await lookup.findByShortCode(shortCode);

            expect(result).toBeNull();
        });
    });
});
