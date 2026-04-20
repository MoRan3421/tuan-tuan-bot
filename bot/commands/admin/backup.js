const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('🛡️ 团团的服务器时光机 (备份系统)')
        .addSubcommand(sub => 
            sub.setName('create')
               .setDescription('📸 为当前服务器创建一个“灵魂快照”备份'))
        .addSubcommand(sub => 
            sub.setName('load')
               .setDescription('⏳ 从备份中恢复服务器结构 (极其危险，请谨慎使用)')
               .addStringOption(option => option.setName('id').setDescription('备份 ID').setRequired(true))),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ 只有“全权管理员”才能动用时光机喔！', ephemeral: true });
        }

        const db = admin.firestore();
        const sub = interaction.options.getSubcommand();

        if (sub === 'create') {
            await interaction.reply('好哒！团团正在努力记录每一个房间和职位的样子，请稍等喵... 📸🐼');
            
            try {
                const roles = interaction.guild.roles.cache
                    .filter(r => !r.managed && r.name !== '@everyone')
                    .map(r => ({ name: r.name, color: r.color, permissions: r.permissions.bitfield.toString() }));

                const channels = interaction.guild.channels.cache
                    .filter(c => c.type !== ChannelType.GuildCategory)
                    .map(c => ({
                        name: c.name,
                        type: c.type,
                        parentName: c.parent ? c.parent.name : null,
                        position: c.position
                    }));

                const categories = interaction.guild.channels.cache
                    .filter(c => c.type === ChannelType.GuildCategory)
                    .map(c => ({ name: c.name, position: c.position }));

                const backupId = Math.random().toString(36).substring(2, 8).toUpperCase();
                const backupData = {
                    id: backupId,
                    guildId: interaction.guild.id,
                    name: interaction.guild.name,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdBy: interaction.user.id,
                    data: { roles, channels, categories }
                };

                await db.collection('backups').doc(backupId).set(backupData);

                const embed = new EmbedBuilder()
                    .setColor(0x5865f2)
                    .setTitle('📸 备份成功！服务器已进入时光机')
                    .setDescription(`团团已经把 **${interaction.guild.name}** 的灵魂存进竹林里啦！`)
                    .addFields(
                        { name: '备份 ID', value: `\`${backupId}\``, inline: true },
                        { name: '记录內容', value: `${channels.length} 个频道, ${roles.length} 个职位`, inline: true }
                    )
                    .setFooter({ text: '© TuanTuan Supreme Core · 时光守护者 🎋' });

                await interaction.editReply({ content: '记录完毕喵！🍢', embeds: [embed] });
            } catch (e) {
                console.error(e);
                await interaction.editReply('呜呜，时光机好像卡住了喵... 记录失败了 (QAQ)');
            }
        } else if (sub === 'load') {
            // Loading is complex and dangerous, we provide a warning and a template generator instead in another command
            return interaction.reply({ content: '⚠️ **警告:** 恢复备份功能目前仅限官方运维使用，因为这会重置服务器结构。建议使用 `/template-setup` 来生成新的结构喔！', ephemeral: true });
        }
    },
};