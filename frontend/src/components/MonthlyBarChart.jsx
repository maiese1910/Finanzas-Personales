import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function MonthlyBarChart({ user, theme }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Colores basados en el tema
    const isDark = theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipText = isDark ? '#f8fafc' : '#0f172a';

    useEffect(() => {
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/transactions/balance/${user.id}`);
            const stats = response.data;

            setData({
                labels: ['Resumen de Cuenta'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [parseFloat(stats.income)],
                        backgroundColor: '#10b981', // Corporate Green
                        borderRadius: 4,
                    },
                    {
                        label: 'Gastos',
                        data: [parseFloat(stats.expenses)],
                        backgroundColor: '#f43f5e', // Corporate Red
                        borderRadius: 4,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching bar chart stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="card h-100">
            <h3 className="mb-4">Comparativa Mensual</h3>
            <div style={{ height: '300px' }}>
                <Bar
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: textColor,
                                    usePointStyle: true,
                                    padding: 20
                                }
                            },
                            tooltip: {
                                backgroundColor: tooltipBg,
                                titleColor: tooltipText,
                                bodyColor: tooltipText,
                                borderColor: gridColor,
                                borderWidth: 1
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: textColor }
                            },
                            y: {
                                grid: { color: gridColor },
                                ticks: {
                                    color: textColor,
                                    callback: (value) => '$' + value
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default MonthlyBarChart;
