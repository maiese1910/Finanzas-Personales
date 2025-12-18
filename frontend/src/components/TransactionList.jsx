import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionList({ user, refreshTrigger }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/transactions?userId=${user.id}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="card mt-2">
            <div className="flex-between mb-2">
                <h3>Historial de Movimientos</h3>
                <span style={{ color: 'var(--text-secondary)' }}>
                    {transactions.length} registros encontrados
                </span>
            </div>

            {transactions.length === 0 ? (
                <p className="text-center" style={{ padding: '2rem' }}>No hay transacciones aún.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {transactions.map(t => (
                        <div key={t.id} className="transaction-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    background: 'var(--bg-primary)',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {t.category.icon || '📄'}
                                </div>
                                <div className="transaction-info">
                                    <h4>{t.description}</h4>
                                    <p>
                                        {new Date(t.date).toLocaleDateString()} • {t.category.name.startsWith(t.category.icon) ? t.category.name.replace(t.category.icon, '').trim() : t.category.name}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className={`transaction-amount ${t.type}`}>
                                    {t.type === 'expense' ? '-' : '+'}
                                    {user.currency || '$'} {parseFloat(t.amount).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="btn-outline"
                                    style={{
                                        padding: '0.4rem',
                                        fontSize: '0.8rem',
                                        border: '1px solid transparent',
                                        opacity: 0.6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: '6px'
                                    }}
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TransactionList;
