import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '../server.js';

export const analyzeFinances = async (req, res) => {
    try {
        const { userId } = req.params;
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey || apiKey === "your_google_gemini_api_key_here") {
            return res.status(500).json({
                error: 'AI no configurada. Por favor añade GEMINI_API_KEY al archivo .env'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Obtener datos financieros del usuario
        const transactions = await prisma.transaction.findMany({
            where: { userId: parseInt(userId) },
            include: { category: true },
            orderBy: { date: 'desc' },
            take: 50 // Analizamos los últimos 50 movimientos
        });

        if (transactions.length === 0) {
            return res.json({
                advice: "Aún no tienes suficientes datos para un análisis. ¡Registra tus primeros movimientos!"
            });
        }

        // 2. Preparar resumen para la IA
        const summary = transactions.reduce((acc, t) => {
            const key = `${t.type} - ${t.category.name}`;
            acc[key] = (acc[key] || 0) + parseFloat(t.amount);
            return acc;
        }, {});

        const prompt = `
            Actúa como un asesor financiero experto y cercano. 
            Analiza los siguientes movimientos financieros de un usuario y proporciónale:
            1. Un resumen breve de dónde se está yendo su dinero.
            2. 3 consejos accionables para mejorar su salud financiera o reducir gastos.
            3. Una recomendación de inversión acorde a su situación (asume un perfil moderado).

            DATOS DE TRANSACCIONES (Tipo - Categoría: Total):
            ${JSON.stringify(summary, null, 2)}

            Responde en español, usando un tono formal pero motivador. Usa formato Markdown (negritas, listas).
        `;

        // 3. Llamada a Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ advice: text });

    } catch (error) {
        console.error('--- ERROR IA DETALLADO ---');
        console.error(error);

        const errorMsg = error.message || 'Error desconocido';
        res.status(500).json({
            error: 'Error en la IA',
            details: errorMsg,
            info: 'Este error suele ocurrir por una API Key inválida o restricciones de región. Revisa la consola del servidor.'
        });
    }
};
