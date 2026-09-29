import * as process from "node:process";

export default Object.freeze({
    shortLinkBaseUrl: `${process.env.PUBLIC_URL as string}/s/`,
});
