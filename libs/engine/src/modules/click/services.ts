import { databaseClient } from '@src/modules/shared/services';
import { PrismaClickRepository } from '@src/modules/click/infrastructure/persistence/PrismaClickRepository';
import { PrismaShortLinkLookupRepository } from '@src/modules/click/infrastructure/persistence/PrismaShortLinkLookupRepository';
import { RegisterClickUseCase } from '@src/modules/click/application/RegisterClickUseCase';


export const registerClickUseCase = new RegisterClickUseCase(
    new PrismaClickRepository(databaseClient),
    new PrismaShortLinkLookupRepository(databaseClient)
);
