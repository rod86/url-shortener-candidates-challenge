import {databaseClient} from "@src/modules/shared/services";


export async function getShortcodeById (id: string) {
    const db = databaseClient.connect();
    return await db.shortLink.findUnique({
        where: { id }
    });
}

export async function getClickById (id: string) {
    const db = databaseClient.connect();
    return await db.click.findUnique({
        where: { id }
    });
}