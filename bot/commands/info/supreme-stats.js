const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supreme-stats')
        .setDescription('📊 团团的至尊运行报告 (Supreme Analytics)'),
    async execute(interaction) {
        const client = interaction.client;
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        const embed = new EmbedBuilder()
            .setColor(0x8e44ad)
            .setTitle('📊 TuanTuan Supreme 运行概览')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🌐 服务规模', value: `\`${guildCount}\` 个服务器\n\`${userCount}\` 名小主人`, inline: true },
                { name: '⏱️ 运行时间', value: `\`${days}d ${hours}h ${minutes}m\``, inline: true },
                { name: '🧠 核心引擎', value: 'Gemini 2.0 / Groq Llama 3.3', inline: false },
                { name: '📜 指令总数', value: '800+ (包含动态与聚合指令)', inline: true },
                { name: '🎋 品牌版权', value: '© 2026 TuanTuan Supreme Core', inline: true }
            )
            .setFooter({ text: 'Designed by godking512 · 团团在努力工作喵 🐾' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};