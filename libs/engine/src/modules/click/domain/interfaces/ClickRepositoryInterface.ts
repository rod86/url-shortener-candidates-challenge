import { type Click } from '@src/modules/click/domain/Click';

export default interface ClickRepositoryInterface {
    create(click: Click): Promise<void>;
}
