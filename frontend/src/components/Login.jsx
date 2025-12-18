import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [identifier, setIdentifier] = useState(''); // For Login (Email or Username)
    const [email, setEmail] = useState('');           // For Registration
    const [username, setUsername] = useState('');     // For Registration
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSlowLoading(false);

        // Timer para avisar si el servidor tarda mucho (Render Cold Start)
        const timer = setTimeout(() => {
            setSlowLoading(true);
        }, 6000); // 6 segundos

        try {
            const endpoint = isRegistering
                ? '/users'
                : '/users/login';

            const body = isRegistering
                ? { email, name, username }
                : { identifier };

            const response = await api.post(endpoint, body);
            onLogin(response.data);
        } catch (err) {
            console.error('Error de autenticación:', err);

            if (err.response) {
                // El servidor respondió con un error (4xx, 5xx)
                if (err.response.status === 404 && !isRegistering) {
                    setError('Usuario no encontrado. ¿Quieres registrarte?');
                } else {
                    setError(err.response.data?.error || 'Error en el servidor. Inténtalo de nuevo.');
                }
            } else if (err.request) {
                // La petición se hizo pero no hubo respuesta (Error de red)
                setError('No se pudo conectar con el servidor. Revisa tu conexión.');
            } else {
                // Error al configurar la petición
                setError('Ocurrió un error inesperado. Inténtalo más tarde.');
            }
        } finally {
            clearTimeout(timer);
            setLoading(false);
            setSlowLoading(false);
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

                {slowLoading && !error && (
                    <div style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#fbbf24',
                        padding: '0.8rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.8rem',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        textAlign: 'center'
                    }}>
                        🚀 El servidor de la nube está "despertando".
                        <br />Por favor, espera unos segundos más...
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
