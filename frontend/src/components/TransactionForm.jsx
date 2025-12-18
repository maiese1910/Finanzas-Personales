import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale('es', es);

function TransactionForm({ user, onTransactionAdded }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [type]);

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/categories?userId=${user.id}&type=${type}`);
            setCategories(response.data);
            if (response.data.length > 0) {
                setCategoryId(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/transactions', {
                amount,
                description,
                type,
                categoryId,
                date,
                userId: user.id
            });

            // Reset form
            setAmount('');
            setDescription('');
            onTransactionAdded(); // Refresh list
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Error al guardar la transacción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>Registrar Movimiento</h3>
            <form onSubmit={handleSubmit} className="form">
                <div className="grid grid-2">
                    <div className="form-group">
                        <label>Tipo</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-outline'}`}
                                onClick={() => setType('expense')}
                                style={{ flex: 1 }}
                            >
                                Gasto
                            </button>
                            <button
                                type="button"
                                className={`btn ${type === 'income' ? 'btn-success' : 'btn-outline'}`}
                                onClick={() => setType('income')}
                                style={{ flex: 1 }}
                            >
                                Ingreso
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Monto ({user.currency || '$'})</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder={type === 'expense' ? "¿En qué gastaste?" : "¿De dónde proviene el ingreso?"}
                    />
                </div>

                <div className="form-group custom-datepicker-wrapper">
                    <label>Fecha</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Selecciona una fecha"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Transacción'}
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;
