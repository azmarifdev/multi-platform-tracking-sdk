# Meta Tracking SDK

A comprehensive, professional TypeScript/JavaScript SDK for Facebook/Meta Pixel and Conversion API tracking. Self-contained implementation with zero external dependencies, inspired by facebook-nodejs-business-sdk patterns.

[![npm version](https://badge.fury.io/js/@azmarifdev/meta-tracking-sdk.svg)](https://badge.fury.io/js/@azmarifdev/meta-tracking-sdk)
[![Downloads](https://img.shields.io/npm/dt/@azmarifdev/meta-tracking-sdk.svg)](https://www.npmjs.com/package/@azmarifdev/meta-tracking-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

-   🎯 **Client-side Pixel tracking** - Browser-based Facebook Pixel integration
-   🔒 **Server-side Conversion API** - Privacy-compliant server-side tracking
-   🔄 **Hybrid tracking mode** - Best of both worlds with automatic deduplication
-   📊 **Enhanced data validation** - Built-in validation and normalization
-   🛡️ **Privacy compliant** - GDPR/CCPA ready with data processing options
-   🔧 **Zero dependencies** - Completely self-contained implementation
-   📦 **Framework agnostic** - Works with React, Vue, Angular, Node.js, and more
-   🚀 **Performance optimized** - Minimal bundle size with tree-shaking support
-   📈 **Comprehensive analytics** - Built-in event tracking and analytics
-   🧪 **Test-friendly** - Debug mode and test event support

## Installation

```bash
# Using npm
npm install @azmarifdev/meta-tracking-sdk

# Using yarn
yarn add @azmarifdev/meta-tracking-sdk

# Using pnpm
pnpm add @azmarifdev/meta-tracking-sdk

# Using bun
bun add @azmarifdev/meta-tracking-sdk
```

> **Note:** This package is completely self-contained and doesn't require any external Facebook SDK dependencies. It includes its own optimized implementation inspired by Facebook's official patterns.

## Quick Start

### Client-side Pixel Tracking

```typescript
import { MetaPixelTracker } from '@azmarifdev/meta-tracking-sdk';

// Initialize the pixel tracker
const pixelTracker = new MetaPixelTracker({
    pixelId: 'YOUR_PIXEL_ID',
    debug: true, // Enable for development
});

// Track page view
await pixelTracker.trackPageView();

// Track purchase
await pixelTracker.trackPurchase({
    value: 29.99,
    currency: 'USD',
    content_ids: ['product-123'],
    content_type: 'product',
});
```

### Server-side Conversion API

```typescript
import { MetaConversionTracker } from '@azmarifdev/meta-tracking-sdk';

// Initialize the conversion tracker
const conversionTracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
    debug: true,
});

// Track server-side purchase
await conversionTracker.trackPurchase({
    eventSourceUrl: 'https://yoursite.com/checkout',
    userData: {
        email: 'customer@example.com',
        phone: '+1234567890',
        clientIpAddress: '127.0.0.1',
        clientUserAgent: 'Mozilla/5.0...',
    },
    products: [
        {
            id: 'product-123',
            name: 'Amazing Product',
            price: 29.99,
            quantity: 1,
        },
    ],
    totalValue: 29.99,
    currency: 'USD',
    orderId: 'order-456',
});
```

### Hybrid Tracking (Recommended)

```typescript
import { HybridTracker } from '@azmarifdev/meta-tracking-sdk';

// Initialize hybrid tracker
const tracker = new HybridTracker({
    pixelId: 'YOUR_PIXEL_ID',
    serverEndpoint: '/api/track', // Your server endpoint
    debug: true,
});

// This will track on both client and server with automatic deduplication
await tracker.trackPurchase({
    value: 29.99,
    currency: 'USD',
    content_ids: ['product-123'],
    eventId: 'unique-event-id', // Important for deduplication
});
```

## Enhanced Features

### Advanced User Data Support

The SDK now supports all user data fields from Facebook's Conversion API:

```typescript
const userData = {
    // Basic identification
    email: 'user@example.com',
    phone: '+1234567890',
    firstName: 'John',
    lastName: 'Doe',

    // Enhanced matching fields
    f5first: 'john', // First 5 characters of first name
    f5last: 'doe', // First 5 characters of last name
    fi: 'j', // First initial

    // Date of birth (multiple formats)
    dateOfBirth: '19901225', // YYYYMMDD
    dobd: '25', // Day
    dobm: '12', // Month
    doby: '1990', // Year

    // Geographic data
    city: 'new york',
    state: 'ny',
    zipCode: '10001',
    country: 'us',

    // Device and session data
    clientIpAddress: '192.168.1.1',
    clientUserAgent: 'Mozilla/5.0...',
    fbp: 'fb.1.1234567890.123456789', // Facebook browser ID
    fbc: 'fb.1.1234567890.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890', // Facebook click ID

    // App and external IDs
    externalId: 'user-12345',
    appUserId: 'app-user-123',
    madid: 'mobile-ad-id',
    subscriptionId: 'sub-123',
    leadId: 'lead-456',

    // WhatsApp and page data
    ctwaClid: 'whatsapp-click-id',
    pageId: 'page-123',
};
```

### Privacy and Compliance

```typescript
// GDPR/CCPA compliance with data processing options
await conversionTracker.sendEvent({
    eventName: 'Purchase',
    eventSourceUrl: 'https://yoursite.com',
    userData: {
        /* ... */
    },
    customData: {
        /* ... */
    },

    // Privacy controls
    optOut: false, // Set to true to exclude from ads optimization
    dataProcessingOptions: ['LDU'], // Limited Data Use
    dataProcessingOptionsCountry: 1, // United States
    dataProcessingOptionsState: 1000, // California
});
```

### Batch Event Processing

```typescript
// Send multiple events efficiently
const events = [
    { eventName: 'PageView', eventSourceUrl: 'https://example.com/page1', userData: {...} },
    { eventName: 'ViewContent', eventSourceUrl: 'https://example.com/product', userData: {...} },
    { eventName: 'AddToCart', eventSourceUrl: 'https://example.com/cart', userData: {...} },
];

const response = await conversionTracker.sendBatchEvents(events);
console.log(`Processed ${response.eventsReceived} events`);
```

### Enhanced Configuration

```typescript
const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',

    // Enhanced security
    appSecret: 'YOUR_APP_SECRET', // For app secret proof

    // Attribution and partnerships
    partnerAgent: 'your-platform-v1.0',

    // Advanced features
    namespaceId: 'namespace-123',
    uploadId: 'upload-456',
    uploadTag: 'campaign-tag',
    uploadSource: 'website',

    // Development & testing
    testEventCode: 'TEST12345',
    debug: true,
});
```

### Validation and Testing

```typescript
// Test API connection
const testResult = await conversionTracker.testConnection();
if (testResult.success) {
    console.log('✅ Connection successful');
} else {
    console.error('❌ Connection failed:', testResult.message);
}

// Validate pixel access
const validation = await conversionTracker.validatePixelAccess();
console.log('Pixel info:', validation.pixelInfo);
console.log('Permissions:', validation.permissions);

// Get recommended events for your business
const recommendedEvents = conversionTracker.getRecommendedEvents('ecommerce');
console.log('Recommended events:', recommendedEvents);
```

### Error Handling and Retry Logic

```typescript
// Configure retry behavior
tracker.setRetryConfig(5, 2000); // 5 attempts, 2 second delay

// Enhanced error handling
try {
    await tracker.trackPurchase(purchaseData);
} catch (error) {
    if (error.code === 'API_ERROR') {
        console.error('Facebook API Error:', error.message);
        console.error('Trace ID:', error.fbtrace_id);
    }
}
```

## API Reference

### MetaPixelTracker

Client-side Facebook Pixel tracking.

#### Methods

-   `trackPageView(data?)` - Track page views
-   `trackPurchase(data)` - Track purchases
-   `trackAddToCart(data)` - Track add to cart events
-   `trackInitiateCheckout(data)` - Track checkout initiation
-   `trackLead(data)` - Track lead generation
-   `trackRegistration(data)` - Track user registration
-   `trackSearch(data)` - Track search events
-   `trackCustomEvent(eventName, data)` - Track custom events

### MetaConversionTracker

Server-side Conversion API tracking with enhanced features.

#### Methods

-   `sendEvent(eventData)` - Send single event
-   `sendBatchEvents(events)` - Send multiple events
-   `trackPageView(data)` - Track page views
-   `trackProductView(data)` - Track product views
-   `trackPurchase(data)` - Track purchases
-   `trackAddToCart(data)` - Track add to cart
-   `trackInitiateCheckout(data)` - Track checkout initiation
-   `trackLead(data)` - Track leads
-   `trackRegistration(data)` - Track registrations
-   `trackSearch(data)` - Track search events
-   `testConnection()` - Test API connectivity
-   `validatePixelAccess()` - Validate pixel permissions
-   `getRecommendedEvents(businessType)` - Get recommended events
-   `setRetryConfig(attempts, delay)` - Configure retry behavior

### HybridTracker

Combined client and server-side tracking with automatic deduplication.

#### Methods

-   `trackHybrid(eventName, data)` - Track on both client and server
-   `trackPageView(data)` - Hybrid page view tracking
-   `trackPurchase(data)` - Hybrid purchase tracking
-   `trackAddToCart(data)` - Hybrid add to cart tracking
-   `trackLead(data)` - Hybrid lead tracking

## Business Type Recommendations

The SDK provides tailored event recommendations based on your business type:

```typescript
// E-commerce
const ecommerceEvents = tracker.getRecommendedEvents('ecommerce');
// Returns: ['PageView', 'ViewContent', 'Search', 'AddToCart', 'AddToWishlist', 'InitiateCheckout', 'AddPaymentInfo', 'Purchase']

// SaaS
const saasEvents = tracker.getRecommendedEvents('saas');
// Returns: ['PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'StartTrial', 'Subscribe', 'Contact']

// Lead Generation
const leadGenEvents = tracker.getRecommendedEvents('lead_generation');
// Returns: ['PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'Contact', 'SubmitApplication', 'Schedule']
```

## Framework Integrations

### React Hook

```typescript
import { useMetaTracking } from '@azmarifdev/meta-tracking-sdk/react';

function CheckoutPage() {
    const { trackPurchase } = useMetaTracking();

    const handlePurchase = async (orderData) => {
        await trackPurchase({
            value: orderData.total,
            currency: 'USD',
            content_ids: orderData.items.map((item) => item.id),
        });
    };

    return <button onClick={handlePurchase}>Complete Purchase</button>;
}
```

### Vue Plugin

```typescript
import { createMetaTracking } from '@azmarifdev/meta-tracking-sdk/vue';

app.use(
    createMetaTracking({
        pixelId: 'YOUR_PIXEL_ID',
        debug: true,
    }),
);

// In component
this.$metaTracking.trackPurchase(purchaseData);
```

### Express.js Middleware

```typescript
import express from 'express';
import { createTrackingMiddleware } from '@azmarifdev/meta-tracking-sdk/express';

const app = express();

app.use(
    '/api/track',
    createTrackingMiddleware({
        accessToken: 'YOUR_ACCESS_TOKEN',
        pixelId: 'YOUR_PIXEL_ID',
    }),
);
```

## Development and Testing

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
    debug: true, // Enables detailed logging
});
```

### Test Events

Use Facebook's Test Events feature:

```typescript
const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
    testEventCode: 'TEST12345', // From Events Manager
});
```

## Performance Optimization

### Bundle Size

The SDK is optimized for minimal bundle impact:

-   Core library: ~15KB gzipped
-   Tree-shaking friendly
-   Lazy loading of heavy dependencies
-   Browser/Node.js specific builds

### Best Practices

1. **Use event deduplication** with unique `eventId` values
2. **Batch events** when possible for better performance
3. **Enable retry logic** for reliable delivery
4. **Use hybrid tracking** for maximum data quality
5. **Validate data** before sending to reduce errors

## Privacy and Compliance

### GDPR Compliance

```typescript
// Check user consent before tracking
if (userConsent.analytics) {
    await tracker.trackPageView();
}

