import {CreateShortLinkUseCase} from "@src/modules/short-link/application/CreateShortLinkUseCase";
import {PrismaShortLinkRepository} from "@src/modules/short-link/infrastructure/persistence/PrismaShortLinkRepository";
import {databaseClient} from "@src/modules/shared/services";
import {
    AlphanumericShortCodeGenerator
} from "@src/modules/short-link/infrastructure/generators/AlphanumericShortCodeGenerator";
import config from "@src/config";
import {HttpUrlValidator} from "@src/modules/short-link/infrastructure/validators/HttpUrlValidator";


export const createShortLinkUseCase = new CreateShortLinkUseCase(
    new PrismaShortLinkRepository(databaseClient),
    new AlphanumericShortCodeGenerator(config.shortCodeLength),
    new HttpUrlValidator(),
    config.maxShortCodeAttempts,
);