import { faker } from "@faker-js/faker";
import {
    ClickCreationError as EngineClickCreationError,
    ShortLinkNotFoundError as EngineShortLinkNotFoundError,
    type RegisterClickUseCase,
} from "@url-shortener/engine";
import { mock, type MockProxy } from "vitest-mock-extended";

import { ClickCreationError, ShortLinkNotFoundError } from "@app/modules/click/errors";
import { ClickRegisterService } from "@app/modules/click/services/ClickRegisterService";

describe("ClickRegisterService", () => {
    const click = {
        id: faker.string.uuid(),
        shortCode: faker.string.alphanumeric(6),
        referrer: faker.internet.url(),
        createdAt: faker.date.recent(),
    };
    let registerClickUseCase: MockProxy<RegisterClickUseCase>;
    let service: ClickRegisterService;

    beforeEach(() => {
        registerClickUseCase = mock<RegisterClickUseCase>();
        service = new ClickRegisterService(registerClickUseCase);
    });

    it("returns the original url", async () => {
        const originalUrl = faker.internet.url();
        registerClickUseCase.invoke.mockResolvedValue({ originalUrl });

        const result = await service.registerClick(click);

        expect(registerClickUseCase.invoke).toHaveBeenCalledWith({
            id: click.id,
            shortCode: click.shortCode,
            referrerUrl: click.referrer,
            createdAt: click.createdAt,
        });
        expect(result).toEqual({ originalUrl });
    });

    it("rejects with a not found error when the short link does not exist", async () => {
        const engineError = new EngineShortLinkNotFoundError(click.shortCode);
        registerClickUseCase.invoke.mockRejectedValue(engineError);

        await expect(service.registerClick(click)).rejects.toThrow(
            new ShortLinkNotFoundError(engineError.message, { cause: engineError }),
        );
    });

    it("rejects with a click creation error when the click could not be stored", async () => {
        const engineError = new EngineClickCreationError(click.shortCode);
        registerClickUseCase.invoke.mockRejectedValue(engineError);

        await expect(service.registerClick(click)).rejects.toThrow(
            new ClickCreationError(engineError.message, { cause: engineError }),
        );
    });
});
