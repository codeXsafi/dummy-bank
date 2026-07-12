/*
 * vitest.setup.ts — runs before every test file. Adds jest-dom's DOM
 * matchers (toBeInTheDocument, etc.) to Vitest's `expect`.
 */
import "@testing-library/jest-dom/vitest";
