import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { faker } from '@faker-js/faker';
import { CreateShortLinkUseCase, type CreateShortLinkQuery } from '@src/modules/short-link/application/CreateShortLinkUseCase.js';
import { ShortCodeGenerationError } from '@src/modules/short-link/domain/errors/ShortCodeGenerationError.js';
import { InvalidUrlError } from '@src/modules/short-link/domain/errors/InvalidUrlError.js';
import { ShortLinkCreationError } from '@src/modules/short-link/domain/errors/ShortLinkCreationError.js';
import type ShortCodeGeneratorInterface from '@src/modules/short-link/domain/interfaces/ShortCodeGeneratorInterface.js';
import type ShortLinkRepositoryInterface from '@src/modules/short-link/domain/interfaces/ShortLinkRepositoryInterface.js';
import type UrlValidatorInterface from '@src/modules/short-link/domain/interfaces/UrlValidatorInterface.js';
import { shortLinkModelFactory } from '@tests/lib/config';
import * as localFaker from "@tests/lib/local-faker";

const buildQuery = (data: Partial<CreateShortLinkQuery> = {}): CreateShortLinkQuery => ({
    id: data.id ?? faker.string.uuid(),
    originalUrl: data.originalUrl ?? faker.internet.url(),
    createdAt: data.createdAt ?? faker.date.recent(),
});

describe('CreateShortLinkUseCase', () => {
    let shortLinkRepository: MockProxy<ShortLinkRepositoryInterface>;
    let shortCodeGenerator: MockProxy<ShortCodeGeneratorInterface>;
    let urlValidator: MockProxy<UrlValidatorInterface>;
    let useCase: CreateShortLinkUseCase;
    const maxAttempts = 5;

    beforeEach(() => {
        shortLinkRepository = mock<ShortLinkRepositoryInterface>();
        shortCodeGenerator = mock<ShortCodeGeneratorInterface>();
        urlValidator = mock<UrlValidatorInterface>();
        useCase = new CreateShortLinkUseCase(shortLinkRepository, shortCodeGenerator, urlValidator, maxAttempts);

        shortLinkRepository.findByShortCode.mockResolvedValue(null);
        urlValidator.isValid.mockReturnValue(true);
    });

    it('generates a short code and stores the short link',  async () => {
        const query = buildQuery();
        const shortLink = shortLinkModelFactory.create({
            id: query.id,
            originalUrl: query.originalUrl,
            createdAt: query.createdAt,
        });
        shortCodeGenerator.generate.mockReturnValue(shortLink.shortCode);

        const response = await useCase.invoke(query);

        expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(1);
        expect(shortLinkRepository.findByShortCode).toHaveBeenCalledWith(shortLink.shortCode);
        expect(shortLinkRepository.create).toHaveBeenCalledWith(shortLink);
        expect(response).toEqual({ shortCode: shortLink.shortCode });
    });

    it('generates a new short code while the generated one is already taken', async () => {
        const query = buildQuery();
        const takenShortLinks = shortLinkModelFactory.createMany(2);
        const shortLink = shortLinkModelFactory.create({
            id: query.id,
            originalUrl: query.originalUrl,
            createdAt: query.createdAt,
        });
        shortCodeGenerator.generate
            .mockReturnValueOnce(takenShortLinks[0].shortCode)
            .mockReturnValueOnce(takenShortLinks[1].shortCode)
            .mockReturnValueOnce(shortLink.shortCode);
        shortLinkRepository.findByShortCode
            .mockResolvedValueOnce(takenShortLinks[0])
            .mockResolvedValueOnce(takenShortLinks[1])
            .mockResolvedValueOnce(null);

        const response = await useCase.invoke(query);

        expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(3);
        expect(shortLinkRepository.create).toHaveBeenCalledTimes(1);
        expect(shortLinkRepository.create).toHaveBeenCalledWith(shortLink);
        expect(response).toEqual({ shortCode: shortLink.shortCode });
    });

    it('throws after reaching the max attempts without finding a free short code', async () => {
        const query = buildQuery();
        const takenShortLink = shortLinkModelFactory.create();
        shortCodeGenerator.generate.mockReturnValue(takenShortLink.shortCode);
        shortLinkRepository.findByShortCode.mockResolvedValue(takenShortLink);

        await expect(useCase.invoke(query)).rejects.toThrow(new ShortCodeGenerationError(maxAttempts));

        expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(maxAttempts);
        expect(shortLinkRepository.create).not.toHaveBeenCalled();
    });

    it('throws a short link creation error when the short link cannot be stored', async () => {
        const query = buildQuery();
        const cause = new Error('database down');
        shortCodeGenerator.generate.mockReturnValue(localFaker.shortCode());
        shortLinkRepository.create.mockRejectedValue(cause);

        await expect(useCase.invoke(query)).rejects.toThrow(new ShortLinkCreationError(query.originalUrl, cause));
    });

    it('rejects an url that is not valid', async () => {
        const query = buildQuery();
        urlValidator.isValid.mockReturnValue(false);

        await expect(useCase.invoke(query)).rejects.toThrow(new InvalidUrlError(query.originalUrl));

        expect(urlValidator.isValid).toHaveBeenCalledWith(query.originalUrl);
        expect(shortLinkRepository.create).not.toHaveBeenCalled();
    });
});