// Use Limited Data Use for California users
await tracker.sendEvent({
    // ... event data
    dataProcessingOptions: ['LDU'],
    dataProcessingOptionsCountry: 1,
    dataProcessingOptionsState: 1000,
});
```

### Data Minimization

```typescript
// Only send necessary user data
const userData = {
    clientIpAddress: request.ip,
    clientUserAgent: request.headers['user-agent'],
    // Avoid sending PII when possible
};
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
    await tracker.trackPurchase(data);
} catch (error) {
    switch (error.code) {
        case 'CONFIG_ERROR':
            console.error('Configuration issue:', error.message);
            break;
        case 'VALIDATION_ERROR':
            console.error('Data validation failed:', error.message);
            break;
        case 'API_ERROR':
            console.error('Facebook API error:', error.message);
            console.error('Trace ID:', error.fbtrace_id);
            break;
        case 'NETWORK_ERROR':
            console.error('Network issue:', error.message);
            break;
        default:
            console.error('Unknown error:', error);
    }
}
```

## Migration Guide

### From Facebook Pixel SDK

```typescript
// Before
fbq('track', 'Purchase', {
    value: 29.99,
    currency: 'USD',
});

// After
await pixelTracker.trackPurchase({
    value: 29.99,
    currency: 'USD',
});
```

### From facebook-nodejs-business-sdk

```typescript
// Before (facebook-nodejs-business-sdk)
const { ServerEvent, EventRequest } = require('facebook-nodejs-business-sdk');
const serverEvent = new ServerEvent();
// ... complex setup

