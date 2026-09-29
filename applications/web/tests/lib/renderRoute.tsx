import { createRoutesStub } from "react-router";
import { render } from "@testing-library/react";

export function renderRoute(route: Parameters<typeof createRoutesStub>[0][number], path = "/") {
    const Stub = createRoutesStub([route]);
    return render(<Stub initialEntries={[path]} />);
}