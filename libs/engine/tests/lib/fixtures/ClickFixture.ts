import {AbstractFixture} from "@tests/lib/fixtures/AbstractFixture";
import type {Click} from "@src/modules/click/domain/Click";
import type {ClickModelFactory} from "@tests/lib/modelFactories/ClickModelFactory";
import type PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";


export class ClickFixture extends AbstractFixture<Click> {
    constructor(
        databaseClient: PrismaDatabaseClient,
        private readonly modelFactory: ClickModelFactory
    ) {
        super(databaseClient);
    }

    public async insert(data?: Partial<Click>): Promise<Click> {
        const click = this.modelFactory.create(data);
        await this.db.click.create({ data: click });
        this.register(click.id);
        return click;
    }

    public async cleanup(): Promise<void> {
        if (this.ids.size === 0) {
            return;
        }
        await this.db.click.deleteMany({
            where: {
                id: { in: [...this.ids] }
            }
        });
        this.ids.clear();
    }
}
