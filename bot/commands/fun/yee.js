const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('tuan-joy')
        .setDescription('🦖 召唤开心团团加入狂欢！(至尊趣味互动)'),
    
    async execute(interaction) {
        const joyGifs = [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/H9M7lvORlmeF5unHnl/giphy.gif'
        ];

        const randomGif = joyGifs[Math.floor(Math.random() * joyGifs.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✨ Tuan Joy!')
            .setDescription('团团刚才在竹林里发现了一件开心的事喵！\n大家一起来：**Happy Tuan~**')
            .setImage(randomGif)
            .setFooter({ text: '© TuanTuan Supreme Core · 至尊快乐 🎋' });

        await interaction.reply({ embeds: [embed] });
    },
};