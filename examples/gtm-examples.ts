// GTM (Google Tag Manager) Usage Examples
// This file demonstrates how to use the GTMTracker class
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createGTMTracker, GTMTracker, GTMConfig, PurchaseData } from '../src/index';

// ========================================
// 1. Basic GTM Setup
// ========================================

// Create GTM tracker with container ID
const gtmTracker = createGTMTracker('GTM-XXXXXXX', {
    debug: true,
    autoTrackPageViews: true,
    defaultCurrency: 'USD',
});

// Or manually instantiate
const gtmConfig: GTMConfig = {
    gtmId: 'GTM-XXXXXXX',
    debug: process.env.NODE_ENV === 'development',
    autoTrackPageViews: true,
    dataLayerName: 'dataLayer', // Custom data layer name
    defaultCurrency: 'BDT',
};

const manualGTMTracker = new GTMTracker(gtmConfig);

// ========================================
// 2. E-commerce Tracking
// ========================================

// Track product view
gtmTracker.trackProductView({
    id: 'product-123',
    name: 'Wireless Headphones',
    price: 99.99,
    currency: 'USD',
    category: 'Electronics',
    brand: 'TechBrand',
});

// Track add to cart
gtmTracker.trackAddToCart({
    id: 'product-123',
    name: 'Wireless Headphones',
    price: 99.99,
    quantity: 2,
    currency: 'USD',
    category: 'Electronics',
    brand: 'TechBrand',
});

// Track checkout initiation
gtmTracker.trackInitiateCheckout({
    value: 199.98,
    currency: 'USD',
    products: [
        {
            id: 'product-123',
            name: 'Wireless Headphones',
            price: 99.99,
            quantity: 2,
            currency: 'USD',
            category: 'Electronics',
            brand: 'TechBrand',
        },
    ],
});

// Track purchase
gtmTracker.trackPurchase({
    orderId: 'order-456',
    value: 199.98,
    currency: 'USD',
    products: [
        {
            id: 'product-123',
            name: 'Wireless Headphones',
            price: 99.99,
            quantity: 2,
            currency: 'USD',
            category: 'Electronics',
            brand: 'TechBrand',
        },
    ],
});

// ========================================
// 3. User Events
// ========================================

// Track user registration
gtmTracker.trackRegistration({
    method: 'email',
    status: 'completed',
});

// Track search
gtmTracker.trackSearch({
    searchTerm: 'wireless headphones',
});

// Set user data for personalization
gtmTracker.setUserData({
    userId: 'user-789',
    userType: 'premium',
    email: 'user@example.com',
    isLoggedIn: true,
});

// Track add to wishlist
gtmTracker.trackAddToWishlist({
    id: 'product-456',
    name: 'Gaming Mouse',
    price: 49.99,
    currency: 'USD',
    category: 'Gaming',
    brand: 'GameBrand',
});

// ========================================
// 4. Custom Events
// ========================================

// Track custom events
gtmTracker.trackCustomEvent('newsletter_signup', {
    email: 'user@example.com',
    source: 'homepage_banner',
    campaign: 'summer_2024',
});

gtmTracker.trackCustomEvent('video_play', {
    video_title: 'Product Demo',
    video_duration: 120,
    video_current_time: 30,
    engagement_level: 'high',
});

gtmTracker.trackCustomEvent('form_submission', {
    form_name: 'contact_us',
    form_fields: ['name', 'email', 'message'],
    submission_success: true,
});

// ========================================
// 5. Page Navigation Tracking
// ========================================

// Manual page view tracking (if autoTrackPageViews is false)
gtmTracker.trackPageView('/product/wireless-headphones', 'Wireless Headphones - TechStore');

// Track page views in Single Page Applications
window.addEventListener('popstate', () => {
    gtmTracker.trackPageView();
});

// For React Router or similar
function trackRouteChange(newPath: string, pageTitle: string) {
    gtmTracker.trackPageView(newPath, pageTitle);
}

