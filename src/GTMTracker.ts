import { isBrowser } from './utils';
import { ProductData, CheckoutData, PurchaseData, SearchData, RegistrationData, TrackingError } from './types';

// Create tracking error helper
function createTrackingError(message: string, code: string): TrackingError {
    const error = new Error(message) as TrackingError;
    error.code = code;
    return error;
}

export interface GTMConfig {
    /** Google Tag Manager Container ID */
    gtmId: string;
    /** Enable debug mode for development */
    debug?: boolean;
    /** Automatically track page views */
    autoTrackPageViews?: boolean;
    /** Custom data layer name (default: 'dataLayer') */
    dataLayerName?: string;
    /** Currency to use for ecommerce events */
    defaultCurrency?: string;
}

// Define window.dataLayer for TypeScript
declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
        [key: string]: unknown;
    }
}

/**
 * Google Tag Manager tracker for comprehensive analytics
 * Supports GA4, Facebook Pixel, and other tracking through GTM
 */
export class GTMTracker {
    private config: GTMConfig;
    private isInitialized: boolean = false;
    private dataLayerName: string;

    constructor(config: GTMConfig) {
        this.config = {
            debug: false,
            autoTrackPageViews: true,
            dataLayerName: 'dataLayer',
            defaultCurrency: 'USD',
            ...config,
        };

        this.dataLayerName = this.config.dataLayerName!;

        // Validate GTM ID
        if (!this.config.gtmId) {
            throw createTrackingError('GTM ID is required', 'CONFIG_ERROR');
        }

        // Auto-initialize if in browser
        if (isBrowser()) {
            this.init();
        }
    }

    /**
     * Initialize Google Tag Manager
     */
    public init(): void {
        if (!isBrowser()) {
            if (this.config.debug) {
                console.warn('GTM can only be initialized in browser environment');
            }
            return;
        }

        if (this.isInitialized) {
            if (this.config.debug) {
                console.warn('GTM already initialized');
            }
            return;
        }

        try {
            this.initDataLayer();
            this.loadGTMScript();
            this.isInitialized = true;

            if (this.config.debug) {
                console.log('GTM initialized successfully');
            }

            // Track initial page view if enabled
            if (this.config.autoTrackPageViews) {
                this.trackPageView();
            }
        } catch (error) {
            if (this.config.debug) {
                console.error('Failed to initialize GTM:', error);
            }
            throw createTrackingError('Failed to initialize GTM', 'INIT_ERROR');
        }
    }

    /**
     * Initialize data layer
     */
    private initDataLayer(): void {
        const win = window as Window;

        if (!win[this.dataLayerName]) {
            win[this.dataLayerName] = [];
        }

        // Enable debug mode if configured
        if (this.config.debug) {
            this.enableDebugMode();
        }
    }

    /**
     * Enable debug mode for development
     */
    private enableDebugMode(): void {
        const win = window as Window;
        const dataLayer = win[this.dataLayerName] as Record<string, unknown>[];

        if (dataLayer && Array.isArray(dataLayer)) {
            const originalPush = Array.prototype.push;

            dataLayer.push = function (...args: Record<string, unknown>[]) {
                console.group('GTM Data Layer Event:');
                console.log(...args);
                console.groupEnd();
                return originalPush.apply(this, args);
            };
        }

        console.info('GTM Debug Mode: Enabled');
    }

