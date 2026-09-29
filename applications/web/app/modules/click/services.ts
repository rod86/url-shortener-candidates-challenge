import {RegisterClickHandler} from "@app/modules/click/handlers/RegisterClickHandler";
import {dateService, uuidGeneratorService} from "@app/modules/shared/services";
import { registerClickUseCase } from "@url-shortener/engine";
import {ClickRegisterService} from "@app/modules/click/services/ClickRegisterService";


export const registerClickHandler = new RegisterClickHandler(
    uuidGeneratorService,
    dateService,
    new ClickRegisterService(registerClickUseCase),
);