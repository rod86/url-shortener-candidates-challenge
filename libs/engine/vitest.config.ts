import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reportsDirectory: 'coverage',
            reporter: ['text', 'html', 'lcov', 'json-summary'],
            thresholds: {
                statements: 80, // executable statements (assignment, return, throw,...)
                branches: 80, // decisions paths taken (if, switch,...)
                functions: 80, // functions called once
                lines: 80, // source line that ran once
            },
            exclude: ['tests/**'],
        },
        projects: [
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: 'unit',
                    globals: true,
                    environment: 'node',
                    include: ['tests/unit/**/*.test.ts']
                }
            },
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: 'integration',
                    globals: true,
                    environment: 'node',
                    include: ['tests/integration/**/*.test.ts'],
                }
            }
        ]
    },
});
