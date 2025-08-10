// Client-side tracking example
import { MetaPixelTracker, createPixelTracker } from '../src/index';

// Method 1: Using the class directly
const directTracker = new MetaPixelTracker({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID!,
    debug: process.env.NODE_ENV === 'development',
});

// Method 2: Using the convenience function
const tracker = createPixelTracker('YOUR_PIXEL_ID', { debug: true });

// Alternative way with environment variables (Next.js example)
const envTracker = process.env.NEXT_PUBLIC_META_PIXEL_ID
    ? createPixelTracker(process.env.NEXT_PUBLIC_META_PIXEL_ID, { debug: true })
    : tracker; // Use default tracker if env var not available

// Initialize in your app (e.g., in useEffect or _app.tsx)
tracker.init();

// Initialize environment tracker if different
if (envTracker !== tracker) {
    envTracker.init();
}

// You can also use the direct tracker
directTracker.init();

// Track page view
tracker.trackPageView();

// Track product view
tracker.trackProductView({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    currency: 'USD',
    category: 'Electronics',
});

// Track add to cart
tracker.trackAddToCart({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    quantity: 2,
    currency: 'USD',
});

// Track purchase
tracker.trackPurchase({
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

// Track search
tracker.trackSearch({
    searchTerm: 'smartphone',
});

export default tracker;
