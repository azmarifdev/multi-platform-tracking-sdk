import {
    UserData,
    ValidationResult,
    TrackingError,
    MetaPixelConfig,
    ConversionAPIConfig,
    HybridTrackerConfig,
} from './types';

// Type for Node.js global process
interface NodeGlobal {
    process?: {
        versions?: {
            node?: string;
        };
    };
}

/**
 * Utility functions for Meta Tracking SDK
 */

/**
 * Hash user data using SHA256 as required by Facebook Conversion API
 * Uses crypto module in Node.js or SubtleCrypto in browsers
 * @param data - The data to hash
 * @returns Hashed data in hexadecimal format
 */
export async function hashData(data: string): Promise<string> {
    if (!data || typeof data !== 'string') {
        return '';
    }

    const normalizedData = data.toLowerCase().trim();

    // Try Node.js crypto module first
    if (
        typeof (globalThis as NodeGlobal).process !== 'undefined' &&
        (globalThis as NodeGlobal).process?.versions &&
        (globalThis as NodeGlobal).process?.versions?.node
    ) {
        try {
            // Use conditional require to avoid eval
            const requireFunc = typeof require !== 'undefined' ? require : (id: string) => { throw new Error(`Module ${id} not found`); };
            const crypto = requireFunc('crypto');
            return crypto.createHash('sha256').update(normalizedData).digest('hex');
        } catch {
            // Fall through to browser implementation
        }
    }

    // Browser implementation using SubtleCrypto
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(normalizedData);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch {
            // Fall through to simple hash
        }
    }

    // Fallback simple hash (not cryptographically secure, but better than nothing)
    let hash = 0;
    for (let i = 0; i < normalizedData.length; i++) {
        const char = normalizedData.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Synchronous version of hashData for compatibility
 * Uses simple hash in browsers, crypto in Node.js
 * @param data - The data to hash
 * @returns Hashed data in hexadecimal format
 */
export function hashDataSync(data: string): string {
    if (!data || typeof data !== 'string') {
        return '';
    }

    const normalizedData = data.toLowerCase().trim();

    // Try Node.js crypto module
    try {
        if (
            typeof (globalThis as NodeGlobal).process !== 'undefined' &&
            (globalThis as NodeGlobal).process?.versions &&
            (globalThis as NodeGlobal).process?.versions?.node
        ) {
            // Use conditional require to avoid eval
            const requireFunc = typeof require !== 'undefined' ? require : (id: string) => { throw new Error(`Module ${id} not found`); };
            const crypto = requireFunc('crypto');
            return crypto.createHash('sha256').update(normalizedData).digest('hex');
        }
    } catch {
        // Continue to fallback
    }

    // Fallback simple hash
    let hash = 0;
    for (let i = 0; i < normalizedData.length; i++) {
        const char = normalizedData.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

/**
 * Normalize and hash user data for privacy compliance
 * @param userData - User data to normalize and hash
 * @returns Normalized and hashed user data
 */
export function normalizeUserData(userData: UserData): UserData {
    const normalized: UserData = { ...userData };

    // Hash email if provided
    if (normalized.email) {
        normalized.email = hashDataSync(normalized.email);
    }

    // Hash phone if provided (remove all non-digits first)
    if (normalized.phone) {
        const cleanPhone = normalized.phone.replace(/\D/g, '');
        normalized.phone = hashDataSync(cleanPhone);
    }

    // Hash first name if provided
    if (normalized.firstName) {
        normalized.firstName = hashDataSync(normalized.firstName);
    }

    // Hash last name if provided
    if (normalized.lastName) {
        normalized.lastName = hashDataSync(normalized.lastName);
    }

    // Hash external ID if provided
    if (normalized.externalId) {
        normalized.externalId = hashDataSync(normalized.externalId);
    }

    // Normalize and hash other PII data
    if (normalized.zipCode) {
        normalized.zipCode = hashDataSync(normalized.zipCode);
    }

    if (normalized.city) {
        normalized.city = hashDataSync(normalized.city);
    }

    if (normalized.state) {
        normalized.state = hashDataSync(normalized.state.toLowerCase());
    }

    if (normalized.country) {
        normalized.country = hashDataSync(normalized.country.toLowerCase());
    }

    return normalized;
}

/**
 * Generate a unique event ID
 * @param prefix - Optional prefix for the event ID
 * @returns Unique event ID
 */
export function generateEventId(prefix: string = 'event'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
}

/**
 * Get current timestamp in Unix seconds
 * @returns Current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * Validate pixel ID format
 * @param pixelId - The pixel ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidPixelId(pixelId: string): boolean {
    return /^\d{15,16}$/.test(pixelId);
}

/**
 * Validate access token format (basic validation)
 * @param accessToken - The access token to validate
 * @returns True if valid format, false otherwise
 */
export function isValidAccessToken(accessToken: string): boolean {
    // Basic validation - Facebook access tokens are typically long strings
    return typeof accessToken === 'string' && accessToken.length > 50;
}

/**
 * Validate email format
 * @param email - The email to validate
 * @returns True if valid email format, false otherwise
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (international)
 * @param phone - The phone number to validate
 * @returns True if valid phone format, false otherwise
 */
export function isValidPhone(phone: string): boolean {
    // Remove all non-digits and check if it's a reasonable length
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
}

/**
 * Validate currency code (ISO 4217)
 * @param currency - The currency code to validate
 * @returns True if valid currency code, false otherwise
 */
export function isValidCurrency(currency: string): boolean {
    // Common currency codes - expand as needed
    const validCurrencies = [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'CNY',
        'INR',
        'BDT',
        'PKR',
        'NGN',
        'KES',
        'ZAR',
        'EGP',
        'AED',
        'SAR',
        'BRL',
        'MXN',
        'RUB',
        'TRY',
        'KRW',
        'SGD',
        'HKD',
        'NZD',
    ];
    return validCurrencies.includes(currency.toUpperCase());
}

/**
 * Validate event configuration
 * @param config - Configuration object to validate
 * @returns Validation result with errors and warnings
 */
export function validateConfig(
    config: Record<string, unknown> | MetaPixelConfig | ConversionAPIConfig | HybridTrackerConfig,
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!config.pixelId) {
        errors.push('Pixel ID is required');
    } else if (typeof config.pixelId === 'string' && !isValidPixelId(config.pixelId)) {
        errors.push('Invalid Pixel ID format');
    }

    // Access token validation for server-side configurations
    if (
        'accessToken' in config &&
        config.accessToken &&
        typeof config.accessToken === 'string' &&
        !isValidAccessToken(config.accessToken)
    ) {
        errors.push('Invalid access token format');
    }

    // Currency validation
    if (
        'currency' in config &&
        config.currency &&
        typeof config.currency === 'string' &&
        !isValidCurrency(config.currency)
    ) {
        warnings.push('Unsupported currency code');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Sanitize URL for tracking
 * @param url - URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        // Remove sensitive query parameters
        const sensitiveParams = ['token', 'key', 'secret', 'password', 'auth'];

        sensitiveParams.forEach((param) => {
            if (urlObj.searchParams.has(param)) {
                urlObj.searchParams.delete(param);
            }
        });

        return urlObj.toString();
    } catch {
        // If URL is invalid, return as is but log warning
        console.warn('Invalid URL provided for sanitization:', url);
        return url;
    }
}

/**
 * Deep clone an object (for avoiding mutations)
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item)) as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }

    return cloned;
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in milliseconds
 * @returns Promise that resolves with function result or rejects after max retries
 */
export async function retry<T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (i === maxRetries) {
                throw lastError;
            }

            // Exponential backoff with jitter
            const backoffDelay = delay * Math.pow(2, i) + Math.random() * 1000;
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }
    }

    throw lastError!;
}

