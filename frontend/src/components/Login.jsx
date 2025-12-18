import React, { useState } from 'react';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [identifier, setIdentifier] = useState(''); // For Login (Email or Username)
    const [email, setEmail] = useState('');           // For Registration
    const [username, setUsername] = useState('');     // For Registration
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegistering
                ? '/api/users'
                : '/api/users/login';

            const body = isRegistering
                ? { email, name, username }
                : { identifier };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404 && !isRegistering) {
                    setError('Usuario no encontrado. ¿Quieres registrarte?');
                } else {
                    throw new Error(data.error || 'Error en la solicitud');
                }
            } else {
                onLogin(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--gradient-primary)',
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isRegistering ? 'Únete a la gestión profesional' : 'Accede a tu panel financiero'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    {!isRegistering ? (
                        <div className="form-group">
                            <label>Usuario o Email</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                placeholder="tu_usuario o tu@email.com"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Nombre de usuario único"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Tu Nombre"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Entrar')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
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
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
