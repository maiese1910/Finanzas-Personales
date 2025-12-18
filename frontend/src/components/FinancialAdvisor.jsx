import React, { useState } from 'react';
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
            if (serverError?.tip) {
                console.warn('AI Advisor Tip:', serverError.tip);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-3" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="flex-between">
                <div>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🤖 Consultoría con IA
                    </h3>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                        Analiza tus movimientos y recibe consejos personalizados para invertir.
                    </p>
                </div>
                <button
                    onClick={handleAnalyze}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Consultando...' : 'Pedir análisis'}
                </button>
            </div>

            {error && (
                <div className="mt-2" style={{
                    color: 'var(--color-danger)',
                    fontSize: '0.875rem',
                    background: 'rgba(244, 63, 94, 0.1)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(244, 63, 94, 0.2)'
                }}>
                    <strong>⚠️ Error en la IA:</strong> {error}
                </div>
            )}

            {advice && (
                <div className="mt-3 p-3" style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem',
                    lineHeight: '1.7',
                    color: '#f8fafc'
                }}>
                    {advice}
                </div>
            )}
        </div>
    );
}

export default FinancialAdvisor;
