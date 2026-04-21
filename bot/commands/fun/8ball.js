const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const responses = [
    '是的，绝对是这样！',
    '毫无疑问！',
    '当然可以！',
    '前景很好！',
    '是的！',
    '很可能',
    '看起来不错',
    '是的，我觉得是',
    '回复模糊，再试一次',
    '稍后再问我',
    '现在无法预测',
    '专注再问一次',
    '别指望它',
    '我的回答是否定的',
    '我的来源说不',
    '不太好',
    '非常值得怀疑'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('魔法8球 - 让团团帮你做决定')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('你想问的问题')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🎱 魔法8球')
            .addFields(
                { name: '❓ 问题', value: question, inline: false },
                { name: '🔮 团团的回答', value: response, inline: false }
            )
            .setFooter({ text: `由 ${interaction.user.username} 提问` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
