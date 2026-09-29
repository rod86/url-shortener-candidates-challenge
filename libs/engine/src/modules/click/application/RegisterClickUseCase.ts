import { ShortLinkNotFoundError } from '@src/modules/click/domain/errors/ShortLinkNotFoundError';
import { ClickCreationError } from '@src/modules/click/domain/errors/ClickCreationError';
import type ClickRepositoryInterface from '@src/modules/click/domain/interfaces/ClickRepositoryInterface';
import type ShortLinkLookupInterface from '@src/modules/click/domain/interfaces/ShortLinkLookupInterface';

export interface RegisterClickQuery {
    id: string;
    shortCode: string;
    referrerUrl: string | null;
    createdAt: Date;
}

export interface RegisterClickResponse {
    originalUrl: string;
}

export class RegisterClickUseCase {
    constructor(
        private readonly clickRepository: ClickRepositoryInterface,
        private readonly shortLinkLookup: ShortLinkLookupInterface,
    ) {}

    public async invoke(query: RegisterClickQuery): Promise<RegisterClickResponse> {
        const shortLink = await this.shortLinkLookup.findByShortCode(query.shortCode);

        if (!shortLink) {
            throw new ShortLinkNotFoundError(query.shortCode);
        }

        try {
            await this.clickRepository.create({
                id: query.id,
                shortLinkId: shortLink.id,
                referrerUrl: query.referrerUrl,
                createdAt: query.createdAt,
            });
        } catch (error) {
            throw new ClickCreationError(query.shortCode, error);
        }

        return { originalUrl: shortLink.originalUrl };
    }
}
