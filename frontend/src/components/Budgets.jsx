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
                api.get('/categories'),
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
            <div className="flex-between mb-4">
                <div>
                    <h2 className="login-title" style={{ textAlign: 'left', margin: 0 }}>Mis Presupuestos 🎯</h2>
                    <p>Gestiona tus límites de gasto para {currentMonth}/{currentYear}</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setSelectedCategory(categories[0]);
                    setAmount('');
                    setShowModal(true);
                }}>
                    Configurar Límite
                </button>
            </div>

            <div className="grid grid-2">
                {categories.map(cat => {
                    const { limit, spent, percentage } = getProgress(cat.id);
                    const isOver = spent > limit && limit > 0;

                    return (
                        <div key={cat.id} className="card" style={{ borderTop: `4px solid ${cat.color || '#3b82f6'}` }}>
                            <div className="flex-between mb-2">
                                <div className="flex align-center gap-2">
                                    <span style={{ fontSize: '1.5rem' }}>{cat.icon || '📁'}</span>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cat.name}</h3>
                                </div>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setAmount(limit || '');
                                        setShowModal(true);
                                    }}
                                >
                                    Editar
                                </button>
                            </div>

                            <div className="flex-between mb-1" style={{ fontSize: '0.9rem' }}>
                                <span>Gastado: <strong>{user.currency}{spent.toLocaleString()}</strong></span>
                                <span>Límite: <strong>{limit > 0 ? user.currency + limit.toLocaleString() : 'No definido'}</strong></span>
                            </div>

                            <div style={{
                                height: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(percentage, 100)}%`,
                                    background: isOver ? 'var(--color-danger)' : (cat.color || 'var(--color-primary)'),
                                    boxShadow: percentage > 80 ? `0 0 10px ${isOver ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.3)'}` : 'none',
                                    transition: 'width 0.5s ease-out'
                                }}></div>
                            </div>

                            {limit > 0 && (
                                <p style={{
                                    fontSize: '0.8rem',
                                    marginTop: '0.5rem',
                                    textAlign: 'right',
                                    color: isOver ? 'var(--color-danger)' : (percentage > 85 ? 'var(--color-warning)' : 'var(--text-muted)')
                                }}>
                                    {isOver
                                        ? `⚠️ Te has pasado por ${user.currency}${(spent - limit).toLocaleString()}`
                                        : `${percentage.toFixed(0)}% del límite utilizado`}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal para configurar presupuesto */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h3>Configurar Presupuesto</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Define cuánto quieres gastar en <strong>{selectedCategory?.name}</strong> este mes.
                        </p>

                        <div className="form-group mb-3">
                            <label>Categoría</label>
                            <select
                                className="form-input"
                                value={selectedCategory?.id}
                                onChange={(e) => setSelectedCategory(categories.find(c => c.id === parseInt(e.target.value)))}
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                            </select>
                        </div>

                        <div className="form-group mb-4">
                            <label>Monto Mensual ({user.currency})</label>
                            <input
                                type="number"
                                className="form-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ej: 500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveBudget}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Budgets;
