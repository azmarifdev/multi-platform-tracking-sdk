// Multi-Platform Tracking SDK - Professional tracking package for Facebook/Meta, Instagram, and Google Tag Manager
// Author: A. Z. M. Arif <hello@azmarif.dev>
// License: MIT

// Export main tracker classes
export { MetaPixelTracker } from './MetaPixelTracker';
export { MetaConversionTracker } from './MetaConversionTracker';
export { HybridTracker } from './HybridTracker';
export { GTMTracker, type GTMConfig } from './GTMTracker';
export {
    InstagramTracker,
    type InstagramConfig,
    type InstagramEngagementData,
    type InstagramShoppingData,
    type InstagramUserData,
} from './InstagramTracker';

// Type definitions
export type {
    // Configuration types
    MetaPixelConfig,
    ConversionAPIConfig,
    HybridTrackerConfig,

    // Data types
    ProductData,
    UserData,
    CustomData,
    EventData,
    ServerEventData,

    // Event data types
    PurchaseData,
    CheckoutData,
    SearchData,
    RegistrationData,

    // Response types
    EventResponse,
    TrackingError,
    ValidationResult,

    // Utility types
    EventName,
    Currency,
    ContentType,
} from './types';

// Utility functions
export {
    // Data processing utilities
    hashData,
    hashDataSync,
    normalizeUserData,

    // ID and timestamp utilities
    generateEventId,
    getCurrentTimestamp,

    // Validation utilities
    isValidPixelId,
    isValidAccessToken,
    isValidEmail,
    isValidPhone,
    isValidCurrency,
    validateConfig,

    // URL and data utilities
    sanitizeUrl,
    deepClone,
    safeGet,

    // Environment utilities
    isBrowser,
    isNode,

    // Function utilities
    retry,

    // Error utilities
    createTrackingError,
} from './utils';

// Import classes and types for convenience functions
import { MetaPixelTracker } from './MetaPixelTracker';
import { MetaConversionTracker } from './MetaConversionTracker';
import { HybridTracker } from './HybridTracker';
import { GTMTracker, GTMConfig } from './GTMTracker';
import { InstagramTracker, InstagramConfig } from './InstagramTracker';
import {
    MetaPixelConfig,
    ConversionAPIConfig,
    HybridTrackerConfig,
    ProductData,
    PurchaseData,
    SearchData,
} from './types';

// Default exports for convenience
export { MetaPixelTracker as default } from './MetaPixelTracker';

// Package constants
export const VERSION = '1.1.0';
export const PACKAGE_NAME = '@azmarifdev/multi-platform-tracking-sdk';

/**
 * Quick setup functions for common use cases
 */

/**
 * Quick setup for client-side tracking only
 * @param pixelId - Facebook Pixel ID
 * @param options - Optional configuration
 * @returns Configured MetaPixelTracker instance
 */
export function createPixelTracker(
    pixelId: string,
    options: Partial<Omit<MetaPixelConfig, 'pixelId'>> = {}
): MetaPixelTracker {
    return new MetaPixelTracker({
        pixelId,
        ...options,
    });
}

/**
 * Quick setup for server-side tracking only
 * @param accessToken - Facebook API access token
 * @param pixelId - Facebook Pixel ID
 * @param options - Optional configuration
 * @returns Configured MetaConversionTracker instance
 */
export function createConversionTracker(
    accessToken: string,
    pixelId: string,
    options: Partial<Omit<ConversionAPIConfig, 'accessToken' | 'pixelId'>> = {}
): MetaConversionTracker {
    return new MetaConversionTracker({
        accessToken,
        pixelId,
        ...options,
    });
}

/**
 * Quick setup for hybrid tracking (client + server)
 * @param pixelId - Facebook Pixel ID
 * @param serverEndpoint - Server endpoint for server-side tracking
 * @param options - Optional configuration
 * @returns Configured HybridTracker instance
 */
