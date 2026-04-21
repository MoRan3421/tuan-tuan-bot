const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const quizQuestions = [
    {
        question: '🐼 团团是什么动物？',
        options: ['熊猫', '猫', '狗', '兔子'],
        correct: 0,
        emoji: '🐼'
    },
    {
        question: '🎋 团团最喜欢吃什么？',
        options: ['竹子', '苹果', '香蕉', '糖果'],
        correct: 0,
        emoji: '🎋'
    },
    {
        question: '🎵 团团可以播放音乐吗？',
        options: ['可以！', '不可以', '只会唱歌', '只会跳舞'],
        correct: 0,
        emoji: '🎵'
    },
    {
        question: '🧠 团团有 AI 功能吗？',
        options: ['有！双核 AI', '没有', '只有单核', '只有音乐功能'],
        correct: 0,
        emoji: '🧠'
    },
    {
        question: '💎 Supreme+ 是什么？',
        options: ['至尊会员', '普通会员', '免费功能', '游戏道具'],
        correct: 0,
        emoji: '💎'
    },
    {
        question: '🌸 团团最喜欢的花是什么？',
        options: ['樱花', '玫瑰', '向日葵', '菊花'],
        correct: 0,
        emoji: '🌸'
    }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('🎮 团团知识问答游戏'),
    async execute(interaction) {
        // 随机选择一个问题
        const question = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        
        // 创建按钮
        const rows = [];
        const currentRow = new ActionRowBuilder();
        
        question.options.forEach((option, index) => {
            const button = new ButtonBuilder()
                .setCustomId(`quiz_${index}`)
                .setLabel(option)
                .setStyle(ButtonStyle.Primary);
            
            currentRow.addComponents(button);
        });
        
        rows.push(currentRow);
        
        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle(`${question.emoji} 团团知识问答`)
            .setDescription(`**${question.question}**\n\n选择一个答案吧！`)
            .setFooter({ text: '限时 30 秒，快快回答！⏰' })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], components: rows, fetchReply: true });
        
        // 创建按钮收集器
        const collector = message.createMessageComponentCollector({
            filter: i => i.customId.startsWith('quiz_'),
            time: 30000
        });
        
        let answered = false;
        
        collector.on('collect', async i => {
            if (answered) return;
            answered = true;
            
            const selectedIndex = parseInt(i.customId.split('_')[1]);
            const isCorrect = selectedIndex === question.correct;
            
            // 禁用所有按钮
            const disabledRows = rows.map(row => {
                const newRow = new ActionRowBuilder();
                row.components.forEach((button, idx) => {
                    const newButton = ButtonBuilder.from(button)
                        .setDisabled(true)
                        .setStyle(idx === question.correct ? ButtonStyle.Success : 
                                  idx === selectedIndex ? ButtonStyle.Danger : ButtonStyle.Secondary);
                    newRow.addComponents(newButton);
                });
                return newRow;
            });
            
            const resultEmbed = new EmbedBuilder()
                .setColor(isCorrect ? 0x00ff00 : 0xff0000)
                .setTitle(isCorrect ? '🎉 回答正确！' : '❌ 回答错误！')
                .setDescription(isCorrect 
                    ? `太棒了 <@${i.user.id}>！答案就是：**${question.options[question.correct]}**\n\n团团为你鼓掌！👏🐼`
                    : `很遗憾 <@${i.user.id}>，正确答案是：**${question.options[question.correct]}**\n\n下次加油哦！💪`)
                .setFooter({ text: isCorrect ? '团团说你真聪明！✨' : '团团相信你会进步的！🌟' })
                .setTimestamp();
            
            await i.update({ embeds: [resultEmbed], components: disabledRows });
            collector.stop();
        });
        
        collector.on('end', async () => {
            if (!answered) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('⏰ 时间到！')
                    .setDescription(`正确答案是：**${question.options[question.correct]}**\n\n下次要快点回答哦！`)
                    .setFooter({ text: '团团等你下次再来挑战！🐼' })
                    .setTimestamp();
                
                const disabledRows = rows.map(row => {
                    const newRow = new ActionRowBuilder();
                    row.components.forEach((button, idx) => {
                        const newButton = ButtonBuilder.from(button)
                            .setDisabled(true)
                            .setStyle(idx === question.correct ? ButtonStyle.Success : ButtonStyle.Secondary);
                        newRow.addComponents(newButton);
                    });
                    return newRow;
                });
                
                await interaction.editReply({ embeds: [timeoutEmbed], components: disabledRows });
            }
        });
    },
};
