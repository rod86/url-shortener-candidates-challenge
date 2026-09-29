import type { DateInterface } from "@app/modules/shared/interfaces/DateInterface";

export class DateService implements DateInterface {
    now(): Date {
        return new Date();
    }
}
