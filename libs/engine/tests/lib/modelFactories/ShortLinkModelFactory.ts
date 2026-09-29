import {AbstractModelFactory} from "@tests/lib/modelFactories/AbstractModelFactory";
import type {ShortLink} from "@src/modules/short-link/domain/ShortLink";
import {faker} from "@faker-js/faker";
import * as localFaker from "@tests/lib/local-faker";


export class ShortLinkModelFactory extends AbstractModelFactory<ShortLink> {
    create(data: Partial<ShortLink> = {}): ShortLink {
        return {
            id: data.id ?? faker.string.uuid(),
            shortCode: data.shortCode ?? localFaker.shortCode(),
            originalUrl: data.originalUrl ?? faker.internet.url(),
            createdAt: data.createdAt ?? faker.date.recent(),
        };
    }
}