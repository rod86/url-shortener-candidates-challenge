
import { createShortLinkUseCase } from "./modules/short-link/services";
import { registerClickUseCase } from "@src/modules/click/services";

export { createShortLinkUseCase, registerClickUseCase };
export type { CreateShortLinkUseCase, CreateShortLinkQuery, CreateShortLinkResponse } from "@src/modules/short-link/application/CreateShortLinkUseCase";
export type { RegisterClickUseCase, RegisterClickQuery, RegisterClickResponse } from "@src/modules/click/application/RegisterClickUseCase";

export { InvalidUrlError } from "@src/modules/short-link/domain/errors/InvalidUrlError";
export { InvalidShortCodeLengthError } from "@src/modules/short-link/domain/errors/InvalidShortCodeLengthError";
export { ShortLinkCreationError } from "@src/modules/short-link/domain/errors/ShortLinkCreationError";
export { ClickCreationError } from "@src/modules/click/domain/errors/ClickCreationError";
export { ShortLinkNotFoundError } from "@src/modules/click/domain/errors/ShortLinkNotFoundError";