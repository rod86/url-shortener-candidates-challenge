import {ShortLinkModelFactory} from "@tests/lib/modelFactories/ShortLinkModelFactory";
import {ClickModelFactory} from "@tests/lib/modelFactories/ClickModelFactory";
import {ShortLinkFixture} from "@tests/lib/fixtures/ShortLinkFixture";
import {ClickFixture} from "@tests/lib/fixtures/ClickFixture";
import {databaseClient} from "@src/modules/shared/services";

export const shortLinkModelFactory = new ShortLinkModelFactory();
export const clickModelFactory = new ClickModelFactory();

export const createShortLinkFixture = () =>
    new ShortLinkFixture(databaseClient, shortLinkModelFactory);

export const createClickFixture = () =>
    new ClickFixture(databaseClient, clickModelFactory);