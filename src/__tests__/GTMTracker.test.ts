import { GTMTracker, GTMConfig } from '../GTMTracker';

// Mock browser environment
const mockWindow = {
    dataLayer: [],
    location: {
        href: 'https://example.com/test',
        pathname: '/test',
    },
};

const mockDocument = {
    title: 'Test Page',
    getElementById: jest.fn().mockReturnValue(null),
    createElement: jest.fn().mockReturnValue({
        id: '',
        innerHTML: '',
    }),
    head: {
        appendChild: jest.fn(),
    },
    body: {
        insertBefore: jest.fn(),
        firstChild: null,
    },
};

// Set up global mocks once
Object.assign(globalThis, { window: mockWindow, document: mockDocument });

describe('GTMTracker', () => {
    let gtmTracker: GTMTracker;
    let config: GTMConfig;

    beforeEach(() => {
        config = {
            gtmId: 'GTM-TEST123',
            debug: false,
            autoTrackPageViews: false,
            defaultCurrency: 'USD',
        };

        // Reset mock data
        mockWindow.dataLayer = [];
        jest.clearAllMocks();

        gtmTracker = new GTMTracker(config);
    });

    describe('basic functionality', () => {
        it('should create GTMTracker with valid config', () => {
            expect(gtmTracker).toBeInstanceOf(GTMTracker);
            expect(gtmTracker.getConfig().gtmId).toBe('GTM-TEST123');
        });

        it('should throw error for missing GTM ID', () => {
            expect(() => {
                new GTMTracker({ gtmId: '' });
            }).toThrow('GTM ID is required');
        });

        it('should initialize with default values', () => {
            const tracker = new GTMTracker({ gtmId: 'GTM-TEST' });
            const trackerConfig = tracker.getConfig();

            expect(trackerConfig.debug).toBe(false);
            expect(trackerConfig.autoTrackPageViews).toBe(true);
            expect(trackerConfig.defaultCurrency).toBe('USD');
        });

        it('should be ready in browser environment', () => {
            expect(gtmTracker.isReady()).toBe(true);
        });

        it('should update configuration', () => {
            gtmTracker.updateConfig({
                debug: true,
                defaultCurrency: 'EUR',
            });

            const updatedConfig = gtmTracker.getConfig();
            expect(updatedConfig.debug).toBe(true);
            expect(updatedConfig.defaultCurrency).toBe('EUR');
        });
    });

    describe('tracking methods', () => {
        it('should have all required tracking methods', () => {
            expect(typeof gtmTracker.trackPageView).toBe('function');
            expect(typeof gtmTracker.trackProductView).toBe('function');
            expect(typeof gtmTracker.trackAddToCart).toBe('function');
            expect(typeof gtmTracker.trackPurchase).toBe('function');
            expect(typeof gtmTracker.trackSearch).toBe('function');
            expect(typeof gtmTracker.trackRegistration).toBe('function');
            expect(typeof gtmTracker.trackCustomEvent).toBe('function');
            expect(typeof gtmTracker.setUserData).toBe('function');
            expect(typeof gtmTracker.trackAddToWishlist).toBe('function');
        });

        it('should not throw errors when calling tracking methods', () => {
            expect(() => {
                gtmTracker.trackPageView('/test', 'Test Page');
            }).not.toThrow();

            expect(() => {
                gtmTracker.trackProductView({
                    id: 'test-product',
                    name: 'Test Product',
                    price: 99.99,
                });
            }).not.toThrow();

            expect(() => {
                gtmTracker.trackCustomEvent('test_event', { test: 'data' });
            }).not.toThrow();
        });

        it('should handle tracking with minimal data', () => {
            expect(() => {
                gtmTracker.trackSearch({ searchTerm: 'test' });
                gtmTracker.trackRegistration();
                gtmTracker.setUserData({ isLoggedIn: false });
            }).not.toThrow();
        });
    });

    describe('initialization', () => {
        it('should initialize successfully', () => {
            expect(() => {
                gtmTracker.init();
            }).not.toThrow();
        });

        it('should handle multiple initialization calls', () => {
            gtmTracker.init();
            expect(() => {
                gtmTracker.init();
            }).not.toThrow();
        });
    });

    describe('debug functionality', () => {
        it('should have debug method', () => {
            expect(typeof gtmTracker.debugDataLayer).toBe('function');
            expect(() => {
                gtmTracker.debugDataLayer();
            }).not.toThrow();
        });
    });
});
