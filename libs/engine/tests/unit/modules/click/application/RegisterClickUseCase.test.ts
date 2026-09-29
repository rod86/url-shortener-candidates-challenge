import { beforeEach, describe, expect, it } from 'vitest';
import { mock, type MockProxy } from 'vitest-mock-extended';
import { faker } from '@faker-js/faker';
import { RegisterClickUseCase, type RegisterClickQuery } from '@src/modules/click/application/RegisterClickUseCase.js';
import { ShortLinkNotFoundError } from '@src/modules/click/domain/errors/ShortLinkNotFoundError.js';
import { ClickCreationError } from '@src/modules/click/domain/errors/ClickCreationError.js';
import type ClickRepositoryInterface from '@src/modules/click/domain/interfaces/ClickRepositoryInterface.js';
import type ShortLinkLookupInterface from '@src/modules/click/domain/interfaces/ShortLinkLookupInterface.js';
import { type ShortLinkLookup } from '@src/modules/click/domain/ShortLinkLookup.js';
import { clickModelFactory } from '@tests/lib/config';
import * as localFaker from '@tests/lib/local-faker';

const buildQuery = (data: Partial<RegisterClickQuery> = {}): RegisterClickQuery => ({
    id: data.id ?? faker.string.uuid(),
    shortCode: data.shortCode ?? localFaker.shortCode(),
    referrerUrl: data.referrerUrl === undefined ? faker.internet.url() : data.referrerUrl,
    createdAt: data.createdAt ?? faker.date.recent(),
});

const buildShortLinkLookup = (data: Partial<ShortLinkLookup> = {}): ShortLinkLookup => ({
    id: data.id ?? faker.string.uuid(),
    originalUrl: data.originalUrl ?? faker.internet.url(),
});

describe('RegisterClickUseCase', () => {
    let clickRepository: MockProxy<ClickRepositoryInterface>;
    let shortLinkLookup: MockProxy<ShortLinkLookupInterface>;
    let useCase: RegisterClickUseCase;

    beforeEach(() => {
        clickRepository = mock<ClickRepositoryInterface>();
        shortLinkLookup = mock<ShortLinkLookupInterface>();
        useCase = new RegisterClickUseCase(clickRepository, shortLinkLookup);
    });

    it('registers the click and returns the original url to redirect to', async () => {
        const query = buildQuery();
        const shortLink = buildShortLinkLookup();
        shortLinkLookup.findByShortCode.mockResolvedValue(shortLink);
        const click = clickModelFactory.create({
            id: query.id,
            shortLinkId: shortLink.id,
            referrerUrl: query.referrerUrl,
            createdAt: query.createdAt,
        });

        const response = await useCase.invoke(query);

        expect(shortLinkLookup.findByShortCode).toHaveBeenCalledWith(query.shortCode);
        expect(clickRepository.create).toHaveBeenCalledWith(click);
        expect(response).toEqual({ originalUrl: shortLink.originalUrl });
    });

    it('registers the click with no referer url when none is given', async () => {
        const query = buildQuery({ referrerUrl: null });
        const shortLink = buildShortLinkLookup();
        shortLinkLookup.findByShortCode.mockResolvedValue(shortLink);
        const click = clickModelFactory.create({
            id: query.id,
            shortLinkId: shortLink.id,
            referrerUrl: null,
            createdAt: query.createdAt,
        });

        await useCase.invoke(query);

        expect(clickRepository.create).toHaveBeenCalledWith(click);
    });

    it('throws a short link not found error when the short code does not resolve to a short link', async () => {
        const query = buildQuery();
        shortLinkLookup.findByShortCode.mockResolvedValue(null);

        await expect(useCase.invoke(query)).rejects.toThrow(new ShortLinkNotFoundError(query.shortCode));

        expect(clickRepository.create).not.toHaveBeenCalled();
    });

    it('throws a click creation error when the click cannot be stored', async () => {
        const query = buildQuery();
        const shortLink = buildShortLinkLookup();
        const cause = new Error('database down');
        shortLinkLookup.findByShortCode.mockResolvedValue(shortLink);
        clickRepository.create.mockRejectedValue(cause);

        await expect(useCase.invoke(query)).rejects.toThrow(new ClickCreationError(query.shortCode, cause));
    });
});
