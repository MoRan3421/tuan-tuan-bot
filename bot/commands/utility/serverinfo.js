const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('查看当前服务器的详细信息')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        const memberCount = guild.memberCount;
        const channelCount = guild.channels.cache.size;
        const roleCount = guild.roles.cache.size;
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount || 0;
        const createdAt = Math.floor(guild.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle(`🏰 ${guild.name} · 服务器信息`)
            .setThumbnail(guild.iconURL({ size: 256 }))
            .addFields(
                { name: '🆔 服务器 ID', value: guild.id, inline: true },
                { name: '👑 服务器主人', value: owner.user.tag, inline: true },
                { name: '👥 成员总数', value: `${memberCount} 人`, inline: true },
                { name: '📢 频道数量', value: `${channelCount} 个`, inline: true },
                { name: '🎭 角色数量', value: `${roleCount} 个`, inline: true },
                { name: '🚀 等级', value: `Level ${boostLevel}`, inline: true },
                { name: '💎 Boost 数量', value: `${boostCount} 次`, inline: true },
                { name: '📅 创建时间', value: `<t:${createdAt}:R>`, inline: true }
            )
            .setImage(guild.bannerURL({ size: 1024 }))
            .setFooter({ text: '团团是一只可爱的 AI 小熊猫喵！🐾' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
