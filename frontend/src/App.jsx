import React, { useState } from 'react';
import './index.css';

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="container">
      <header>
        <h1>💰 Finance Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Gestiona tus finanzas personales de manera inteligente
        </p>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-link ${view === 'transactions' ? 'active' : ''}`}
          onClick={() => setView('transactions')}
        >
          💳 Transacciones
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
        {view === 'dashboard' && <Dashboard />}
        {view === 'transactions' && <Transactions />}
        {view === 'categories' && <Categories />}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <div className="grid grid-3 mb-2">
        <div className="card balance-card income">
          <h3>Ingresos</h3>
          <div className="amount">$0.00</div>
        </div>
        <div className="card balance-card expense">
          <h3>Gastos</h3>
          <div className="amount">$0.00</div>
        </div>
        <div className="card balance-card total">
          <h3>Balance</h3>
          <div className="amount">$0.00</div>
        </div>
      </div>

      <div className="card mt-3">
        <h2>🎯 Próximos pasos</h2>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '2' }}>
          <li>Configurar PostgreSQL con la contraseña que elegiste</li>
          <li>Crear archivo <code>.env</code> en la carpeta backend</li>
          <li>Ejecutar las migraciones de Prisma</li>
          <li>Instalar dependencias del backend</li>
          <li>Iniciar el servidor backend</li>
        </ol>
      </div>
    </div>
  );
}

function Transactions() {
  return (
    <div className="card">
      <h2>Transacciones</h2>
      <p>Próximamente: formulario para agregar transacciones...</p>
    </div>
  );
}

function Categories() {
  return (
    <div className="card">
      <h2>Categorías</h2>
      <p>Próximamente: gestión de categorías...</p>
    </div>
  );
}

export default App;
