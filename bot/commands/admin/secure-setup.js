const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secure-setup')
        .setDescription('🛡️ 团团的小保安：开启服务器验证系统 (Supreme Secure)')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('验证成功后要发放的职位')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ 只有“全权管理员”才能动用我的保安工具喔！', ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        const db = admin.firestore();

        try {
            await db.collection('guilds').doc(interaction.guild.id).set({
                verifyRoleId: role.id
            }, { merge: true });

            const embed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setTitle('🛡️ 服务器安全验证')
                .setDescription('为了保护服务器不受机器人骚扰，请点击下方的按钮进行身份验证喵！\n验证成功后，您将获得 **' + role.name + '** 职位并解锁服务器频道。')
                .setFooter({ text: '© TuanTuan Supreme Core · 安全卫士 🐾' })
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_user')
                    .setLabel('立即验证 🐾')
                    .setStyle(ButtonStyle.Success)
            );

            await interaction.reply({ 
                embeds: [embed], 
                components: [row]
            });
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: '❌ 哎呀，设置验证系统时出错了喵！', ephemeral: true });
        }
    },
};