// Hybrid tracking example (Client + Server)
import { HybridTracker, createHybridTracker } from '../src/index';

// Method 1: Using the class directly
const tracker = new HybridTracker({
    pixelId: 'YOUR_PIXEL_ID',
    serverEndpoint: '/api/track/event', // Your server tracking endpoint
    debug: true,
    enableClientTracking: true,
    enableServerTracking: true,
});

// Method 2: Using the convenience function
const serverTracker = createHybridTracker('YOUR_PIXEL_ID', '/api/track/event', { debug: true });

// All tracking methods will now track both client-side and server-side

// Track page view (both client and server)
await tracker.trackPageView();

// You can also use the server tracker
await serverTracker.trackPageView();

// Track product view (both client and server)
await tracker.trackProductView({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    currency: 'USD',
    category: 'Electronics',
});

// Track add to cart (both client and server)
await tracker.trackAddToCart({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    quantity: 2,
    currency: 'USD',
});

// Track purchase (both client and server)
await tracker.trackPurchase({
    orderId: 'order-456',
    value: 199.98,
    currency: 'USD',
    products: [
        {
            id: 'product-123',
            name: 'Amazing Product',
            price: 99.99,
            quantity: 2,
        },
    ],
});

// Track custom event (both client and server)
await tracker.trackCustomEvent('CustomEvent', {
    customProperty: 'value',
    anotherProperty: 123,
});

// Control tracking methods individually
tracker.setClientTrackingEnabled(false); // Disable client-side tracking
tracker.setServerTrackingEnabled(true); // Keep server-side tracking

// Check tracking status
const status = tracker.getTrackingStatus();
console.log('Tracking Status:', status);
// Output: { clientTracking: false, serverTracking: true, pixelReady: true, serverConfigured: true }

export default tracker;
