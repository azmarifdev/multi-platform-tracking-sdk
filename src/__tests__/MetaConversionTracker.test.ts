import { MetaConversionTracker } from '../MetaConversionTracker';

describe('MetaConversionTracker', () => {
    let tracker: MetaConversionTracker;

    beforeEach(() => {
        // Mock the validation to avoid API token requirements in tests
        jest.spyOn(console, 'warn').mockImplementation();

        tracker = new MetaConversionTracker({
            accessToken: 'EAAY9gQ7FnoABO1234567890abcdefghijklmnopqrstuvwxyz123456789012345',
            pixelId: '1234567890123456',
            testEventCode: 'TEST12345',
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initialization', () => {
        it('should create tracker instance', () => {
            expect(tracker).toBeInstanceOf(MetaConversionTracker);
        });
    });

    describe('event tracking', () => {
        it('should handle event data structure', async () => {
            const eventData = {
                eventName: 'Purchase' as const,
                eventSourceUrl: 'https://example.com',
                userData: {
                    email: 'test@example.com',
                },
                customData: {
                    value: 99.99,
                    currency: 'USD',
                },
            };

            // Mock fetch to avoid actual API calls
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () =>
                    Promise.resolve({
                        events_received: 1,
                        messages: [],
                        fbtrace_id: 'test-trace-id',
                    }),
            });

            const result = await tracker.sendEvent(eventData);
            expect(result.events_received).toBe(1);
        });
    });
});
