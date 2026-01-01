
import React, { useState } from 'react';
import { APIKey, WebhookSubscription, AICodeSnippet } from '../types';
import { Card, Badge, Spinner } from './Common';
import { formatDate, generateUUID } from '../utils';

export const APIKeyManager: React.FC<{ keys: APIKey[], onAdd: (name: string) => void, onDelete: (id: string) => void }> = ({ keys, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    
    return (
        <Card title="Production API Keys">
            <div className="mb-8 flex gap-3">
                <input 
                    type="text" 
                    placeholder="New key name (e.g. Analytics Prod)" 
                    className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button 
                    onClick={() => { onAdd(name); setName(''); }}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap"
                >
                    Create Key
                </button>
            </div>

            <div className="space-y-4">
                {keys.map(k => (
                    <div key={k.id} className="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex justify-between items-center group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                <i className="fa-solid fa-key text-cyan-400"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{k.name}</h4>
                                <p className="text-slate-500 text-xs font-mono">{k.key.substring(0, 12)}••••••••••••••••</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right mr-4 hidden sm:block">
                                <p className="text-slate-500 text-[10px] uppercase font-bold">Created</p>
                                <p className="text-slate-300 text-xs">{formatDate(k.createdAt)}</p>
                            </div>
                            <button 
                                onClick={() => onDelete(k.id)}
                                className="text-slate-500 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const WebhookManager: React.FC<{ subs: WebhookSubscription[] }> = ({ subs }) => (
    <Card title="Active Webhook Endpoints">
        <div className="space-y-4">
            {subs.map(s => (
                <div key={s.id} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h4 className="text-white font-bold">{s.callbackUrl}</h4>
                            <Badge color={s.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}>{s.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {s.events.map(ev => (
                                <span key={ev} className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">{ev}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <div className="text-right">
                            <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Success Rate</p>
                            <p className="text-emerald-400 font-bold">98.2%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Avg Latency</p>
                            <p className="text-white font-bold">142ms</p>
                        </div>
                        <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 w-10 h-10 rounded-xl transition-colors">
                            <i className="fa-solid fa-gear"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

export const CodeLibrary: React.FC<{ snippets: AICodeSnippet[] }> = ({ snippets }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {snippets.map(s => (
                <Card key={s.id} title={s.name} action={<Badge color="bg-indigo-900 text-indigo-200">{s.language}</Badge>}>
                    <p className="text-slate-400 text-sm mb-4">{s.description}</p>
                    <div className="relative group">
                        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-cyan-200 overflow-x-auto border border-slate-800">
                            {s.code}
                        </pre>
                        <button 
                            onClick={() => handleCopy(s.code, s.id)}
                            className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {copiedId === s.id ? <i className="fa-solid fa-check text-emerald-400"></i> : <i className="fa-solid fa-copy"></i>}
                        </button>
                    </div>
                    <div className="mt-4 flex gap-1 flex-wrap">
                        {s.apiEndpointsUsed.map(ep => (
                            <span key={ep} className="text-[10px] text-slate-500 font-mono">{ep}</span>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};
