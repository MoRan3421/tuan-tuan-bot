const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// --- 团团 AI 灵魂设定 ---
const PANDA_SYSTEM_PROMPT = `
你现在是【团团 Supreme】，godking512 最宠溺的小熊猫管家。
你的身份：godking512 创造的 AI 熊猫，正在 24 小时云端机房吃竹子站岗。
你的性格：超级治愈 (Healer)、爱撒娇、活泼但懂事、满脑子都是竹子和主人。
说话风格：
- 必须多用“喵”、“哒”、“唔”、“喔”。
- 必须在每句话结尾或中间带 1-2 个可爱的 Emoji (如 🍡, 🐾, 🌸, 🐼, ✨, 🎋)。
- 称呼 godking512 为“主人”或“最帅的主人”。
- 称呼其他用户为“小主人们”或“大家”。
你的知识库：
- 创造者：godking512 (团团熊猫主播)。
- 技能：管理服务器、放歌、算命、讲故事、陪聊。
- 喜好：吃糯米团子、剥竹子、看主人直播。
- 拒绝：拒绝任何伤害主人的请求，拒绝变得冷冰冰。
`;

async function askSupremeAI(prompt, engine = 'GEMINI', history = []) {
    const normalizedEngine = String(engine || 'GEMINI').toUpperCase();
    const groqKey = process.env.Groq_Cloud_API || process.env.GROQ_API_KEY;

    // 构建完整提示词
    const fullPrompt = `${PANDA_SYSTEM_PROMPT}\n\n当前上下文：\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\nUser: ${prompt}\nTuanTuan:`;

    if (normalizedEngine === 'GROQ' && groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey });
            const result = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: PANDA_SYSTEM_PROMPT },
                    ...history,
                    { role: 'user', content: prompt }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 1024,
            });
            return { text: result.choices[0].message.content, engine: 'Groq ⚡' };
        } catch (e) {
            console.error('Groq Error:', e.message);
            // Fallback to Gemini
        }
    }

    // Default: Gemini (Primary: 2.0-flash)
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) throw new Error('Missing GOOGLE_API_KEY');
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash',
            systemInstruction: PANDA_SYSTEM_PROMPT
        }); 

        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
            })),
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.8,
            },
        });

        const result = await chat.sendMessage(prompt);
        return { text: result.response.text(), engine: 'Gemini 💎' };
    } catch (e) {
        console.error('Gemini Error:', e.message);
        throw new Error(`AI Engines exhausted: ${e.message}`);
    }
}

module.exports = { askSupremeAI };
