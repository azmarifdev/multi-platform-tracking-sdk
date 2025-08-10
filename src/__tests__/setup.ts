// Test setup file
/// <reference types="jest" />

// Type declarations for testing environment
interface MockConsole extends Console {
    warn: jest.MockedFunction<typeof console.warn>;
    error: jest.MockedFunction<typeof console.error>;
    log: jest.MockedFunction<typeof console.log>;
}

// Jest setup for testing environment

// Mock window object for Node.js testing environment
if (typeof window === 'undefined') {
    const mockWindow = {
        fbq: jest.fn(),
        gtag: jest.fn(),
        location: {
            href: 'http://localhost',
            pathname: '/',
            search: '',
            hash: '',
        },
        localStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        },
        sessionStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        },
        fetch: jest.fn(),
    };

    (global as any).window = mockWindow;
}

// Mock fetch for testing
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

if (typeof global !== 'undefined') {
    (global as any).fetch = mockFetch;
} else {
    (window as any).fetch = mockFetch;
}

// Mock console methods to avoid noise in tests
const mockConsole = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
} as MockConsole;

if (typeof global !== 'undefined') {
    (global as any).console = mockConsole;
} else {
    (window as any).console = mockConsole;
}

// Clear all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
