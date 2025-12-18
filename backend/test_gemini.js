import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();

async function testNewModel() {
    if (!apiKey) {
        console.error("❌ ERROR: GEMINI_API_KEY no encontrada en .env");
        return;
    }

    console.log(`🔍 Probando gemini-2.5-flash con API Key: ${apiKey.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hola, responde con 'LISTO' si funcionas.");
        console.log("✅ Respuesta exitosa:", result.response.text());
    } catch (e) {
        console.error("❌ Error con 'gemini-2.5-flash':", e.message);
    }
}

testNewModel();
