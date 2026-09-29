import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// cleanup() unmounts the rendered DOM after each test. It runs automatically only when Vitest globals are enabled and the testing library detects afterEach. Calling it explicitly is safer.
afterEach(() => cleanup());