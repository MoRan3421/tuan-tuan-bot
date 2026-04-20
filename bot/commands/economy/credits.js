const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('🪙 团团的至尊信用查询 (Supreme Credits)')
        .addUserOption(option => option.setName('user').setDescription('想查谁的账喵？')),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const db = admin.firestore();
        const userRef = db.collection('guilds').doc(interaction.guild.id).collection('members').doc(target.id);
        const doc = await userRef.get();
        const data = doc.exists ? doc.data() : { xp: 0, level: 1, bamboo: 0 };

        const embed = new EmbedBuilder()
            .setColor(0x7289da)
            .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
            .setTitle('🪙 至尊熊猫信用點 (Supreme Credits)')
            .setDescription(`${target.id === interaction.user.id ? '主人' : '这位主人'} 目前在 **${interaction.guild.name}** 的信用额度如下喵：`)
            .addFields(
                { name: '💰 信用點 (Credits)', value: `**${(data.bamboo || 0).toLocaleString()}**`, inline: true },
                { name: '📊 经验等级 (Level)', value: `**${data.level || 1}**`, inline: true }
            )
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/3135/3135706.png')
            .setFooter({ text: '© TuanTuan Supreme Core · 财富与荣誉 🎋' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};