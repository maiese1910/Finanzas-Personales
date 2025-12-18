import { prisma } from '../server.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
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
                name: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// Login user (simple check by email)
export const loginUser = async (req, res) => {
    try {
        console.log('Login Request Body:', req.body);
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ error: 'El usuario o email es obligatorio' });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('LOGIN ERROR DETAILS:', error);
        res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message });
    }
};

// Crear nuevo usuario
export const createUser = async (req, res) => {
    try {
        console.log('Register Request Body:', req.body);
        const { email, name, username } = req.body;

        if (!email || !name || !username) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const user = await prisma.user.create({
            data: {
                email,
                username,
                name
            }
        });

        // Seed default categories for the new user
        const defaultCategories = [
            { name: '🏦 Nómina y Renta', type: 'income', icon: '💼', color: '#10b981' },
            { name: '🥗 Alimentación', type: 'expense', icon: '🍽️', color: '#f43f5e' },
            { name: '🚆 Transporte', type: 'expense', icon: '🛤️', color: '#3b82f6' },
            { name: '🏢 Alquiler y Servicios', type: 'expense', icon: '🏛️', color: '#8b5cf6' },
            { name: '🎭 Cultura y Ocio', type: 'expense', icon: '🎟️', color: '#f59e0b' },
            { name: '🏥 Salud y Bienestar', type: 'expense', icon: '⚕️', color: '#ef4444' }
        ];

        await prisma.category.createMany({
            data: defaultCategories.map(cat => ({
                ...cat,
                userId: user.id
            }))
        });

        res.status(201).json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El email o usuario ya existe' });
        }
        console.error('REGISTRATION ERROR DETAILS:', error);
        res.status(500).json({ error: 'Error al crear usuario: ' + error.message });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name } = req.body;

        const data = {};
        if (email !== undefined) data.email = email;
        if (name !== undefined) data.name = name;

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data
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

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
