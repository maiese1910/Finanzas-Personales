import { prisma } from '../server.js';

// Obtener categorías del usuario
export const getCategories = async (req, res) => {
    try {
        const { userId, type } = req.query;

        const where = {};
        if (userId) where.userId = parseInt(userId);
        if (type) where.type = type;

        const categories = await prisma.category.findMany({
            where,
            orderBy: {
                name: 'asc'
            }
        });

        res.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

// Crear nueva categoría
export const createCategory = async (req, res) => {
    try {
        const { name, type, color, icon, userId } = req.body;

        if (!name || !type || !userId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({ error: 'El tipo debe ser "income" o "expense"' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                type,
                color: color || '#6366f1',
                icon: icon || 'default',
                userId: parseInt(userId)
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

// Actualizar categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, color, icon } = req.body;

        const data = {};
        if (name !== undefined) data.name = name;
        if (type !== undefined) data.type = type;
        if (color !== undefined) data.color = color;
        if (icon !== undefined) data.icon = icon;

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data
        });

        res.json(category);
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

// Eliminar categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay transacciones asociadas
        const transactionCount = await prisma.transaction.count({
            where: { categoryId: parseInt(id) }
        });

        if (transactionCount > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar una categoría que tiene movimientos asociados',
                transactionCount
            });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};
