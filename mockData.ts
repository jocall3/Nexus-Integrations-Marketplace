
import { 
    Integration, Developer, IntegrationCategory, IntegrationTag, 
    Review, IntegrationInstance, APIKey, WebhookSubscription, 
    WebhookLog, AICodeSnippet, WebhookEvent 
} from './types';
import { generateUUID } from './utils';

const categories: IntegrationCategory[] = ['CRM', 'Analytics', 'Marketing', 'Finance', 'Communication', 'Productivity', 'Developer Tools', 'Security', 'HR', 'E-commerce', 'Data Sync', 'AI & ML'];
const tags: IntegrationTag[] = ['popular', 'new', 'free', 'premium', 'enterprise', 'data-sync', 'automation', 'reporting', 'notifications', 'payments', 'dev-ops'];
const apiEndpoints: string[] = ['GET /customers', 'POST /customers', 'PUT /customers/{id}', 'GET /transactions', 'POST /transactions', 'GET /accounts/{id}/balance', 'POST /payments', 'GET /invoices', 'POST /webhooks/subscribe', 'GET /webhooks/events'];
const webhookEvents: WebhookEvent[] = ['customer.created', 'customer.updated', 'transaction.completed', 'invoice.paid', 'integration.installed'];

export const mockDevelopers: Developer[] = Array.from({ length: 5 }, (_, i) => ({
    id: generateUUID(),
    name: `Dev Corp ${i + 1}`,
    email: `support@devcorp${i + 1}.com`,
    website: `https://devcorp${i + 1}.com`,
    integrations: [],
    memberSince: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    contactPerson: `Lead Developer ${i + 1}`
}));

export const mockIntegrations: Integration[] = Array.from({ length: 24 }, (_, i) => {
    const dev = mockDevelopers[i % mockDevelopers.length];
    const category = categories[i % categories.length];
    const name = `${category} Suite ${i + 1}`;
    const slug = name.toLowerCase().replace(/\s/g, '-');
    
    return {
        id: generateUUID(),
        name,
        slug,
        shortDescription: `Streamline your ${category.toLowerCase()} workflows with deep Demo Bank integration.`,
        longDescription: `Full feature description for ${name}. This integration provides end-to-end connectivity between your existing ${category.toLowerCase()} tools and our core banking APIs. Automate data entry, synchronize customer profiles, and generate real-time financial reports without leaving your dashboard.`,
        logoUrl: `https://picsum.photos/seed/${slug}/200/200`,
        bannerUrl: `https://picsum.photos/seed/${slug}banner/1200/400`,
        category,
        tags: [tags[i % tags.length], 'popular'],
        developerId: dev.id,
        developerName: dev.name,
        website: dev.website,
        documentationUrl: `${dev.website}/docs`,
        supportEmail: dev.email,
        features: [
            { id: generateUUID(), name: 'Live Sync', description: 'Instant synchronization of all core entities.' },
            { id: generateUUID(), name: 'Audit Logging', description: 'Comprehensive logs of every API interaction.' }
        ],
        compatibility: [{ platform: 'Web', version: '2.0' }],
        pricingModel: 'Freemium',
        pricingPlans: [
            { id: generateUUID(), name: 'Starter', description: 'Good for small teams.', price: 0, currency: 'USD', features: ['Basic Sync', '5 Users'], isTrialAvailable: false },
            { id: generateUUID(), name: 'Business', description: 'Advanced features.', price: 49, currency: 'USD', interval: 'month', features: ['Advanced Analytics', 'Unlimited Users', 'Priority Support'], isTrialAvailable: true, trialDurationDays: 14 }
        ],
        averageRating: 3.5 + (Math.random() * 1.5),
        totalReviews: Math.floor(Math.random() * 500) + 12,
        installationCount: Math.floor(Math.random() * 10000) + 100,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        setupGuideMarkdown: `# Setup Guide\n1. Generate an API Key\n2. Configure the sync interval\n3. Start the service.`,
        apiEndpointsNeeded: [apiEndpoints[0], apiEndpoints[1]]
    };
});

export const mockReviews: Review[] = mockIntegrations.flatMap(integration => 
    Array.from({ length: 3 }, (_, i) => ({
        id: generateUUID(),
        integrationId: integration.id,
        userId: generateUUID(),
        userName: `User ${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 4,
        title: 'Excellent Integration',
        comment: 'Worked seamlessly with our existing infrastructure. Highly recommend for any enterprise looking to automate financial data.',
        createdAt: new Date().toISOString()
    }))
);

export const mockCodeSnippets: AICodeSnippet[] = [
    {
        id: generateUUID(),
        name: 'Basic Auth Example',
        language: 'javascript',
        description: 'How to authenticate against our banking APIs.',
        code: `const fetch = require('node-fetch');\n\nasync function getBalance(accId) {\n  const res = await fetch(\`https://api.demobank.com/accounts/\${accId}/balance\`, {\n    headers: { 'Authorization': 'Bearer YOUR_KEY' }\n  });\n  return res.json();\n}`,
        apiEndpointsUsed: ['GET /accounts/{id}/balance']
    },
    {
        id: generateUUID(),
        name: 'Python Transaction Sync',
        language: 'python',
        description: 'Syncing transactions with a local database.',
        code: `import requests\n\ndef sync_transactions():\n    headers = {"Authorization": "Bearer YOUR_KEY"}\n    r = requests.get("https://api.demobank.com/transactions", headers=headers)\n    for txn in r.json():\n        process_transaction(txn)`,
        apiEndpointsUsed: ['GET /transactions']
    }
];
