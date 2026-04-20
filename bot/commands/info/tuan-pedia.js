const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const DATA = {
    'facts': { title: '🐼 熊猫冷知识', list: ['大熊猫每天要吃 12-38 公斤的竹子喵！', '熊猫其实是独居动物，喜欢安静。', '刚出生的熊猫宝宝只有一根香肠那么大。'] },
    'bamboo': { title: '🎋 竹子百科', list: ['竹子是草本植物，不是树喔！', '有的竹子一天能长一米高，团团都跟不上。', '全球有 1200 多种竹子，团团最爱甜竹。'] },
    'owner': { title: '💕 关于主人', list: ['主人 godking512 是最帅的熊猫主播！', '主人创造了团团，给了团团灵魂喵。', '主人的直播间里充满了欢声笑语。'] },
    'tips': { title: '💡 团团的小贴士', list: ['早睡早起身体好，主人不要熬夜喔。', '多喝热水，少喝冷饮喵。', '开心的时候记得给团团一个抱抱。'] },
    'jokes': { title: '🤣 团团的冷笑话', list: ['熊猫最想拍什么照片？彩色照片喵！', '为什么熊猫不玩捉迷藏？因为黑眼圈太明显啦。', '团团的愿望是什么？全世界的竹子都变甜！'] }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tuan-pedia')
        .setDescription('📖 团团的熊猫百科全书 (包含 50+ 知识点)')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('想看哪个分类喵？')
                .setRequired(true)
                .addChoices(
                    { name: '🐼 熊猫知识', value: 'facts' },
                    { name: '🎋 竹子百科', value: 'bamboo' },
                    { name: '💕 关于主人', value: 'owner' },
                    { name: '💡 小贴士', value: 'tips' },
                    { name: '🤣 冷笑话', value: 'jokes' }
                )),
    async execute(interaction) {
        const catKey = interaction.options.getString('category');
        const cat = DATA[catKey];
        const randomItem = cat.list[Math.floor(Math.random() * cat.list.length)];

        const embed = new EmbedBuilder()
            .setColor(0x7ed6df)
            .setTitle(cat.title)
            .setDescription(randomItem)
            .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
            .setFooter({ text: '© TuanTuan Supreme Core · 知识就是力量 🎋' });

        await interaction.reply({ embeds: [embed] });
    },
};