import {afterEach, beforeAll, describe, expect, it} from "vitest";
import {clickModelFactory, createClickFixture} from "@tests/lib/config";
import {PrismaClickRepository} from "@src/modules/click/infrastructure/persistence/PrismaClickRepository";
import {databaseClient} from "@src/modules/shared/services";
import {getClickById} from "@tests/lib/utils/databaseUtils";


describe('PrismaClickRepository', () => {
    const clickFixture = createClickFixture();
    let repository: PrismaClickRepository;

    beforeAll(() => {
        repository = new PrismaClickRepository(databaseClient);
    });

    afterEach(async () => {
        await clickFixture.cleanup();
    });

    describe('create', () => {
        it('persists a click', async () => {
            const click = clickModelFactory.create();

            await repository.create(click);
            clickFixture.register(click.id);

            const result = await getClickById(click.id);

            expect(result).toEqual({
                id: click.id,
                shortLinkId: click.shortLinkId,
                referrerUrl: click.referrerUrl,
                createdAt: click.createdAt,
            });
        });
    });
});