/**
 * Create a tracking error with additional context
 * @param message - Error message
 * @param code - Error code
 * @param details - Additional error details
 * @returns Formatted tracking error
 */
export function createTrackingError(message: string, code?: string, details?: unknown): TrackingError {
    const error = new Error(message) as TrackingError;
    error.name = 'TrackingError';
    if (code !== undefined) {
        error.code = code;
    }
    error.details = details;
    return error;
}

/**
 * Check if code is running in browser environment
 * @returns True if in browser, false otherwise
 */
export function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if code is running in Node.js environment
 * @returns True if in Node.js, false otherwise
 */
export function isNode(): boolean {
    return (
        typeof (globalThis as NodeGlobal).process !== 'undefined' &&
        typeof (globalThis as NodeGlobal).process?.versions !== 'undefined' &&
        typeof (globalThis as NodeGlobal).process?.versions?.node !== 'undefined'
    );
}

/**
 * Safely get nested object property
 * @param obj - Object to get property from
 * @param path - Property path (e.g., 'user.profile.name')
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default value
 */
export function safeGet(obj: Record<string, unknown>, path: string, defaultValue: unknown = undefined): unknown {
    try {
        return (
            path.split('.').reduce((current: unknown, key: string) => {
                return current && typeof current === 'object' && key in (current as Record<string, unknown>)
                    ? (current as Record<string, unknown>)[key]
                    : undefined;
            }, obj) ?? defaultValue
        );
    } catch {
        return defaultValue;
    }
}
