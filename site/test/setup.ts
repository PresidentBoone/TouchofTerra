import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom lacks these; polyfill so motion + hooks don't throw in tests.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!("IntersectionObserver" in window)) {
  class IntersectionObserverStub {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
}
