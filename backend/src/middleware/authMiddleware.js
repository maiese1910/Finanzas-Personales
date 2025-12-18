import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // Obtener usuario del token
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                    currency: true,
                    subscriptionStatus: true
                }
            });

            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            next();
        } catch (error) {
            console.error('AUTH ERROR:', error);
            res.status(401).json({ error: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'No autorizado, no hay token' });
    }
};

// Middleware para verificar suscripción premium
export const premiumOnly = (req, res, next) => {
    if (req.user && (req.user.subscriptionStatus === 'active' || req.user.subscriptionStatus === 'premium')) {
        next();
    } else {
        res.status(403).json({
            error: 'Acceso denegado',
            message: 'Esta función requiere una suscripción premium activa.'
        });
    }
};
