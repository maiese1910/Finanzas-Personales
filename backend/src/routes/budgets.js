import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Obtener presupuestos de un usuario para un mes/año específico
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { month, year } = req.query;

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                userId: parseInt(userId),
                month: parseInt(month),
                year: parseInt(year)
            },
            include: {
                category: true
            }
        });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener presupuestos', details: error.message });
    }
});

// Crear o actualizar un presupuesto
router.post('/', async (req, res) => {
    const { userId, categoryId, amount, month, year } = req.body;

    try {
        const budget = await prisma.budget.upsert({
            where: {
                userId_categoryId_month_year: {
                    userId: parseInt(userId),
                    categoryId: parseInt(categoryId),
                    month: parseInt(month),
                    year: parseInt(year)
                }
            },
            update: {
                amount: parseFloat(amount)
            },
            create: {
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                amount: parseFloat(amount),
                month: parseInt(month),
                year: parseInt(year)
            }
        });
        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar presupuesto', details: error.message });
    }
});

// Eliminar un presupuesto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.budget.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Presupuesto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar presupuesto', details: error.message });
    }
});

export default router;
