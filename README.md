# 🚀 Multi-Platform Tracking SDK

[![npm version](https://img.shields.io/npm/v/multi-platform-tracking-sdk.svg)](https://www.npmjs.com/package/multi-platform-tracking-sdk)
[![npm downloads](https://img.shields.io/npm/dm/multi-platform-tracking-sdk.svg)](https://www.npmjs.com/package/multi-platform-tracking-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-44%20Passing-green.svg)](#testing)
[![Build](https://github.com/azmarifdev/multi-platform-tracking-sdk/workflows/Tests/badge.svg)](https://github.com/azmarifdev/multi-platform-tracking-sdk/actions)

> **Professional-grade tracking SDK for Facebook/Meta Pixel, Instagram, and
> Google Tag Manager**  
> Zero dependencies • TypeScript ready • Framework agnostic • Privacy compliant

## ✨ Why Choose This SDK?

- 🎯 **Complete Multi-Platform Support** - Facebook/Meta, Instagram, Google GTM
- 🔒 **Privacy-First Design** - GDPR/CCPA compliant with automatic data hashing
- 🚀 **Zero Dependencies** - Self-contained, optimized implementation
- 📦 **Framework Agnostic** - Works with React, Vue, Angular, Node.js, vanilla
  JS
- 🛡️ **Enterprise Ready** - TypeScript support, comprehensive error handling
- ⚡ **Performance Optimized** - Tree-shakable, minimal bundle size (~15KB)

## 📦 Installation

```bash
# Choose your preferred package manager
npm install multi-platform-tracking-sdk
yarn add multi-platform-tracking-sdk
pnpm add multi-platform-tracking-sdk
bun add multi-platform-tracking-sdk
```

## 🚀 Quick Start

### 30 Second Setup

```typescript
import { MetaPixelTracker } from 'multi-platform-tracking-sdk';

// 1. Initialize (client-side)
const tracker = new MetaPixelTracker({
    pixelId: 'YOUR_PIXEL_ID',
    debug: true, // Enable for development
});

// 2. Track events
await tracker.trackPageView();
await tracker.trackPurchase({
    value: 99.99,
    currency: 'USD',
    content_ids: ['product-123'],
});

// Done! 🎉 Your tracking is now active
```

### Server-Side Tracking

```typescript
import { MetaConversionTracker } from 'multi-platform-tracking-sdk';

const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
});

await tracker.trackPurchase({
    eventSourceUrl: 'https://yoursite.com/checkout',
    userData: {
        email: 'customer@example.com',
        clientIpAddress: req.ip,
        clientUserAgent: req.headers['user-agent'],
    },
    customData: {
        value: 99.99,
        currency: 'USD',
        contents: [{ id: 'product-123', quantity: 1 }],
    },
});
```

## 🎯 Core Features

### 🖥️ Client-Side Tracking

Perfect for websites and web applications

```typescript
const pixelTracker = new MetaPixelTracker({ pixelId: 'YOUR_PIXEL_ID' });

// Essential e-commerce events
await pixelTracker.trackPageView();
await pixelTracker.trackViewContent({ content_ids: ['product-123'] });
await pixelTracker.trackAddToCart({ value: 29.99, currency: 'USD' });
await pixelTracker.trackPurchase({ value: 299.99, currency: 'USD' });
```

### 🔧 Server-Side Conversion API

Enhanced data quality and iOS 14.5+ compliance

```typescript
const conversionTracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
});

await conversionTracker.trackPurchase({
    eventSourceUrl: 'https://yoursite.com/checkout/success',
    userData: {
        email: 'customer@example.com', // Automatically hashed
        phone: '+1234567890', // Automatically hashed
        clientIpAddress: '192.168.1.1',
        clientUserAgent: 'Mozilla/5.0...',
    },
    customData: {
        value: 299.99,
        currency: 'USD',
        contents: [{ id: 'product-1', quantity: 2, itemPrice: 149.99 }],
    },
});
```

### 🔄 Hybrid Tracking (Recommended)

Best of both worlds with automatic deduplication

```typescript
const hybridTracker = new HybridTracker({
    pixelId: 'YOUR_PIXEL_ID',
    serverEndpoint: '/api/track',
});

// Tracks on both client and server with deduplication
await hybridTracker.trackPurchase({
    value: 199.99,
    currency: 'USD',
    eventId: 'unique-purchase-123', // Prevents duplicate counting
});
```

## 📚 Framework Integration

### ⚛️ React/Next.js

```typescript
// hooks/useTracking.ts
import { MetaPixelTracker } from 'multi-platform-tracking-sdk';

const tracker = new MetaPixelTracker({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID!
});

export const useTracking = () => {
    const trackPurchase = (orderData: any) => {
        return tracker.trackPurchase({
            value: orderData.total,
            currency: orderData.currency,
            content_ids: orderData.items.map((item: any) => item.id)
        });
    };

    return { trackPurchase };
};

// components/CheckoutButton.tsx
import { useTracking } from '../hooks/useTracking';

export default function CheckoutButton({ orderData }: any) {
    const { trackPurchase } = useTracking();

    const handleCheckout = async () => {
        await trackPurchase(orderData);
        // Process checkout...
    };

    return <button onClick={handleCheckout}>Complete Purchase</button>;
}
```

### 🟢 Node.js/Express

```typescript
// middleware/tracking.ts
import { MetaConversionTracker } from 'multi-platform-tracking-sdk';

const tracker = new MetaConversionTracker({
    accessToken: process.env.META_ACCESS_TOKEN!,
    pixelId: process.env.META_PIXEL_ID!,
});

export const trackingMiddleware = (req: any, res: any, next: any) => {
    req.tracking = tracker;
    next();
};

// routes/orders.ts
app.post('/orders', trackingMiddleware, async (req, res) => {
    const order = await createOrder(req.body);

    // Track the purchase
    await req.tracking.trackPurchase({
        eventSourceUrl: `${req.protocol}://${req.get('host')}/orders`,
        userData: {
            email: req.body.customerEmail,
            clientIpAddress: req.ip,
            clientUserAgent: req.headers['user-agent'],
        },
        customData: {
            value: order.total,
            currency: order.currency,
            contents: order.items.map((item) => ({
                id: item.productId,
                quantity: item.quantity,
                itemPrice: item.price,
            })),
        },
    });

    res.json(order);
});
```

## 🔐 Privacy & Compliance

### GDPR/CCPA Ready

```typescript
// Automatic PII hashing - no manual setup required
const userData = {
    email: 'user@example.com', // Automatically SHA-256 hashed
    phone: '+1234567890', // Automatically SHA-256 hashed
    firstName: 'John', // Automatically hashed
    lastName: 'Doe', // Automatically hashed
};

// California compliance
await tracker.trackPurchase({
    // ... event data
    dataProcessingOptions: ['LDU'],
    dataProcessingOptionsCountry: 1,
    dataProcessingOptionsState: 1000,
});
```

### Consent Management

```typescript
// Check user consent before tracking
if (userConsent.analytics) {
    await tracker.trackPageView();
}

// Opt-out specific users
await tracker.trackEvent({
    // ... event data
    optOut: true, // Excludes from ad optimization
});
```

## 🧪 Testing & Development

### Debug Mode

```typescript
const tracker = new MetaPixelTracker({
    pixelId: 'YOUR_PIXEL_ID',
    debug: true, // Enables detailed console logging
});
```

### Test Events

```typescript
const tracker = new MetaConversionTracker({
    accessToken: 'YOUR_ACCESS_TOKEN',
    pixelId: 'YOUR_PIXEL_ID',
    testEventCode: 'TEST12345', // From Facebook Events Manager
});
```

### Connection Validation

```typescript
// Test your API connection
const testResult = await tracker.testConnection();
if (testResult.success) {
    console.log('✅ API connection successful');
} else {
    console.error('❌ Connection failed:', testResult.error);
}
```

## 📊 Event Reference

### E-commerce Events

```typescript
// Page view
await tracker.trackPageView();

// Product view
await tracker.trackViewContent({
    content_ids: ['product-123'],
    content_type: 'product',
    value: 29.99,
    currency: 'USD',
});

// Add to cart
await tracker.trackAddToCart({
    content_ids: ['product-123'],
    value: 29.99,
    currency: 'USD',
});

// Purchase completed
await tracker.trackPurchase({
    value: 299.99,
    currency: 'USD',
    content_ids: ['product-123', 'product-456'],
    content_type: 'product',
});
```

### Lead Generation Events

```typescript
// Lead form submission
await tracker.trackLead({
    value: 100,
    currency: 'USD',
    content_name: 'Newsletter Signup',
});

// User registration
await tracker.trackCompleteRegistration({
    content_name: 'Account Creation',
});

// Custom events
await tracker.trackCustomEvent('custom_event_name', {
    custom_parameter: 'value',
    value: 50,
    currency: 'USD',
});
```

## ⚡ Performance Features

### Bundle Size Optimization

```typescript
// Tree-shaking friendly - only import what you need
import { MetaPixelTracker } from 'multi-platform-tracking-sdk/pixel';
import { MetaConversionTracker } from 'multi-platform-tracking-sdk/conversion';

// Total bundle impact: ~15KB gzipped
```

### Batch Processing

```typescript
// Send multiple events efficiently
const events = [
    { eventName: 'PageView', eventSourceUrl: 'https://example.com/page1' },
    { eventName: 'ViewContent', eventSourceUrl: 'https://example.com/product' },
    { eventName: 'AddToCart', eventSourceUrl: 'https://example.com/cart' },
];

const response = await tracker.sendBatchEvents(events);
console.log(`✅ Processed ${response.eventsReceived} events`);
```

### Error Handling

```typescript
try {
    await tracker.trackPurchase(purchaseData);
} catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
        console.error('Data validation failed:', error.message);
    } else if (error.code === 'API_ERROR') {
        console.error('Facebook API error:', error.message);
        console.error('Trace ID:', error.fbtrace_id);
    } else if (error.code === 'NETWORK_ERROR') {
        console.error('Network error:', error.message);
        // Implement retry logic
    }
}
```

## 🌍 Environment Setup

### Environment Variables

```env
# Client-side (use NEXT_PUBLIC_ prefix for Next.js)
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_META_DEBUG=false

