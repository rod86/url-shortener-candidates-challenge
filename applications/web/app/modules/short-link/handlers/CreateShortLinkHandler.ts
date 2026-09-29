import type { DateInterface } from "@app/modules/shared/interfaces/DateInterface";
import type { UuidGeneratorInterface } from "@app/modules/shared/interfaces/UuidGeneratorInterface";
import type { ShortLinkProviderInterface } from "@app/modules/short-link/interfaces/ShortLinkProviderInterface";

export type CreateShortLinkRequest = {
    url: string;
};

export type CreateShortLinkResponse = {
    shortCode: string;
    shortLink: string;
};

export class CreateShortLinkHandler {
    constructor(
        private readonly uuidGenerator: UuidGeneratorInterface,
        private readonly dateService: DateInterface,
        private readonly shortLinkProvider: ShortLinkProviderInterface,
        private readonly shortLinkBaseURL: string,
    ) {}

    async handle(request: CreateShortLinkRequest): Promise<CreateShortLinkResponse> {
        const id = this.uuidGenerator.generate();
        const createdAt = this.dateService.now();

        const { shortCode } = await this.shortLinkProvider.createShortCode({
            id,
            url: request.url,
            createdAt,
        });

        return {
            shortCode,
            shortLink: `${this.shortLinkBaseURL}${shortCode}`,
        };
    }
}
