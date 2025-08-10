/**
 * Instagram Tracking Examples
 *
 * This file demonstrates how to use the InstagramTracker for various
 * Instagram-specific events and interactions.
 */

import { InstagramTracker, InstagramHelpers } from '../src/InstagramTracker';

// Initialize Instagram Tracker
const instagramTracker = new InstagramTracker({
    pixelId: 'YOUR_PIXEL_ID',
    accessToken: 'YOUR_ACCESS_TOKEN', // Optional for server-side tracking
    debug: true,
    defaultCurrency: 'BDT', // Bangladesh Taka
});

// Initialize the tracker
instagramTracker.init();

console.log('=== Instagram Tracker Examples ===\n');

// Example 1: Basic Content Engagement
console.log('1. Content Engagement Examples:');

// Track Instagram post like
instagramTracker.trackContentEngagement('like', {
    contentType: 'photo',
    contentId: 'post_123456',
    contentName: 'Beautiful Sunset Photo',
    creatorId: 'photographer_bd',
    hashtags: ['#sunset', '#bangladesh', '#photography'],
    location: "Cox's Bazar, Bangladesh",
});

// Track Instagram comment
instagramTracker.trackContentEngagement('comment', {
    contentType: 'video',
    contentId: 'video_789012',
    contentName: 'Cooking Tutorial',
    creatorId: 'chef_dhaka',
    duration: 120, // 2 minutes
    hashtags: ['#cooking', '#bangladeshi', '#recipe'],
});

// Track Instagram share
instagramTracker.trackContentEngagement('share', {
    contentType: 'carousel',
    contentId: 'carousel_345678',
    contentName: 'Bangladesh Travel Guide',
    creatorId: 'travel_bd',
    hashtags: ['#travel', '#bangladesh', '#tourism'],
});

// Example 2: Instagram Stories
console.log('\n2. Instagram Stories Examples:');

// Track story view
instagramTracker.trackStoryInteraction('view', {
    contentId: 'story_111222',
    creatorId: 'fashion_dhaka',
    duration: 15,
    isSponsored: false,
});

// Track story swipe up (link click)
instagramTracker.trackStoryInteraction('swipe_up', {
    contentId: 'story_333444',
    creatorId: 'shop_bd',
    isSponsored: true,
    campaignId: 'campaign_123',
});

// Track story reply
instagramTracker.trackStoryInteraction('reply', {
    contentId: 'story_555666',
    creatorId: 'friend_chittagong',
});

// Example 3: Instagram Reels
console.log('\n3. Instagram Reels Examples:');

// Track reels view
instagramTracker.trackReelsInteraction('view', {
    contentId: 'reel_777888',
    creatorId: 'comedian_bd',
    duration: 30,
    hashtags: ['#funny', '#bangladesh', '#comedy'],
});

// Track reels like and follow
instagramTracker.trackReelsInteraction('like', {
    contentId: 'reel_999000',
    creatorId: 'musician_bd',
    hashtags: ['#music', '#bengali', '#song'],
});

instagramTracker.trackReelsInteraction('follow', {
    contentId: 'reel_111333',
    creatorId: 'dancer_sylhet',
    hashtags: ['#dance', '#traditional', '#bangladesh'],
});

// Example 4: Instagram Shopping
console.log('\n4. Instagram Shopping Examples:');

// Track product view in Instagram Shop
instagramTracker.trackShoppingEvent('product_view', {
    productId: 'saree_001',
    productName: 'Traditional Bengali Saree',
    price: 2500, // BDT
    currency: 'BDT',
    category: 'Fashion',
    brand: 'Heritage Sarees BD',
    availability: 'in_stock',
    merchantId: 'merchant_dhaka_001',
    isFromShop: true,
    shoppingSource: 'feed',
});

// Track add to cart from Instagram
instagramTracker.trackShoppingEvent('add_to_cart', {
    productId: 'kurta_002',
    productName: "Men's Cotton Kurta",
    price: 800, // BDT
    currency: 'BDT',
    category: "Men's Fashion",
    brand: 'Deshi Wear',
    availability: 'in_stock',
    shoppingSource: 'story',
});

// Track purchase from Instagram
instagramTracker.trackShoppingEvent('purchase', {
    productId: 'jewelry_003',
    productName: 'Gold Plated Necklace',
    price: 1200, // BDT
    currency: 'BDT',
    category: 'Jewelry',
    brand: 'BD Jewelry House',
    merchantId: 'jeweler_bd_001',
    isFromShop: true,
    shoppingSource: 'explore',
});

