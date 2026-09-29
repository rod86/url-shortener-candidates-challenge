import { render, screen } from "@testing-library/react";
import Spinner from "@app/components/global/Spinner";
import { describe, it, expect } from "vitest";

describe("Spinner", () => {
    it("shows a loading image", () => {
        render(<Spinner />);

        expect(screen.getByRole("img", { name: "Loading" })).toBeInTheDocument();
    });
});
