import '@testing-library/jest-dom';

// Mock IntersectionObserver for framer-motion in jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
};

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
