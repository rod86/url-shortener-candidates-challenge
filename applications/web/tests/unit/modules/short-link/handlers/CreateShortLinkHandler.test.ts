import { faker } from "@faker-js/faker";
import { mock, type MockProxy } from "vitest-mock-extended";

import { CreateShortLinkHandler } from "@app/modules/short-link/handlers/CreateShortLinkHandler";
import type { ShortLinkProviderInterface } from "@app/modules/short-link/interfaces/ShortLinkProviderInterface";
import type { DateInterface } from "@app/modules/shared/interfaces/DateInterface";
import type { UuidGeneratorInterface } from "@app/modules/shared/interfaces/UuidGeneratorInterface";

const shortLinkBaseURL = "https://short.test/s/";

describe("CreateShortLinkHandler", () => {
    const command = { url: faker.internet.url() };
    const id = faker.string.uuid();
    const now = faker.date.recent();
    const shortCode = faker.string.alphanumeric(6);

    let uuidGenerator: MockProxy<UuidGeneratorInterface>;
    let dateService: MockProxy<DateInterface>;
    let shortLinkProvider: MockProxy<ShortLinkProviderInterface>;
    let handler: CreateShortLinkHandler;

    beforeEach(() => {
        uuidGenerator = mock<UuidGeneratorInterface>();
        dateService = mock<DateInterface>();
        shortLinkProvider = mock<ShortLinkProviderInterface>();
        handler = new CreateShortLinkHandler(uuidGenerator, dateService, shortLinkProvider, shortLinkBaseURL);
    });

    it("returns a short link and shortcode", async () => {
        uuidGenerator.generate.mockReturnValue(id);
        dateService.now.mockReturnValue(now);
        shortLinkProvider.createShortCode.mockResolvedValue({ shortCode });

        const result = await handler.handle(command);

        expect(shortLinkProvider.createShortCode).toHaveBeenCalledWith({
            id,
            url: command.url,
            createdAt: now,
        });
        expect(result).toEqual({
            shortCode,
            shortLink: `${shortLinkBaseURL}${shortCode}`,
        });
    });
});
