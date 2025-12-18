import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ user }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            // Fetch stats for expenses only
            const response = await api.get(`/transactions/stats/${user.id}?type=expense`);
            const stats = response.data;

            if (stats.length === 0) {
                setChartData(null);
                return;
            }

            const data = {
                labels: stats.map(item => item.category),
                datasets: [
                    {
                        data: stats.map(item => item.total),
                        backgroundColor: stats.map(item => item.color || '#cbd5e1'), // Fallback color
                        borderColor: 'transparent',
                        borderWidth: 1,
                    },
                ],
            };
            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Cargando gráfico...</div>;
    if (!chartData) return <div className="text-center p-4 text-muted">Aún no hay gastos registrados.</div>;

    return (
        <div className="card h-100" style={{ minHeight: '400px' }}>
            <h3 className="mb-4">Distribución por Categorías</h3>
            <div style={{ position: 'relative', height: '300px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#94a3b8', // --text-secondary
                                    font: {
                                        family: 'Inter',
                                        size: 13
                                    },
                                    padding: 20,
                                    usePointStyle: true
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default ExpenseChart;
