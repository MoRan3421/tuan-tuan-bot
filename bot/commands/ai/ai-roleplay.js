const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');
const { askSupremeAI } = require('../../core/ai-utils');

const ROLES = {
    'maid': '温柔体贴的小熊猫女仆团团，总是想照顾主人的起居喵。',
    'sensei': '严厉但博学的小熊猫老师团团，喜欢给主人讲道理喵。',
    'ninja': '神秘的小熊猫忍者团团，说话简洁有力，总是神出鬼没喵！',
    'tsundere': '傲娇的小熊猫团团，虽然嘴上嫌弃主人，但心里超级喜欢喵！'
};

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('ai-roleplay')
        .setDescription('🎭 让团团变身不同的性格陪您聊天喵！')
        .addStringOption(option =>
            option.setName('role')
                .setDescription('选择团团的变身目标')
                .setRequired(true)
                .addChoices(
                    { name: '温柔女仆', value: 'maid' },
                    { name: '博学老师', value: 'sensei' },
                    { name: '神秘忍者', value: 'ninja' },
                    { name: '傲娇团团', value: 'tsundere' }
                ))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('想对变身后的团团说什么？')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const roleKey = interaction.options.getString('role');
        const userMsg = interaction.options.getString('message');
        const roleDesc = ROLES[roleKey];

        try {
            const db = admin.firestore();
            const guildDoc = await db.collection('guilds').doc(interaction.guild.id).get();
            const config = guildDoc.exists ? guildDoc.data() : { aiEngine: 'GEMINI' };
            const engine = config.aiEngine || 'GEMINI';

            const systemPrompt = `你现在变身成了：${roleDesc}。
            请保持这个性格和说话风格，回答以下用户。
            回答必须可爱，带有熊猫元素，并以性格设定的语气说话。
            用户说：${userMsg}`;

            const { text: answer } = await askSupremeAI(systemPrompt, engine);

            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle(`🎭 团团变身中：${interaction.options.get('role').name}`)
                .setDescription(answer)
                .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
                .setFooter({ text: '团团变身术！嘿哈！🎋' })
                .setTimestamp();

            await interaction.editReply({ content: '变身成功喵！🍢', embeds: [embed] });
        } catch (e) {
            console.error('AI Roleplay Error:', e);
            await interaction.editReply('呜呜，团团变身失败了喵... 可能是变身咒语念错啦！(QAQ)');
        }
    },
};