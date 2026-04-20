const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    premiumOnly: true, // 只有 Premium 才能在至尊宇宙结婚喔！
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('💍 向心仪的 TA 求婚喵！(至尊版专属浪漫)')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('主人想和谁求婚呀？')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ 诶？主人想和自己结婚吗？团团虽然不反对，但这样会很寂寞哒喵！', ephemeral: true });
        }
        if (target.bot) {
            return interaction.reply({ content: '❌ 呜呜，机器人是不能结婚的喔，虽然团团也很喜欢主人喵！', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('💍 浪漫求婚现场')
            .setDescription(`**${interaction.user.username}** 捧着一束新鲜的竹叶（？），单膝跪在 **${target.username}** 面前！\n\n“你愿意和我一起在团团的见证下，共同守护这片竹林吗喵？”`)
            .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
            .setFooter({ text: '请在 60 秒内做出决定喔！🐾' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('marry_accept')
                    .setLabel('我愿意！💍')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('marry_reject')
                    .setLabel('拒绝 (QAQ)')
                    .setStyle(ButtonStyle.Danger)
            );

        const response = await interaction.reply({ content: `${target}，有人向你求婚啦喵！✨`, embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== target.id) {
                return i.reply({ content: '哼，这不是主人的婚礼，不要乱点喔！', ephemeral: true });
            }

            if (i.customId === 'marry_accept') {
                const successEmbed = new EmbedBuilder()
                    .setColor(0xff69b4)
                    .setTitle('🎊 婚礼礼成！呜呼！')
                    .setDescription(`恭喜 **${interaction.user.username}** 和 **${target.username}** 正式结为夫妻喵！\n团团宣布：你们可以互相交换糯米团子啦！🍡🥂🌸\n\n愿你们的爱情像竹子一样节节高，像熊猫一样圆滚滚喵！`)
                    .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnh4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4JmU9Zw/3o7TKoWXm3okO1kgHC/giphy.gif');
                
                await i.update({ content: '🎊 撒花！撒花！', embeds: [successEmbed], components: [] });
            } else {
                await i.update({ content: '💔 呜呜，求婚被拒绝了... 团团的小心心也碎了一地喵。', embeds: [], components: [] });
            }
        });
    },
};
