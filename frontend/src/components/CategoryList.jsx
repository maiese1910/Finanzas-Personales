import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CategoryList({ user }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    // New category state
    const [newCat, setNewCat] = useState({
        name: '',
        type: 'expense',
        icon: '🏷️',
        color: '#6366f1'
    });

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

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/categories', {
                ...newCat,
                userId: user.id
            });
            setCategories(prev => [...prev, response.data]);
            setShowForm(false);
            setNewCat({ name: '', type: 'expense', icon: '🏷️', color: '#6366f1' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear categoría');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Error al eliminar');
        }
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="animate-in">
            <div className="flex-between mb-3" style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '16px',
                borderLeft: '4px solid var(--color-primary)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏷️ Gestión de Categorías</h2>
                    <p style={{ margin: 0, opacity: 0.7 }}>Personaliza tus etiquetas de ingresos y gastos.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    style={{ borderRadius: '12px' }}
                >
                    {showForm ? 'Cancelar' : '+ Nueva Categoría'}
                </button>
            </div>

            {showForm && (
                <div className="card mb-3 animate-in" style={{ border: '1px dashed var(--color-primary)' }}>
                    <form onSubmit={handleCreate} className="form">
                        <div className="grid grid-3">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Gimnasio, Freelance..."
                                    value={newCat.name}
                                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo</label>
                                <select
                                    value={newCat.type}
                                    onChange={e => setNewCat({ ...newCat, type: e.target.value })}
                                >
                                    <option value="expense">Gasto</option>
                                    <option value="income">Ingreso</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Icono (Emoji)</label>
                                <input
                                    type="text"
                                    value={newCat.icon}
                                    onChange={e => setNewCat({ ...newCat, icon: e.target.value })}
                                    maxLength="2"
                                />
                            </div>
                        </div>
                        <div className="grid grid-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="color"
                                    value={newCat.color}
                                    onChange={e => setNewCat({ ...newCat, color: e.target.value })}
                                    style={{ height: '45px', width: '80px', padding: '2px' }}
                                />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '45px' }}>
                                    Guardar Categoría
                                </button>
                            </div>
                        </div>
                        {error && <p style={{ color: 'var(--color-danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
                    </form>
                </div>
            )}

            <div className="grid grid-2">
                {/* INGRESOS */}
                <div className="card">
                    <div className="flex-between mb-2">
                        <h3 className="text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                            Ingresos
                        </h3>
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {incomeCategories.length}
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
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                                        {cat.name.startsWith(cat.icon) ? cat.name.replace(cat.icon, '').trim() : cat.name}
                                    </h4>
                                </div>
                                <button
                                    className="btn-icon"
                                    onClick={() => handleDelete(cat.id)}
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
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
                            {expenseCategories.length}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {expenseCategories.map(cat => (
                            <div key={cat.id} className="category-item-full" style={{ padding: '0.75rem', position: 'relative' }}>
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
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                                        {cat.name.startsWith(cat.icon) ? cat.name.replace(cat.icon, '').trim() : cat.name}
                                    </h4>
                                </div>
                                <button
                                    className="btn-icon"
                                    onClick={() => handleDelete(cat.id)}
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
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
                .btn-icon {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    padding: 5px;
                    border-radius: 6px;
                }
                .btn-icon:hover {
                    opacity: 1;
                    background: rgba(244, 63, 94, 0.1);
                }
            `}</style>
        </div>
    );
}

export default CategoryList;
