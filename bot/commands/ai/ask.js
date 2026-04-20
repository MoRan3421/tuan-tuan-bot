const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
    premiumOnly: false, // 基础 AI 问答对所有人开放喵！
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('🧠 向团团提问任何奇思妙想喵！✨')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('主人想问团团什么呀？')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const question = interaction.options.getString('question');

        try {
            const db = admin.firestore();
            const guildDoc = await db.collection('guilds').doc(interaction.guild.id).get();
            const config = guildDoc.exists ? guildDoc.data() : { aiEngine: 'GEMINI' };
            const engine = config.aiEngine || 'GEMINI';

            const { askSupremeAI } = require('../../core/ai-utils');
            const result = await askSupremeAI(question, engine);

            if (!result || !result.text) {
                return interaction.editReply('呜呜，团团的大脑卡住了喵！API 没有返回任何内容呢 (QAQ)');
            }

            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle(`🧠 团团的智慧结晶 (${result.engine || 'Gemini'})`)
                .setDescription(result.text)
                .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
                .setFooter({ text: '团团会一直陪着主人哒！🌸' })
                .setTimestamp();

            await interaction.editReply({ content: '主人！团团想好啦：🍢', embeds: [embed] });
        } catch (e) {
            console.error('❌ Ask AI Error:', e.message);
            await interaction.editReply('呜呜，团团脑仁儿疼，想不出来啦！(>_<) 可能是竹子吃太饱了，请稍后再试喵。');
        }
    },
};
