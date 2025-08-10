import { MetaPixelConfig, ProductData, CheckoutData, PurchaseData, SearchData, RegistrationData, EventName } from './types';
import { validateConfig, generateEventId, isBrowser, createTrackingError } from './utils';

// Extend Window interface for fbq
declare global {
    interface Window {
        fbq: FacebookPixelFunction;
        fbevents?: Record<string, unknown>;
    }
}

interface FacebookPixelFunction {
    (...args: unknown[]): void;
    callMethod?: ((...args: unknown[]) => void) | null;
    queue?: unknown[];
    loaded?: boolean;
    version?: string | undefined;
    agent?: string | undefined;
}

/**
 * Meta Pixel (Facebook Pixel) client-side tracker
 * Handles client-side tracking using the Facebook Pixel
 */
export class MetaPixelTracker {
    private config: MetaPixelConfig;
    private isInitialized: boolean = false;

    constructor(config: MetaPixelConfig) {
        this.config = {
            debug: false,
            autoInit: true,
            version: '2.0',
            agent: 'meta-tracking-sdk',
            ...config,
        };

        // Validate configuration
        const validation = validateConfig(this.config);
        if (!validation.isValid) {
            throw createTrackingError(`Invalid configuration: ${validation.errors.join(', ')}`, 'CONFIG_ERROR');
        }

        // Log warnings if any
        if (validation.warnings.length > 0 && this.config.debug) {
            console.warn('Meta Pixel configuration warnings:', validation.warnings);
        }

        // Auto-initialize if in browser and autoInit is true
        if (isBrowser() && this.config.autoInit) {
            this.init();
        }
    }

    /**
     * Initialize the Meta Pixel
     */
    public init(): void {
        if (!isBrowser()) {
            if (this.config.debug) {
                console.warn('Meta Pixel can only be initialized in browser environment');
            }
            return;
        }

        if (this.isInitialized) {
            if (this.config.debug) {
                console.warn('Meta Pixel already initialized');
            }
            return;
        }

        try {
            this.setupPixel();
            this.isInitialized = true;

            if (this.config.debug) {
                console.log('Meta Pixel initialized successfully');
            }
        } catch (error) {
            if (this.config.debug) {
                console.error('Failed to initialize Meta Pixel:', error);
            }
            throw createTrackingError('Failed to initialize Meta Pixel', 'INIT_ERROR', error);
        }
    }

    /**
     * Set up the Meta Pixel script and initialize fbq
     */
    private setupPixel(): void {
        const win = window as Window & {
            fbq: (...args: unknown[]) => void;
            fbevents?: Record<string, unknown>;
        };

        // Initialize fbq if not already initialized
        if (!win.fbq) {
            win.fbq = function (...args: unknown[]) {
                if (win.fbq.callMethod) {
                    win.fbq.callMethod(...args);
                } else {
                    if (win.fbq.queue) {
                        win.fbq.queue.push(args);
                    }
                }
            };

            // Initialize the queue and other properties
            win.fbq.queue = [];
            win.fbq.callMethod = null;
            win.fbq.loaded = true;
            win.fbq.version = this.config.version;
            win.fbq.agent = this.config.agent;
        }

        // Initialize the pixel
        win.fbq('init', this.config.pixelId, {}, { agent: this.config.agent });

        // Enable debug mode if configured
        if (this.config.debug) {
            this.enableDebugMode();
        }

        // Load the pixel script
        this.loadPixelScript();
    }

    /**
     * Enable debug mode for development
     */
    private enableDebugMode(): void {
        const win = window as Window;

        if (this.config.debug) {
            console.log('Meta Pixel Debug Mode Enabled');

            // Add a listener to log all fbq calls
            const originalFbq = win.fbq;
            win.fbq = function (...args: unknown[]) {
                console.group('Meta Pixel Event:');
                console.log(...args);
                console.groupEnd();
                return originalFbq?.(...args);
            };

            // Copy over the properties
            if (originalFbq) {
                if (originalFbq.queue) win.fbq.queue = originalFbq.queue;
                if (originalFbq.loaded) win.fbq.loaded = originalFbq.loaded;
                if (originalFbq.version) win.fbq.version = originalFbq.version;
                if (originalFbq.agent) win.fbq.agent = originalFbq.agent;
                if (originalFbq.callMethod) win.fbq.callMethod = originalFbq.callMethod;
            }
        }
    }