export function createHybridTracker(
    pixelId: string,
    serverEndpoint?: string,
    options: Partial<Omit<HybridTrackerConfig, 'pixelId' | 'serverEndpoint'>> = {}
): HybridTracker {
    return new HybridTracker({
        pixelId,
        serverEndpoint: serverEndpoint || '',
        ...options,
    });
}

/**
 * Quick setup for Google Tag Manager tracking
 * @param gtmId - Google Tag Manager Container ID
 * @param options - Optional configuration
 * @returns Configured GTMTracker instance
 */
export function createGTMTracker(gtmId: string, options: Partial<Omit<GTMConfig, 'gtmId'>> = {}): GTMTracker {
    return new GTMTracker({
        gtmId,
        ...options,
    });
}

/**
 * Quick setup for Instagram tracking
 * @param pixelId - Facebook Pixel ID (Instagram uses same pixel)
 * @param options - Optional configuration
 * @returns Configured InstagramTracker instance
 */
export function createInstagramTracker(
    pixelId: string,
    options: Partial<Omit<InstagramConfig, 'pixelId'>> = {}
): InstagramTracker {
    return new InstagramTracker({
        pixelId,
        ...options,
    });
}

/**
 * Convenience functions for common tracking events
 */

/**
 * Global tracker instance for convenience functions
 * Set this using setGlobalTracker() to use the convenience functions
 */
let globalTracker: MetaPixelTracker | null = null;

/**
 * Set the global tracker instance for convenience functions
 * @param tracker - Tracker instance to use globally
 */
export function setGlobalTracker(tracker: MetaPixelTracker): void {
    globalTracker = tracker;
}

/**
 * Get the current global tracker instance
 * @returns Current global tracker or null
 */
export function getGlobalTracker(): MetaPixelTracker | null {
    return globalTracker;
}

/**
 * Convenience function to track page view
 * Requires global tracker to be set
 */
export function trackPageView(): void {
    if (!globalTracker) {
        console.warn('Global tracker not set. Use setGlobalTracker() first.');
        return;
    }
    globalTracker.trackPageView();
}

/**
 * Convenience function to track product view
 * Requires global tracker to be set
 * @param product - Product data
 */
export function trackProductView(product: ProductData): void {
    if (!globalTracker) {
        console.warn('Global tracker not set. Use setGlobalTracker() first.');
        return;
    }
    globalTracker.trackProductView(product);
}

/**
 * Convenience function to track add to cart
 * Requires global tracker to be set
 * @param product - Product data
 */
export function trackAddToCart(product: ProductData): void {
    if (!globalTracker) {
        console.warn('Global tracker not set. Use setGlobalTracker() first.');
        return;
    }
    globalTracker.trackAddToCart(product);
}

/**
 * Convenience function to track purchase
 * Requires global tracker to be set
 * @param data - Purchase data
 */
export function trackPurchase(data: PurchaseData): void {
    if (!globalTracker) {
        console.warn('Global tracker not set. Use setGlobalTracker() first.');
        return;
    }
    globalTracker.trackPurchase(data);
}

/**
 * Convenience function to track search
 * Requires global tracker to be set
 * @param data - Search data
 */
export function trackSearch(data: SearchData): void {
    if (!globalTracker) {
        console.warn('Global tracker not set. Use setGlobalTracker() first.');
        return;
    }
    globalTracker.trackSearch(data);
}

/**
 * SDK Information
 */
export const SDK_INFO = {
    name: PACKAGE_NAME,
    version: VERSION,
    author: 'A. Z. M. Arif',
    license: 'MIT',
    repository: 'https://github.com/azmarifdev/multi-platform-tracking-sdk',
    homepage: 'https://github.com/azmarifdev/multi-platform-tracking-sdk#readme',
    bugs: 'https://github.com/azmarifdev/multi-platform-tracking-sdk/issues',
} as const;