// Track Instagram shop visit
instagramTracker.trackShoppingEvent('shop_visit', {
    productId: 'shop_main',
    productName: 'BD Fashion Store',
    price: 0,
    currency: 'BDT',
    category: 'Fashion Store',
    merchantId: 'fashion_store_bd',
    isFromShop: true,
    shoppingSource: 'profile',
});

// Example 5: Follow/Unfollow Actions
console.log('\n5. Follow/Unfollow Examples:');

// Track following a business account
instagramTracker.trackFollowAction('follow', {
    userId: 'business_123',
    username: 'shop_bangladesh',
    accountType: 'business',
});

// Track following a creator
instagramTracker.trackFollowAction('follow', {
    userId: 'creator_456',
    username: 'artist_dhaka',
    accountType: 'creator',
});

// Track unfollowing
instagramTracker.trackFollowAction('unfollow', {
    userId: 'user_789',
    username: 'old_friend',
    accountType: 'personal',
});

// Example 6: Instagram Search
console.log('\n6. Search Examples:');

// Search for hashtags
instagramTracker.trackSearch('bangladesh', 'hashtag');
instagramTracker.trackSearch('dhaka', 'place');
instagramTracker.trackSearch('bangladeshi_food', 'hashtag');

// Search for users
instagramTracker.trackSearch('photographer_bd', 'user');

// General search
instagramTracker.trackSearch('traditional saree', 'general');

// Example 7: Instagram Live
console.log('\n7. Instagram Live Examples:');

// Track starting to watch a live video
instagramTracker.trackLiveInteraction('start_watching', {
    liveId: 'live_111',
    creatorId: 'news_bd',
    viewerCount: 1500,
});

// Track commenting on live
instagramTracker.trackLiveInteraction('comment', {
    liveId: 'live_222',
    creatorId: 'cook_bd',
    viewerCount: 800,
});

// Track stopping live watch
instagramTracker.trackLiveInteraction('stop_watching', {
    liveId: 'live_111',
    creatorId: 'news_bd',
    duration: 600, // 10 minutes
});

// Example 8: Instagram Ads
console.log('\n8. Instagram Ads Examples:');

// Track ad view
instagramTracker.trackAdInteraction('view', {
    adId: 'ad_12345',
    campaignId: 'campaign_bd_fashion',
    adType: 'photo',
    placementType: 'feed',
});

// Track ad click
instagramTracker.trackAdInteraction('click', {
    adId: 'ad_67890',
    campaignId: 'campaign_bd_food',
    adType: 'video',
    placementType: 'story',
});

// Track sponsored post interaction
instagramTracker.trackAdInteraction('like', {
    adId: 'sponsored_001',
    campaignId: 'brand_awareness_bd',
    adType: 'carousel',
    placementType: 'explore',
});

// Example 9: User Context
console.log('\n9. User Context Examples:');

// Set Instagram user context
instagramTracker.setUserContext({
    userId: 'user_bd_123',
    username: 'user_dhaka',
    isFollower: true,
    followersCount: 500,
    accountType: 'personal',
    verificationStatus: 'unverified',
    interests: ['photography', 'travel', 'food', 'bangladesh'],
    demographics: {
        age: 25,
        gender: 'female',
        location: 'Dhaka, Bangladesh',
        language: 'bn', // Bengali
    },
});

// Example 10: Profile Visits
console.log('\n10. Profile Visit Examples:');

// Track visiting someone's profile
instagramTracker.trackProfileVisit({
    userId: 'profile_123',
    username: 'celebrity_bd',
    accountType: 'creator',
    isOwn: false,
});

// Track visiting own profile
instagramTracker.trackProfileVisit({
    userId: 'own_profile',
    username: 'my_username',
    accountType: 'personal',
    isOwn: true,
});

// Example 11: Hashtag Interactions
console.log('\n11. Hashtag Interaction Examples:');

// Track viewing hashtag page
instagramTracker.trackHashtagInteraction('view', 'bangladesh');
instagramTracker.trackHashtagInteraction('view', 'dhakacity');

// Track following hashtags
instagramTracker.trackHashtagInteraction('follow', 'bangladeshi_food');
instagramTracker.trackHashtagInteraction('follow', 'bangladesh_tourism');

