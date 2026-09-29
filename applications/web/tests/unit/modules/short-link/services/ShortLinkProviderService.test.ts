import { faker } from "@faker-js/faker";
import {
    InvalidUrlError as EngineInvalidUrlError,
    ShortLinkCreationError as EngineShortLinkCreationError,
    type CreateShortLinkUseCase,
} from "@url-shortener/engine";
import { mock, type MockProxy } from "vitest-mock-extended";

import { InvalidUrlError, ShortLinkCreationError } from "@app/modules/short-link/errors";
import { ShortLinkProviderService } from "@app/modules/short-link/services/ShortLinkProviderService";

describe("ShortLinkProviderService", () => {
    const request = {
        id: faker.string.uuid(),
        url: faker.internet.url(),
        createdAt: faker.date.recent(),
    };
    let createShortLinkUseCase: MockProxy<CreateShortLinkUseCase>;
    let service: ShortLinkProviderService;

    beforeEach(() => {
        createShortLinkUseCase = mock<CreateShortLinkUseCase>();
        service = new ShortLinkProviderService(createShortLinkUseCase);
    });

    it("returns a short code", async () => {
        const shortCode = faker.string.alphanumeric(6);
        createShortLinkUseCase.invoke.mockResolvedValue({ shortCode });

        const result = await service.createShortCode(request);

        expect(createShortLinkUseCase.invoke).toHaveBeenCalledWith({
            id: request.id,
            originalUrl: request.url,
            createdAt: request.createdAt,
        });
        expect(result).toEqual({ shortCode });
    });

    it("rejects with an invalid url error when the engine rejects the url", async () => {
        const engineError = new EngineInvalidUrlError(request.url);
        createShortLinkUseCase.invoke.mockRejectedValue(engineError);

        await expect(service.createShortCode(request)).rejects.toThrow(
            new InvalidUrlError(engineError.message, { cause: engineError }),
        );
    });

    it("rejects with a creation error when the engine fails to create the short link", async () => {
        const engineError = new EngineShortLinkCreationError(request.url);
        createShortLinkUseCase.invoke.mockRejectedValue(engineError);

        await expect(service.createShortCode(request)).rejects.toThrow(
            new ShortLinkCreationError("Could not create short link", { cause: engineError }),
        );
    });

    it("rejects with a creation error when something unexpected happens", async () => {
        const unexpectedError = new Error("Connection lost");
        createShortLinkUseCase.invoke.mockRejectedValue(unexpectedError);

        await expect(service.createShortCode(request)).rejects.toThrow(
            new ShortLinkCreationError("Could not create short link", { cause: unexpectedError }),
        );
    });
});
