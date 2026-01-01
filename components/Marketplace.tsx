
import React, { useState } from 'react';
import { Integration, IntegrationInstance, Review } from '../types';
import { Card, Badge, Modal, Spinner } from './Common';
import { formatDate } from '../utils';

export const IntegrationCard: React.FC<{ 
    integration: Integration; 
    onView: (i: Integration) => void;
    isInstalled: boolean;
}> = ({ integration, onView, isInstalled }) => (
    <Card className="hover:scale-[1.02] transition-transform cursor-pointer group" onClick={() => onView(integration)}>
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
                <img src={integration.logoUrl} alt={integration.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-500 transition-colors" />
                {isInstalled && (
                    <div className="absolute -top-1 -right-1 bg-cyan-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-lg border-2 border-slate-800">
                        <i className="fa-solid fa-check"></i>
                    </div>
                )}
            </div>
            <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{integration.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{integration.shortDescription}</p>
            
            <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center text-yellow-500 text-xs">
                    <i className="fa-solid fa-star mr-1"></i>
                    <span>{integration.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500 text-xs">{integration.installationCount.toLocaleString()} installs</span>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
                <Badge color="bg-cyan-950 text-cyan-400 border border-cyan-800/50">{integration.category}</Badge>
                {integration.tags.slice(0, 1).map(tag => (
                    <Badge key={tag} color="bg-slate-700 text-slate-300">{tag}</Badge>
                ))}
            </div>
        </div>
    </Card>
);

export const IntegrationDetails: React.FC<{
    integration: Integration;
    isInstalled: boolean;
    reviews: Review[];
    onInstall: (planId?: string) => void;
    onDisconnect: () => void;
}> = ({ integration, isInstalled, reviews, onInstall, onDisconnect }) => {
    const [tab, setTab] = useState<'overview' | 'features' | 'reviews'>('overview');
    const [selectedPlan, setSelectedPlan] = useState(integration.pricingPlans[0]?.id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-700">
                    <img src={integration.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>

                <div className="flex border-b border-slate-700">
                    {(['overview', 'features', 'reviews'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-4 font-bold text-sm capitalize transition-all border-b-2 ${tab === t ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="py-4">
                    {tab === 'overview' && (
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-white">About this Integration</h2>
                            <p className="text-slate-300 leading-relaxed">{integration.longDescription}</p>
                            <h3 className="text-white mt-6">Developer Details</h3>
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                    <i className="fa-solid fa-code text-cyan-400"></i>
                                </div>
                                <div>
                                    <p className="text-white font-bold">{integration.developerName}</p>
                                    <p className="text-slate-400 text-sm">Official Marketplace Partner</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'features' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {integration.features.map(f => (
                                <div key={f.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <h4 className="text-white font-bold mb-1">{f.name}</h4>
                                    <p className="text-slate-400 text-sm">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'reviews' && (
                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <p className="text-slate-500 italic">No reviews yet for this integration.</p>
                            ) : (
                                reviews.map(r => (
                                    <div key={r.id} className="border-b border-slate-800 pb-6 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-white font-bold">{r.title}</h4>
                                                <div className="flex text-yellow-500 text-xs mt-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <i key={i} className={`${i < r.rating ? 'fa-solid' : 'fa-regular'} fa-star mr-0.5`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-slate-500 text-xs">{formatDate(r.createdAt)}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm italic">"{r.comment}"</p>
                                        <p className="text-slate-500 text-xs mt-2">— {r.userName}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <Card title="Installation Settings">
                    {isInstalled ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center p-6 bg-emerald-950/20 border border-emerald-900/50 rounded-xl">
                                <div className="text-center">
                                    <i className="fa-solid fa-circle-check text-emerald-500 text-4xl mb-2"></i>
                                    <p className="text-emerald-400 font-bold">Currently Active</p>
                                </div>
                            </div>
                            <button 
                                onClick={onDisconnect}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Choose Plan</label>
                                <div className="space-y-2">
                                    {integration.pricingPlans.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlan(p.id)}
                                            className={`w-full p-4 rounded-xl border flex justify-between items-center text-left transition-all ${selectedPlan === p.id ? 'bg-cyan-950/30 border-cyan-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                                        >
                                            <div>
                                                <p className={`font-bold ${selectedPlan === p.id ? 'text-cyan-400' : 'text-white'}`}>{p.name}</p>
                                                <p className="text-slate-500 text-xs line-clamp-1">{p.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold text-lg">{p.price === 0 ? 'Free' : `$${p.price}`}</p>
                                                <p className="text-slate-500 text-[10px] uppercase">{p.interval || 'one-time'}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={() => onInstall(selectedPlan)}
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-cyan-900/20 transition-all hover:scale-[1.02]"
                            >
                                Complete Installation
                            </button>
                        </div>
                    )}
                </Card>

                <Card title="Developer Specs">
                    <ul className="space-y-4 text-xs">
                        <li className="flex justify-between border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400">Version</span>
                            <span className="text-white font-mono">v1.2.4-stable</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400">Last Update</span>
                            <span className="text-white">2 days ago</span>
                        </li>
                        <li className="flex flex-col space-y-2 pt-2">
                            <span className="text-slate-400">Required Permissions</span>
                            <div className="flex flex-wrap gap-1">
                                <Badge color="bg-indigo-950 text-indigo-300">Read Transactions</Badge>
                                <Badge color="bg-indigo-950 text-indigo-300">View Accounts</Badge>
                                <Badge color="bg-indigo-950 text-indigo-300">Manage Invoices</Badge>
                            </div>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};
