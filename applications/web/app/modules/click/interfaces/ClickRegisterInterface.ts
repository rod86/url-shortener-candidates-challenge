import type { Click, RegisteredClick } from "@app/modules/click/types";

export interface ClickRegisterInterface {
    registerClick(click: Click): Promise<RegisteredClick>;
}
