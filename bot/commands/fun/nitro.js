const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('nitro')
        .setDescription('🎁 团团送 Nitro 啦！(趣味互动)'),
    async execute(interaction) {
        const initialEmbed = new EmbedBuilder()
            .setColor(0x7289da)
            .setTitle('✨ 发现一个野生的 Nitro 礼包！')
            .setDescription('团团刚才在竹林里捡到了一个 **Discord Nitro (1个月)** 礼包喵！\n点击下方的按钮试试运气，看看能不能领到它哒！🎋')
            .setThumbnail('https://cdn.pixabay.com/photo/2021/03/24/18/13/discord-6121408_1280.png')
            .setFooter({ text: 'TuanTuan Fun Edition · 100% 纯天然竹子制造' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claim_nitro')
                    .setLabel('立即领取 🎁')
                    .setStyle(ButtonStyle.Primary)
            );

        const response = await interaction.reply({ 
            embeds: [initialEmbed], 
            components: [row],
            fetchReply: true 
        });

        const collector = response.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'claim_nitro') {
                await i.deferUpdate();
                
                // 模拟一个加载过程
                await new Promise(resolve => setTimeout(resolve, 2000));

                const failEmbed = new EmbedBuilder()
                    .setColor(0xff4757)
                    .setTitle('❌ 哎呀！领取失败了喵...')
                    .setDescription(`对不起 ${i.user.username}，这个礼包好像被其他小熊猫抢先一步吃掉了喵！(QAQ)\n\n**团团提示:** 真正的 Nitro 可是很珍贵的喔，小主人们要小心网上那些“免费 Nitro”的诈骗链接喵！只有官方送的才是真的哒！🍡`)
                    .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif')
                    .setFooter({ text: '安全第一，团团爱你们喵！🐾' });

                await i.editReply({ embeds: [failEmbed], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] }).catch(() => {});
            }
        });
    },
};