    /**
     * Load the Facebook Pixel script
     */
    private loadPixelScript(): void {
        if (document.getElementById('facebook-pixel-script')) {
            return; // Script already loaded
        }

        const script = document.createElement('script');
        script.id = 'facebook-pixel-script';
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';

        // Add error handling
        script.onerror = () => {
            console.error('Failed to load Facebook Pixel script');
        };

        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.head.appendChild(script);
        }
    }

    /**
     * Track a custom event
     * @param eventName - Name of the event
     * @param parameters - Event parameters
     * @param eventId - Optional event ID for deduplication
     */
    public trackEvent(eventName: EventName, parameters: Record<string, unknown> = {}, eventId?: string): void {
        if (!this.isInitialized) {
            this.init();
        }

        if (!isBrowser() || !window.fbq) {
            if (this.config.debug) {
                console.warn('Meta Pixel not available');
            }
            return;
        }

        try {
            const eventData = {
                ...parameters,
                ...(eventId && { eventID: eventId }),
                ...(this.config.testEventCode && { test_event_code: this.config.testEventCode }),
            };

            window.fbq('track', eventName, eventData);

            if (this.config.debug) {
                console.log(`Tracked event: ${eventName}`, eventData);
            }
        } catch (error) {
            if (this.config.debug) {
                console.error(`Failed to track event ${eventName}:`, error);
            }
        }
    }

    /**
     * Track page view
     */
    public trackPageView(): void {
        this.trackEvent('PageView');
    }

    /**
     * Track product view
     * @param product - Product data
     */
    public trackProductView(product: ProductData): void {
        const eventId = generateEventId('pv');

        this.trackEvent(
            'ViewContent',
            {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price,
                currency: product.currency || 'USD',
                content_category: product.category,
                brand: product.brand,
            },
            eventId,
        );
    }

    /**
     * Track add to cart
     * @param product - Product data
     */
    public trackAddToCart(product: ProductData): void {
        const eventId = generateEventId('atc');
        const quantity = product.quantity || 1;

        this.trackEvent(
            'AddToCart',
            {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price * quantity,
                currency: product.currency || 'USD',
                content_category: product.category,
                brand: product.brand,
                contents: [
                    {
                        id: product.id,
                        quantity: quantity,
                        item_price: product.price,
                    },
                ],
            },
            eventId,
        );
    }

    /**
     * Track initiate checkout
     * @param data - Checkout data
     */
    public trackInitiateCheckout(data: CheckoutData): void {
        const eventId = data.eventId || generateEventId('ic');

        const contentIds = data.products.map((p) => p.id);
        const contents = data.products.map((p) => ({
            id: p.id,
            quantity: p.quantity || 1,
            item_price: p.price,
        }));

        this.trackEvent(
            'InitiateCheckout',
            {
                content_ids: contentIds,
                contents: contents,
                value: data.value,
                currency: data.currency,
                num_items: data.products.length,
                ...data.customData,
            },
            eventId,
        );
    }

    /**
     * Track purchase
     * @param data - Purchase data
     */
    public trackPurchase(data: PurchaseData): void {
        const eventId = data.eventId || generateEventId('purchase');

        const contentIds = data.products.map((p) => p.id);
        const contents = data.products.map((p) => ({
            id: p.id,
            quantity: p.quantity || 1,
            item_price: p.price,
        }));

        this.trackEvent(
            'Purchase',
            {
                content_ids: contentIds,
                contents: contents,
                value: data.value,
                currency: data.currency,
                num_items: data.products.length,
                transaction_id: data.orderId,
                ...data.customData,
            },
            eventId,
        );
    }

    /**
     * Track search
     * @param data - Search data
     */
    public trackSearch(data: SearchData): void {
        const eventId = data.eventId || generateEventId('search');

        this.trackEvent(
            'Search',
            {
                search_string: data.searchTerm,
                ...data.customData,
            },
            eventId,
        );
    }

    /**
     * Track user registration
     * @param data - Registration data
     */
    public trackRegistration(data: RegistrationData = {}): void {
        const eventId = data.eventId || generateEventId('reg');

        this.trackEvent(
            'CompleteRegistration',
            {
                registration_method: data.method,
                status: data.status,
                ...data.customData,
            },
            eventId,
        );
    }

    /**
     * Track add to wishlist
     * @param product - Product data
     */
    public trackAddToWishlist(product: ProductData): void {
        const eventId = generateEventId('atw');

        this.trackEvent(
            'AddToWishlist',
            {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price,
                currency: product.currency || 'USD',
                content_category: product.category,
                brand: product.brand,
            },
            eventId,
        );
    }

    /**
     * Track lead generation
     * @param data - Lead data
     */
    public trackLead(data: Record<string, unknown> = {}): void {
        const eventId = generateEventId('lead');

        this.trackEvent(
            'Lead',
            {
                value: data.value,
                currency: data.currency || 'USD',
                ...data,
            },
            eventId,
        );
    }

    /**
     * Get current configuration
     */
    public getConfig(): MetaPixelConfig {
        return { ...this.config };
    }

    /**
     * Check if pixel is initialized
     */
    public isReady(): boolean {
        return this.isInitialized && isBrowser() && typeof window.fbq === 'function';
    }

    /**
     * Update configuration (requires re-initialization)
     * @param newConfig - New configuration
     */
    public updateConfig(newConfig: Partial<MetaPixelConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.isInitialized = false;

        if (isBrowser() && this.config.autoInit) {
            this.init();
        }
    }
}

// Default export
export default MetaPixelTracker;
