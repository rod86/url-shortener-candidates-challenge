import * as process from "node:process";

export default Object.freeze({
    databaseUrl: process.env.DATABASE_URL as string,
    shortCodeLength: 8,
    maxShortCodeAttempts: 5,
});