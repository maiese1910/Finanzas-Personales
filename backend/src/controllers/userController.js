import { prisma } from '../server.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                currency: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                currency: true,
                createdAt: true,
                subscriptionStatus: true
            }
        });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Usuario/email y contraseña son obligatorios' });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (user && (await bcrypt.compare(password, user.password || ''))) {
            res.json({
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                currency: user.currency,
                subscriptionStatus: user.subscriptionStatus,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Crear nuevo usuario (Registro)
export const createUser = async (req, res) => {
    try {
        const { email, name, username, password } = req.body;

        if (!email || !name || !username || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                name,
                password: hashedPassword
            }
        });

        // Seed default categories for the new user
        const defaultCategories = [
            { name: '💼 Salario / Nómina', type: 'income', icon: '💼', color: '#10b981' },
            { name: '📈 Inversiones', type: 'income', icon: '📈', color: '#059669' },
            { name: '🖱️ Freelance', type: 'income', icon: '⌨️', color: '#047857' },
            { name: '🎁 Otros Ingresos', type: 'income', icon: '💰', color: '#065f46' },
            { name: '🏠 Vivienda', type: 'expense', icon: '🏠', color: '#f43f5e' },
            { name: '⚡ Servicios', type: 'expense', icon: '⚡', color: '#e11d48' },
            { name: '🛒 Alimentación', type: 'expense', icon: '🛒', color: '#be123c' },
            { name: '🚗 Transporte', type: 'expense', icon: '🚗', color: '#3b82f6' },
            { name: '🏥 Salud', type: 'expense', icon: '🏥', color: '#2563eb' },
            { name: '🍿 Ocio y Restaurantes', type: 'expense', icon: '🎭', color: '#8b5cf6' },
            { name: '📱 Suscripciones', type: 'expense', icon: '📱', color: '#7c3aed' },
            { name: '🖋️ Educación', type: 'expense', icon: '📚', color: '#f59e0b' },
            { name: '🛍️ Ropa y Compras', type: 'expense', icon: '🛍️', color: '#d97706' },
            { name: '💳 Impuestos', type: 'expense', icon: '📑', color: '#4b5563' }
        ];

        await prisma.category.createMany({
            data: defaultCategories.map(cat => ({ ...cat, userId: user.id }))
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            token: generateToken(user.id)
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El email o usuario ya existe' });
        }
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, currency } = req.body;
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { email, name, currency },
            select: { id: true, email: true, username: true, name: true, currency: true }
        });
        res.json(user);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
