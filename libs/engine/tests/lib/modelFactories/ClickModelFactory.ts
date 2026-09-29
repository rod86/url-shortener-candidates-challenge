import {AbstractModelFactory} from "@tests/lib/modelFactories/AbstractModelFactory";
import type {Click} from "@src/modules/click/domain/Click";
import {faker} from "@faker-js/faker";

export class ClickModelFactory extends AbstractModelFactory<Click> {
    create(data: Partial<Click> = {}): Click {
        return {
            id: data.id ?? faker.string.uuid(),
            shortLinkId: data.shortLinkId ?? faker.string.uuid(),
            referrerUrl: data.referrerUrl === undefined ? faker.internet.url() : data.referrerUrl,
            createdAt: data.createdAt ?? faker.date.recent(),
        };
    }
}
