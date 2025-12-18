import Stripe from 'stripe';
import { prisma } from '../server.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const createCheckoutSession = async (req, res) => {
    try {
        const { priceId } = req.body;
        const user = req.user;

        // Crear o recuperar cliente de Stripe
        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            });
            stripeCustomerId = customer.id;
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=cancel`,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('STRIPE ERROR:', error);
        res.status(500).json({ error: 'Error al crear sesión de pago' });
    }
};

// Webhook para manejar eventos de Stripe (Pago exitoso, cancelación, etc.)
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await prisma.user.update({
                where: { stripeCustomerId: session.customer },
                data: {
                    subscriptionStatus: 'active',
                    subscriptionId: session.subscription
                }
            });
            break;
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await prisma.user.update({
                where: { subscriptionId: subscription.id },
                data: { subscriptionStatus: 'canceled' }
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
