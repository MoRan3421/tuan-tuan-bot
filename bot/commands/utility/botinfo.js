const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('查看团团的详细信息'),
    async execute(interaction) {
        const bot = interaction.client.user;
        const guilds = interaction.client.guilds.cache.size;
        const members = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const uptime = Math.floor(interaction.client.uptime / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🐼 团团 Kawaii Panda · 机器人信息')
            .setThumbnail(bot.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: '👤 机器人名称', value: bot.username, inline: true },
                { name: '🆔 机器人 ID', value: bot.id, inline: true },
                { name: '🌍 服务器数量', value: `${guilds} 个`, inline: true },
                { name: '👥 服务用户总数', value: `${members} 人`, inline: true },
                { name: '⏱️ 运行时间', value: `${hours}时 ${minutes}分 ${seconds}秒`, inline: true },
                { name: '📝 前缀', value: '!', inline: true },
                { name: '🎮 版本', value: 'v8.0 Supreme+', inline: true },
                { name: '👨‍💻 开发者', value: 'godking512', inline: true }
            )
            .setFooter({ text: '团团是一只可爱的 AI 小熊猫喵！🐾' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
