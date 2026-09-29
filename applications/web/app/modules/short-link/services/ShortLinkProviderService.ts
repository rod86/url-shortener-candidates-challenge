import { InvalidUrlError as EngineInvalidUrlError, type CreateShortLinkUseCase } from "@url-shortener/engine";

import { InvalidUrlError, ShortLinkCreationError } from "@app/modules/short-link/errors";
import type { ShortLinkProviderInterface } from "@app/modules/short-link/interfaces/ShortLinkProviderInterface";
import type { CreateShortCodeRequest, CreateShortCodeResponse } from "@app/modules/short-link/types";

export class ShortLinkProviderService implements ShortLinkProviderInterface {
    constructor(private readonly createShortLinkUseCase: CreateShortLinkUseCase) {}

    async createShortCode(request: CreateShortCodeRequest): Promise<CreateShortCodeResponse> {
        try {
            const { shortCode } = await this.createShortLinkUseCase.invoke({
                id: request.id,
                originalUrl: request.url,
                createdAt: request.createdAt,
            });

            return { shortCode };
        } catch (error) {
            if (error instanceof EngineInvalidUrlError) {
                throw new InvalidUrlError((error as Error).message, { cause: error });
            }
            throw new ShortLinkCreationError("Could not create short link", { cause: error });
        }
    }
}
