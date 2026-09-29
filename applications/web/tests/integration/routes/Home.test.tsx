import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home, { action } from "@app/routes/Home";
import { createShortLinkHandler } from "@app/modules/short-link/services";
import { InvalidUrlError, ShortLinkCreationError } from "@app/modules/short-link/errors";
import { renderRoute } from "@tests/lib/renderRoute";
import { describe, it, expect, vi } from "vitest";
import {faker} from "@faker-js/faker";

vi.mock("@app/modules/short-link/services", () => ({
    createShortLinkHandler: { handle: vi.fn() },
}));

describe("Home page", () => {
    it("shows the form to shorten a link", async () => {
        renderRoute({ path: "/", Component: Home } as never);

        expect(await screen.findByRole("heading", { name: "Shorten a long link" })).toBeInTheDocument();
        expect(screen.getByLabelText("URL")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Shorten" })).toBeInTheDocument();
    });

    it("does not show a short url before shortening anything", async () => {
        renderRoute({ path: "/", Component: Home } as never);
        await screen.findByRole("heading", { name: "Shorten a long link" });

        expect(screen.queryByText(/your short link/i)).not.toBeInTheDocument();
    });

    it("shows a short link when I shorten a long link", async () => {
        const longUrl = faker.internet.url();
        const shortCode = faker.string.alphanumeric(7);
        const shortLink = faker.internet.url();
        vi.mocked(createShortLinkHandler.handle).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ shortCode, shortLink }), 200)),
        );
        renderRoute({ path: "/", Component: Home, action } as never);

        await userEvent.type(await screen.findByLabelText("URL"), longUrl);
        await userEvent.click(screen.getByRole("button", { name: "Shorten" }));

        expect(screen.getByRole("button", { name: "Shorten" })).toBeDisabled();
        expect(createShortLinkHandler.handle).toHaveBeenCalledWith({ url: longUrl });
        expect(await screen.findByText(shortLink)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Shorten" })).toBeEnabled();
        expect(screen.getByLabelText("URL")).toHaveValue("");
    });

    it.each([
        [new InvalidUrlError("Invalid url"), "Please enter a valid URL"],
        [new ShortLinkCreationError("Could not create short link"), "We could not shorten your link, please try again"],
    ])("shows an error message when shortening fails with %s", async (error, message) => {
        vi.mocked(createShortLinkHandler.handle).mockRejectedValue(error);
        renderRoute({ path: "/", Component: Home, action } as never);

        const longUrl = faker.internet.url();

        await userEvent.type(await screen.findByLabelText("URL"), longUrl);
        await userEvent.click(screen.getByRole("button", { name: "Shorten" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByLabelText("URL")).toHaveValue(longUrl);
        expect(screen.queryByText(/your short link/i)).not.toBeInTheDocument();
    });
});
