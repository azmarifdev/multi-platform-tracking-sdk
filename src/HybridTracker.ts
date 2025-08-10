import { HybridTrackerConfig, ProductData, CheckoutData, PurchaseData, SearchData, RegistrationData } from './types';
import { MetaPixelTracker } from './MetaPixelTracker';
import { generateEventId, isBrowser } from './utils';

/**
 * Hybrid tracker that combines client-side (Meta Pixel) and server-side tracking
 * Provides maximum tracking reliability and coverage
 */
export class HybridTracker {
    private config: HybridTrackerConfig;
    private pixelTracker?: MetaPixelTracker;

    constructor(config: HybridTrackerConfig) {
        this.config = {
            debug: false,
            enableClientTracking: true,
            enableServerTracking: true,
            ...config,
        };

        // Initialize client-side tracker if enabled and in browser
        if (this.config.enableClientTracking && isBrowser()) {
            this.pixelTracker = new MetaPixelTracker({
                pixelId: this.config.pixelId,
                debug: this.config.debug || false,
                ...(this.config.testEventCode && { testEventCode: this.config.testEventCode }),
            });
        }
    }

    /**
     * Send event to server endpoint for server-side tracking
     * @param eventData - Event data to send to server
     * @returns Promise with success status
     */
    private async sendToServer(eventData: Record<string, unknown>): Promise<boolean> {
        if (!this.config.enableServerTracking || !this.config.serverEndpoint) {
            return false;
        }

        try {
            const response = await fetch(this.config.serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...eventData,
                    sourceUrl: isBrowser() ? window.location.href : '',
                    timestamp: Date.now(),
                }),
                // Don't wait for the response to avoid blocking the UI
                keepalive: true,
            });

            return response.ok;
        } catch (error) {
            if (this.config.debug) {
                console.error('Failed to send server-side tracking event:', error);
            }
            return false;
        }
    }

    /**
     * Track event on both client and server
     * @param clientTrackingFn - Function to execute client-side tracking
     * @param serverEventData - Data to send to server for server-side tracking
     */
    private async trackHybrid(clientTrackingFn?: () => void, serverEventData?: Record<string, unknown>): Promise<void> {
        const promises: Promise<boolean>[] = [];

        // Execute client-side tracking
        if (this.config.enableClientTracking && clientTrackingFn && this.pixelTracker?.isReady()) {
            try {
                clientTrackingFn();
            } catch (error) {
                if (this.config.debug) {
                    console.error('Client-side tracking failed:', error);
                }
            }
        }

        // Execute server-side tracking
        if (this.config.enableServerTracking && serverEventData) {
            promises.push(this.sendToServer(serverEventData));
        }

        // Wait for server-side tracking to complete (if any)
        if (promises.length > 0) {
            try {
                await Promise.all(promises);
            } catch (error) {
                if (this.config.debug) {
                    console.error('Server-side tracking failed:', error);
                }
            }
        }
    }

    /**
     * Track page view
     */
    public async trackPageView(): Promise<void> {
        const eventId = generateEventId('pv');

        await this.trackHybrid(() => this.pixelTracker?.trackPageView(), {
            eventName: 'PageView',
            eventId,
            eventData: {},
        });
    }

    /**
     * Track product view
     * @param product - Product data
     */
    public async trackProductView(product: ProductData): Promise<void> {
        const eventId = generateEventId('pv');

        await this.trackHybrid(() => this.pixelTracker?.trackProductView(product), {
            eventName: 'ViewContent',
            eventId,
            products: [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    category: product.category,
                    brand: product.brand,
                },
            ],
            value: product.price,
            currency: product.currency || 'USD',
        });
    }

    /**
     * Track add to cart
     * @param product - Product data
     */
    public async trackAddToCart(product: ProductData): Promise<void> {
        const eventId = generateEventId('atc');
        const quantity = product.quantity || 1;

        await this.trackHybrid(() => this.pixelTracker?.trackAddToCart(product), {
            eventName: 'AddToCart',
            eventId,
            products: [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    category: product.category,
                    brand: product.brand,
                },
            ],
            value: product.price * quantity,
            currency: product.currency || 'USD',
        });
    }

    /**
     * Track initiate checkout
     * @param data - Checkout data
     */
    public async trackInitiateCheckout(data: CheckoutData): Promise<void> {
        const eventId = data.eventId || generateEventId('ic');

        await this.trackHybrid(() => this.pixelTracker?.trackInitiateCheckout(data), {
            eventName: 'InitiateCheckout',
            eventId,
            products: data.products.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                quantity: p.quantity || 1,
                category: p.category,
                brand: p.brand,
            })),
            value: data.value,
            currency: data.currency,
            customData: data.customData,
        });
    }

    /**
     * Track purchase
     * @param data - Purchase data
     */
    public async trackPurchase(data: PurchaseData): Promise<void> {
        const eventId = data.eventId || generateEventId('purchase');

        await this.trackHybrid(() => this.pixelTracker?.trackPurchase(data), {
            eventName: 'Purchase',
            eventId,
            products: data.products.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                quantity: p.quantity || 1,
                category: p.category,
                brand: p.brand,
            })),
            value: data.value,
            currency: data.currency,
            orderId: data.orderId,
            customData: data.customData,
        });
    }

    /**
     * Track search
     * @param data - Search data
     */
    public async trackSearch(data: SearchData): Promise<void> {
        const eventId = data.eventId || generateEventId('search');

        await this.trackHybrid(() => this.pixelTracker?.trackSearch(data), {
            eventName: 'Search',
            eventId,
            searchTerm: data.searchTerm,
            customData: data.customData,
        });
    }

    /**
     * Track user registration
     * @param data - Registration data
     */
    public async trackRegistration(data: RegistrationData = {}): Promise<void> {
        const eventId = data.eventId || generateEventId('reg');

        await this.trackHybrid(() => this.pixelTracker?.trackRegistration(data), {
            eventName: 'CompleteRegistration',
            eventId,
            method: data.method,
            status: data.status,
            customData: data.customData,
        });
    }

    /**
     * Track add to wishlist
     * @param product - Product data
     */
    public async trackAddToWishlist(product: ProductData): Promise<void> {
        const eventId = generateEventId('atw');

        await this.trackHybrid(() => this.pixelTracker?.trackAddToWishlist(product), {
            eventName: 'AddToWishlist',
            eventId,
            products: [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    category: product.category,
                    brand: product.brand,
                },
            ],
            value: product.price,
            currency: product.currency || 'USD',
        });
    }

    /**
     * Track lead generation
     * @param data - Lead data
     */
    public async trackLead(data: Record<string, unknown> = {}): Promise<void> {
        const eventId = generateEventId('lead');

        await this.trackHybrid(() => this.pixelTracker?.trackLead(data), {
            eventName: 'Lead',
            eventId,
            value: data.value,
            currency: data.currency || 'USD',
            customData: data,
        });
    }

    /**
     * Track custom event
     * @param eventName - Event name
     * @param parameters - Event parameters
     * @param eventId - Optional event ID
     */
    public async trackCustomEvent(
        eventName: string,
        parameters: Record<string, unknown> = {},
        eventId?: string,
    ): Promise<void> {
        const id = eventId || generateEventId('custom');

        await this.trackHybrid(() => this.pixelTracker?.trackEvent(eventName, parameters, id), {
            eventName,
            eventId: id,
            customData: parameters,
        });
    }

    /**
     * Get current configuration
     */
    public getConfig(): HybridTrackerConfig {
        return { ...this.config };
    }

    /**
     * Update configuration
     * @param newConfig - New configuration
     */
    public updateConfig(newConfig: Partial<HybridTrackerConfig>): void {
        this.config = { ...this.config, ...newConfig };

        // Update pixel tracker if configuration changed
        if (this.pixelTracker && (newConfig.pixelId || newConfig.debug || newConfig.testEventCode)) {
            this.pixelTracker.updateConfig({
                pixelId: this.config.pixelId,
                debug: this.config.debug || false,
                ...(this.config.testEventCode && { testEventCode: this.config.testEventCode }),
            });
        }
    }

    /**
     * Enable/disable client-side tracking
     * @param enabled - Whether to enable client-side tracking
     */
    public setClientTrackingEnabled(enabled: boolean): void {
        this.config.enableClientTracking = enabled;
    }

    /**
     * Enable/disable server-side tracking
     * @param enabled - Whether to enable server-side tracking
     */
    public setServerTrackingEnabled(enabled: boolean): void {
        this.config.enableServerTracking = enabled;
    }

    /**
     * Check if client-side tracking is ready
     */
    public isClientTrackingReady(): boolean {
        return !!this.pixelTracker?.isReady();
    }

    /**
     * Check if server-side tracking is configured
     */
    public isServerTrackingConfigured(): boolean {
        return !!(this.config.enableServerTracking && this.config.serverEndpoint);
    }

    /**
     * Get tracking status
     */
    public getTrackingStatus(): {
        clientTracking: boolean;
        serverTracking: boolean;
        pixelReady: boolean;
        serverConfigured: boolean;
    } {
        return {
            clientTracking: !!this.config.enableClientTracking,
            serverTracking: !!this.config.enableServerTracking,
            pixelReady: this.isClientTrackingReady(),
            serverConfigured: this.isServerTrackingConfigured(),
        };
    }
}

// Default export
export default HybridTracker;
