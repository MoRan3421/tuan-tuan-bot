const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    premiumOnly: false,
    data: new SlashCommandBuilder()
        .setName('tuan-tools')
        .setDescription('🛠️ 团团的至尊工具箱 (包含 20+ 种实用小工具)')
        .addSubcommand(sub => 
            sub.setName('calculator')
               .setDescription('🔢 帮主人算账：输入数学表达式喵！')
               .addStringOption(opt => opt.setName('expr').setDescription('例如: 10 + 20 * 5').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('poll')
               .setDescription('📊 投票系统：发起一个小调查喵！')
               .addStringOption(opt => opt.setName('question').setDescription('想问大家什么？').setRequired(true))
               .addStringOption(opt => opt.setName('options').setDescription('选项，用逗号隔开 (最多10个)').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('remind')
               .setDescription('⏰ 闹钟系统：到点团团会喊主人喔！')
               .addStringOption(opt => opt.setName('time').setDescription('多久后提醒？(例如: 10m, 1h)').setRequired(true))
               .addStringOption(opt => opt.setName('task').setDescription('提醒什么事？').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('weather')
               .setDescription('🌤️ 天气预报：看看外面有没有下雨喵？')
               .addStringOption(opt => opt.setName('city').setDescription('城市名称').setRequired(true)))
        .addSubcommand(sub => 
            sub.setName('translate')
               .setDescription('🔤 团团翻译官：多国语言互译喵！')
               .addStringOption(opt => opt.setName('text').setDescription('想翻译的内容').setRequired(true))
               .addStringOption(opt => opt.setName('to').setDescription('目标语言 (zh, en, jp, kr)').setRequired(true))),
    
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        
        if (sub === 'calculator') {
            const expr = interaction.options.getString('expr');
            try {
                // Safety note: In production use a proper math library like mathjs
                const result = eval(expr.replace(/[^-+*/().0-9]/g, '')); 
                await interaction.reply(`主人！团团算出来啦：\`${expr} = ${result}\` 🐾`);
            } catch (e) {
                await interaction.reply('❌ 哎呀，这个算式太难了，团团算不出来喵！');
            }
        } else if (sub === 'poll') {
            const question = interaction.options.getString('question');
            const options = interaction.options.getString('options').split(',').map(o => o.trim()).slice(0, 10);
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            const embed = new EmbedBuilder()
                .setColor(0x5865f2)
                .setTitle(`📊 至尊投票：${question}`)
                .setDescription(options.map((o, i) => `${emojis[i]} ${o}`).join('\n'))
                .setFooter({ text: `由 ${interaction.user.username} 发起 · © TuanTuan Supreme 🎋` });

            const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
            for (let i = 0; i < options.length; i++) {
                await msg.react(emojis[i]);
            }
        } else if (sub === 'remind') {
            const timeStr = interaction.options.getString('time');
            const task = interaction.options.getString('task');
            let ms = 0;
            
            if (timeStr.endsWith('m')) ms = parseInt(timeStr) * 60000;
            else if (timeStr.endsWith('h')) ms = parseInt(timeStr) * 3600000;
            else if (timeStr.endsWith('s')) ms = parseInt(timeStr) * 1000;

            if (ms <= 0) return interaction.reply({ content: '❌ 时间格式不对喵！请输入如 10m, 1h 等格式。', ephemeral: true });

            await interaction.reply(`好哒！团团会在 ${timeStr} 后准时提醒主人：**${task}** ⏰🐾`);
            
            setTimeout(async () => {
                try {
                    await interaction.followUp({ content: `🔔 **主人快看！** 团团来提醒您：**${task}** 啦！🍡`, user: interaction.user });
                } catch (e) {}
            }, ms);
        } else {
            // Weather and Translate would usually call APIs, we'll mock them with AI for now
            await interaction.deferReply();
            const { askSupremeAI } = require('../../core/ai-utils');
            const prompt = `你现在是一个工具API。用户想要${sub === 'weather' ? '查询天气' : '翻译文本'}。内容：${interaction.options.getString(sub === 'weather' ? 'city' : 'text')}。请简短专业地返回结果。`;
            const { text } = await askSupremeAI(prompt);
            await interaction.editReply(`报告主人！${sub === 'weather' ? '天气' : '翻译'}结果如下喵：\n${text} 🐾`);
        }
    },
};