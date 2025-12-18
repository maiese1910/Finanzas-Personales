import React, { useState } from 'react';
import Login from './components/Login';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import MonthlyBarChart from './components/MonthlyBarChart';
import FinancialAdvisor from './components/FinancialAdvisor';
import api from './services/api';
import './index.css';

function App() {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('finance_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('finance_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('finance_user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          </div>
          <h1>Control de Finanzas</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center' }}
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Navegación */}
      <nav className="nav">
        <button
          className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          📊 Panel Principal
        </button>
        <button
          className={`nav-link ${view === 'transactions' ? 'active' : ''}`}
          onClick={() => setView('transactions')}
        >
          💳 Movimientos
        </button>
        <button
          className={`nav-link ${view === 'categories' ? 'active' : ''}`}
          onClick={() => setView('categories')}
        >
          🏷️ Categorías
        </button>
      </nav>

      {/* Content */}
      <div className="animate-in">
        {view === 'dashboard' && <Dashboard user={user} />}
        {view === 'transactions' && <Transactions user={user} />}
        {view === 'categories' && <Categories user={user} />}
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/transactions/balance/${user.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div>
      <div className="card mb-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👋 Bienvenido de nuevo, {user.name}</h2>
        <p style={{ margin: 0 }}>Este es el análisis de tus finanzas para el período actual.</p>
      </div>

      <FinancialAdvisor user={user} />

      <div className="grid grid-3 mb-3">
        <div className="card" style={{ borderTop: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Ingresos Totales</h3>
          <div className="amount text-success" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {loading ? '...' : formatCurrency(stats.income)}
          </div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--color-danger)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Gastos Totales</h3>
          <div className="amount text-danger" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {loading ? '...' : formatCurrency(stats.expenses)}
          </div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Balance Neto</h3>
          <div className="amount" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {loading ? '...' : formatCurrency(stats.balance)}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <MonthlyBarChart user={user} />
        <ExpenseChart user={user} />
      </div>
    </div>
  );
}

function Transactions({ user }) {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="grid">
      <TransactionForm user={user} onTransactionAdded={() => setRefresh(prev => prev + 1)} />
      <TransactionList user={user} refreshTrigger={refresh} />
    </div>
  );
}

function Categories({ user }) {
  return (
    <div className="card">
      <h2>Categorías</h2>
      <p>Próximamente: gestión de categorías...</p>
    </div>
  );
}

export default App;
