const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

const FISH_TYPES = [
    { name: '小鱼仔 🐟', xp: 5, bamboo: 2, chance: 50 },
    { name: '大草鱼 🐡', xp: 15, bamboo: 5, chance: 30 },
    { name: '金色鲤鱼 🐠', xp: 50, bamboo: 20, chance: 15 },
    { name: '千年老龟 🐢', xp: 150, bamboo: 100, chance: 4 },
    { name: '传说中的亚特兰蒂斯竹子 🎋✨', xp: 500, bamboo: 300, chance: 1 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('🎣 陪团团去小溪边钓鱼喵！(赢取竹子和经验)'),
    async execute(interaction) {
        await interaction.reply('好哒！团团这就带上小鱼竿，咱们出发去小溪边喵！🚣‍♂️🎋');

        // Random delay to simulate fishing
        const waitTime = Math.floor(Math.random() * 5000) + 2000;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        const random = Math.random() * 100;
        let caught = null;
        let cumulative = 0;

        for (const fish of FISH_TYPES) {
            cumulative += fish.chance;
            if (random <= cumulative) {
                caught = fish;
                break;
            }
        }

        if (!caught) {
            return interaction.editReply('呜呜，鱼儿们好像都在睡觉喵，咱们下次再来吧... (QAQ)');
        }

        const db = admin.firestore();
        const memberRef = db.collection('guilds').doc(interaction.guild.id).collection('members').doc(interaction.user.id);
        
        await db.runTransaction(async (t) => {
            const doc = await t.get(memberRef);
            const data = doc.exists ? doc.data() : { xp: 0, level: 1, bamboo: 0 };
            t.set(memberRef, {
                xp: (data.xp || 0) + caught.xp,
                bamboo: (data.bamboo || 0) + caught.bamboo,
                last_fish: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        });

        const embed = new EmbedBuilder()
            .setColor(0x00d2ff)
            .setTitle('🎣 哇！鱼儿上钩啦！')
            .setDescription(`恭喜主人！团团帮您钓到了一只 **${caught.name}**！`)
            .addFields(
                { name: '奖励经验', value: `+${caught.xp} XP`, inline: true },
                { name: '奖励竹子', value: `+${caught.bamboo} 🎋`, inline: true }
            )
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3062/3062276.png')
            .setFooter({ text: '团团最喜欢和主人一起钓鱼了喵~ 🐾' })
            .setTimestamp();

        await interaction.editReply({ content: '报告主人！大丰收喵！🍢', embeds: [embed] });
    },
};