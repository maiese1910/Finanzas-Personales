import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

function FinancialAdvisor({ user }) {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/ai/analyze/${user.id}`);
            setAdvice(response.data.advice);
        } catch (err) {
            const serverError = err.response?.data;
            setError(serverError?.details || serverError?.error || 'No se pudo conectar con el asesor IA.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-3 ai-advisor-card" style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
            {/* Decoración sutil de fondo */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                zIndex: 0
            }}></div>

            <div className="flex-between align-center" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="ai-icon-pulse" style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                        🤖
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
                            Consultoría Estratégica
                        </h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                            Análisis experto de patrimonio mediante IA.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleAnalyze}
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                        padding: '0.75rem 1.5rem',
                        fontWeight: '600'
                    }}
                >
                    {loading ? (
                        <span className="flex align-center gap-2">
                            <div className="spinner-small"></div> Analizando...
                        </span>
                    ) : 'Generar Informe'}
                </button>
            </div>

            {error && (
                <div className="mt-3" style={{
                    color: '#f43f5e',
                    fontSize: '0.875rem',
                    background: 'rgba(244, 63, 94, 0.05)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <div>{error}</div>
                </div>
            )}

            {advice && (
                <div className="mt-4 ai-response-container animate-fade-in" style={{
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '16px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    padding: '1.5rem'
                }}>
                    <div className="ai-markdown-content" style={{
                        fontSize: '1rem',
                        lineHeight: '1.8',
                        color: '#cbd5e1'
                    }}>
                        <ReactMarkdown>{advice}</ReactMarkdown>
                    </div>
                </div>
            )}

            <style>{`
                .ai-icon-pulse {
                    animation: subtle-pulse 3s infinite ease-in-out;
                }
                @keyframes subtle-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .ai-markdown-content h3 {
                    color: #10b981;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    font-size: 1.25rem;
                    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
                    padding-bottom: 0.5rem;
                }
                .ai-markdown-content p {
                    margin-bottom: 1rem;
                }
                .ai-markdown-content ul {
                    padding-left: 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .ai-markdown-content li {
                    margin-bottom: 0.5rem;
                }
                .ai-markdown-content strong {
                    color: #f8fafc;
                    font-weight: 600;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spinner-small {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default FinancialAdvisor;
