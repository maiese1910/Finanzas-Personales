import express from 'express';
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getUserBalance,
    getCategoryStats,
    getHistoricalComparison,
    exportTransactions
} from '../controllers/transactionController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Rutas de transacciones
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

// Rutas de estadísticas
router.get('/balance/:userId', getUserBalance);
router.get('/stats/:userId', getCategoryStats);
router.get('/historical/:userId', getHistoricalComparison);
router.get('/export/:userId', exportTransactions);

export default router;
