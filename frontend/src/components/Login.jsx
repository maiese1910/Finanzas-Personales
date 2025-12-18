import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [identifier, setIdentifier] = useState(''); // Email o Username para Login
    const [email, setEmail] = useState('');           // Para Registro
    const [username, setUsername] = useState('');     // Para Registro
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSlowLoading(false);

        const timer = setTimeout(() => {
            setSlowLoading(true);
        }, 6000);

        try {
            const endpoint = isRegistering ? '/users' : '/users/login';
            const body = isRegistering
                ? { email, name, username, password }
                : { identifier, password };

            const response = await api.post(endpoint, body);
            onLogin(response.data);
        } catch (err) {
            console.error('Error de autenticación:', err);
            const msg = err.response?.data?.error || 'Error de conexión. Revisa el servidor.';
            setError(msg);
        } finally {
            clearTimeout(timer);
            setLoading(false);
            setSlowLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card animate-in">
                <div style={{ textAlign: 'center' }}>
                    <div className="login-logo-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                        </svg>
                    </div>
                    <h2 className="login-title">
                        {isRegistering ? 'Crea tu Cuenta' : 'Bienvenido a Finanzly'}
                    </h2>
                    <p className="login-subtitle" style={{ marginBottom: '2rem' }}>
                        {isRegistering ? 'Únete a la nueva era del control financiero.' : 'Tu dinero, bajo control e inteligente.'}
                    </p>
                </div>

                {error && (
                    <div className="error-alert" style={{
                        background: 'rgba(244, 63, 94, 0.1)',
                        color: 'var(--color-danger)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        border: '1px solid var(--color-danger)',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    {isRegistering ? (
                        <>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Juan Pérez"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="juan123"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                    className="form-input"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label>Usuario o Email</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                placeholder="tu@email.com"
                                className="form-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', height: '48px', fontSize: '1rem' }}
                    >
                        {loading ? 'Procesando...' : (isRegistering ? 'Empezar ahora' : 'Ingresar')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                    {' '}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
