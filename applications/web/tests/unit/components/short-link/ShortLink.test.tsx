import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import ShortLink from "@app/components/short-link/ShortLink";
import { describe, it, expect, vi } from "vitest";

describe("ShortLink", () => {
    it("shows the url and a copy button", () => {
        const url = faker.internet.url();

        render(<ShortLink url={url} />);

        expect(screen.getByText(url)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });

    it("copies the url to the clipboard when clicking copy", async () => {
        const user = userEvent.setup();
        const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
        const url = faker.internet.url();
        render(<ShortLink url={url} />);

        await user.click(screen.getByRole("button", { name: /copy/i }));

        expect(writeText).toHaveBeenCalledWith(url);
    });

    it("shows a copied confirmation after copying and restores the label afterwards", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
        render(<ShortLink url={faker.internet.url()} />);

        await user.click(screen.getByRole("button", { name: /copy/i }));

        expect(await screen.findByText("Copied")).toBeInTheDocument();

        await act(() => vi.advanceTimersByTime(2000));

        expect(screen.queryByText("Copied")).not.toBeInTheDocument();
        expect(screen.getByText("Copy")).toBeInTheDocument();
        vi.useRealTimers();
    });
});
