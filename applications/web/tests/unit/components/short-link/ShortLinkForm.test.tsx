import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import ShortLinkForm from "@app/components/short-link/ShortLinkForm";
import { renderRoute } from "@tests/lib/renderRoute";
import { describe, it, expect, vi } from "vitest";

describe("ShortLinkForm", () => {
    it("shows a url input and a shorten button", async () => {
        renderRoute({ path: "/", Component: ShortLinkForm } as never);

        expect(await screen.findByLabelText("URL")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /shorten/i })).toBeInTheDocument();
    });

    it("shows the value as the user types", async () => {
        const user = userEvent.setup();
        const url = faker.internet.url();
        renderRoute({ path: "/", Component: ShortLinkForm } as never);

        const input = await screen.findByLabelText("URL");
        await user.type(input, url);

        expect(input).toHaveValue(url);
    });

    it("sends the url to the onSubmit callback when clicking shorten", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const url = faker.internet.url();
        renderRoute({ path: "/", Component: () => <ShortLinkForm onSubmit={onSubmit} /> } as never);

        await user.type(await screen.findByLabelText("URL"), url);
        await user.click(screen.getByRole("button", { name: /shorten/i }));

        expect(onSubmit).toHaveBeenCalledWith(url);
    });

    it("enables the shorten button by default", async () => {
        renderRoute({ path: "/", Component: ShortLinkForm } as never);

        expect(await screen.findByRole("button", { name: /shorten/i })).toBeEnabled();
    });

    it("disables the shorten button while loading", async () => {
        renderRoute({ path: "/", Component: () => <ShortLinkForm onSubmit={vi.fn()} isLoading /> } as never);

        expect(await screen.findByRole("button", { name: /shorten/i })).toBeDisabled();
    });
});