// Example usage:
// trackRouteChange('/new-page', 'New Page Title');

// ========================================
// 6. Bangladesh E-commerce Example
// ========================================

// Setup for Bangladeshi e-commerce
const bangladeshiStore = createGTMTracker('GTM-BDXXXXXXX', {
    debug: false,
    autoTrackPageViews: true,
    defaultCurrency: 'BDT',
});

// Track local product
bangladeshiStore.trackProductView({
    id: 'saree-001',
    name: 'Cotton Saree',
    price: 2500,
    currency: 'BDT',
    category: 'Fashion',
    brand: 'Deshi Fashion',
});

// Track local purchase
bangladeshiStore.trackPurchase({
    orderId: 'BD-ORDER-789',
    value: 3500,
    currency: 'BDT',
    products: [
        {
            id: 'saree-001',
            name: 'Cotton Saree',
            price: 2500,
            quantity: 1,
            currency: 'BDT',
        },
        {
            id: 'jewelry-002',
            name: 'Gold Earrings',
            price: 1000,
            quantity: 1,
            currency: 'BDT',
        },
    ],
});

// ========================================
// 7. Multi-platform Integration
// ========================================

// Use GTM alongside Facebook Pixel for comprehensive tracking
import { createPixelTracker, createHybridTracker } from '../src/index';

// Setup both GTM and Facebook tracking
const facebookPixel = createPixelTracker('YOUR_PIXEL_ID');
const gtm = createGTMTracker('GTM-XXXXXXX');

// Track the same event on both platforms
function trackPurchaseOnBothPlatforms(purchaseData: PurchaseData) {
    // GTM tracking (includes GA4, Facebook via GTM, etc.)
    gtm.trackPurchase(purchaseData);

    // Direct Facebook Pixel tracking for redundancy
    facebookPixel.trackPurchase(purchaseData);
}

// Example usage:
// trackPurchaseOnBothPlatforms(purchaseData);

// Or use Hybrid Tracker which includes server-side tracking
const hybridTracker = createHybridTracker('YOUR_PIXEL_ID', '/api/track');

// Example usage:
// hybridTracker.trackCustomEvent('Purchase', { value: 99.99, currency: 'USD' });

// ========================================
// 8. Debug and Monitoring
// ========================================

// Debug data layer in development
if (gtmConfig.debug) {
    gtmTracker.debugDataLayer();

    // Log configuration
    console.log('GTM Configuration:', gtmTracker.getConfig());

    // Check if ready
    console.log('GTM Ready:', gtmTracker.isReady());
}

// ========================================
// 9. Advanced Configuration
// ========================================

// Custom data layer name for multiple GTM containers
const customGTM = new GTMTracker({
    gtmId: 'GTM-CUSTOM',
    dataLayerName: 'customDataLayer',
    debug: true,
    defaultCurrency: 'EUR',
});

// Example usage:
// customGTM.trackCustomEvent('custom_event', { customData: 'value' });

// Update configuration at runtime
gtmTracker.updateConfig({
    debug: false,
    defaultCurrency: 'CAD',
});

// ========================================
// 10. Integration with npm-pickone Project
// ========================================

// This shows how to integrate with your existing npm-pickone GTM setup
function integrateWithExistingProject() {
    // Create tracker that matches your current setup
    const pickoneGTM = createGTMTracker(process.env.NEXT_PUBLIC_GTM_ID || '', {
        debug: process.env.NODE_ENV === 'development',
        autoTrackPageViews: true,
        defaultCurrency: 'BDT',
    });

    // Replace your existing gtm.ts functions with package methods
    // Instead of: import { trackProductView } from '@/lib/gtm'
    // Use: pickoneGTM.trackProductView(product)

    return pickoneGTM;
}

export {
    gtmTracker,
    manualGTMTracker,
    bangladeshiStore,
    hybridTracker,
    customGTM,
    trackRouteChange,
    trackPurchaseOnBothPlatforms,
    integrateWithExistingProject,
};
