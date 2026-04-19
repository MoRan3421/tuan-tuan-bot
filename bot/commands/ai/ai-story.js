const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askSupremeAI } = require('../../core/ai-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai-story')
        .setDescription('📖 让团团用 AI 为您即兴创作一段专属微型童话/冒险故事。')
        .addStringOption(option => option.setName('topic').setDescription('故事的主题或几个关键词，比如：勇士、巨龙、香蕉').setRequired(true)),
    premiumOnly: true,
    async execute(interaction) {
        await interaction.deferReply();
        const topic = interaction.options.getString('topic');
        const prompt = `你是一只叫"团团"的熊猫。请用可爱的口吻，为用户讲述一个关于【${topic}】的100字超短小故事，并在故事结尾带上一个互动提问。`;
        
        try {
            const { text: answer, engine } = await askSupremeAI(prompt);
            const embed = new EmbedBuilder().setColor(0xffb7c5).setTitle(`📖 团团微小说：关于「${topic}」`)
                .setDescription(answer)
                .setFooter({ text: `Powered by ${engine}` }).setTimestamp();
            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            await interaction.editReply('团团写不出故事啦！');
        }
    }
};
