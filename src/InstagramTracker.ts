/**
 * Instagram Tracking SDK
 *
 * Instagram uses the same Facebook/Meta Pixel and Conversion API infrastructure
 * but with Instagram-specific parameters and tracking patterns.
 *
 * This tracker extends the existing Meta tracking capabilities with
 * Instagram-specific features and optimizations.
 */

import { MetaPixelTracker } from './MetaPixelTracker';
import { MetaConversionTracker } from './MetaConversionTracker';

// Instagram-specific event types
export interface InstagramEngagementData {
    contentType?: 'photo' | 'video' | 'carousel' | 'story' | 'reel' | 'igtv';
    contentId?: string;
    contentName?: string;
    contentCategory?: string;
    creatorId?: string;
    creatorName?: string;
    hashtags?: string[];
    location?: string;
    duration?: number; // For video content
    isSponsored?: boolean;
    campaignId?: string;
}

export interface InstagramShoppingData {
    productId: string;
    productName?: string;
    price: number;
    currency?: string;
    category?: string;
    brand?: string;
    availability?: 'in_stock' | 'out_of_stock' | 'preorder';
    imageUrl?: string;
    productUrl?: string;
    merchantId?: string;
    catalogId?: string;
    isFromShop?: boolean;
    shoppingSource?: 'feed' | 'story' | 'explore' | 'search' | 'profile';
}

export interface InstagramUserData {
    userId?: string;
    username?: string;
    isFollower?: boolean;
    followersCount?: number;
    accountType?: 'personal' | 'business' | 'creator';
    verificationStatus?: 'verified' | 'unverified';
    interests?: string[];
    demographics?: {
        age?: number;
        gender?: 'male' | 'female' | 'other';
        location?: string;
        language?: string;
    };
}

export interface InstagramConfig {
    pixelId: string;
    accessToken?: string; // For server-side tracking
    debug?: boolean;
    instagramAppId?: string; // Optional Instagram app ID
    enableInstagramAPI?: boolean; // Enable Instagram Basic Display API integration
    defaultCurrency?: string;
    testEventCode?: string;
}

export class InstagramTracker {
    private pixelTracker: MetaPixelTracker;
    private conversionTracker?: MetaConversionTracker;
    private config: InstagramConfig;

    constructor(config: InstagramConfig) {
        this.config = {
            debug: false,
            enableInstagramAPI: false,
            defaultCurrency: 'USD',
            ...config,
        };

        // Initialize Meta Pixel tracker with Instagram-specific settings
        const pixelConfig: any = {
            pixelId: config.pixelId,
            debug: this.config.debug || false,
        };
        if (config.testEventCode) {
            pixelConfig.testEventCode = config.testEventCode;
        }
        this.pixelTracker = new MetaPixelTracker(pixelConfig);

        // Initialize Conversion API tracker if access token provided
        if (config.accessToken) {
            const conversionConfig: any = {
                accessToken: config.accessToken,
                pixelId: config.pixelId,
                debug: this.config.debug || false,
            };
            if (config.testEventCode) {
                conversionConfig.testEventCode = config.testEventCode;
            }
            this.conversionTracker = new MetaConversionTracker(conversionConfig);
        }
    }

    /**
     * Initialize Instagram tracking
     */
    public init(): void {
        this.pixelTracker.init();

        if (this.config.debug) {
            console.log('Instagram Tracker initialized:', {
                pixelId: this.config.pixelId,
                hasConversionAPI: !!this.conversionTracker,
                instagramAPIEnabled: this.config.enableInstagramAPI,
            });
        }

        // Set Instagram-specific parameters
        this.setInstagramContext();
    }

    /**
     * Set Instagram-specific context for tracking
     */
    private setInstagramContext(): void {
        if (typeof window !== 'undefined') {
            // Set Instagram-specific parameters in dataLayer or fbq
            if (window.fbq) {
                window.fbq('set', 'agent', 'instagram-tracker-v1.0');

                // Add Instagram app ID if provided
                if (this.config.instagramAppId) {
                    window.fbq('set', 'appId', this.config.instagramAppId);
                }
            }
        }
    }

