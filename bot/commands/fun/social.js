const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ACTIONS = {
    'hug': { verb: '抱住了', emoji: '🫂', color: '#ff9a9e', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'kiss': { verb: '亲吻了', emoji: '💋', color: '#ffb7c5', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'slap': { verb: '扇了', emoji: '💢', color: '#ff4757', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'pat': { verb: '摸了摸', emoji: '🖐️', color: '#feca57', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'poke': { verb: '戳了戳', emoji: '👉', color: '#48dbfb', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'cuddle': { verb: '依偎在', emoji: '🧸', color: '#ff9ff3', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'highfive': { verb: '击掌了', emoji: '✋', color: '#1dd1a1', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'tickle': { verb: '挠了挠', emoji: '👐', color: '#f9ca24', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'bite': { verb: '咬了', emoji: '🦷', color: '#eb4d4b', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'dance': { verb: '和', emoji: '💃', color: '#686de0', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'wave': { verb: '向', emoji: '👋', color: '#95afc0', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'wink': { verb: '向', emoji: '😉', color: '#e056fd', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'blush': { verb: '对着', emoji: '😳', color: '#badc58', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'cry': { verb: '在', emoji: '😭', color: '#7ed6df', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'laugh': { verb: '对着', emoji: '🤣', color: '#f0932b', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'shrug': { verb: '向', emoji: '🤷', color: '#c7ecee', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'pout': { verb: '对着', emoji: '😤', color: '#ffbe76', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'scare': { verb: '吓了', emoji: '😱', color: '#4834d4', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'punch': { verb: '揍了', emoji: '👊', color: '#be2edd', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'kick': { verb: '踢了', emoji: '🦵', color: '#22a6b3', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'stare': { verb: '盯着', emoji: '👀', color: '#130f40', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'smile': { verb: '向', emoji: '😊', color: '#f9ca24', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'wink': { verb: '向', emoji: '😉', color: '#f0932b', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'clap': { verb: '为', emoji: '👏', color: '#ffbe76', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'sleep': { verb: '在', emoji: '😴', color: '#7ed6df', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'think': { verb: '对着', emoji: '🤔', color: '#95afc0', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'shout': { verb: '对着', emoji: '📢', color: '#ff4757', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'cheer': { verb: '为', emoji: '🎉', color: '#2ecc71', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'beg': { verb: '向', emoji: '🥺', color: '#f1c40f', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'bored': { verb: '对着', emoji: '😑', color: '#bdc3c7', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
    'confused': { verb: '向', emoji: '❓', color: '#34495e', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif' },
};

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('social')
        .setDescription('🌟 团团的百宝交互袋！(包含 30+ 种萌萌互动)')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('想做什么交互喵？')
                .setRequired(true)
                .addChoices(...Object.keys(ACTIONS).slice(0, 25).map(key => ({ name: `${ACTIONS[key].emoji} ${key}`, value: key }))))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('互动的对象喵？')
                .setRequired(true)),
    async execute(interaction) {
        const actionKey = interaction.options.getString('action');
        const target = interaction.options.getUser('user');
        const action = ACTIONS[actionKey];

        const embed = new EmbedBuilder()
            .setColor(action.color)
            .setDescription(`**${interaction.user.username}** ${action.verb} **${target.username}** ${action.emoji}`)
            .setImage(action.gif)
            .setFooter({ text: '© TuanTuan Supreme Core · 爱的抱抱 🎋' });

        await interaction.reply({ embeds: [embed] });
    },
};