const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('🖐️ 摸摸头，给对方一个可爱的安慰喵！')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('主人想摸摸谁呀？')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.client.user;
        const isSelf = target.id === interaction.user.id;
        const isBot = target.id === interaction.client.user.id;

        let description = '';
        let image = '';

        if (isBot) {
            description = `呜哇！主人摸了团团的头喵！好舒服喔... 团团的毛都要变软了哒！(>ω<) 🌸🎋`;
            image = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtZzZyeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5JmU9Zw/3o7TKMGpxP5O0M6C8o/giphy.gif';
        } else if (isSelf) {
            description = `主人在自己摸自己吗？团团也来帮主人摸摸！一定要好好爱自己喵！🍡🐾`;
            image = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtZzZyeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5JmU9Zw/5tmRhwTlHGFu5SHfV8/giphy.gif';
        } else {
            description = `**${interaction.user.username}** 伸出小手，温柔地摸了摸 **${target.username}** 的小脑袋！\n“要乖乖的喔，给你一颗糯米团子喵！” 🍢✨`;
            image = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtZzZyeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5JmU9Zw/ARSp9T+/giphy.gif';
        }

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🌸 温柔的摸摸头')
            .setDescription(description)
            .setImage(image)
            .setFooter({ text: '团团最喜欢这种温馨的时刻了喵！🐾' });

        await interaction.reply({ embeds: [embed] });
    },
};
