import { loader } from "@app/routes/s.$code";
import { registerClickHandler } from "@app/modules/click/services";
import { ClickCreationError, ShortLinkNotFoundError } from "@app/modules/click/errors";
import { describe, it, expect, vi } from "vitest";
import { faker } from "@faker-js/faker";

vi.mock("@app/modules/click/services", () => ({
    registerClickHandler: { handle: vi.fn() },
}));

describe("Short link redirect page", () => {
    it("registers the click and redirects to the original url", async () => {
        const shortCode = faker.string.alphanumeric(8);
        const originalUrl = faker.internet.url();
        vi.mocked(registerClickHandler.handle).mockResolvedValue({ originalUrl });
        const request = new Request(`http://localhost/s/${shortCode}`);

        const response = (await loader({ request, params: { code: shortCode }, context: {} } as never)) as Response;

        expect(registerClickHandler.handle).toHaveBeenCalledWith({ shortCode, referrer: null });
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe(originalUrl);
    });

    it("sends the referrer along when the visitor comes from another page", async () => {
        const shortCode = faker.string.alphanumeric(8);
        const referrer = faker.internet.url();
        vi.mocked(registerClickHandler.handle).mockResolvedValue({ originalUrl: faker.internet.url() });
        const request = new Request(`http://localhost/s/${shortCode}`, { headers: { referer: referrer } });

        await loader({ request, params: { code: shortCode }, context: {} } as never);

        expect(registerClickHandler.handle).toHaveBeenCalledWith({ shortCode, referrer });
    });

    it("responds with 404 Not Found when the short code does not exist", async () => {
        const shortCode = faker.string.alphanumeric(8);
        vi.mocked(registerClickHandler.handle).mockRejectedValue(new ShortLinkNotFoundError("Short link not found"));
        const request = new Request(`http://localhost/s/${shortCode}`);

        const thrown = await loader({ request, params: { code: shortCode }, context: {} } as never).catch((error) => error);

        expect(thrown).toBeInstanceOf(Response);
        expect(thrown.status).toBe(404);
        expect(thrown.statusText).toBe("Not Found");
    });

    it.each([
        [new ClickCreationError("Could not register click")],
        [new Error("Unexpected failure")],
    ])("lets the error page handle an unexpected failure (%s)", async (error) => {
        const shortCode = faker.string.alphanumeric(8);
        vi.mocked(registerClickHandler.handle).mockRejectedValue(error);
        const request = new Request(`http://localhost/s/${shortCode}`);

        const thrown = await loader({ request, params: { code: shortCode }, context: {} } as never).catch((error) => error);

        expect(thrown).toBeInstanceOf(Response);
        expect(thrown.status).toBe(500);
        expect(thrown.statusText).toBe("Internal Server Error");
    });
});
