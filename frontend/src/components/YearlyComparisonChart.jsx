import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

function YearlyComparisonChart({ user }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComparison();
    }, [user]);

    const fetchComparison = async () => {
        try {
            const now = new Date();
            const response = await api.get(`/transactions/historical/${user.id}?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
            const { current, previous, years } = response.data;

            setData({
                labels: [`Ingresos (${years.previous} vs ${years.current})`, `Gastos (${years.previous} vs ${years.current})`],
                datasets: [
                    {
                        label: `${years.previous}`,
                        data: [previous.income, previous.expenses],
                        backgroundColor: 'rgba(148, 163, 184, 0.5)',
                        borderRadius: 6,
                    },
                    {
                        label: `${years.current}`,
                        data: [current.income, current.expenses],
                        backgroundColor: (context) => {
                            const index = context.dataIndex;
                            return index === 0 ? '#10b981' : '#f43f5e';
                        },
                        borderRadius: 6,
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching yearly comparison:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;
    if (!data) return null;

    return (
        <div className="card">
            <h3 className="mb-4">Comparativa Interanual (Este Mes)</h3>
            <div style={{ height: '300px' }}>
                <Bar
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: { color: '#94a3b8', usePointStyle: true }
                            }
                        },
                        scales: {
                            y: {
                                grid: { color: '#334155' },
                                ticks: { color: '#94a3b8' }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#94a3b8' }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default YearlyComparisonChart;