    /**
     * Load Google Tag Manager script
     */
    private loadGTMScript(): void {
        if (document.getElementById('gtm-script')) {
            return; // Script already loaded
        }

        // GTM script injection
        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.async = true;

        const gtmCode = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','${this.dataLayerName}','${this.config.gtmId}');
        `;

        script.innerHTML = gtmCode;
        document.head.appendChild(script);

        // Add noscript fallback
        this.addNoScriptFallback();
    }

    /**
     * Add noscript fallback for users with JavaScript disabled
     */
    private addNoScriptFallback(): void {
        if (document.getElementById('gtm-noscript')) {
            return;
        }

        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

        document.body.insertBefore(noscript, document.body.firstChild);
    }

    /**
     * Push event to data layer
     */
    private pushEvent(event: Record<string, unknown>): void {
        if (!isBrowser()) return;

        const win = window as Window;
        const dataLayer = win[this.dataLayerName] as Record<string, unknown>[];

        if (dataLayer && Array.isArray(dataLayer)) {
            dataLayer.push(event);
        }
    }

    /**
     * Track page view
     */
    public trackPageView(url?: string, title?: string): void {
        const pageData = {
            path: url || (isBrowser() ? window.location.pathname : ''),
            title: title || (isBrowser() ? document.title : ''),
            location: isBrowser() ? window.location.href : '',
        };

        this.pushEvent({
            event: 'page_view',
            page_location: pageData.location,
            page_title: pageData.title,
            page_path: pageData.path,
            page: {
                path: pageData.path,
                title: pageData.title,
                location: pageData.location,
            },
        });
    }

    /**
     * Track product view
     */
    public trackProductView(product: ProductData): void {
        const productData = {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            currency: product.currency || this.config.defaultCurrency,
            item_category: product.category,
            item_brand: product.brand,
            quantity: 1,
        };

        // GA4 Event: view_item
        this.pushEvent({
            event: 'view_item',
            ecommerce: {
                currency: productData.currency,
                value: productData.price,
                items: [productData],
            },
            page_title: productData.item_name,
            page_location: isBrowser() ? window.location.href : '',
            content_type: 'product',
        });

        // Facebook Pixel Event: view_content
        this.pushEvent({
            event: 'view_content',
            content_type: 'product',
            content_ids: [productData.item_id],
            content_name: productData.item_name,
            content_category: productData.item_category,
            value: productData.price,
            currency: productData.currency,
            ecommerce: {
                items: [productData],
            },
        });
    }

    /**
     * Track add to cart
     */
    public trackAddToCart(product: ProductData): void {
        const quantity = product.quantity || 1;
        const productData = {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            currency: product.currency || this.config.defaultCurrency,
            quantity: quantity,
            item_category: product.category,
            item_brand: product.brand,
        };

        // GA4 Event: add_to_cart
        this.pushEvent({
            event: 'add_to_cart',
            ecommerce: {
                currency: productData.currency,
                value: productData.price * quantity,
                items: [productData],
            },
        });

        // Facebook Pixel Event: add_to_cart
        this.pushEvent({
            event: 'add_to_cart_fb',
            content_type: 'product',
            content_ids: [productData.item_id],
            content_name: productData.item_name,
            value: productData.price * quantity,
            currency: productData.currency,
            ecommerce: {
                items: [productData],
            },
        });
    }

    /**
     * Track initiate checkout
     */
    public trackInitiateCheckout(data: CheckoutData): void {
        const items = data.products.map((product) => ({
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            currency: product.currency || this.config.defaultCurrency,
            quantity: product.quantity || 1,
            item_category: product.category,
            item_brand: product.brand,
        }));

        // GA4 Event: begin_checkout
        this.pushEvent({
            event: 'begin_checkout',
            ecommerce: {
                currency: data.currency || this.config.defaultCurrency,
                value: data.value,
                items: items,
            },
        });

        // Facebook Pixel Event: InitiateCheckout
        this.pushEvent({
            event: 'initiate_checkout',
            content_type: 'product',
            content_ids: items.map((item) => item.item_id),
            value: data.value,
            currency: data.currency || this.config.defaultCurrency,
            num_items: items.length,
            ecommerce: {
                items: items,
            },
        });
    }

    /**
     * Track purchase
     */
    public trackPurchase(data: PurchaseData): void {
        const items = data.products.map((product) => ({
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            currency: product.currency || this.config.defaultCurrency,
            quantity: product.quantity || 1,
            item_category: product.category,
            item_brand: product.brand,
        }));

        // GA4 Event: purchase
        this.pushEvent({
            event: 'purchase',
            ecommerce: {
                transaction_id: data.orderId,
                value: data.value,
                tax: 0,
                shipping: 0,
                currency: data.currency || this.config.defaultCurrency,
                items: items,
            },
        });

        // Facebook Pixel Event: Purchase
        this.pushEvent({
            event: 'purchase_fb',
            content_type: 'product',
            content_ids: items.map((item) => item.item_id),
            value: data.value,
            currency: data.currency || this.config.defaultCurrency,
            num_items: items.length,
            transaction_id: data.orderId,
            ecommerce: {
                items: items,
            },
        });
    }

    /**
     * Track search
     */
    public trackSearch(data: SearchData): void {
        this.pushEvent({
            event: 'search',
            search_term: data.searchTerm,
            search_results_count: 0,
        });
    }

    /**
     * Track user registration
     */
    public trackRegistration(data: RegistrationData = {}): void {
        // GA4 Event: sign_up
        this.pushEvent({
            event: 'sign_up',
            user_id: '',
            signup_method: data.method || 'email',
            user_email: '',
            event_category: 'engagement',
            event_label: 'user_registration',
        });

        // Facebook Pixel Event: CompleteRegistration
        this.pushEvent({
            event: 'complete_registration',
            registration_method: data.method || 'email',
            user_properties: {
                user_id: '',
                signup_method: data.method || 'email',
            },
            content_name: 'Registration',
            value: 0,
            currency: this.config.defaultCurrency,
        });
    }

    /**
     * Track custom event
     */
    public trackCustomEvent(eventName: string, parameters: Record<string, unknown> = {}): void {
        this.pushEvent({
            event: eventName,
            ...parameters,
        });
    }

    /**
     * Set user data
     */
    public setUserData(userData: { userId?: string; userType?: string; email?: string; isLoggedIn: boolean }): void {
        this.pushEvent({
            event: 'set_user_data',
            user_id: userData.userId || null,
            user_type: userData.userType || 'customer',
            user_email: userData.email || null,
            is_logged_in: userData.isLoggedIn,
        });
    }

    /**
     * Track add to wishlist
     */
    public trackAddToWishlist(product: ProductData): void {
        this.pushEvent({
            event: 'add_to_wishlist',
            ecommerce: {
                items: [
                    {
                        item_id: product.id,
                        item_name: product.name,
                        price: product.price,
                        currency: product.currency || this.config.defaultCurrency,
                        item_category: product.category,
                    },
                ],
            },
        });
    }

    /**
     * Debug data layer contents
     */
    public debugDataLayer(): void {
        if (!isBrowser()) return;

        const win = window as Window;
        const dataLayer = win[this.dataLayerName] as Record<string, unknown>[];

        if (dataLayer && Array.isArray(dataLayer)) {
            console.log('🔍 GTM Data Layer Contents:', dataLayer);
            console.log('📊 Last 5 Events:', dataLayer.slice(-5));

            // Check for undefined values
            const lastEvent = dataLayer[dataLayer.length - 1];
            if (lastEvent) {
                const undefinedKeys = Object.keys(lastEvent).filter((key) => lastEvent[key] === undefined);
                if (undefinedKeys.length > 0) {
                    console.warn('⚠️ Undefined values found in last event:', undefinedKeys);
                } else {
                    console.log('✅ No undefined values in last event');
                }
            }
        }
    }

    /**
     * Check if GTM is initialized
     */
    public isReady(): boolean {
        return this.isInitialized && isBrowser();
    }

    /**
     * Get current configuration
     */
    public getConfig(): GTMConfig {
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    public updateConfig(newConfig: Partial<GTMConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (this.config.debug) {
            console.log('GTM configuration updated:', this.config);
        }
    }
}
