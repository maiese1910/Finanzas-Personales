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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        res.status(500).json({
            error: 'Error en la IA',
            details: errorMsg,
            info: 'Este error suele ocurrir por una API Key inválida o restricciones de región. Revisa la consola del servidor.'
        });
    }
};

export const getFinanceInsights = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        const m = parseInt(month) || new Date().getMonth() + 1;
        const y = parseInt(year) || new Date().getFullYear();
        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59);

        // 1. Obtener datos clave: Balance actual, Presupuestos y Transacciones del mes
        const [balanceRes, budgets, transactions] = await Promise.all([
            prisma.transaction.groupBy({
                by: ['type'],
                where: { userId: parseInt(userId), date: { gte: startDate, lte: endDate } },
                _sum: { amount: true }
            }),
            prisma.budget.findMany({
                where: { userId: parseInt(userId), month: m, year: y }
            }),
            prisma.transaction.findMany({
                where: { userId: parseInt(userId), date: { gte: startDate, lte: endDate }, type: 'expense' },
                orderBy: { date: 'asc' }
            })
        ]);

        const totalIncome = balanceRes.find(b => b.type === 'income')?._sum.amount || 0;
        const totalExpenses = balanceRes.find(b => b.type === 'expense')?._sum.amount || 0;
        const currentBalance = totalIncome - totalExpenses;

        // 2. Cálculo matemático de ritmo de gasto
        const today = new Date();
        const daysInMonth = new Date(y, m, 0).getDate();
        const currentDay = m === (today.getMonth() + 1) ? today.getDate() : daysInMonth;

        const dailyAverage = currentDay > 0 ? totalExpenses / currentDay : 0;
        const estimatedEndMonth = dailyAverage * daysInMonth;
        const daysRemaining = daysInMonth - currentDay;

        let burnoutDate = null;
        if (dailyAverage > 0 && currentBalance > 0) {
            const daysUntilZero = Math.floor(currentBalance / dailyAverage);
            if (daysUntilZero < daysRemaining) {
                const date = new Date();
                date.setDate(today.getDate() + daysUntilZero);
                burnoutDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
            }
        }

        // 3. Generar Insight con IA
        let aiAdvice = "";
        if (apiKey && apiKey !== "your_google_gemini_api_key_here") {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `
                Como experto en finanzas, analiza estos datos rápidos:
                - Ingresos mes: ${totalIncome}
                - Gastos mes: ${totalExpenses}
                - Saldo actual: ${currentBalance}
                - Gasto diario promedio: ${dailyAverage.toFixed(2)}
                - Pronóstico fin de mes: ${estimatedEndMonth.toFixed(2)}
                ${burnoutDate ? `- Alerta: Al ritmo actual, el saldo se agotará el ${burnoutDate}` : '- Sin alerta inmediata de saldo cero.'}
                
                Genera una UNICA frase impactante y motivadora de insights para el usuario. Sé breve (máximo 25 palabras).
            `;

            const result = await model.generateContent(prompt);
            aiAdvice = (await result.response).text().trim();
        }

        res.json({
            mathematicalInsights: {
                dailyAverage: dailyAverage.toFixed(2),
                estimatedEndMonth: estimatedEndMonth.toFixed(2),
                burnoutDate,
                isRisk: !!burnoutDate
            },
            aiAdvice: aiAdvice || "Mantén el control de tus gastos para llegar tranquilo a fin de mes."
        });

    } catch (error) {
        console.error('Error en Finance Insights:', error);
        res.status(500).json({ error: 'Error al generar insights financieros' });
    }
};
