import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta protegida para que el usuario inicie el pago
router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook de Stripe (Debe ser público, pero lo protegemos con la firma de Stripe en el controlador)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
