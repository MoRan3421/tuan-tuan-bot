const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const admin = require('firebase-admin');

const ITEMS = {
    'xp_boost': { name: '✨ 经验加成卡 (2h)', price: 500, description: '在 2 小时内获得 1.5 倍经验值喵！', icon: '⚡' },
    'golden_bamboo': { name: '🎋 黄金竹子', price: 2000, description: '极其珍贵的零食，送给 TA 能增加大量好感度喵！', icon: '💎' },
    'title_badge': { name: '🏅 至尊勋章', price: 5000, description: '在个人资料卡片上显示专属的至尊勋章喵！', icon: '🌟' },
    'custom_background': { name: '🖼️ 专属背景', price: 10000, description: '解锁一张超萌的 Rank Card 专属背景喵！', icon: '🎨' }
};

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('🛒 团团的至尊竹子商店：使用竹子购买神奇道具喵！'),
    async execute(interaction) {
        const db = admin.firestore();
        const userRef = db.collection('guilds').doc(interaction.guild.id).collection('members').doc(interaction.user.id);
        const doc = await userRef.get();
        const bamboo = doc.exists ? (doc.data().bamboo || 0) : 0;

        const mainEmbed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🛒 团团的至尊竹子商店')
            .setDescription(`欢迎光临！主人目前拥有：**${bamboo.toLocaleString()} 🎋**\n请在下方选择您想要购买的神奇道具喵！✨`)
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3081/3081840.png')
            .setFooter({ text: '© 2026 TuanTuan Supreme Core · 购物愉快 🎋' });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('shop_buy')
            .setPlaceholder('请选择一个道具喵...')
            .addOptions(Object.keys(ITEMS).map(key => ({
                label: ITEMS[key].name,
                description: `${ITEMS[key].price} 🎋 | ${ITEMS[key].description}`,
                value: key,
                emoji: ITEMS[key].icon
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({ embeds: [mainEmbed], components: [row] });

        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect,
            time: 60000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: '❌ 呜呜，只有刚才喊团团的主人才能操作喔！', ephemeral: true });

            const selection = i.values[0];
            const item = ITEMS[selection];

            if (bamboo < item.price) {
                return i.reply({ content: `❌ 哎呀，主人的竹子不够喵！购买 **${item.name}** 需要 **${item.price}** 🎋，主人还差 **${item.price - bamboo}** 🎋 喔！`, ephemeral: true });
            }

            try {
                await db.runTransaction(async (t) => {
                    t.update(userRef, {
                        bamboo: admin.firestore.FieldValue.increment(-item.price),
                        inventory: admin.firestore.FieldValue.arrayUnion(selection)
                    });
                });

                const successEmbed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('🎉 购买成功喵！')
                    .setDescription(`恭喜主人成功购买了 **${item.name}**！✨\n竹子已扣除 **${item.price}** 🎋，道具已经放进主人的背包啦！`)
                    .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif')
                    .setFooter({ text: '团团最喜欢看主人买买买了喵！🐾' });

                await i.update({ embeds: [successEmbed], components: [] });
            } catch (e) {
                console.error(e);
                await i.reply({ content: '❌ 呜呜，收银台卡住了喵！购买失败，请稍后再试喔 (QAQ)', ephemeral: true });
            }
        });
    },
};