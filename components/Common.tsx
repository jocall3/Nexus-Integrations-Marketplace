
import React, { useEffect, useState } from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', action }) => (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm ${className}`}>
        {(title || action) && (
            <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
                {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
                {action && <div>{action}</div>}
            </div>
        )}
        <div className="p-6">
            {children}
        </div>
    </div>
);

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        '2xl': 'max-w-7xl',
        'full': 'max-w-[95vw]'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
                <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
    return (
        <div className={`${s} border-2 border-slate-400 border-t-cyan-500 rounded-full animate-spin`}></div>
    );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-slate-700' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${color}`}>
        {children}
    </span>
);

export const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
        info: 'bg-cyan-600'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-circle-exclamation',
        info: 'fa-circle-info'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center p-4 rounded-lg shadow-2xl text-white transform transition-all duration-300 translate-y-0 opacity-100 ${colors[type]}`}>
            <i className={`fa-solid ${icons[type]} mr-3 text-lg`}></i>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-75">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};
