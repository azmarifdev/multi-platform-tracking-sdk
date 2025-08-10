// Quick start examples for different scenarios

// ========================================
// 1. Quick Client-Side Setup (React/Next.js)
// ========================================
import { createPixelTracker } from '../src/index';

const tracker = createPixelTracker('YOUR_PIXEL_ID', { debug: true });

// Track page view
tracker.trackPageView();

// Track events
tracker.trackEvent('ViewContent', {
    content_ids: ['product-123'],
    content_type: 'product',
    value: 29.99,
    currency: 'USD',
});

// ========================================
// 2. Quick Server-Side Setup (Node.js)
// ========================================
import { createConversionTracker } from '../src/index';

const serverTracker = createConversionTracker('YOUR_ACCESS_TOKEN', 'YOUR_PIXEL_ID', { debug: true });

// Example function for server-side tracking
interface RequestData {
    sourceUrl?: string;
    ip?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
    email?: string;
    phone?: string;
    total?: number;
    orderId?: string;
    products?: Array<{
        id: string;
        quantity: number;
        price: number;
    }>;
}

async function handlePurchaseTracking(requestData: RequestData) {
    return await serverTracker.sendEvent({
        eventName: 'Purchase',
        eventSourceUrl: requestData.sourceUrl || 'https://example.com',
        userData: {
            clientIpAddress: requestData.ip,
            clientUserAgent: requestData.userAgent,
            fbp: requestData.fbp,
            fbc: requestData.fbc,
            email: requestData.email,
            phone: requestData.phone,
        },
        customData: {
            contentIds: requestData.products?.map((p) => p.id) || [],
            value: requestData.total,
            currency: 'USD',
            orderId: requestData.orderId,
            contents:
                requestData.products?.map((p) => ({
                    id: p.id,
                    quantity: p.quantity,
                    itemPrice: p.price,
                })) || [],
        },
    });
}

// ========================================
// 3. Hybrid Tracking (Best of Both Worlds)
// ========================================
import { createHybridTracker } from '../src/index';

const hybridTracker = createHybridTracker('YOUR_PIXEL_ID', 'YOUR_SERVER_ENDPOINT', {
    debug: true,
    enableClientTracking: true,
    enableServerTracking: true,
});

// This will track on both client and server automatically
hybridTracker.trackCustomEvent('Purchase', {
    value: 99.99,
    currency: 'USD',
    content_ids: ['product-456'],
});

// ========================================
// 4. Global Functions (Convenience)
// ========================================
import { setGlobalTracker, trackPageView, trackProductView } from '../src/index';

// Set up global tracker once
setGlobalTracker(createPixelTracker('YOUR_PIXEL_ID'));

// Use anywhere in your app
trackPageView();
trackProductView({
    id: 'product-789',
    name: 'Electronics Product',
    category: 'Electronics',
    price: 149.99,
    currency: 'USD',
});

// ========================================
// 5. E-commerce Complete Example
// ========================================
async function ecommerceExample() {
    const conversionTracker = createConversionTracker('YOUR_ACCESS_TOKEN', 'YOUR_PIXEL_ID');

    // Track product view
    await conversionTracker.sendEvent({
        eventName: 'ViewContent',
        eventSourceUrl: 'https://store.example.com/product/123',
        userData: {
            email: 'customer@example.com',
            phone: '+1234567890',
            fbp: 'fb.1.1234567890123.1234567890',
        },
        customData: {
            contentIds: ['product-123'],
            contentType: 'product',
            value: 29.99,
            currency: 'USD',
            contentName: 'Awesome Product',
        },
    });

    // Track add to cart
    await conversionTracker.sendEvent({
        eventName: 'AddToCart',
        eventSourceUrl: 'https://store.example.com/product/123',
        userData: {
            email: 'customer@example.com',
            fbp: 'fb.1.1234567890123.1234567890',
        },
        customData: {
            contentIds: ['product-123'],
            value: 29.99,
            currency: 'USD',
        },
    });

    // Track purchase
    await conversionTracker.sendEvent({
        eventName: 'Purchase',
        eventSourceUrl: 'https://store.example.com/checkout/success',
        userData: {
            email: 'customer@example.com',
            phone: '+1234567890',
            fbp: 'fb.1.1234567890123.1234567890',
        },
        customData: {
            value: 59.98,
            currency: 'USD',
            orderId: 'order-456',
            contentIds: ['product-123', 'product-124'],
            contents: [
                {
                    id: 'product-123',
                    quantity: 1,
                    itemPrice: 29.99,
                    title: 'Awesome Product',
                    category: 'Electronics',
                },
                {
                    id: 'product-124',
                    quantity: 1,
                    itemPrice: 29.99,
                    title: 'Another Product',
                    category: 'Electronics',
                },
            ],
            numItems: 2,
        },
    });
}

// ========================================
// 6. Lead Generation Example
// ========================================
async function leadGenerationExample() {
    const conversionTracker = createConversionTracker('YOUR_ACCESS_TOKEN', 'YOUR_PIXEL_ID');

    // Track lead form submission
    await conversionTracker.sendEvent({
        eventName: 'Lead',
        eventSourceUrl: 'https://example.com/contact',
        userData: {
            email: 'lead@example.com',
            phone: '+1234567890',
            firstName: 'John',
            lastName: 'Doe',
        },
        customData: {
            value: 50, // Lead value
            currency: 'USD',
            contentName: 'Contact Form',
        },
    });
}

// ========================================
// 7. Testing and Validation
// ========================================
import { isValidPixelId, isValidEmail } from '../src/index';

async function testSetup() {
    // Validate configuration
    const pixelId = 'YOUR_PIXEL_ID';
    const email = 'test@example.com';

    if (!isValidPixelId(pixelId)) {
        console.error('Invalid Pixel ID');
        return;
    }

    if (!isValidEmail(email)) {
        console.error('Invalid email format');
        return;
    }

    // Test server connection
    const tracker = createConversionTracker('YOUR_ACCESS_TOKEN', pixelId, {
        debug: true,
        testEventCode: 'TEST12345', // Use test event code during development
    });

    const testResult = await tracker.testConnection();
    if (testResult.success) {
        console.log('Connection successful:', testResult.details);
    } else {
        console.error('Server tracking failed:', testResult.error);
    }
}

// Run examples
if (require.main === module) {
    ecommerceExample().catch(console.error);
    leadGenerationExample().catch(console.error);
    testSetup().catch(console.error);
}

export { handlePurchaseTracking, ecommerceExample, leadGenerationExample, testSetup };
