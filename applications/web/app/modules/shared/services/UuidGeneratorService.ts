import type { UuidGeneratorInterface } from '@app/modules/shared/interfaces/UuidGeneratorInterface';

export class UuidGeneratorService implements UuidGeneratorInterface {
    generate(): string {
        return crypto.randomUUID();
    }
}
