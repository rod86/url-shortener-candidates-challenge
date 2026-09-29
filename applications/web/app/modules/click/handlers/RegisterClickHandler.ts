import type { DateInterface } from "@app/modules/shared/interfaces/DateInterface";
import type { UuidGeneratorInterface } from "@app/modules/shared/interfaces/UuidGeneratorInterface";
import type { ClickRegisterInterface } from "@app/modules/click/interfaces/ClickRegisterInterface";
import type { RegisteredClick } from "@app/modules/click/types";

export type RegisterClickHandlerRequest = {
    shortCode: string;
    referrer: string | null;
};

export type RegisterClickHandlerResponse = {
    originalUrl: string;
};

export class RegisterClickHandler {
    constructor(
        private readonly uuidGenerator: UuidGeneratorInterface,
        private readonly dateService: DateInterface,
        private readonly clickRegister: ClickRegisterInterface,
    ) {}

    async handle(request: RegisterClickHandlerRequest): Promise<RegisterClickHandlerResponse> {
        const id = this.uuidGenerator.generate();
        const createdAt = this.dateService.now();

        const { originalUrl } = await this.clickRegister.registerClick({
            id,
            shortCode: request.shortCode,
            referrer: request.referrer,
            createdAt,
        });

        return { originalUrl };
    }
}