    /**
     * Track Instagram content engagement
     */
    public trackContentEngagement(
        action: 'like' | 'comment' | 'share' | 'save' | 'view' | 'click',
        data: InstagramEngagementData = {},
    ): void {
        const eventData = {
            content_type: data.contentType || 'photo',
            content_ids: data.contentId ? [data.contentId] : [],
            content_name: data.contentName,
            content_category: data.contentCategory,
            custom_data: {
                engagement_action: action,
                creator_id: data.creatorId,
                creator_name: data.creatorName,
                hashtags: data.hashtags,
                location: data.location,
                duration: data.duration,
                is_sponsored: data.isSponsored,
                campaign_id: data.campaignId,
                platform: 'instagram',
            },
        };

        // Track on client-side - using existing trackEvent method
        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram Story interaction
     */
    public trackStoryInteraction(
        action: 'view' | 'tap_next' | 'tap_back' | 'tap_exit' | 'swipe_up' | 'reply',
        data: InstagramEngagementData = {},
    ): void {
        const eventData = {
            content_type: 'story',
            content_ids: data.contentId ? [data.contentId] : [],
            custom_data: {
                story_action: action,
                creator_id: data.creatorId,
                duration: data.duration,
                is_sponsored: data.isSponsored,
                platform: 'instagram',
                content_format: 'story',
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram Story ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram Reels interaction
     */
    public trackReelsInteraction(
        action: 'view' | 'like' | 'comment' | 'share' | 'save' | 'follow',
        data: InstagramEngagementData = {},
    ): void {
        const eventData = {
            content_type: 'reel',
            content_ids: data.contentId ? [data.contentId] : [],
            custom_data: {
                reels_action: action,
                creator_id: data.creatorId,
                duration: data.duration,
                hashtags: data.hashtags,
                platform: 'instagram',
                content_format: 'reel',
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram Reels ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram Shopping events
     */
    public trackShoppingEvent(
        action: 'product_view' | 'add_to_cart' | 'add_to_wishlist' | 'purchase' | 'shop_visit',
        data: InstagramShoppingData,
    ): void {
        // Map to proper ProductData format for existing methods
        const productData = {
            id: data.productId,
            name: data.productName || data.productId,
            price: data.price,
            currency: data.currency || this.config.defaultCurrency || 'USD',
            category: data.category || 'general',
            brand: data.brand || 'unknown',
            quantity: 1,
        };

        // Map to standard Facebook events when applicable
        switch (action) {
            case 'product_view':
                this.pixelTracker.trackProductView(productData);
                break;
            case 'add_to_cart':
                this.pixelTracker.trackAddToCart(productData);
                break;
            case 'add_to_wishlist':
                this.pixelTracker.trackAddToWishlist(productData);
                break;
            case 'purchase': {
                // Create proper purchase data structure
                const purchaseData = {
                    orderId: `ig_order_${Date.now()}`,
                    value: data.price,
                    currency: data.currency || this.config.defaultCurrency || 'USD',
                    products: [productData],
                };
                this.pixelTracker.trackPurchase(purchaseData);
                break;
            }
            default:
                // For other actions, use generic tracking
                this.pixelTracker.trackEvent('ViewContent', {
                    content_type: 'product',
                    content_ids: [data.productId],
                    value: data.price,
                    currency: data.currency || this.config.defaultCurrency,
                });
        }

        if (this.config.debug) {
            console.log(`Instagram Shopping ${action} tracked:`, data);
        }
    }

    /**
     * Track Instagram user follow/unfollow
     */
    public trackFollowAction(
        action: 'follow' | 'unfollow',
        targetUser: {
            userId?: string;
            username?: string;
            accountType?: 'personal' | 'business' | 'creator';
        },
    ): void {
        const eventData = {
            custom_data: {
                follow_action: action,
                target_user_id: targetUser.userId,
                target_username: targetUser.username,
                target_account_type: targetUser.accountType,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackEvent('Lead', eventData);

        if (this.config.debug) {
            console.log(`Instagram ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram search
     */
    public trackSearch(searchTerm: string, searchType: 'hashtag' | 'user' | 'place' | 'general' = 'general'): void {
        const searchData = {
            searchTerm: searchTerm,
            custom_data: {
                search_type: searchType,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackSearch(searchData);

        if (this.config.debug) {
            console.log('Instagram search tracked:', searchData);
        }
    }

    /**
     * Track Instagram Live interaction
     */
    public trackLiveInteraction(
        action: 'start_watching' | 'stop_watching' | 'comment' | 'like' | 'share',
        data: {
            liveId?: string;
            creatorId?: string;
            viewerCount?: number;
            duration?: number;
        } = {},
    ): void {
        const eventData = {
            content_type: 'live_video',
            content_ids: data.liveId ? [data.liveId] : [],
            custom_data: {
                live_action: action,
                creator_id: data.creatorId,
                viewer_count: data.viewerCount,
                duration: data.duration,
                platform: 'instagram',
                content_format: 'live',
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram Live ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram ad interaction
     */
    public trackAdInteraction(
        action: 'view' | 'click' | 'like' | 'comment' | 'share' | 'save' | 'hide',
        adData: {
            adId?: string;
            campaignId?: string;
            adSetId?: string;
            adType?: 'photo' | 'video' | 'carousel' | 'story' | 'reel';
            placementType?: 'feed' | 'story' | 'explore' | 'reel';
        } = {},
    ): void {
        const eventData = {
            content_type: adData.adType || 'ad',
            content_ids: adData.adId ? [adData.adId] : [],
            custom_data: {
                ad_action: action,
                campaign_id: adData.campaignId,
                ad_set_id: adData.adSetId,
                ad_type: adData.adType,
                placement_type: adData.placementType,
                platform: 'instagram',
                is_ad: true,
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram Ad ${action} tracked:`, eventData);
        }
    }

    /**
     * Set Instagram user context
     */
    public setUserContext(userData: InstagramUserData): void {
        const contextData = {
            custom_data: {
                instagram_user_id: userData.userId,
                instagram_username: userData.username,
                is_follower: userData.isFollower,
                followers_count: userData.followersCount,
                account_type: userData.accountType,
                verification_status: userData.verificationStatus,
                interests: userData.interests,
                demographics: userData.demographics,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackEvent('Lead', contextData);

        if (this.config.debug) {
            console.log('Instagram user context set:', contextData);
        }
    }

    /**
     * Track Instagram profile visit
     */
    public trackProfileVisit(profileData: {
        userId?: string;
        username?: string;
        accountType?: 'personal' | 'business' | 'creator';
        isOwn?: boolean;
    }): void {
        const eventData = {
            content_type: 'profile',
            custom_data: {
                visited_user_id: profileData.userId,
                visited_username: profileData.username,
                visited_account_type: profileData.accountType,
                is_own_profile: profileData.isOwn,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log('Instagram profile visit tracked:', eventData);
        }
    }

    /**
     * Track Instagram hashtag interaction
     */
    public trackHashtagInteraction(action: 'view' | 'follow' | 'unfollow', hashtag: string): void {
        const eventData = {
            content_type: 'hashtag',
            custom_data: {
                hashtag_action: action,
                hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackEvent('ViewContent', eventData);

        if (this.config.debug) {
            console.log(`Instagram hashtag ${action} tracked:`, eventData);
        }
    }

    /**
     * Track Instagram direct message interaction
     */
    public trackDirectMessage(
        action: 'send' | 'receive' | 'read' | 'react',
        messageData: {
            conversationId?: string;
            messageType?: 'text' | 'photo' | 'video' | 'voice' | 'story_reply';
            isGroupMessage?: boolean;
        } = {},
    ): void {
        const eventData = {
            content_type: 'message',
            custom_data: {
                message_action: action,
                conversation_id: messageData.conversationId,
                message_type: messageData.messageType,
                is_group_message: messageData.isGroupMessage,
                platform: 'instagram',
            },
        };

        this.pixelTracker.trackEvent('Lead', eventData);

        if (this.config.debug) {
            console.log(`Instagram DM ${action} tracked:`, eventData);
        }
    }

    /**
     * Get configuration
     */
    public getConfig(): InstagramConfig {
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    public updateConfig(newConfig: Partial<InstagramConfig>): void {
        this.config = { ...this.config, ...newConfig };

        // Update underlying trackers
        if (this.config.debug !== undefined) {
            this.pixelTracker.updateConfig({
                debug: this.config.debug,
            });

            if (this.conversionTracker) {
                this.conversionTracker.updateConfig({
                    debug: this.config.debug,
                });
            }
        }
    }

    /**
     * Check if tracker is ready
     */
    public isReady(): boolean {
        return this.pixelTracker.isReady();
    }

    /**
     * Get Instagram-specific recommendations based on account type
     */
    public getRecommendedEvents(accountType: 'personal' | 'business' | 'creator' = 'personal'): string[] {
        const baseEvents = [
            'instagram_content_view',
            'instagram_like',
            'instagram_follow',
            'instagram_profile_visit',
            'instagram_search',
        ];

        const businessEvents = [
            'instagram_product_view',
            'instagram_add_to_cart',
            'instagram_purchase',
            'instagram_shop_visit',
            'instagram_ad_interaction',
        ];

        const creatorEvents = [
            'instagram_story_interaction',
            'instagram_reels_interaction',
            'instagram_live_interaction',
            'instagram_content_engagement',
        ];

        switch (accountType) {
            case 'business':
                return [...baseEvents, ...businessEvents];
            case 'creator':
                return [...baseEvents, ...creatorEvents];
            default:
                return baseEvents;
        }
    }

    /**
     * Debug Instagram tracking data
     */
    public debugInstagramData(): void {
        if (this.config.debug) {
            console.group('Instagram Tracker Debug Info');
            console.log('Configuration:', this.config);
            console.log('Pixel Tracker Ready:', this.pixelTracker.isReady());
            console.log('Conversion Tracker Available:', !!this.conversionTracker);

            if (typeof window !== 'undefined' && window.dataLayer) {
                console.log(
                    'Instagram DataLayer Events:',
                    window.dataLayer.filter(
                        (item: Record<string, unknown>) =>
                            item.event && typeof item.event === 'string' && item.event.includes('instagram'),
                    ),
                );
            }
            console.groupEnd();
        }
    }
}

// Instagram-specific helper functions
export const InstagramHelpers = {
    /**
     * Extract hashtags from text
     */
    extractHashtags(text: string): string[] {
        const hashtagRegex = /#[\w]+/g;
        const matches = text.match(hashtagRegex);
        return matches || [];
    },

    /**
     * Extract mentions from text
     */
    extractMentions(text: string): string[] {
        const mentionRegex = /@[\w]+/g;
        const matches = text.match(mentionRegex);
        return matches ? matches.map((mention) => mention.slice(1)) : [];
    },

    /**
     * Format Instagram currency for different regions
     */
    formatCurrency(amount: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    },

    /**
     * Generate Instagram event ID
     */
    generateEventId(prefix: string = 'ig'): string {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Validate Instagram username
     */
    isValidUsername(username: string): boolean {
        const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
        return usernameRegex.test(username);
    },

    /**
     * Get Instagram content type from URL
     */
    getContentTypeFromUrl(url: string): InstagramEngagementData['contentType'] {
        if (url.includes('/p/')) return 'photo';
        if (url.includes('/reel/')) return 'reel';
        if (url.includes('/tv/')) return 'igtv';
        if (url.includes('/stories/')) return 'story';
        return 'photo';
    },
};
