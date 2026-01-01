
export type IntegrationCategory = 'CRM' | 'Analytics' | 'Marketing' | 'Finance' | 'Communication' | 'Productivity' | 'Developer Tools' | 'Security' | 'HR' | 'E-commerce' | 'Data Sync' | 'AI & ML';

export type IntegrationTag = 'popular' | 'new' | 'free' | 'premium' | 'enterprise' | 'data-sync' | 'automation' | 'reporting' | 'notifications' | 'payments' | 'dev-ops';

export interface IntegrationFeature {
    id: string;
    name: string;
    description: string;
    icon?: string;
}

export interface IntegrationCompatibility {
    platform: string;
    version?: string;
    notes?: string;
}

export type IntegrationPricingModel = 'Free' | 'Freemium' | 'Subscription' | 'Per-usage' | 'Enterprise';

export interface IntegrationPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval?: 'month' | 'year' | 'one-time';
    features: string[];
    isTrialAvailable: boolean;
    trialDurationDays?: number;
}

export type IntegrationStatus = 'active' | 'pending-review' | 'rejected' | 'draft' | 'archived';

export type WebhookEvent = 'customer.created' | 'customer.updated' | 'transaction.completed' | 'transaction.failed' | 'invoice.paid' | 'invoice.created' | 'integration.installed' | 'integration.uninstalled';

export interface Integration {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    longDescription: string;
    logoUrl: string;
    bannerUrl?: string;
    category: IntegrationCategory;
    tags: IntegrationTag[];
    developerId: string;
    developerName: string;
    website: string;
    documentationUrl: string;
    supportEmail: string;
    features: IntegrationFeature[];
    compatibility: IntegrationCompatibility[];
    pricingModel: IntegrationPricingModel;
    pricingPlans: IntegrationPlan[];
    averageRating: number;
    totalReviews: number;
    installationCount: number;
    status: IntegrationStatus;
    createdAt: string;
    updatedAt: string;
    setupGuideMarkdown: string;
    apiEndpointsNeeded: string[];
    configSchema?: Record<string, any>;
    webhookEventsSupported?: WebhookEvent[];
    dataSyncCapabilities?: {
        direction: 'inbound' | 'outbound' | 'bidirectional';
        entities: string[];
    };
}

export interface IntegrationInstance {
    id: string;
    integrationId: string;
    userId: string;
    installedAt: string;
    lastSyncedAt?: string;
    status: 'active' | 'disconnected' | 'error';
    configuration: Record<string, any>;
    planId?: string;
    metadata?: Record<string, any>;
}

export interface Review {
    id: string;
    integrationId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    responseFromDeveloper?: {
        developerId: string;
        comment: string;
        createdAt: string;
    };
}

export interface Developer {
    id: string;
    name: string;
    email: string;
    website: string;
    integrations: string[];
    memberSince: string;
    contactPerson: string;
}

export interface APIKey {
    id: string;
    key: string;
    name: string;
    developerId: string;
    createdAt: string;
    expiresAt?: string;
    permissions: string[];
    isActive: boolean;
}

export interface WebhookSubscription {
    id: string;
    developerId: string;
    integrationId?: string;
    callbackUrl: string;
    events: WebhookEvent[];
    secret: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastTriggeredAt?: string;
    failureCount: number;
    status: 'active' | 'inactive' | 'suspended';
}

export interface WebhookLog {
    id: string;
    subscriptionId: string;
    eventId: string;
    eventType: WebhookEvent;
    payload: string;
    statusCode: number;
    responseBody: string;
    attemptedAt: string;
    isSuccess: boolean;
    error?: string;
}

export interface AICodeSnippet {
    id: string;
    name: string;
    language: 'javascript' | 'python' | 'go' | 'ruby' | 'java' | 'curl' | 'shell';
    description: string;
    code: string;
    integrationTarget?: string;
    apiEndpointsUsed: string[];
}

export type ToastMessage = {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
};
