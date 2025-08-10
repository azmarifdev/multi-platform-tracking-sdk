import {
    hashDataSync,
    generateEventId,
    isValidPixelId,
    isValidEmail,
    isValidPhone,
    sanitizeUrl,
    deepClone,
} from '../utils';

describe('Utils', () => {
    describe('hashDataSync', () => {
        it('should hash data consistently', () => {
            const data = 'test@example.com';
            const hash1 = hashDataSync(data);
            const hash2 = hashDataSync(data);
            expect(hash1).toBe(hash2);
            expect(hash1).toBeTruthy();
        });

        it('should return empty string for invalid data', () => {
            expect(hashDataSync('')).toBe('');
            expect(hashDataSync(null as any)).toBe('');
            expect(hashDataSync(undefined as any)).toBe('');
        });
    });

    describe('generateEventId', () => {
        it('should generate unique event IDs', () => {
            const id1 = generateEventId('test');
            const id2 = generateEventId('test');
            expect(id1).not.toBe(id2);
            expect(id1).toContain('test_');
            expect(id2).toContain('test_');
        });

        it('should use default prefix', () => {
            const id = generateEventId();
            expect(id).toContain('event_');
        });
    });

    describe('isValidPixelId', () => {
        it('should validate correct pixel IDs', () => {
            expect(isValidPixelId('123456789012345')).toBe(true);
            expect(isValidPixelId('1234567890123456')).toBe(true);
        });

        it('should reject invalid pixel IDs', () => {
            expect(isValidPixelId('123')).toBe(false);
            expect(isValidPixelId('12345678901234567')).toBe(false);
            expect(isValidPixelId('abc123456789012')).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct emails', () => {
            expect(isValidEmail('user@example.com')).toBe(true);
            expect(isValidEmail('test.email+tag@domain.co.uk')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
        });
    });

    describe('isValidPhone', () => {
        it('should validate correct phone numbers', () => {
            expect(isValidPhone('+1234567890')).toBe(true);
            expect(isValidPhone('123-456-7890')).toBe(true);
            expect(isValidPhone('(123) 456-7890')).toBe(true);
        });

        it('should reject invalid phone numbers', () => {
            expect(isValidPhone('123')).toBe(false);
            expect(isValidPhone('abc')).toBe(false);
        });
    });

    describe('sanitizeUrl', () => {
        it('should remove sensitive parameters', () => {
            const url = 'https://example.com/page?token=secret&other=value';
            const sanitized = sanitizeUrl(url);
            expect(sanitized).not.toContain('token=secret');
            expect(sanitized).toContain('other=value');
        });

        it('should handle invalid URLs gracefully', () => {
            const invalidUrl = 'not-a-url';
            const result = sanitizeUrl(invalidUrl);
            expect(result).toBe(invalidUrl);
        });
    });

    describe('deepClone', () => {
        it('should deep clone objects', () => {
            const original = {
                a: 1,
                b: {
                    c: 2,
                    d: [3, 4, 5],
                },
            };

            const cloned = deepClone(original);
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned.b).not.toBe(original.b);
            expect(cloned.b.d).not.toBe(original.b.d);
        });

        it('should handle primitives', () => {
            expect(deepClone(42)).toBe(42);
            expect(deepClone('hello')).toBe('hello');
            expect(deepClone(null)).toBe(null);
            expect(deepClone(undefined)).toBe(undefined);
        });
    });
});