// After (Meta Tracking SDK)
await conversionTracker.trackPurchase({
    eventSourceUrl: 'https://example.com',
    userData: {
        /* simplified */
    },
    products: [
        {
            /* simplified */
        },
    ],
    totalValue: 29.99,
    currency: 'USD',
    orderId: 'order-123',
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

-   📖 [Documentation](https://github.com/yourusername/meta-tracking-sdk/wiki)
-   🐛 [Issue Tracker](https://github.com/yourusername/meta-tracking-sdk/issues)
-   💬 [Discussions](https://github.com/yourusername/meta-tracking-sdk/discussions)
-   📧 [Email Support](mailto:support@yourdomain.com)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

**Built with ❤️ by [Azm Arif](https://github.com/azmarifdev)** | Enhanced with insights from facebook-nodejs-business-sdk v23.0.1

## Installation

```bash
# npm
npm install @azmarifdev/meta-tracking-sdk

# yarn
yarn add @azmarifdev/meta-tracking-sdk

# pnpm
pnpm add @azmarifdev/meta-tracking-sdk

# bun
bun add @azmarifdev/meta-tracking-sdk
```

For server-side tracking, you'll also need:

```bash
npm install facebook-nodejs-business-sdk
```

## Quick Start

### Client-Side Tracking (Browser)

```typescript
import { MetaPixelTracker } from '@azmarifdev/meta-tracking-sdk';

// Initialize the tracker
const tracker = new MetaPixelTracker({
    pixelId: 'YOUR_PIXEL_ID',
    debug: process.env.NODE_ENV === 'development',
});

// Track page view
tracker.trackPageView();

// Track product view
tracker.trackProductView({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    currency: 'USD',
});

// Track add to cart
tracker.trackAddToCart({
    id: 'product-123',
    name: 'Amazing Product',
    price: 99.99,
    quantity: 2,
    currency: 'USD',
});
```

### Server-Side Tracking (Node.js)

```typescript
import { MetaConversionTracker } from '@azmarifdev/meta-tracking-sdk';

// Initialize the tracker
const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
    debug: process.env.NODE_ENV === 'development',
});

// Track purchase event
await tracker.trackPurchase({
    eventSourceUrl: 'https://example.com/checkout/success',
    eventId: 'purchase_12345',
    userData: {
        email: 'user@example.com',
        phone: '+1234567890',
        clientIpAddress: req.ip,
        clientUserAgent: req.headers['user-agent'],
        fbp: req.cookies._fbp,
        fbc: req.cookies._fbc,
    },
    customData: {
        value: 199.98,
        currency: 'USD',
        contents: [{ id: 'product-123', quantity: 2, itemPrice: 99.99 }],
    },
});
```

### Hybrid Tracking (Client + Server)

```typescript
import { MetaPixelTracker, MetaConversionTracker, HybridTracker } from '@azmarifdev/meta-tracking-sdk';

// For maximum tracking reliability
const hybridTracker = new HybridTracker({
    pixelId: 'YOUR_PIXEL_ID',
    serverEndpoint: '/api/track', // Your server tracking endpoint
    debug: process.env.NODE_ENV === 'development',
});

// This will track both client-side and server-side
await hybridTracker.trackPurchase({
    id: 'order-123',
    value: 299.99,
    currency: 'USD',
    products: [
        { id: 'product-1', quantity: 1, price: 199.99 },
        { id: 'product-2', quantity: 1, price: 99.99 },
    ],
});
```

## API Reference

### MetaPixelTracker (Client-Side)

#### Constructor Options

```typescript
interface MetaPixelConfig {
    pixelId: string;
    debug?: boolean;
    autoInit?: boolean;
    testEventCode?: string;
}
```

#### Methods

-   `trackPageView(data?: any): void`
-   `trackProductView(product: ProductData): void`
-   `trackAddToCart(product: ProductData): void`
-   `trackInitiateCheckout(data: CheckoutData): void`
-   `trackPurchase(data: PurchaseData): void`
-   `trackSearch(searchTerm: string): void`
-   `trackRegistration(data?: any): void`

### MetaConversionTracker (Server-Side)

#### Constructor Options

```typescript
interface ConversionAPIConfig {
    accessToken: string;
    pixelId: string;
    debug?: boolean;
    testEventCode?: string;
}
```

#### Methods

-   `trackPageView(data: ServerEventData): Promise<EventResponse>`
-   `trackProductView(data: ServerEventData): Promise<EventResponse>`
-   `trackAddToCart(data: ServerEventData): Promise<EventResponse>`
-   `trackInitiateCheckout(data: ServerEventData): Promise<EventResponse>`
-   `trackPurchase(data: ServerEventData): Promise<EventResponse>`
-   `trackSearch(data: ServerEventData): Promise<EventResponse>`

### Data Types

```typescript
interface ProductData {
    id: string;
    name?: string;
    price: number;
    quantity?: number;
    currency?: string;
    category?: string;
}

interface UserData {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
}

interface ServerEventData {
    eventSourceUrl: string;
    eventId?: string;
    userData: UserData;
    customData?: {
        value?: number;
        currency?: string;
        contents?: Array<{
            id: string;
            quantity: number;
            itemPrice?: number;
        }>;
        [key: string]: any;
    };
}
```

## Framework Integration

### Next.js

```typescript
// app/lib/tracking.ts
import { MetaPixelTracker } from '@azmarifdev/meta-tracking-sdk';

export const tracker = new MetaPixelTracker({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID!,
    debug: process.env.NODE_ENV === 'development',
});

// app/layout.tsx
('use client');
import { useEffect } from 'react';
import { tracker } from '@/lib/tracking';

export default function RootLayout({ children }) {
    useEffect(() => {
        tracker.init();
    }, []);

    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
```

### Express.js

```typescript
// server/tracking.ts
import { MetaConversionTracker } from '@azmarifdev/meta-tracking-sdk';

export const serverTracker = new MetaConversionTracker({
    accessToken: process.env.META_ACCESS_TOKEN!,
    pixelId: process.env.META_PIXEL_ID!,
});

// routes/track.ts
app.post('/api/track', async (req, res) => {
    try {
        await serverTracker.trackEvent({
            eventName: req.body.eventName,
            eventSourceUrl: req.body.sourceUrl,
            userData: {
                clientIpAddress: req.ip,
                clientUserAgent: req.headers['user-agent'],
                fbp: req.cookies._fbp,
                fbc: req.cookies._fbc,
            },
            customData: req.body.customData,
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Best Practices

### 1. Event Deduplication

```typescript
// Use consistent event IDs to prevent duplicate tracking
const eventId = `purchase_${orderId}_${timestamp}`;
```

### 2. Privacy Compliance

```typescript
// The SDK automatically hashes PII data
const userData = {
    email: 'user@example.com', // Will be hashed automatically
    phone: '+1234567890', // Will be hashed automatically
};
```

### 3. Error Handling

```typescript
try {
    await tracker.trackPurchase(data);
} catch (error) {
    console.error('Tracking failed:', error);
    // Don't let tracking errors break user experience
}
```

### 4. Testing

```typescript
// Use test event codes in development
const tracker = new MetaConversionTracker({
    accessToken: 'your-token',
    pixelId: 'your-pixel',
    testEventCode: 'TEST12345', // Events will be marked as test
});
```

## Environment Variables

```env
# Client-side (Next.js example)
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id

# Server-side
META_ACCESS_TOKEN=your_access_token
META_PIXEL_ID=your_pixel_id
META_DEBUG=true
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Azm Arif](https://github.com/azmarifdev)

## Support

-   📧 Email: dev@azmarif.dev
-   🐛 Issues: [GitHub Issues](https://github.com/azmarifdev/meta-tracking-sdk/issues)
-   📖 Documentation: [GitHub Wiki](https://github.com/azmarifdev/meta-tracking-sdk/wiki)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about each release.
