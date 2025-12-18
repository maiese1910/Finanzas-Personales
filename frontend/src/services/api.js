import axios from 'axios';

const api = axios.create({
    // Si estamos en producción (Vercel/Netlify), usamos la URL de Render.
    // Si no hay variable definida, usamos localhost:5000 por defecto.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 segundos de espera máxima
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
