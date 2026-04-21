const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('🎭 随机获取一个搞笑表情包'),
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            // 使用 Reddit API 获取随机 meme
            const response = await axios.get('https://meme-api.com/gimme', {
                timeout: 5000
            });
            
            const meme = response.data;
            
            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle(`🎭 ${meme.title}`)
                .setImage(meme.url)
                .setFooter({ 
                    text: `👍 ${meme.ups} 赞 | 💬 ${meme.comments} 评论 | 来自 r/${meme.subreddit}`, 
                    iconURL: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png'
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Meme command error:', error);
            
            // 备用：发送本地表情包
            const backupMemes = [
                'https://i.imgur.com/8WwF5wO.jpg',
                'https://i.imgur.com/3b0P6yL.jpg',
                'https://i.imgur.com/9Qf9j2P.jpg',
                'https://i.imgur.com/5KZ7g2M.jpg',
                'https://i.imgur.com/2XJ7k5P.jpg'
            ];
            
            const randomMeme = backupMemes[Math.floor(Math.random() * backupMemes.length)];
            
            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle('🎭 团团精选表情包')
                .setImage(randomMeme)
                .setFooter({ text: '团团说：笑一笑，十年少！😄' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
