import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";
import type {PrismaClient} from "@prisma/client/extension";

type Identifiable = { id: string };

export abstract class AbstractFixture<TModel extends Identifiable> {
    protected readonly ids = new Set<string>();

    constructor(private readonly databaseClient: PrismaDatabaseClient) {}

    /** Resolved lazily per operation, so fixtures can be built before connect(). */
    protected get db(): PrismaClient {
        return this.databaseClient.connect();
    }

    public abstract insert(data?: Partial<TModel>): Promise<TModel>;

    public abstract cleanup(): Promise<void>;

    /** Track an externally-created id (e.g. a row the app inserted) for cleanup. */
    public register(id: string): void {
        this.ids.add(id);
    }
}