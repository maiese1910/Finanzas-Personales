import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CategoryList({ user }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories?userId=${user.id}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="animate-in">
            <div className="card mb-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏷️ Gestión de Categorías</h2>
                <p style={{ margin: 0 }}>Organiza tus ingresos y gastos con etiquetas personalizadas para un mejor análisis.</p>
            </div>

            <div className="grid grid-2">
                {/* INGRESOS */}
                <div className="card">
                    <div className="flex-between mb-2">
                        <h3 className="text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                            Ingresos
                        </h3>
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {incomeCategories.length} categorías
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {incomeCategories.map(cat => (
                            <div key={cat.id} className="category-item-full">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: `${cat.color}20`,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    border: `1px solid ${cat.color}40`
                                }}>
                                    {cat.icon || '💰'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{cat.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>ID: #{cat.id}</p>
                                </div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GASTOS */}
                <div className="card">
                    <div className="flex-between mb-2">
                        <h3 className="text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                            Gastos
                        </h3>
                        <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-danger)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {expenseCategories.length} categorías
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {expenseCategories.map(cat => (
                            <div key={cat.id} className="category-item-full" style={{ padding: '0.75rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: `${cat.color}20`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    border: `1px solid ${cat.color}40`,
                                    marginBottom: '0.5rem'
                                }}>
                                    {cat.icon || '🧾'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{cat.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></div>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Activa</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .category-item-full {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                .category-item-full:hover {
                    transform: translateY(-2px);
                    border-color: var(--color-primary);
                    background: rgba(255,255,255,0.02);
                }
            `}</style>
        </div>
    );
}

export default CategoryList;
