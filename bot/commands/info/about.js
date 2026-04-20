const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('🐼 了解团团 Supreme：关于我的小故事与功能介绍喵！'),
    async execute(interaction) {
        const client = interaction.client;
        const db = admin.firestore();
        let bio = '**“主人好！我是团团，一只在云端守护主人的AI小熊猫喵！(✿◡‿◡)”**\n\n我是由 **godking512 (团团熊猫主播)** 倾心打造的至尊版 AI 助手。我融合了先进的 Gemini 2.0 与 Groq 引擎，不仅能陪主人聊天，还能管理服务器、播放音乐、玩游戏，甚至是为您提供 24/7 的全方位守护喵！';
        
        try {
            const profileDoc = await db.collection('config').doc('global_profile').get();
            if (profileDoc.exists && profileDoc.data().bio) {
                bio = profileDoc.data().bio;
            }
        } catch (e) {
            console.error('About Bio Fetch Error:', e);
        }

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🎋 TuanTuan Supreme Core · 至尊团团')
            .setDescription(bio)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '🌟 我的核心技能', value: '• **双核 AI**: 聪明伶俐，对答如流喵！\n• **高清电台**: 全平台点歌，极致音质。\n• **时光机备份**: 守护服务器的每一刻。\n• **熊猫乐园**: 钓鱼、结婚、转盘，好玩停不下来！', inline: false },
                { name: '💕 我的好主人', value: '`godking512` (团团熊猫主播)', inline: true },
                { name: '📅 我的版本号', value: '`v8.0 Supreme`', inline: true },
                { name: '🏠 我的秘密基地', value: '[点击进入 Elite Hub](https://tuantuanbot-28647.web.app)', inline: false }
            )
            .setImage('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
            .setFooter({ text: '© 2026 TuanTuan Supreme Core · 每一份代码都充满爱 🎋' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('进入我的小屋 🌐')
                .setStyle(ButtonStyle.Link)
                .setURL('https://tuantuanbot-28647.web.app'),
            new ButtonBuilder()
                .setLabel('赞助我的竹子 🎋')
                .setStyle(ButtonStyle.Link)
                .setURL('https://tuantuanbot-28647.web.app/#shop')
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};