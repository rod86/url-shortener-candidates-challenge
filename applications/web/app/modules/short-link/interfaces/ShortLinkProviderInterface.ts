import type { CreateShortCodeRequest, CreateShortCodeResponse } from "@app/modules/short-link/types";

export interface ShortLinkProviderInterface {
    createShortCode(request: CreateShortCodeRequest): Promise<CreateShortCodeResponse>;
}
