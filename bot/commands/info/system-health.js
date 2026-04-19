const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('system-health')
        .setDescription('🩺 看看团团的身体健康检查报告喵！✨'),
    async execute(interaction) {
        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        // Memory info
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const healthEmbed = new EmbedBuilder()
            .setColor(0x00ffcc)
            .setTitle('🩺 TuanTuan Supreme 核心体检报告')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: '🌐 运行环境', value: 'Google Cloud Run (Node 22)', inline: true },
                { name: '⏱️ 连续工作时间', value: `${days}天 ${hours}时 ${minutes}分`, inline: true },
                { name: '🧠 内存消耗', value: `${memoryUsage} MB`, inline: true },
                { name: '🌍 机房负载', value: `空闲内存: ${freeMem} / ${totalMem} GB`, inline: true },
                { name: '🤖 AI 脑核状态', value: 'Gemini 1.5 Flash (正常运转)', inline: false },
                { name: '📦 CI/CD 状态', value: 'GitHub Auto-Sync (激活)', inline: true },
                { name: '📡 交互延迟', value: `${interaction.client.ws.ping}ms`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Designed by godking512 · 系统状态稳定', iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [healthEmbed] });
    },
};
