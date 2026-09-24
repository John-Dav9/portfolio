import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// jsdom lacks these browser APIs used by the animations.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserverStub;
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.focus;
});
