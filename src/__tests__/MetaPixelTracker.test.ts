import { MetaPixelTracker } from '../MetaPixelTracker';

// Mock window.fbq
const mockFbq = jest.fn();
Object.defineProperty(window, 'fbq', {
    value: mockFbq,
    writable: true,
});

describe('MetaPixelTracker', () => {
    let tracker: MetaPixelTracker;
    const pixelId = '123456789012345';

    beforeEach(() => {
        tracker = new MetaPixelTracker({
            pixelId,
            debug: true,
            autoInit: false,
        });
        mockFbq.mockClear();
    });

    it('should create tracker with valid config', () => {
        expect(tracker).toBeInstanceOf(MetaPixelTracker);
        expect(tracker.getConfig().pixelId).toBe(pixelId);
    });

    it('should throw error with invalid pixel ID', () => {
        expect(() => {
            new MetaPixelTracker({
                pixelId: 'invalid',
            });
        }).toThrow();
    });

    it('should track page view', () => {
        tracker.init();
        tracker.trackPageView();
        expect(mockFbq).toHaveBeenCalledWith('track', 'PageView', expect.any(Object));
    });

    it('should track product view', () => {
        tracker.init();
        const product = {
            id: 'prod-123',
            name: 'Test Product',
            price: 99.99,
            currency: 'USD',
        };

        tracker.trackProductView(product);
        expect(mockFbq).toHaveBeenCalledWith(
            'track',
            'ViewContent',
            expect.objectContaining({
                content_ids: ['prod-123'],
                content_name: 'Test Product',
                value: 99.99,
                currency: 'USD',
            })
        );
    });

    it('should track add to cart', () => {
        tracker.init();
        const product = {
            id: 'prod-123',
            name: 'Test Product',
            price: 99.99,
            quantity: 2,
            currency: 'USD',
        };

        tracker.trackAddToCart(product);
        expect(mockFbq).toHaveBeenCalledWith(
            'track',
            'AddToCart',
            expect.objectContaining({
                content_ids: ['prod-123'],
                value: 199.98,
                currency: 'USD',
            })
        );
    });

    it('should check if ready', () => {
        expect(tracker.isReady()).toBe(false);
        tracker.init();
        expect(tracker.isReady()).toBe(true);
    });
});
