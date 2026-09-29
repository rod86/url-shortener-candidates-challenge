import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";
import type ClickRepositoryInterface from "@src/modules/click/domain/interfaces/ClickRepositoryInterface";
import type {Click} from "@src/modules/click/domain/Click";


export class PrismaClickRepository implements ClickRepositoryInterface {
    constructor(
        private readonly databaseClient: PrismaDatabaseClient
    ) {}

    async create(click: Click): Promise<void> {
        const db = this.databaseClient.connect();
        await db.click.create({ data: click });
    }
}
