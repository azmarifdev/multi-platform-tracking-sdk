import { InstagramTracker, InstagramConfig } from '../InstagramTracker';

// Mock browser environment
const mockWindow = {
    dataLayer: [],
    location: {
        href: 'https://example.com/test',
        pathname: '/test',
    },
    fbq: jest.fn(),
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

// Set up global mocks
Object.assign(globalThis, { window: mockWindow, document: mockDocument });

describe('InstagramTracker', () => {
    let instagramTracker: InstagramTracker;
    let config: InstagramConfig;

    beforeEach(() => {
        config = {
            pixelId: '1234567890123456', // Valid 16-digit format
            debug: false,
            defaultCurrency: 'BDT',
        };

        // Reset mock data
        mockWindow.dataLayer = [];
        jest.clearAllMocks();

        instagramTracker = new InstagramTracker(config);
    });

    describe('basic functionality', () => {
        it('should create InstagramTracker with valid config', () => {
            expect(instagramTracker).toBeInstanceOf(InstagramTracker);
            expect(instagramTracker.getConfig().pixelId).toBe('1234567890123456');
        });

        it('should throw error for missing Pixel ID', () => {
            expect(() => {
                new InstagramTracker({ pixelId: '' });
            }).toThrow();
        });

        it('should initialize with default values', () => {
            const tracker = new InstagramTracker({ pixelId: '1234567890123456' });
            const trackerConfig = tracker.getConfig();

            expect(trackerConfig.debug).toBe(false);
            expect(trackerConfig.defaultCurrency).toBe('USD');
        });

        it('should be ready in browser environment', () => {
            expect(instagramTracker.isReady()).toBe(true);
        });

        it('should update configuration', () => {
            instagramTracker.updateConfig({
                debug: true,
                defaultCurrency: 'EUR',
            });

            const updatedConfig = instagramTracker.getConfig();
            expect(updatedConfig.debug).toBe(true);
            expect(updatedConfig.defaultCurrency).toBe('EUR');
        });
    });

    describe('tracking methods', () => {
        it('should have all required Instagram tracking methods', () => {
            expect(typeof instagramTracker.trackContentEngagement).toBe('function');
            expect(typeof instagramTracker.trackStoryInteraction).toBe('function');
            expect(typeof instagramTracker.trackReelsInteraction).toBe('function');
            expect(typeof instagramTracker.trackShoppingEvent).toBe('function');
            expect(typeof instagramTracker.trackFollowAction).toBe('function');
            expect(typeof instagramTracker.trackSearch).toBe('function');
            expect(typeof instagramTracker.trackLiveInteraction).toBe('function');
            expect(typeof instagramTracker.trackAdInteraction).toBe('function');
            expect(typeof instagramTracker.setUserContext).toBe('function');
            expect(typeof instagramTracker.trackProfileVisit).toBe('function');
            expect(typeof instagramTracker.trackHashtagInteraction).toBe('function');
            expect(typeof instagramTracker.trackDirectMessage).toBe('function');
        });

        it('should not throw errors when calling tracking methods', () => {
            expect(() => {
                instagramTracker.trackContentEngagement('like', {
                    contentType: 'photo',
                    contentId: 'test-post',
                });
            }).not.toThrow();

            expect(() => {
                instagramTracker.trackShoppingEvent('product_view', {
                    productId: 'test-product',
                    productName: 'Test Product',
                    price: 99.99,
                });
            }).not.toThrow();

            expect(() => {
                instagramTracker.trackFollowAction('follow', {
                    userId: 'test-user',
                    username: 'testuser',
                });
            }).not.toThrow();
        });

        it('should handle Instagram-specific tracking with minimal data', () => {
            expect(() => {
                instagramTracker.trackStoryInteraction('view');
                instagramTracker.trackReelsInteraction('like');
                instagramTracker.trackSearch('test', 'hashtag');
                instagramTracker.trackLiveInteraction('start_watching');
                instagramTracker.trackAdInteraction('view');
                instagramTracker.trackProfileVisit({ username: 'test' });
                instagramTracker.trackHashtagInteraction('view', 'test');
                instagramTracker.trackDirectMessage('send');
            }).not.toThrow();
        });
    });

    describe('initialization', () => {
        it('should initialize successfully', () => {
            expect(() => {
                instagramTracker.init();
            }).not.toThrow();
        });
    });

    describe('helper methods', () => {
        it('should provide recommended events for different account types', () => {
            const personalEvents = instagramTracker.getRecommendedEvents('personal');
            const businessEvents = instagramTracker.getRecommendedEvents('business');
            const creatorEvents = instagramTracker.getRecommendedEvents('creator');

            expect(personalEvents).toBeInstanceOf(Array);
            expect(businessEvents).toBeInstanceOf(Array);
            expect(creatorEvents).toBeInstanceOf(Array);

            expect(businessEvents.length).toBeGreaterThan(personalEvents.length);
            expect(creatorEvents.length).toBeGreaterThan(personalEvents.length);
        });

        it('should have debug method', () => {
            expect(typeof instagramTracker.debugInstagramData).toBe('function');
            expect(() => {
                instagramTracker.debugInstagramData();
            }).not.toThrow();
        });
    });
});
