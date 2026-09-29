import { DateService } from "@app/modules/shared/services/DateService";
import {faker} from "@faker-js/faker";

describe("DateService", () => {
    let dateService: DateService;

    beforeEach(() => {
        vi.useFakeTimers();
        dateService = new DateService();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("now", () => {
        it("returns the current date", () => {
            const currentDate = faker.date.recent();
            vi.setSystemTime(currentDate);

            const result = dateService.now();

            expect(result).toEqual(currentDate);
        });

        it("returns a Date instance", () => {
            const result = dateService.now();

            expect(result).toBeInstanceOf(Date);
        });

        it("returns a later date once time has passed", () => {
            vi.setSystemTime(faker.date.recent());
            const before = dateService.now();

            vi.advanceTimersByTime(5_000);
            const after = dateService.now();

            expect(after.getTime() - before.getTime()).toBe(5_000);
        });

        it("returns a new Date object on each call", () => {
            const first = dateService.now();
            const second = dateService.now();

            expect(first).not.toBe(second);
        });
    });
});
