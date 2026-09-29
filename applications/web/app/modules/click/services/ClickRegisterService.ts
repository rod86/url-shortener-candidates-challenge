import {
    ShortLinkNotFoundError as EngineShortLinkNotFoundError,
    type RegisterClickUseCase,
} from "@url-shortener/engine";

import { ClickCreationError, ShortLinkNotFoundError } from "@app/modules/click/errors";
import type { ClickRegisterInterface } from "@app/modules/click/interfaces/ClickRegisterInterface";
import type { Click, RegisteredClick } from "@app/modules/click/types";

export class ClickRegisterService implements ClickRegisterInterface {
    constructor(private readonly registerClickUseCase: RegisterClickUseCase) {}

    async registerClick(click: Click): Promise<RegisteredClick> {
        try {
            const { originalUrl } = await this.registerClickUseCase.invoke({
                id: click.id,
                shortCode: click.shortCode,
                referrerUrl: click.referrer,
                createdAt: click.createdAt,
            });

            return { originalUrl };
        } catch (error) {
            if (error instanceof EngineShortLinkNotFoundError) {
                throw new ShortLinkNotFoundError((error as Error).message, { cause: error });
            }
            throw new ClickCreationError((error as Error).message, { cause: error });
        }
    }
}
