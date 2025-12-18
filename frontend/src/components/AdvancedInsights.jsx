import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdvancedInsights({ user }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, [user]);

    const fetchInsights = async () => {
        try {
            const response = await api.get(`/ai/insights/${user.id}`);
            setInsights(response.data);
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card animate-pulse" style={{ height: '100px' }}></div>;
    if (!insights) return null;

    const { mathematicalInsights, aiAdvice } = insights;

    return (
        <div className="card mb-3" style={{
            background: mathematicalInsights.isRisk ? 'rgba(244, 63, 94, 0.05)' : 'rgba(16, 185, 129, 0.05)',
            borderLeft: `4px solid ${mathematicalInsights.isRisk ? 'var(--color-danger)' : 'var(--color-success)'}`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            </div>

            <div className="flex-between align-center">
                <div style={{ flex: 1 }}>
                    <div className="flex align-center gap-2 mb-2">
                        <span style={{
                            fontSize: '1.25rem',
                            animation: mathematicalInsights.isRisk ? 'pulse 2s infinite' : 'none'
                        }}>
                            {mathematicalInsights.isRisk ? '⚠️' : '🛡️'}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Estado de Salud Financiera</h3>
                    </div>

                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        "{aiAdvice}"
                    </p>
                </div>

                <div className="text-right hide-mobile" style={{ minWidth: '200px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Pronóstico de Gasto
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        {user.currency}{parseFloat(mathematicalInsights.estimatedEndMonth).toLocaleString()}
                        <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            est. fin de mes
                        </span>
                    </div>
                </div>
            </div>

            {mathematicalInsights.isRisk && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(244, 63, 94, 0.1)',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    color: 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Al ritmo actual, tu saldo podría agotarse alrededor del <strong>{mathematicalInsights.burnoutDate}</strong>.
                </div>
            )}
        </div>
    );
}

export default AdvancedInsights;
