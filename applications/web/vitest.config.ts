import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "v8",
            reportsDirectory: "coverage",
            reporter: ["text", "html", "lcov", "json-summary"],
            include: ["app/**"],
            exclude: ["app/root.tsx", "app/routes.ts", "tests/**"],
        },
        projects: [
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: "unit",
                    globals: true,
                    environment: "jsdom",
                    setupFiles: ["tests/setup.ts"],
                    include: ["tests/unit/**/*.test.{ts,tsx}"],
                },
            },
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: "integration",
                    globals: true,
                    environment: "jsdom",
                    setupFiles: ["tests/setup.ts"],
                    include: ["tests/integration/**/*.test.{ts,tsx}"],
                },
            },
        ],
    },
    esbuild: { jsx: "automatic" },
});