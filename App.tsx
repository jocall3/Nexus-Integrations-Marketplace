
import React, { useState, useMemo, useCallback } from 'react';
import { Integration, IntegrationInstance, APIKey, WebhookSubscription, ToastMessage } from './types';
import { mockIntegrations, mockReviews, mockCodeSnippets, mockDevelopers } from './mockData';
import { Card, Modal, Spinner, Toast, Badge } from './components/Common';
import { IntegrationCard, IntegrationDetails } from './components/Marketplace';
import { APIKeyManager, WebhookManager, CodeLibrary } from './components/DeveloperPortal';
import { generateUUID } from './utils';
import { generateIntegrationPlan } from './services/geminiService';

const App: React.FC = () => {
    // Navigation State
    const [view, setView] = useState<'marketplace' | 'developer' | 'settings'>('marketplace');
    
    // Data State
    const [integrations] = useState<Integration[]>(mockIntegrations);
    const [instances, setInstances] = useState<IntegrationInstance[]>([]);
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [webhookSubs] = useState<WebhookSubscription[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');

    // UI State
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [isIdeatorOpen, setIsIdeatorOpen] = useState(false);
    const [ideatorPrompt, setIdeatorPrompt] = useState('');
    const [ideatorResult, setIdeatorResult] = useState('');
    const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
    const [toast, setToast] = useState<Omit<ToastMessage, 'id'> | null>(null);

    // Derived State
    const filteredIntegrations = useMemo(() => {
        return integrations.filter(i => {
            const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                                 i.shortDescription.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [integrations, search, categoryFilter]);

    const categories = Array.from(new Set(integrations.map(i => i.category)));

    // Actions
    const handleInstall = (integration: Integration, planId?: string) => {
        const newInstance: IntegrationInstance = {
            id: generateUUID(),
            integrationId: integration.id,
            userId: 'current-user-id',
            installedAt: new Date().toISOString(),
            status: 'active',
            configuration: {},
            planId
        };
        setInstances([...instances, newInstance]);
        setSelectedIntegration(null);
        setToast({ type: 'success', message: `${integration.name} installed successfully!` });
    };

    const handleDisconnect = (integrationId: string) => {
        setInstances(instances.filter(i => i.integrationId !== integrationId));
        setSelectedIntegration(null);
        setToast({ type: 'info', message: 'Integration disconnected.' });
    };

    const addApiKey = (name: string) => {
        const newKey: APIKey = {
            id: generateUUID(),
            key: `nk_${generateUUID().replace(/-/g, '')}`,
            name,
            developerId: 'dev-1',
            createdAt: new Date().toISOString(),
            isActive: true,
            permissions: ['read_banking', 'manage_webhooks']
        };
        setApiKeys([newKey, ...apiKeys]);
        setToast({ type: 'success', message: 'Production API Key generated.' });
    };

    const handleGenerateIdea = async () => {
        setIsGeneratingIdea(true);
        setIdeatorResult('');
        try {
            const plan = await generateIntegrationPlan(ideatorPrompt);
            setIdeatorResult(plan);
        } catch (e: any) {
            setToast({ type: 'error', message: e.message });
        } finally {
            setIsGeneratingIdea(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('marketplace')}>
                        <div className="bg-cyan-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/20">
                            <i className="fa-solid fa-layer-group text-xl"></i>
                        </div>
                        <h1 className="text-xl font-extrabold text-white tracking-tight">Nexus <span className="text-cyan-500">Integrations</span></h1>
                    </div>

                    <nav className="hidden md:flex items-center space-x-2">
                        <button 
                            onClick={() => setView('marketplace')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'marketplace' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-store mr-2"></i> Marketplace
                        </button>
                        <button 
                            onClick={() => setView('developer')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'developer' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-terminal mr-2"></i> Developer Portal
                        </button>
                        <button 
                            onClick={() => setIsIdeatorOpen(true)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all ml-4"
                        >
                            <i className="fa-solid fa-wand-sparkles mr-2"></i> AI Ideator
                        </button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
                {view === 'marketplace' && (
                    <div className="space-y-10">
                        {/* Hero / Filter Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">Discovery Hub</h2>
                                <p className="text-slate-400">Connect your banking data to 500+ ecosystem partners.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Search apps..." 
                                        className="bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 w-full sm:w-64"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Integration Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredIntegrations.map(i => (
                                <IntegrationCard 
                                    key={i.id} 
                                    integration={i} 
                                    isInstalled={instances.some(inst => inst.integrationId === i.id)}
                                    onView={setSelectedIntegration} 
                                />
                            ))}
                        </div>
                    </div>
                )}

                {view === 'developer' && (
                    <div className="space-y-10">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">Build & Extend</h2>
                                <p className="text-slate-400">Manage your private developer ecosystem and API access.</p>
                            </div>
                            <Badge color="bg-cyan-900 text-cyan-300">Sandbox Environment</Badge>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 space-y-8">
                                <APIKeyManager 
                                    keys={apiKeys} 
                                    onAdd={addApiKey} 
                                    onDelete={(id) => setApiKeys(apiKeys.filter(k => k.id !== id))} 
                                />
                                <WebhookManager subs={webhookSubs} />
                            </div>
                            <div>
                                <Card title="Quick Resources">
                                    <ul className="space-y-4">
                                        <li>
                                            <a href="#" className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mr-3 border border-slate-700 group-hover:border-cyan-500 transition-colors">
                                                    <i className="fa-solid fa-book text-slate-400 group-hover:text-cyan-400"></i>
                                                </div>
                                                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">API Reference</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mr-3 border border-slate-700 group-hover:border-cyan-500 transition-colors">
                                                    <i className="fa-solid fa-circle-question text-slate-400 group-hover:text-cyan-400"></i>
                                                </div>
                                                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">Integration Guides</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mr-3 border border-slate-700 group-hover:border-cyan-500 transition-colors">
                                                    <i className="fa-solid fa-shield-halved text-slate-400 group-hover:text-cyan-400"></i>
                                                </div>
                                                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">Security Sandbox</span>
                                            </a>
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">AI Generated Blueprints</h3>
                            <CodeLibrary snippets={mockCodeSnippets} />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-500 text-sm">
                        © 2024 Nexus Enterprise. All rights reserved. Built for high-performance finance teams.
                    </div>
                    <div className="flex space-x-6 text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <Modal 
                isOpen={!!selectedIntegration} 
                onClose={() => setSelectedIntegration(null)} 
                title={selectedIntegration?.name || ''}
                size="full"
            >
                {selectedIntegration && (
                    <IntegrationDetails 
                        integration={selectedIntegration}
                        isInstalled={instances.some(i => i.integrationId === selectedIntegration.id)}
                        reviews={mockReviews.filter(r => r.integrationId === selectedIntegration.id)}
                        onInstall={(planId) => handleInstall(selectedIntegration, planId)}
                        onDisconnect={() => handleDisconnect(selectedIntegration.id)}
                    />
                )}
            </Modal>

            <Modal 
                isOpen={isIdeatorOpen} 
                onClose={() => setIsIdeatorOpen(false)} 
                title="AI Integration Ideator"
                size="md"
            >
                <div className="space-y-6">
                    <p className="text-slate-400 text-sm">Describe the problem you're trying to solve, and our AI will architect a technical blueprint for a new integration.</p>
                    <div>
                        <textarea 
                            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="e.g. Syncing my real estate portfolio's monthly rental income with a Slack reporting channel..."
                            value={ideatorPrompt}
                            onChange={(e) => setIdeatorPrompt(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleGenerateIdea}
                        disabled={isGeneratingIdea || !ideatorPrompt}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {isGeneratingIdea ? <Spinner size="sm" /> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        <span>{isGeneratingIdea ? 'Architecting Plan...' : 'Generate Technical Plan'}</span>
                    </button>

                    {ideatorResult && (
                        <div className="mt-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                            <h4 className="text-cyan-400 font-bold mb-4 flex items-center">
                                <i className="fa-solid fa-robot mr-2"></i> Technical Blueprint
                            </h4>
                            <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed custom-scrollbar max-h-96 overflow-y-auto pr-4">
                                {ideatorResult}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
};

export default App;