// Example 12: Direct Messages
console.log('\n12. Direct Message Examples:');

// Track sending DM
instagramTracker.trackDirectMessage('send', {
    conversationId: 'conv_123',
    messageType: 'text',
    isGroupMessage: false,
});

// Track sending photo in DM
instagramTracker.trackDirectMessage('send', {
    conversationId: 'conv_456',
    messageType: 'photo',
    isGroupMessage: true,
});

// Track story reply
instagramTracker.trackDirectMessage('send', {
    conversationId: 'conv_789',
    messageType: 'story_reply',
    isGroupMessage: false,
});

// Example 13: Helper Functions
console.log('\n13. Helper Functions Examples:');

// Extract hashtags from text
const caption = "Beautiful sunset at Cox's Bazar #sunset #bangladesh #travel #photography";
const hashtags = InstagramHelpers.extractHashtags(caption);
console.log('Extracted hashtags:', hashtags);

// Extract mentions
const mentionText = 'Thanks @photographer_bd and @friend_dhaka for the amazing day!';
const mentions = InstagramHelpers.extractMentions(mentionText);
console.log('Extracted mentions:', mentions);

// Format currency
const formattedPrice = InstagramHelpers.formatCurrency(1500, 'BDT');
console.log('Formatted price:', formattedPrice);

// Generate event ID
const eventId = InstagramHelpers.generateEventId('ig_purchase');
console.log('Generated event ID:', eventId);

// Validate username
const isValidUser = InstagramHelpers.isValidUsername('user_bd_123');
console.log('Is valid username:', isValidUser);

// Get content type from URL
const contentType = InstagramHelpers.getContentTypeFromUrl('https://instagram.com/p/ABC123/');
console.log('Content type from URL:', contentType);

// Example 14: Advanced Configuration
console.log('\n14. Advanced Configuration Examples:');

// Update Instagram tracker configuration
instagramTracker.updateConfig({
    debug: false,
    defaultCurrency: 'USD',
    enableInstagramAPI: true,
});

// Check if tracker is ready
console.log('Instagram tracker ready:', instagramTracker.isReady());

// Get configuration
const config = instagramTracker.getConfig();
console.log('Current configuration:', config);

// Get recommended events for different account types
const personalEvents = instagramTracker.getRecommendedEvents('personal');
console.log('Recommended events for personal account:', personalEvents);

const businessEvents = instagramTracker.getRecommendedEvents('business');
console.log('Recommended events for business account:', businessEvents);

const creatorEvents = instagramTracker.getRecommendedEvents('creator');
console.log('Recommended events for creator account:', creatorEvents);

// Debug Instagram data
instagramTracker.debugInstagramData();

// Example 15: Bangladesh-Specific Use Cases
console.log('\n15. Bangladesh-Specific Examples:');

// Track local business interaction
instagramTracker.trackShoppingEvent('product_view', {
    productId: 'rickshaw_art_001',
    productName: 'Hand-painted Rickshaw Art',
    price: 500, // BDT
    currency: 'BDT',
    category: 'Art & Crafts',
    brand: 'Dhaka Art Collective',
    availability: 'in_stock',
    shoppingSource: 'feed',
});

// Track cultural content engagement
instagramTracker.trackContentEngagement('like', {
    contentType: 'video',
    contentId: 'pohela_boishakh_2024',
    contentName: 'Pohela Boishakh Celebration',
    creatorId: 'cultural_bd',
    hashtags: ['#pohela_boishakh', '#bengali_new_year', '#bangladesh', '#culture'],
    location: 'Ramna Batamul, Dhaka',
});

// Track local food content
instagramTracker.trackReelsInteraction('share', {
    contentId: 'reel_biryani_recipe',
    creatorId: 'food_blogger_bd',
    hashtags: ['#biryani', '#bangladeshi_food', '#recipe', '#dhaka'],
});

// Track following local influencer
instagramTracker.trackFollowAction('follow', {
    userId: 'influencer_bd_001',
    username: 'lifestyle_dhaka',
    accountType: 'creator',
});

console.log('\n✅ All Instagram tracking examples completed!');
console.log('📊 Check your Instagram analytics dashboard to see the tracked events.');

// Export examples for use in other files
export { instagramTracker, InstagramHelpers };
