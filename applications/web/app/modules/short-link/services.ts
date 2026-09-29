import config from "@app/config";
import {CreateShortLinkHandler} from "@app/modules/short-link/handlers/CreateShortLinkHandler";
import {dateService, uuidGeneratorService} from "@app/modules/shared/services";
import {ShortLinkProviderService} from "@app/modules/short-link/services/ShortLinkProviderService";
import { createShortLinkUseCase } from "@url-shortener/engine";

export const createShortLinkHandler = new CreateShortLinkHandler(
    uuidGeneratorService,
    dateService,
    new ShortLinkProviderService(createShortLinkUseCase),
    config.shortLinkBaseUrl,
);