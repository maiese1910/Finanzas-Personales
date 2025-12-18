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
        <div className="login-container">
            <div className="login-card">
                <div style={{ textAlign: 'center' }}>
                    <div className="login-logo-box">
                        {/* Logo de Rayo - Finanzly */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                        </svg>
                    </div>
                    <h2 className="login-title">
                        {isRegistering ? 'Crea tu Cuenta' : 'Bienvenido a Finanzly'}
                    </h2>
                    <p className="login-subtitle">
                        {isRegistering ? 'Empieza a tomar el control de tu dinero.' : 'Accede a tu panel financiero inteligente.'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(244, 63, 94, 0.15)',
                        color: 'var(--color-danger)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        textAlign: 'center',
                        fontWeight: '500'
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
                                style={{ borderRadius: '12px' }}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="ejemplo@correo.com"
                                    style={{ borderRadius: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre de Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Nombre de usuario"
                                    style={{ borderRadius: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="¿Cómo te llamas?"
                                    style={{ borderRadius: '12px' }}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1rem', borderRadius: '12px' }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                Cargando...
                            </div>
                        ) : (isRegistering ? 'Registrarme ahora' : 'Iniciar Sesión')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isRegistering ? '¿Ya eres parte de Finanzly?' : '¿Aún no tienes cuenta?'}
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
                            cursor: 'pointer',
                            padding: '4px 8px'
                        }}
                    >
                        {isRegistering ? 'Inicia Sesión' : 'Crea una aquí'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
