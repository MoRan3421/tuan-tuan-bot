const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

const TEMPLATES = {
    'gaming': {
        label: '🎮 极速电竞馆 (Gaming)',
        description: '适合开黑聊天、寻找队友、语音直播',
        categories: [
            { name: '📣 团团公告区', channels: [{ name: '🎉-欢迎主人', type: ChannelType.GuildText }, { name: '📜-服务器规则', type: ChannelType.GuildText }] },
            { name: '💬 小熊猫聊天室', channels: [{ name: '🐼-闲聊灌水', type: ChannelType.GuildText }, { name: '📸-生活分享', type: ChannelType.GuildText }] },
            { name: '🎧 开黑竞技区', channels: [{ name: '🎮-寻找队友', type: ChannelType.GuildText }, { name: '🎤-五排开黑', type: ChannelType.GuildVoice }, { name: '🎵-团团点歌台', type: ChannelType.GuildVoice }] }
        ]
    },
    'community': {
        label: '🏘️ 熊猫大社区 (Community)',
        description: '适合大型综合服务器、多主题讨论',
        categories: [
            { name: '📍 新手村', channels: [{ name: '👋-欢迎新人', type: ChannelType.GuildText }, { name: '🔰-新手指南', type: ChannelType.GuildText }] },
            { name: '🗣️ 综合讨论', channels: [{ name: '💭-日常闲聊', type: ChannelType.GuildText }, { name: '💡-建议反馈', type: ChannelType.GuildText }] },
            { name: '✨ 兴趣小组', channels: [{ name: '🎨-绘画摄影', type: ChannelType.GuildText }, { name: '🍲-美食交流', type: ChannelType.GuildText }] },
            { name: '🔊 语音大厅', channels: [{ name: '🎙️-自由麦', type: ChannelType.GuildVoice }, { name: '💤-挂机休眠', type: ChannelType.GuildVoice }] }
        ]
    },
    'study': {
        label: '📚 团团自习室 (Study)',
        description: '适合专注学习、作业讨论、知识分享',
        categories: [
            { name: '🔔 自习公告', channels: [{ name: '📅-今日计划', type: ChannelType.GuildText }, { name: '📖-资源分享', type: ChannelType.GuildText }] },
            { name: '📝 讨论区域', channels: [{ name: '❓-有问必答', type: ChannelType.GuildText }, { name: '✍️-作业互助', type: ChannelType.GuildText }] },
            { name: '🔇 沉浸自习', channels: [{ name: '💻-静音专注', type: ChannelType.GuildVoice }, { name: '🎵-白噪音播放', type: ChannelType.GuildVoice }] }
        ]
    }
};

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('template-setup')
        .setDescription('🏰 团团帮主人一键布置新家！(模板生成系统)'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ 只有“全权管理员”才能动用我的装修工具喔！', ephemeral: true });
        }

        const mainEmbed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🏰 团团的服务器装修公司 · Supreme Core')
            .setDescription('主人想把这里布置成什么样的风格喵？\n请在下方选择一个模板，团团会瞬间为您建好所有的频道和分类喔！✨🎋\n\n**注意:** 团团会创建新的分类，不会删除旧的内容喵！')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: '© TuanTuan Supreme Core · 设计与施工 🐼🐾' });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('template_select')
            .setPlaceholder('请选择一个装修风格喵...')
            .addOptions(Object.keys(TEMPLATES).map(key => ({
                label: TEMPLATES[key].label,
                description: TEMPLATES[key].description,
                value: key
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({ 
            embeds: [mainEmbed], 
            components: [row] 
        });

        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect,
            time: 60000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '❌ 呜呜，只有刚才喊团团的主人才能指挥我喵！', ephemeral: true });
            }

            const selection = i.values[0];
            const template = TEMPLATES[selection];

            await i.update({ 
                content: `🧱 **装修工程开工！** 团团正在为您布置 [${template.label}]，请稍等喵... 🐼🏗️`, 
                embeds: [], 
                components: [] 
            });

            try {
                for (const cat of template.categories) {
                    const category = await interaction.guild.channels.create({
                        name: cat.name,
                        type: ChannelType.GuildCategory
                    });

                    for (const ch of cat.channels) {
                        await interaction.guild.channels.create({
                            name: ch.name,
                            type: ch.type,
                            parent: category.id
                        });
                    }
                }

                const successEmbed = new EmbedBuilder()
                    .setColor(0x7ed6df)
                    .setTitle('🏰 装修大功告成！新家落成喵！✨')
                    .setDescription(`主人请看，团团已经把 [${template.label}] 风格的频道都建好啦！🍡🐾\n如果主人不满意，还可以自己微调喔~`)
                    .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2XY3m0SlS/giphy.gif')
                    .setFooter({ text: '© TuanTuan Supreme Core · 居住愉快 🌸' });

                await interaction.followUp({ embeds: [successEmbed] });
            } catch (e) {
                console.error(e);
                await interaction.followUp({ content: '❌ 哎呀，搬砖的时候摔了一跤喵！装修失败了，请检查我的权限喔！(QAQ)' });
            }
        });
    },
};