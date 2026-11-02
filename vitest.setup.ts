// Runs before every test file.
import "@testing-library/jest-dom/vitest"; // adds DOM checks like toBeInTheDocument() and toHaveAttribute()
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount whatever a test rendered, so the next test starts with an empty page.
afterEach(() => cleanup());
