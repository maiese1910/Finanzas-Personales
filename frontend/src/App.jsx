import React, { useState } from 'react';
import Login from './components/Login';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import MonthlyBarChart from './components/MonthlyBarChart';
import FinancialAdvisor from './components/FinancialAdvisor';
import CategoryList from './components/CategoryList';
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

  const handleCurrencyChange = async (e) => {
    let newCurrency = e.target.value;

    if (newCurrency === 'CUSTOM') {
      const custom = window.prompt('Introduce el símbolo de tu moneda (ej: CHF, BRL, ₿):');
      if (!custom) return;
      newCurrency = custom;
    }

    try {
      const response = await api.patch(`/users/profile/${user.id}`, { currency: newCurrency });
      const updatedUser = { ...user, currency: response.data.currency };
      localStorage.setItem('finance_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al cambiar moneda:', error);
    }
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
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            {/* Logo de Rayo - Finanzly */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
          <h1 style={{ letterSpacing: '-0.5px' }}>Finanzly</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={['$', '€', '£', 'ARS', 'MXN', 'COP', 'BRL', 'CLP', 'PEN', 'UYU', 'PYG', 'BOB', 'CHF', 'JPY', 'CNY', 'CAD', 'AUD'].includes(user.currency || '$') ? (user.currency || '$') : 'CUSTOM'}
            onChange={handleCurrencyChange}
            className="btn btn-outline"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="ARS">ARS</option>
            <option value="MXN">MXN</option>
            <option value="COP">COP</option>
            <option value="BRL">BRL (R$)</option>
            <option value="CLP">CLP ($)</option>
            <option value="PEN">PEN (S/)</option>
            <option value="UYU">UYU ($)</option>
            <option value="PYG">PYG (₲)</option>
            <option value="BOB">BOB (Bs)</option>
            <option value="CHF">CHF (Fr.)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="CUSTOM">{['$', '€', '£', 'ARS', 'MXN', 'COP', 'BRL', 'CLP', 'PEN', 'UYU', 'PYG', 'BOB', 'CHF', 'JPY', 'CNY', 'CAD', 'AUD'].includes(user.currency || '$') ? 'Otra...' : `Otra (${user.currency || '$'})`}</option>
          </select>
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
      <div className="nav-container">
        <nav className="nav">
          <button
            className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Panel Principal
          </button>
          <button
            className={`nav-link ${view === 'transactions' ? 'active' : ''}`}
            onClick={() => setView('transactions')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            Movimientos
          </button>
          <button
            className={`nav-link ${view === 'categories' ? 'active' : ''}`}
            onClick={() => setView('categories')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
            Categorías
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="animate-in">
        {view === 'dashboard' && <Dashboard user={user} />}
        {view === 'transactions' && <Transactions user={user} />}
        {view === 'categories' && <CategoryList user={user} />}
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
    const symbol = user.currency || '$';

    // LatAm and common regional formatting
    if (['ARS', 'MXN', 'COP', 'CLP', 'UYU', 'PYG', 'BOB', 'PEN', 'BRL'].includes(symbol)) {
      let displaySymbol = '$';
      if (symbol === 'PEN') displaySymbol = 'S/';
      if (symbol === 'BRL') displaySymbol = 'R$';
      if (symbol === 'PYG') displaySymbol = '₲';
      if (symbol === 'BOB') displaySymbol = 'Bs';

      return `${displaySymbol} ${new Intl.NumberFormat('es-AR').format(amount)}`;
    }

    // Default international formatting
    try {
      return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: symbol === '€' ? 'EUR' : symbol === '£' ? 'GBP' : (symbol.length === 3 ? symbol : 'USD'),
        currencyDisplay: 'symbol'
      }).format(amount).replace('$', symbol);
    } catch (e) {
      // Fallback if currency code is invalid
      return `${symbol} ${new Intl.NumberFormat('es-US').format(amount)}`;
    }
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

export default App;
