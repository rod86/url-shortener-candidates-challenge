import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import PrismaDatabaseClient from '@src/modules/shared/infrastructure/database/PrismaDatabaseClient.js';
import config from "@src/config";

describe('PrismaDatabaseClient', () => {
    let databaseClient: PrismaDatabaseClient;

    beforeAll(() => {
        databaseClient = new PrismaDatabaseClient(config.databaseUrl);
    });

    afterAll(async () => {
        await databaseClient.close();
    });

    it('returns a connection', async () => {
        const connection = databaseClient.connect();

        await expect(connection.$queryRaw`SELECT 1`).resolves.toBeTruthy();
    });

    it('closes the connection', async () => {
        const connection = databaseClient.connect();

        await databaseClient.close();

        await expect(connection.$queryRaw`SELECT 1`).rejects.toThrow();
    });
});
