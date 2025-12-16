import { prisma } from '../server.js';

// Obtener todas las transacciones con filtros
export const getTransactions = async (req, res) => {
    try {
        const { userId, month, year, categoryId, type } = req.query;

        const where = {};

        if (userId) where.userId = parseInt(userId);
        if (categoryId) where.categoryId = parseInt(categoryId);
        if (type) where.type = type;

        // Filtro por mes y año
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            where.date = {
                gte: startDate,
                lte: endDate
            };
        } else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            where.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// Crear nueva transacción
export const createTransaction = async (req, res) => {
    try {
        const { amount, description, date, type, categoryId, userId } = req.body;

        // Validación
        if (!amount || !description || !date || !type || !categoryId || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({ error: 'Type must be "income" or "expense"' });
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                description,
                date: new Date(date),
                type,
                categoryId: parseInt(categoryId),
                userId: parseInt(userId)
            },
            include: {
                category: true
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Error creating transaction' });
    }
};

// Actualizar transacción
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, date, type, categoryId } = req.body;

        const data = {};
        if (amount !== undefined) data.amount = parseFloat(amount);
        if (description !== undefined) data.description = description;
        if (date !== undefined) data.date = new Date(date);
        if (type !== undefined) data.type = type;
        if (categoryId !== undefined) data.categoryId = parseInt(categoryId);

        const transaction = await prisma.transaction.update({
            where: { id: parseInt(id) },
            data,
            include: {
                category: true
            }
        });

        res.json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Error updating transaction' });
    }
};

// Eliminar transacción
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.transaction.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};

// Calcular balance del usuario
export const getUserBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;

        const where = { userId: parseInt(userId) };

        // Filtro por período
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            where.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await prisma.transaction.findMany({ where });

        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = income - expenses;

        res.json({
            income: income.toFixed(2),
            expenses: expenses.toFixed(2),
            balance: balance.toFixed(2),
            transactionCount: transactions.length
        });
    } catch (error) {
        console.error('Error calculating balance:', error);
        res.status(500).json({ error: 'Error calculating balance' });
    }
};

// Obtener estadísticas por categoría
export const getCategoryStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year, type } = req.query;

        const where = { userId: parseInt(userId) };
        if (type) where.type = type;

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            where.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: true
            }
        });

        // Agrupar por categoría
        const categoryMap = {};
        transactions.forEach(t => {
            const catName = t.category.name;
            if (!categoryMap[catName]) {
                categoryMap[catName] = {
                    category: t.category,
                    total: 0,
                    count: 0
                };
            }
            categoryMap[catName].total += parseFloat(t.amount);
            categoryMap[catName].count += 1;
        });

        const stats = Object.values(categoryMap).map(item => ({
            category: item.category.name,
            categoryId: item.category.id,
            color: item.category.color,
            total: item.total.toFixed(2),
            count: item.count,
            type: item.category.type
        }));

        res.json(stats);
    } catch (error) {
        console.error('Error getting category stats:', error);
        res.status(500).json({ error: 'Error getting category stats' });
    }
};
