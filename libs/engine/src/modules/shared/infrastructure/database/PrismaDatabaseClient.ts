import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@src/generated/prisma/client';
import type DatabaseClientInterface from "@src/modules/shared/domain/interfaces/DatabaseClientInterface";

export default class PrismaDatabaseClient implements DatabaseClientInterface<PrismaClient> {
    private client: PrismaClient | undefined;
    private pool: Pool | undefined;

    constructor(private readonly databaseUrl: string) {}

    public connect(): PrismaClient {
        if (this.client === undefined) {
            this.pool = new Pool({ connectionString: this.databaseUrl });
            const adapter = new PrismaPg(this.pool);
            this.client = new PrismaClient({ adapter });
        }

        return this.client;
    }

    public async close(): Promise<void> {
        if (this.client !== undefined) {
            await this.client.$disconnect();
            // Prisma silently reconnects on the next query after $disconnect(),
            // so the underlying pool must be ended too to make close() final.
            await this.pool?.end();
            this.client = undefined;
            this.pool = undefined;
        }
    }
}
