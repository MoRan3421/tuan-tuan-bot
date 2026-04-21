const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('⏰ 设置一个提醒')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('提醒内容')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('minutes')
                .setDescription('几分钟后提醒（1-60分钟）')
                .setMinValue(1)
                .setMaxValue(60)
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const minutes = interaction.options.getInteger('minutes');
        
        const remindTime = Date.now() + (minutes * 60 * 1000);
        const remindTimeString = new Date(remindTime).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('⏰ 提醒已设置！')
            .setDescription(`团团会在 **${minutes}** 分钟后提醒你：\n\n📝 **${message}**`)
            .addFields(
                { name: '🕐 提醒时间', value: remindTimeString, inline: true },
                { name: '👤 设置者', value: `<@${interaction.user.id}>`, inline: true }
            )
            .setFooter({ text: '团团会准时提醒你的！🐼' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        
        // 设置定时器
        setTimeout(async () => {
            try {
                const remindEmbed = new EmbedBuilder()
                    .setColor(0xffb7c5)
                    .setTitle('⏰ 时间到啦！')
                    .setDescription(`<@${interaction.user.id}>，你设置的提醒：\n\n📝 **${message}**`)
                    .setFooter({ text: '团团准时来提醒你啦！🐼' })
                    .setTimestamp();
                
                await interaction.channel.send({ embeds: [remindEmbed] });
            } catch (error) {
                console.error('Reminder error:', error);
            }
        }, minutes * 60 * 1000);
    },
};
