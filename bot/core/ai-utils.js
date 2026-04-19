const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

async function askSupremeAI(prompt, engine = 'GEMINI') {
    const normalizedEngine = String(engine || 'GEMINI').toUpperCase();
    const groqKey = process.env.Groq_Cloud_API || process.env.GROQ_API_KEY;

    if (normalizedEngine === 'GROQ' && groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey });
            const result = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
            });
            return { text: result.choices[0].message.content, engine: 'Groq ⚡' };
        } catch (e) {
            console.error('Groq Error:', e.message);
            // Fallback to Gemini
        }
    }

    // Default: Gemini (Primary: 1.5-flash for maximum stability)
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) throw new Error('Missing GOOGLE_API_KEY');
        
        const genAI = new GoogleGenerativeAI(apiKey);
        // 使用 2.0-flash，它是目前最稳定且响应最快的模型
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); 
        const result = await model.generateContent(prompt);
        return { text: result.response.text(), engine: 'Gemini 💎' };
    } catch (e) {
        console.error('Gemini Error:', e.message);
        throw new Error(`AI Engines exhausted: ${e.message}`);
    }
}

module.exports = { askSupremeAI };