# Server-side
META_ACCESS_TOKEN=your_access_token
META_PIXEL_ID=your_pixel_id
META_APP_SECRET=your_app_secret
META_DEBUG=false
META_TEST_EVENT_CODE=TEST12345
```

### TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
    MetaPixelConfig,
    ConversionAPIConfig,
    ServerEventData,
    UserData,
    CustomData,
    EventResponse,
} from 'multi-platform-tracking-sdk';
```

## 🚀 Migration Guide

### From Facebook Pixel

```typescript
// Before (Facebook Pixel)
fbq('track', 'Purchase', {
    value: 29.99,
    currency: 'USD',
});

// After (Multi-Platform SDK)
await tracker.trackPurchase({
    value: 29.99,
    currency: 'USD',
});
```

### From facebook-nodejs-business-sdk

```typescript
// Before (facebook-nodejs-business-sdk)
const {
    ServerEvent,
    EventRequest,
    UserData,
} = require('facebook-nodejs-business-sdk');
// ... complex setup with many lines

// After (Multi-Platform SDK)
await tracker.trackPurchase({
    eventSourceUrl: 'https://example.com',
    userData: { email: 'user@example.com' },
    customData: { value: 29.99, currency: 'USD' },
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

### Development Setup

```bash
# Clone the repository
git clone https://github.com/azmarifdev/multi-platform-tracking-sdk.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 📄 License

MIT © [Azm Arif](https://github.com/azmarifdev)

## 🆘 Support

- 📖 **Documentation**:
  [GitHub Wiki](https://github.com/azmarifdev/multi-platform-tracking-sdk/wiki)
- 🐛 **Bug Reports**:
  [GitHub Issues](https://github.com/azmarifdev/multi-platform-tracking-sdk/issues)
- 💬 **Discussions**:
  [GitHub Discussions](https://github.com/azmarifdev/multi-platform-tracking-sdk/discussions)
- 📧 **Email**: dev@azmarif.dev

## 📊 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed release history.

---

<div align="center">

**Built with ❤️ by [Azm Arif](https://github.com/azmarifdev)**

[⭐ Star on GitHub](https://github.com/azmarifdev/multi-platform-tracking-sdk) •
[📦 View on NPM](https://www.npmjs.com/package/multi-platform-tracking-sdk) •
[📖 Read the Docs](https://github.com/azmarifdev/multi-platform-tracking-sdk/wiki)

</div>
