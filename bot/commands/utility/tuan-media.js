const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('tuan-media')
        .setDescription('🔍 团团的至尊媒体搜索器 (Premium 专属)')
        .addSubcommand(sub => 
            sub.setName('youtube')
               .setDescription('🎥 搜索 YouTube 视频喵！')
               .addStringOption(opt => opt.setName('query').setDescription('搜索关键词').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('spotify')
               .setDescription('🎵 搜索 Spotify 曲目喵！')
               .addStringOption(opt => opt.setName('query').setDescription('歌名或艺人').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('image')
               .setDescription('🖼️ 搜索精美图片喵！')
               .addStringOption(opt => opt.setName('query').setDescription('想看什么？').setRequired(true))),
    
    async execute(interaction) {
        await interaction.deferReply();
        const sub = interaction.options.getSubcommand();
        const query = interaction.options.getString('query');
        
        // In a real bot, you'd use YT-Search or Spotify Web API
        // For this demo, we'll return a formatted embed with search links
        const searchLinks = {
            'youtube': `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            'spotify': `https://open.spotify.com/search/${encodeURIComponent(query)}`,
            'image': `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
        };

        const embed = new EmbedBuilder()
            .setColor(0x1db954)
            .setTitle(`🔍 团团帮您找到了关于「${query}」的内容！`)
            .setDescription(`主人，这是为您在 **${sub.toUpperCase()}** 上搜寻的结果喵！✨`)
            .addFields({ name: '快捷传送门', value: `[点击这里直达喵！](${searchLinks[sub]})` })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: '© TuanTuan Supreme Core · 媒体大师 🎋' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};