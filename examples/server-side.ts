// Server-side tracking example
import { MetaConversionTracker, createConversionTracker } from '../src/index';

// Method 1: Using the class directly
const tracker = new MetaConversionTracker({
    accessToken: process.env.META_ACCESS_TOKEN!,
    pixelId: process.env.META_PIXEL_ID!,
    debug: process.env.NODE_ENV === 'development',
});

// Method 2: Using the convenience function
const tracker2 = createConversionTracker(process.env.META_ACCESS_TOKEN!, process.env.META_PIXEL_ID!, { debug: true });

// Example usage in a simple HTTP server (without express dependency)
// This example shows how to integrate with any Node.js HTTP framework

// ========================================
// Helper Functions
// ========================================

interface UserInfo {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
    ip?: string; // Alternative field name
    userAgent?: string; // Alternative field name
}

interface ProductData {
    id: string;
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
    currency?: string;
    sourceUrl?: string;
}

interface OrderData {
    value?: number;
    currency?: string;
    orderId?: string;
    products?: ProductData[];
    total?: number; // Alternative field name for value
}

interface LeadData {
    value?: number;
    currency?: string;
    source?: string;
    sourceUrl?: string;
    formName?: string;
    [key: string]: unknown;
}

function getUserData(userInfo: UserInfo) {
    return {
        clientIpAddress: userInfo.ip || '',
        clientUserAgent: userInfo.userAgent || '',
        fbp: userInfo.fbp,
        fbc: userInfo.fbc,
        email: userInfo.email,
        phone: userInfo.phone,
    };
}

// Track page view example
async function trackPageView(userInfo: UserInfo, pageUrl: string) {
    try {
        const result = await tracker.sendEvent({
            eventName: 'PageView',
            eventSourceUrl: pageUrl,
            userData: getUserData(userInfo),
            customData: {},
        });
        console.log('Page view tracked:', result);
        return result;
    } catch (error) {
        console.error('Error tracking page view:', error);
        throw error;
    }
}

// Track product view example
async function trackProductView(userInfo: UserInfo, productData: ProductData) {
    try {
        const result = await tracker.sendEvent({
            eventName: 'ViewContent',
            eventSourceUrl: productData.sourceUrl || '',
            userData: getUserData(userInfo),
            customData: {
                contentIds: [productData.id],
                contentType: productData.category,
                value: productData.price,
                currency: productData.currency || 'USD',
                contentName: productData.name,
            },
        });
        console.log('Product view tracked:', result);
        return result;
    } catch (error) {
        console.error('Error tracking product view:', error);
        throw error;
    }
}

// Track purchase example
async function trackPurchase(userInfo: UserInfo, orderData: OrderData) {
    try {
        const result = await tracker.sendEvent({
            eventName: 'Purchase',
            eventSourceUrl: '',
            userData: getUserData(userInfo),
            customData: {
                contentIds: orderData.products?.map((p) => p.id) || [],
                value: orderData.total || orderData.value,
                currency: orderData.currency || 'USD',
                orderId: orderData.orderId,
                contents:
                    orderData.products?.map((p) => ({
                        id: p.id,
                        quantity: p.quantity || 1,
                        itemPrice: p.price || 0,
                        title: p.name,
                        category: p.category,
                    })) || [],
                numItems: orderData.products?.length || 0,
            },
        });
        console.log('Purchase tracked:', result);
        return result;
    } catch (error) {
        console.error('Error tracking purchase:', error);
        throw error;
    }
}

// Track lead example
async function trackLead(userInfo: UserInfo, leadData: LeadData) {
    try {
        const result = await tracker.sendEvent({
            eventName: 'Lead',
            eventSourceUrl: leadData.sourceUrl || '',
            userData: getUserData(userInfo),
            customData: {
                value: leadData.value || 0,
                currency: leadData.currency || 'USD',
                contentName: leadData.formName || 'Lead Form',
            },
        });
        console.log('Lead tracked:', result);
        return result;
    } catch (error) {
        console.error('Error tracking lead:', error);
        throw error;
    }
}

// Example usage with mock data
async function examples() {
    const mockUserInfo = {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        email: 'user@example.com',
        fbp: 'fb.1.1234567890123.1234567890',
        fbc: 'fb.1.1234567890123.AbCdEfGhIjKlMnOpQrStUvWxYz',
    };

    // Track page view
    await trackPageView(mockUserInfo, 'https://example.com/product/123');

    // Track product view
    await trackProductView(mockUserInfo, {
        id: 'product-123',
        name: 'Awesome Product',
        category: 'Electronics',
        price: 99.99,
        currency: 'USD',
        sourceUrl: 'https://example.com/product/123',
    });

    // Track purchase
    await trackPurchase(mockUserInfo, {
        orderId: 'order-456',
        total: 199.98,
        currency: 'USD',
        products: [
            {
                id: 'product-123',
                name: 'Awesome Product',
                category: 'Electronics',
                price: 99.99,
                quantity: 2,
            },
        ],
    });

    // Track lead
    await trackLead(mockUserInfo, {
        value: 50,
        currency: 'USD',
        formName: 'Contact Form',
        sourceUrl: 'https://example.com/contact',
    });
}

// Run examples if this file is executed directly
if (require.main === module) {
    examples().catch(console.error);
}

export { tracker, tracker2, trackPageView, trackProductView, trackPurchase, trackLead };
