const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('fortune')
        .setDescription('🔮 团团的小竹签：测测主人的今日运势喵！'),
    async execute(interaction) {
        const fortunes = [
            { title: '🎋 大吉 · 竹林盛宴', desc: '哇！今天是超级无敌幸运日喵！出门就能捡到糯米团子，心想事成喔！', color: 0xffd700 },
            { title: '🌸 中吉 · 樱花烂漫', desc: '运势很不错哒！会有意想不到的小惊喜，记得多笑笑喔喵！', color: 0xffb7c5 },
            { title: '🍃 小吉 · 清风拂面', desc: '平稳而快乐的一天。适合发呆、吃零食和找团团聊天喵！', color: 0xc1ffc1 },
            { title: '⛅ 末吉 · 云淡风轻', desc: '虽然没有特别的大好事，但平淡也是一种幸福喔，加油喵！', color: 0xf0f0f0 },
            { title: '🍙 平 · 饭团饱饱', desc: '今天普普通通，适合多吃点好吃的补充能量喵！', color: 0xffdead },
            { title: '🌧️ 凶 · 淋雨熊猫', desc: '唔，今天可能会有点小倒霉，不过没关系，团团会一直抱抱你的喵！(>_<)', color: 0xa2d2ff }
        ];

        const result = fortunes[Math.floor(Math.random() * fortunes.length)];
        const advice = [
            '建议：去喝一杯奶茶喵！',
            '建议：给喜欢的人发个可爱的表情包喔！',
            '建议：听一首轻快的歌喵！',
            '建议：早点睡觉，梦里有大竹林喔！',
            '建议：对镜子里的自己夸一句“你真棒”喵！'
        ];

        const embed = new EmbedBuilder()
            .setColor(result.color)
            .setTitle(`🔮 团团的熊猫占卜 · ${result.title}`)
            .setDescription(`${result.desc}\n\n✨ **团团的建议：**\n${advice[Math.floor(Math.random() * advice.length)]}`)
            .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
            .setFooter({ text: '占卜结果仅供娱乐，团团永远支持主人喵！🐾' })
            .setTimestamp();

        await interaction.reply({ content: '🔮 团团正在摇晃签筒... 咔哒咔哒... 喵！', embeds: [embed] });
    },
};
