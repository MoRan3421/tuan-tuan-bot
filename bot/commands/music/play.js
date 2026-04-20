const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 让团团为您演奏音乐喵！支持 YT/Spotify/SoundCloud')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('想听什么歌？告诉团团吧~')
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const query = interaction.options.getString('query');
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.reply({ content: '❌ 呜呜，请先进入一个语音频道找团团喔！', ephemeral: true });
        
        // Check if bot has permissions to join and speak
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({ content: '❌ 团团没有权限进入或在频道说话喵！请检查权限喔~', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const result = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply({ content: '❌ 呜呜，团团找遍了整个森林也没找到这首歌喵...' });
            }

            const { track } = await player.play(channel, result, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        interaction: interaction
                    },
                    bufferingTimeout: 15000,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    selfDeaf: true
                },
            });

            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle('🎶 团团点播成功！')
                .setDescription(`已经为主唱准备好啦：**${track.title}**`)
                .setThumbnail(track.thumbnail)
                .addFields(
                    { name: '曲目时长', value: `\`${track.duration}\``, inline: true },
                    { name: '点播官', value: `${interaction.user.username}`, inline: true }
                )
                .setFooter({ text: '小熊猫正在卖力为您演奏喵！🐾' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.error('Player Error:', e);
            return interaction.editReply(`❌ 哎呀，团团搬磁带的时候摔了一跤：\n\`${e.message}\``);
        }
    },
};

