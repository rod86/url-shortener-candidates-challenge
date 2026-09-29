import { InvalidUrlError } from '@src/modules/short-link/domain/errors/InvalidUrlError';
import { ShortCodeGenerationError } from '@src/modules/short-link/domain/errors/ShortCodeGenerationError';
import { ShortLinkCreationError } from '@src/modules/short-link/domain/errors/ShortLinkCreationError';
import type ShortCodeGeneratorInterface from '@src/modules/short-link/domain/interfaces/ShortCodeGeneratorInterface';
import type ShortLinkRepositoryInterface from '@src/modules/short-link/domain/interfaces/ShortLinkRepositoryInterface';
import type UrlValidatorInterface from '@src/modules/short-link/domain/interfaces/UrlValidatorInterface';

export interface CreateShortLinkQuery {
    id: string;
    originalUrl: string;
    createdAt: Date;
}

export interface CreateShortLinkResponse {
    shortCode: string;
}

export class CreateShortLinkUseCase {
    constructor(
        private readonly shortLinkRepository: ShortLinkRepositoryInterface,
        private readonly shortCodeGenerator: ShortCodeGeneratorInterface,
        private readonly urlValidator: UrlValidatorInterface,
        private readonly maxShortCodeAttempts: number,
    ) {}

    public async invoke(query: CreateShortLinkQuery): Promise<CreateShortLinkResponse> {
        if (!this.urlValidator.isValid(query.originalUrl)) {
            throw new InvalidUrlError(query.originalUrl);
        }

        const shortCode = await this.generateUniqueShortCode();

        try {
            await this.shortLinkRepository.create({
                id: query.id,
                shortCode,
                originalUrl: query.originalUrl,
                createdAt: query.createdAt,
            });
        } catch (error) {
            throw new ShortLinkCreationError(query.originalUrl, error);
        }

        return { shortCode };
    }

    private async generateUniqueShortCode(): Promise<string> {
        for (let attempt = 0; attempt < this.maxShortCodeAttempts; attempt++) {
            const shortCode = this.shortCodeGenerator.generate();

            if (!(await this.shortLinkRepository.findByShortCode(shortCode))) {
                return shortCode;
            }
        }

        throw new ShortCodeGenerationError(this.maxShortCodeAttempts);
    }
}
