import { render, screen } from "@testing-library/react";
import ErrorMessage from "@app/components/global/ErrorMessage";
import { describe, it, expect } from "vitest";

describe("ErrorMessage", () => {
    it("shows the given message", () => {
        render(<ErrorMessage message="Something went wrong" />);

        expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    });
});
