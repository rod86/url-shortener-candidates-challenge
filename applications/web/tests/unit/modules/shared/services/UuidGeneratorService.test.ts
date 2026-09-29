import type { UuidGeneratorInterface } from '@app/modules/shared/interfaces/UuidGeneratorInterface';
import { UuidGeneratorService } from '@app/modules/shared/services/UuidGeneratorService';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('UuidGeneratorService', () => {
    let uuidGenerator: UuidGeneratorInterface;

    beforeEach(() => {
        uuidGenerator = new UuidGeneratorService();
    });

    it('generates a valid uuid', () => {
        const uuid = uuidGenerator.generate();

        expect(uuid).toMatch(UUID_V4_REGEX);
    });

    it('generates a different uuid on every call', () => {
        const firstUuid = uuidGenerator.generate();
        const secondUuid = uuidGenerator.generate();

        expect(firstUuid).not.toBe(secondUuid);
    });
});
