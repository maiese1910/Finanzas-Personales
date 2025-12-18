import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Budgets({ user }) {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [currentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear] = useState(new Date().getFullYear());

    // Estado para el modal de edición
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Cargar categorías, presupuestos y estadísticas del mes actual simultáneamente
            const [catsRes, budgetsRes, statsRes] = await Promise.all([
                api.get(`/categories?userId=${user.id}`),
                api.get(`/budgets/${user.id}?month=${currentMonth}&year=${currentYear}`),
                api.get(`/transactions/stats/${user.id}?month=${currentMonth}&year=${currentYear}`)
            ]);

            setCategories(catsRes.data.filter(c => c.type === 'expense'));
            setBudgets(budgetsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error al cargar datos de presupuestos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBudget = async () => {
        if (!selectedCategory || !amount) return;

        try {
            await api.post('/budgets', {
                userId: user.id,
                categoryId: selectedCategory.id,
                amount: parseFloat(amount),
                month: currentMonth,
                year: currentYear
            });
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('Error al guardar presupuesto:', error);
        }
    };

    const getProgress = (categoryId) => {
        const budget = budgets.find(b => b.categoryId === categoryId);
        const stat = stats.find(s => s.categoryId === categoryId);

        const limit = budget ? parseFloat(budget.amount) : 0;
        const spent = stat ? parseFloat(stat.total) : 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;

        return { limit, spent, percentage };
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="animate-in">
            <div className="flex-between mb-4" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h2 className="login-title" style={{ textAlign: 'left', margin: '2rem 0 0.5rem', fontSize: '2rem' }}>Mis Presupuestos 🎯</h2>
                    <p style={{ marginTop: '0.25rem', marginBottom: '2rem' }}>Gasto máximo mensual para su {currentMonth}/{currentYear}</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setSelectedCategory(categories[0]);
                    setAmount('');
                    setShowModal(true);
                }} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Añadir Límite
                </button>
            </div>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                {categories.map(cat => {
                    const { limit, spent, percentage } = getProgress(cat.id);
                    const isOver = spent > limit && limit > 0;
                    const isNear = percentage > 85 && !isOver;

                    return (
                        <div key={cat.id} className="card budget-card" style={{
                            borderTop: `5px solid ${cat.color || '#3b82f6'}`,
                            background: 'var(--bg-card)',
                            padding: '1.75rem',
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div className="flex-between mb-3">
                                <div className="flex align-center gap-3">
                                    <div style={{
                                        background: `${cat.color}15`,
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        {cat.icon || '📁'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'white' }}>{cat.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meta Mensual</span>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setAmount(limit || '');
                                        setShowModal(true);
                                    }}
                                >
                                    Ajustar
                                </button>
                            </div>

                            <div className="flex-between mb-2">
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gastado</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isOver ? 'var(--color-danger)' : 'white' }}>
                                    {user.currency}{spent.toLocaleString()}
                                </span>
                            </div>

                            <div style={{
                                height: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                margin: '1rem 0'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(percentage, 100)}%`,
                                    background: isOver ? 'var(--color-danger)' : (isNear ? 'var(--color-warning)' : (cat.color || 'var(--color-primary)')),
                                    boxShadow: percentage > 80 ? `0 0 15px ${isOver ? 'rgba(244,63,94,0.4)' : 'rgba(245,158,11,0.3)'}` : 'none',
                                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    borderRadius: '10px'
                                }}></div>
                            </div>

                            <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>
                                    {limit > 0 ? `${percentage.toFixed(0)}% del plan` : 'Sin límite fijado'}
                                </span>
                                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {limit > 0 ? `Límite: ${user.currency}${limit.toLocaleString()}` : ''}
                                </span>
                            </div>

                            {isOver && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.6rem',
                                    background: 'rgba(244,63,94,0.1)',
                                    borderRadius: '10px',
                                    color: 'var(--color-danger)',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    Exceso de {user.currency}${(spent - limit).toLocaleString()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal para configurar presupuesto */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-content">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Configurar Presupuesto</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                            Establece un límite de gasto realista para esta categoría.
                        </p>

                        <div className="form-group">
                            <label>Categoría Seleccionada</label>
                            <select
                                className="form-input"
                                value={selectedCategory?.id || ''}
                                onChange={(e) => {
                                    const id = parseInt(e.target.value);
                                    const cat = categories.find(c => c.id === id);
                                    setSelectedCategory(cat);
                                }}
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.icon} {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Límite Mensual en {user.currency || '$'}</label>
                            <input
                                type="number"
                                className="form-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ej: 1200"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button className="btn btn-outline" style={{ flex: 1, height: '48px' }} onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, height: '48px' }} onClick={handleSaveBudget}>
                                Guardar Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Budgets;
