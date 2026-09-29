import { faker } from "@faker-js/faker";
import { mock, type MockProxy } from "vitest-mock-extended";

import { RegisterClickHandler } from "@app/modules/click/handlers/RegisterClickHandler";
import type { ClickRegisterInterface } from "@app/modules/click/interfaces/ClickRegisterInterface";
import type { DateInterface } from "@app/modules/shared/interfaces/DateInterface";
import type { UuidGeneratorInterface } from "@app/modules/shared/interfaces/UuidGeneratorInterface";

describe("RegisterClickHandler", () => {
    let uuidGenerator: MockProxy<UuidGeneratorInterface>;
    let dateService: MockProxy<DateInterface>;
    let clickRegister: MockProxy<ClickRegisterInterface>;
    let handler: RegisterClickHandler;

    beforeEach(() => {
        uuidGenerator = mock<UuidGeneratorInterface>();
        dateService = mock<DateInterface>();
        clickRegister = mock<ClickRegisterInterface>();
        handler = new RegisterClickHandler(uuidGenerator, dateService, clickRegister);
    });

    it.each([
        ["a referrer", faker.internet.url()],
        ["no referrer", null],
    ])("returns the original url when the click comes with %s", async (_case, referrer) => {
        const request = { shortCode: faker.string.alphanumeric(6), referrer };
        const id = faker.string.uuid();
        const now = faker.date.recent();
        const originalUrl = faker.internet.url();
        uuidGenerator.generate.mockReturnValue(id);
        dateService.now.mockReturnValue(now);
        clickRegister.registerClick.mockResolvedValue({ originalUrl });

        const result = await handler.handle(request);

        expect(uuidGenerator.generate).toHaveBeenCalledTimes(1);
        expect(dateService.now).toHaveBeenCalledTimes(1);
        expect(clickRegister.registerClick).toHaveBeenCalledWith({
            id,
            shortCode: request.shortCode,
            referrer: request.referrer,
            createdAt: now,
        });
        expect(result).toEqual({ originalUrl });
    });
});
