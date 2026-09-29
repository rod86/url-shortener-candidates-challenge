import {afterEach, beforeAll, describe, expect, it} from "vitest";
import {createShortLinkFixture, shortLinkModelFactory} from "@tests/lib/config";
import {
    PrismaShortLinkRepository
} from "@src/modules/short-link/infrastructure/persistence/PrismaShortLinkRepository";
import {databaseClient} from "@src/modules/shared/services";
import {getShortcodeById} from "@tests/lib/utils/databaseUtils";
import * as localFaker from "@tests/lib/local-faker";


describe('PrismaShortLinkRepository', () => {
    const shortLinkFixture = createShortLinkFixture();
    let repository: PrismaShortLinkRepository;

    beforeAll(() => {
        repository = new PrismaShortLinkRepository(databaseClient);
    });

    afterEach(async () => {
       await shortLinkFixture.cleanup();
    });

    describe('create', () => {
        it('persists a short link', async () => {
            const shortLink = shortLinkModelFactory.create();

            await repository.create(shortLink);
            shortLinkFixture.register(shortLink.id);

            const result = await getShortcodeById(shortLink.id);

            expect(result).toEqual(shortLink);
        });
    });

    describe('findByShortCode', () => {
        it('returns a short link', async () => {
            const shortCode = await shortLinkFixture.insert();

            const result = await repository.findByShortCode(shortCode.shortCode);

            expect(result).toEqual(shortCode);
        });

        it('returns null when no link is found', async () => {
            const shortCode = localFaker.shortCode();

            const result = await repository.findByShortCode(shortCode);

            expect(result).toBeNull();
        });
    });
});