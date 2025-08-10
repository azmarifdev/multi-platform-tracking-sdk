import { ConversionAPIConfig, ServerEventData, EventResponse, UserData, CustomData, EventName } from './types';
import {
    validateConfig,
    generateEventId,
    getCurrentTimestamp,
    normalizeUserData,
    isNode,
    createTrackingError,
    retry,
    hashData,
} from './utils';

/**
 * Meta Conversion API server-side tracker
 * Self-contained implementation inspired by facebook-nodejs-business-sdk patterns
 * Handles server-side tracking using Facebook's Conversion API without external dependencies
 */
export class MetaConversionTracker {
    private config: ConversionAPIConfig;
    private retryAttempts: number = 3;
    private retryDelay: number = 1000;
    private baseUrl: string;

    constructor(config: ConversionAPIConfig) {
        this.config = {
            debug: false,
            apiVersion: 'v18.0',
            ...config,
        };

        // Set base URL for Conversion API
        this.baseUrl = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}/events`;

        // Enhanced validation
        const validation = validateConfig(this.config);
        if (!validation.isValid) {
            throw createTrackingError(`Invalid configuration: ${validation.errors.join(', ')}`, 'CONFIG_ERROR');
        }

        // Log warnings if any
        if (validation.warnings.length > 0 && this.config.debug) {
            console.warn('Meta Conversion API configuration warnings:', validation.warnings);
        }
    }

    /**
     * Make HTTP request to Facebook Conversion API
     */
    private async makeRequest(data: unknown[] | Record<string, unknown>): Promise<unknown> {
        const requestBody: Record<string, unknown> = {
            data: Array.isArray(data) ? data : [data],
            test_event_code: this.config.testEventCode,
            access_token: this.config.accessToken,
            ...(this.config.partnerAgent && { partner_agent: this.config.partnerAgent }),
        };

        // Add app secret for request verification if provided
        if (this.config.appSecret) {
            const payload = JSON.stringify(requestBody);
            const signature = this.generateSignature(payload);
            requestBody.appsecret_proof = signature;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'meta-tracking-sdk/1.1.0',
            },
            body: JSON.stringify(requestBody),
        };

        try {
            let response: Response;

            if (isNode()) {
                // Node.js environment - use fetch if available (Node 18+)
                try {
                    response = await fetch(this.baseUrl, requestOptions);
                } catch {
                    // Fallback to require approach for older Node versions
                    const requireFunc = typeof require !== 'undefined' ? require : (id: string) => { throw new Error(`Module ${id} not found`); };
                    const https = requireFunc('https');
                    const url = requireFunc('url');

                    return new Promise((resolve, reject) => {
                        const parsedUrl = new url.URL(this.baseUrl);
                        const postData = requestOptions.body;

                        const req = https.request(
                            {
                                hostname: parsedUrl.hostname,
                                port: parsedUrl.port || 443,
                                path: parsedUrl.pathname + parsedUrl.search,
                                method: 'POST',
                                headers: {
                                    ...requestOptions.headers,
                                    'Content-Length': Buffer.byteLength(postData),
                                },
                            },
                            (res: import('http').IncomingMessage) => {
                                let data = '';
                                res.on('data', (chunk: Buffer) => (data += chunk));
                                res.on('end', () => {
                                    try {
                                        const result = JSON.parse(data);
                                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                                            resolve(result);
                                        } else {
                                            reject(
                                                new Error(`HTTP ${res.statusCode}: ${result.error?.message || data}`)
                                            );
                                        }
                                    } catch {
                                        reject(new Error(`Failed to parse response: ${data}`));
                                    }
                                });
                            }
                        );

                        req.on('error', reject);
                        req.write(postData);
                        req.end();
                    });
                }
            } else {
                // Browser environment
                response = await fetch(this.baseUrl, requestOptions);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            return await response.json();
        } catch (error: unknown) {
            if (this.config.debug) {
                console.error('Meta Conversion API request failed:', error);
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw createTrackingError(`API request failed: ${errorMessage}`, 'API_ERROR', error);
        }
    }

    /**
     * Generate HMAC-SHA256 signature for app secret proof
     */
    private generateSignature(payload: string): string {
        if (!this.config.appSecret) {
            return '';
        }

        try {
            if (isNode()) {
                const requireFunc = typeof require !== 'undefined' ? require : (id: string) => { throw new Error(`Module ${id} not found`); };
                const crypto = requireFunc('crypto');
                return crypto.createHmac('sha256', this.config.appSecret).update(payload).digest('hex');
            } else {
                console.warn('App secret signing not recommended in browser environment');
                return '';
            }
        } catch (error) {
            if (this.config.debug) {
                console.warn('Failed to generate signature:', error);
            }
            return '';
        }
    }

    /**
     * Send a single event to Facebook Conversion API
     */
    async sendEvent(eventData: ServerEventData): Promise<EventResponse> {
        this.validateServerEventData(eventData);
        const serverEvent = this.createServerEvent(eventData);

        return retry(
            async () => {
                const response = await this.makeRequest(serverEvent);
                return this.transformResponse(response);
            },
            this.retryAttempts,
            this.retryDelay
        );
    }

    /**
     * Send multiple events in a batch
     */
    async sendBatchEvents(events: ServerEventData[]): Promise<EventResponse> {
        if (!Array.isArray(events) || events.length === 0) {
            throw createTrackingError('Events array is required and cannot be empty', 'VALIDATION_ERROR');
        }

        if (events.length > 1000) {
            throw createTrackingError('Maximum 1000 events per batch allowed', 'VALIDATION_ERROR');
        }

        // Validate all events
        events.forEach((event, index) => {
            try {
                this.validateServerEventData(event);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw createTrackingError(`Event ${index}: ${errorMessage}`, 'VALIDATION_ERROR');
            }
        });

        const serverEvents = events.map((event) => this.createServerEvent(event));

        return retry(
            async () => {
                const response = await this.makeRequest(serverEvents);
                return this.transformResponse(response);
            },
            this.retryAttempts,
            this.retryDelay
        );
    }

    /**
     * Create server event object
     */
    private createServerEvent(eventData: ServerEventData): Record<string, unknown> {
        const event = {
            event_name: eventData.eventName,
            event_time: eventData.eventTime || getCurrentTimestamp(),
            event_id: eventData.eventId || generateEventId(),
            action_source: eventData.actionSource || 'website',
            event_source_url:
                eventData.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
            user_data: this.createUserData(eventData.userData || {}),
            custom_data: this.createCustomData(eventData.customData || {}),
            ...(eventData.optOut && { opt_out: eventData.optOut }),
            ...(eventData.dataProcessingOptions && {
                data_processing_options: eventData.dataProcessingOptions,
                ...(eventData.dataProcessingOptionsCountry !== undefined && {
                    data_processing_options_country: eventData.dataProcessingOptionsCountry,
                }),
                ...(eventData.dataProcessingOptionsState !== undefined && {
                    data_processing_options_state: eventData.dataProcessingOptionsState,
                }),
            }),
        };

        return event;
    }

    /**
     * Create and populate user data object
     */
    private createUserData(userData: UserData): Record<string, unknown> {
        const normalizedData = normalizeUserData(userData);
        const userDataObj: Record<string, unknown> = {};

        // Hash and set standard fields
        if (normalizedData.email) userDataObj.em = hashData(normalizedData.email);
        if (normalizedData.phone) userDataObj.ph = hashData(normalizedData.phone);
        if (normalizedData.firstName) userDataObj.fn = hashData(normalizedData.firstName);
        if (normalizedData.lastName) userDataObj.ln = hashData(normalizedData.lastName);
        if (normalizedData.dateOfBirth) userDataObj.db = hashData(normalizedData.dateOfBirth);
        if (normalizedData.gender) userDataObj.ge = hashData(normalizedData.gender);
        if (normalizedData.city) userDataObj.ct = hashData(normalizedData.city);
        if (normalizedData.state) userDataObj.st = hashData(normalizedData.state);
        if (normalizedData.country) userDataObj.country = hashData(normalizedData.country);
        if (normalizedData.zipCode) userDataObj.zp = hashData(normalizedData.zipCode);

        // Enhanced fields inspired by Facebook SDK
        if (normalizedData.f5first) userDataObj.f5first = hashData(normalizedData.f5first);
        if (normalizedData.f5last) userDataObj.f5last = hashData(normalizedData.f5last);
        if (normalizedData.fi) userDataObj.fi = hashData(normalizedData.fi);
        if (normalizedData.dobd) userDataObj.dobd = hashData(normalizedData.dobd);
        if (normalizedData.dobm) userDataObj.dobm = hashData(normalizedData.dobm);
        if (normalizedData.doby) userDataObj.doby = hashData(normalizedData.doby);

        // External identifiers (not hashed)
        if (normalizedData.externalId) userDataObj.external_id = normalizedData.externalId;
        if (normalizedData.clientIpAddress) userDataObj.client_ip_address = normalizedData.clientIpAddress;
        if (normalizedData.clientUserAgent) userDataObj.client_user_agent = normalizedData.clientUserAgent;
        if (normalizedData.fbc) userDataObj.fbc = normalizedData.fbc;
        if (normalizedData.fbp) userDataObj.fbp = normalizedData.fbp;
        if (normalizedData.subscriptionId) userDataObj.subscription_id = normalizedData.subscriptionId;
        if (normalizedData.fbLoginId) userDataObj.fb_login_id = normalizedData.fbLoginId;
        if (normalizedData.leadId) userDataObj.lead_id = normalizedData.leadId;

        return userDataObj;
    }

    /**
     * Create custom data object
     */
    private createCustomData(customData: CustomData): Record<string, unknown> {
        const customDataObj: Record<string, unknown> = {};

        if (customData.value !== undefined) customDataObj.value = customData.value;
        if (customData.currency) customDataObj.currency = customData.currency;
        if (customData.contentName) customDataObj.content_name = customData.contentName;
        if (customData.contentCategory) customDataObj.content_category = customData.contentCategory;
        if (customData.contentIds) customDataObj.content_ids = customData.contentIds;
        if (customData.contentType) customDataObj.content_type = customData.contentType;
        if (customData.orderId) customDataObj.order_id = customData.orderId;
        if (customData.searchString) customDataObj.search_string = customData.searchString;
        if (customData.numItems !== undefined) customDataObj.num_items = customData.numItems;
        if (customData.status) customDataObj.status = customData.status;
        if (customData.deliveryCategory) customDataObj.delivery_category = customData.deliveryCategory;

        // Handle contents array
        if (customData.contents && Array.isArray(customData.contents)) {
            customDataObj.contents = customData.contents.map((content) => ({
                id: content.id,
                quantity: content.quantity || 1,
                item_price: content.itemPrice,
                ...(content.title && { title: content.title }),
                ...(content.category && { category: content.category }),
                ...(content.brand && { brand: content.brand }),
            }));
        }

        // Handle custom properties
        if (customData.customProperties) {
            Object.keys(customData.customProperties).forEach((key) => {
                const reservedFields = [
                    'value',
                    'currency',
                    'content_name',
                    'content_category',
                    'content_ids',
                    'content_type',
                    'order_id',
                    'search_string',
                    'num_items',
                    'status',
                    'delivery_category',
                    'contents',
                ];
                if (!reservedFields.includes(key)) {
                    customDataObj[key] = customData.customProperties![key];
                }
            });
        }

        return customDataObj;
    }

    /**
     * Transform API response to our format
     */
    private transformResponse(response: unknown): EventResponse {
        const resp = response as Record<string, unknown>;
        const eventsReceived = (resp.events_received as number) || 0;
        return {
            eventsReceived,
            events_received: eventsReceived, // Legacy field for backward compatibility
            messages: (resp.messages as string[]) || [],
            fbtrace_id: resp.fbtrace_id as string,
            id: resp.id as string,
            numProcessedEntries: (resp.num_processed_entries as number) || 0,
        };
    }

    /**
     * Validate server event data
     */
    private validateServerEventData(eventData: ServerEventData): void {
        if (!eventData.eventName) {
            throw createTrackingError('Event name is required', 'VALIDATION_ERROR');
        }

        // Validate event name
        const standardEvents = [
            'PageView',
            'ViewContent',
            'Search',
            'AddToCart',
            'AddToWishlist',
            'InitiateCheckout',
            'AddPaymentInfo',
            'Purchase',
            'Lead',
            'CompleteRegistration',
            'Contact',
            'CustomizeProduct',
            'Donate',
            'FindLocation',
            'Schedule',
            'StartTrial',
            'SubmitApplication',
            'Subscribe',
        ];

        if (!standardEvents.includes(eventData.eventName) && !eventData.eventName.startsWith('Custom_')) {
            if (this.config.debug) {
                console.warn(`Consider using standard event name or prefix with "Custom_": ${eventData.eventName}`);
            }
        }

        // Validate action source
        const validActionSources = [
            'email',
            'website',
            'phone_call',
            'chat',
            'physical_store',
            'system_generated',
            'business_messaging',
            'other',
        ];
        if (eventData.actionSource && !validActionSources.includes(eventData.actionSource)) {
            throw createTrackingError(`Invalid action source: ${eventData.actionSource}`, 'VALIDATION_ERROR');
        }

        // Validate timestamp
        if (
            eventData.eventTime &&
            (eventData.eventTime < 1000000000 || eventData.eventTime > Date.now() / 1000 + 3600)
        ) {
            throw createTrackingError(
                'Event time must be a valid Unix timestamp within reasonable bounds',
                'VALIDATION_ERROR'
            );
        }
    }

    /**
     * Test connection to Facebook Conversion API
     */
    async testConnection(): Promise<{ success: boolean; details?: unknown; error?: string }> {
        try {
            const testEvent: ServerEventData = {
                eventName: 'PageView',
                eventTime: getCurrentTimestamp(),
                eventId: generateEventId(),
                actionSource: 'website',
                eventSourceUrl: 'https://example.com/test',
                userData: { email: 'test@example.com' },
                customData: { value: 0, currency: 'USD' },
            };

            const response = await this.sendEvent(testEvent);

            return {
                success: true,
                details: {
                    eventsReceived: response.eventsReceived,
                    fbtrace_id: response.fbtrace_id,
                    testMode: !!this.config.testEventCode,
                },
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Validate pixel access
     */
    async validatePixelAccess(): Promise<{ valid: boolean; permissions?: string[]; error?: string }> {
        try {
            const testResult = await this.testConnection();
            if (testResult.success) {
                return {
                    valid: true,
                    permissions: ['ADVERTISE', 'ANALYZE'],
                };
            } else {
                return {
                    valid: false,
                    ...(testResult.error && { error: testResult.error }),
                };
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return { valid: false, error: errorMessage };
        }
    }

    /**
     * Get recommended events for business type
     */
    getRecommendedEvents(businessType: 'ecommerce' | 'saas' | 'lead_generation' | 'content' | 'app'): EventName[] {
        const recommendations: Record<string, EventName[]> = {
            ecommerce: [
                'PageView',
                'ViewContent',
                'Search',
                'AddToCart',
                'InitiateCheckout',
                'AddPaymentInfo',
                'Purchase',
            ],
            saas: ['PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'StartTrial', 'Subscribe', 'Purchase'],
            lead_generation: [
                'PageView',
                'ViewContent',
                'Lead',
                'Contact',
                'SubmitApplication',
                'CompleteRegistration',
            ],
            content: ['PageView', 'ViewContent', 'Search', 'Subscribe', 'Contact'],
            app: ['PageView', 'ViewContent', 'CompleteRegistration', 'AddToCart', 'Purchase', 'Subscribe'],
        };

        return recommendations[businessType] || ['PageView', 'ViewContent', 'Purchase'];
    }

    /**
     * Quick tracking methods
     */
    async trackPageView(userData?: UserData, customData?: CustomData): Promise<EventResponse> {
        return this.sendEvent({
            eventName: 'PageView',
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
            userData: userData || {},
            customData: customData || {},
        });
    }

    async trackPurchase(
        value: number,
        currency: string = 'USD',
        userData?: UserData,
        additionalData?: Partial<CustomData>
    ): Promise<EventResponse> {
        return this.sendEvent({
            eventName: 'Purchase',
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
            userData: userData || {},
            customData: { value, currency, ...additionalData },
        });
    }

    async trackLead(userData?: UserData, customData?: CustomData): Promise<EventResponse> {
        return this.sendEvent({
            eventName: 'Lead',
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
            userData: userData || {},
            customData: customData || {},
        });
    }

    async trackAddToCart(
        contentIds: string[],
        value?: number,
        currency: string = 'USD',
        userData?: UserData,
        additionalData?: Partial<CustomData>
    ): Promise<EventResponse> {
        return this.sendEvent({
            eventName: 'AddToCart',
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
            userData: userData || {},
            customData: { contentIds, ...(value !== undefined && { value }), currency, ...additionalData },
        });
    }

    async trackViewContent(
        contentId: string,
        contentType?: string,
        value?: number,
        currency: string = 'USD',
        userData?: UserData,
        additionalData?: Partial<CustomData>
    ): Promise<EventResponse> {
        return this.sendEvent({
            eventName: 'ViewContent',
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
            userData: userData || {},
            customData: {
                contentIds: [contentId],
                ...(contentType && { contentType }),
                ...(value !== undefined && { value }),
                currency,
                ...additionalData,
            },
        });
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<ConversionAPIConfig>): void {
        this.config = { ...this.config, ...newConfig };

        // Update base URL if pixel ID or API version changed
        if (newConfig.pixelId || newConfig.apiVersion) {
            this.baseUrl = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.pixelId}/events`;
        }

        // Validate updated config
        const validation = validateConfig(this.config);
        if (!validation.isValid) {
            throw createTrackingError(`Invalid configuration update: ${validation.errors.join(', ')}`, 'CONFIG_ERROR');
        }
    }

    /**
     * Get current configuration (without sensitive data)
     */
    getConfig(): Record<string, unknown> {
        const { accessToken, appSecret, ...publicConfig } = this.config;
        return {
            ...publicConfig,
            hasAccessToken: !!accessToken,
            hasAppSecret: !!appSecret,
        };
    }
}
