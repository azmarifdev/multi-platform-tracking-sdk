// Core types for the multi platform tracking sdk

export interface ProductData {
    id: string;
    name?: string;
    price: number;
    quantity?: number;
    currency?: string;
    category?: string;
    brand?: string;
    variant?: string;
}

export interface UserData {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string; // Facebook Browser Pixel
    fbc?: string; // Facebook Click ID
    externalId?: string;
    loginId?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
    dateOfBirth?: string;
    gender?: 'M' | 'F' | 'm' | 'f';
    subscriptionId?: string;
    fbLoginId?: string;
    leadId?: string;
    f5first?: string; // First 5 characters of first name
    f5last?: string; // First 5 characters of last name
    fi?: string; // First initial
    dobd?: string; // Date of birth day (DD)
    dobm?: string; // Date of birth month (MM)
    doby?: string; // Date of birth year (YYYY)
    madid?: string; // Mobile Advertiser ID
    anonId?: string; // Anonymous ID
    appUserId?: string;
    ctwaClid?: string; // Click-to-WhatsApp click ID
    pageId?: string;
}

export interface CustomData {
    value?: number;
    currency?: string;
    contentName?: string;
    contentCategory?: string;
    contentIds?: string[];
    contents?: Array<{
        id: string;
        quantity: number;
        itemPrice?: number;
        title?: string;
        category?: string;
        brand?: string;
    }>;
    contentType?: string;
    orderId?: string;
    searchString?: string;
    status?: string;
    numItems?: number;
    deliveryCategory?: string;
    customProperties?: { [key: string]: unknown };
}

export interface EventData {
    eventName: string;
    eventTime?: number;
    eventId?: string;
    eventSourceUrl?: string;
    actionSource?:
        | 'website'
        | 'email'
        | 'app'
        | 'phone_call'
        | 'chat'
        | 'physical_store'
        | 'system_generated'
        | 'other';
    userData?: UserData;
    customData?: CustomData;
    testEventCode?: string;
}

export interface ServerEventData extends EventData {
    eventSourceUrl: string;
    userData: UserData;
    optOut?: boolean;
    dataProcessingOptions?: string[];
    dataProcessingOptionsCountry?: number;
    dataProcessingOptionsState?: number;
}

export interface MetaPixelConfig {
    pixelId: string;
    debug?: boolean;
    autoInit?: boolean;
    testEventCode?: string;
    version?: string;
    agent?: string;
}

export interface ConversionAPIConfig {
    accessToken: string;
    pixelId: string;
    debug?: boolean;
    testEventCode?: string;
    apiVersion?: string;
    appSecret?: string;
    partnerAgent?: string;
    namespaceId?: string;
    uploadId?: string;
    uploadTag?: string;
    uploadSource?: string;
}

export interface HybridTrackerConfig {
    pixelId: string;
    serverEndpoint?: string;
    debug?: boolean;
    testEventCode?: string;
    enableClientTracking?: boolean;
    enableServerTracking?: boolean;
}

export interface PurchaseData {
    orderId: string;
    value: number;
    currency: string;
    products: ProductData[];
    eventId?: string;
    customData?: CustomData;
}

export interface CheckoutData {
    value: number;
    currency: string;
    products: ProductData[];
    eventId?: string;
    customData?: CustomData;
}

export interface SearchData {
    searchTerm: string;
    eventId?: string;
    customData?: CustomData;
}

export interface RegistrationData {
    method?: string;
    status?: string;
    eventId?: string;
    customData?: CustomData;
}

// Event response types
export interface EventResponse {
    eventsReceived?: number;
    messages?: string[];
    fbtrace_id?: string;
    id?: string;
    numProcessedEntries?: number;
    events_received?: number; // Legacy field for backward compatibility
}

// Error types
export interface TrackingError extends Error {
    code?: string;
    fbtrace_id?: string;
    details?: unknown;
}

// Configuration validation
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Utility types
export type EventName =
    | 'PageView'
    | 'ViewContent'
    | 'Search'
    | 'AddToCart'
    | 'AddToWishlist'
    | 'InitiateCheckout'
    | 'AddPaymentInfo'
    | 'Purchase'
    | 'Lead'
    | 'CompleteRegistration'
    | 'Contact'
    | 'CustomizeProduct'
    | 'Donate'
    | 'FindLocation'
    | 'Schedule'
    | 'StartTrial'
    | 'SubmitApplication'
    | 'Subscribe'
    | string; // Allow custom events

export type Currency =
    | 'USD'
    | 'EUR'
    | 'GBP'
    | 'CAD'
    | 'AUD'
    | 'JPY'
    | 'CNY'
    | 'INR'
    | 'BDT'
    | 'PKR'
    | 'NGN'
    | 'KES'
    | 'ZAR'
    | 'EGP'
    | string; // Allow other currencies

export type ContentType = 'product' | 'product_group' | 'destination' | 'flight' | 'hotel' | 'vehicle' | string; // Allow custom content types
