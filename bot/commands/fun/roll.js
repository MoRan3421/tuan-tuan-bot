const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('掷骰子游戏')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('骰子面数（默认6面）')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)),
    async execute(interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🎲 掷骰子')
            .setDescription(`团团帮主人掷了一个 ${sides} 面的骰子...`)
            .addFields(
                { name: '🎯 结果', value: `**${result}**`, inline: true },
                { name: '📊 面数', value: `${sides} 面`, inline: true }
            )
            .setFooter({ text: `${interaction.user.username} 掷出了 ${result} 点！` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
