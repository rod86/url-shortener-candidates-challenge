import config from '@src/config';
import PrismaDatabaseClient from "@src/modules/shared/infrastructure/database/PrismaDatabaseClient";


export const databaseClient = new PrismaDatabaseClient(config.databaseUrl);