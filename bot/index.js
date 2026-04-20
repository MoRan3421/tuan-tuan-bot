if (process.env.NODE_ENV !== 'production' && !process.env.SPACE_ID) {
    require('dotenv').config({ path: '../.env' });
}
const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, PermissionsBitField, Partials, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const { Player } = require('discord-player');
const express = require('express');
const cors = require('cors');

// --- ROBUST ENVIRONMENT CHECK ---
const CRITICAL_ENV = ['DISCORD_TOKEN', 'GOOGLE_API_KEY', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
const missingCritical = CRITICAL_ENV.filter(key => !process.env[key]);

if (missingCritical.length > 0) {
    console.error(`\n❌ [STOP] 关键环境变量缺失: ${missingCritical.join(', ')}`);
    console.error("👉 请务必添加这些变量，否则团团无法启动喵！\n");
    throw new Error(`CRITICAL_ENV_MISSING: ${missingCritical.join(', ')}`);
}

// --- OPTIONAL ENGINES ---
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
    try {
        stripe = require('stripe')(stripeKey);
        console.log("💳 Stripe engine initialized.");
    } catch (e) {
        console.error("❌ Stripe init failed:", e.message);
    }
} else {
    console.warn("⚠️ [SKIPPED] STRIPE_SECRET_KEY 缺失，至尊会员充值功能将不可用。");
}

// --- FIREBASE ADMIN INITIALIZATION ---
if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined;

        if (!privateKey || !privateKey.includes('BEGIN PRIVATE KEY')) {
            console.warn("⚠️ [WARNING] FIREBASE_PRIVATE_KEY 格式可能不正确，请确保它包含完整的证书内容。");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            })
        });
        console.log("🔥 Firebase Admin initialized.");
    } catch (error) {
        console.error("❌ Firebase Init Error:", error.message);
        // 如果是本地开发环境，不一定要因为 Firebase 挂掉而停止整个机器人
        if (process.env.NODE_ENV === 'production') throw error;
    }
}
const db = admin.firestore();

const { askSupremeAI } = require('./core/ai-utils');
const { generateRankCard, generateLevelUpCard } = require('./utils/rank-card');

async function getAIResponse(prompt, guildId = 'global', history = []) {
    try {
        let engine = 'GEMINI';
        if (guildId && guildId !== 'global') {
            try {
                const guildDoc = await db.collection('guilds').doc(guildId).get();
                if (guildDoc.exists && guildDoc.data().aiEngine) {
                    engine = String(guildDoc.data().aiEngine).toUpperCase();
                }
            } catch (dbErr) {
                console.error('Firebase DB Error in AI fetch (fallback to GEMINI):', dbErr.message);
            }
        }
        
        const result = await askSupremeAI(prompt, engine, history);
        if (!result || !result.text) {
            throw new Error('AI returned an empty response');
        }
        return result.text;
    } catch (e) {
        console.error('❌ AI Core Failure:', e.message);
        return '团团脑仁儿疼，可能 API 出错啦！(>_<) 或者是小熊猫还没吃饱，请主人稍后再试喵~';
    }
}

// --- EXPRESS SERVER SETUP ---
const app = express();
app.use(cors());
app.use(express.json());

// Firebase Auth Middleware
async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (e) {
        res.status(403).send('Forbidden');
    }
}

// --- SUPREME API ENDPOINTS ---

// Bot Profile Management
app.post('/api/bot/profile', verifyUser, async (req, res) => {
    const { nickname, avatar, status, bio, guildId } = req.body;
    try {
        if (guildId) {
            const guild = client.guilds.cache.get(guildId);
            if (guild && nickname) {
                await guild.members.me.setNickname(nickname).catch(e => console.error('Nickname set error:', e.message));
            }
        } else {
            // Global profile
            if (nickname) {
                await client.user.setUsername(nickname).catch(e => console.error('Username set error:', e.message));
            }
            if (avatar && avatar.startsWith('http')) {
                await client.user.setAvatar(avatar).catch(e => console.error('Avatar set error:', e.message));
            }
            if (bio) {
                await db.collection('config').doc('global_profile').set({ bio }, { merge: true });
            }
        }
        if (status) {
            client.user.setActivity(status, { type: ActivityType.Playing });
            await db.collection('config').doc('global_profile').set({ status }, { merge: true });
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Guild Config (AI, Music, etc.)
app.post('/api/guilds/:guildId/config', verifyUser, async (req, res) => {
    const { guildId } = req.params;
    const updates = req.body;
    
    // Security: Check if user has MANAGE_GUILD permission (optional but recommended)
    // For now, we trust the frontend or use Firebase security rules
    
    try {
        await db.collection('guilds').doc(guildId).set(updates, { merge: true });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/', (req, res) => res.send('<h1>TuanTuan Supreme Core is Online 🐼</h1>'));
app.get('/health', (req, res) => res.status(200).send('OK'));

// Stripe Checkout Session
app.post('/api/stripe/create-checkout-session', verifyUser, async (req, res) => {
    if (!stripe) return res.status(503).json({ error: "Stripe features are currently unavailable. Please contact the bot owner." });

    const { guildId, plan } = req.body;
    const priceId = plan === 'lifetime' ? process.env.STRIPE_PRICE_ID_LIFETIME : process.env.STRIPE_PRICE_ID_MONTHLY;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: `${process.env.DASHBOARD_URL}/success?guildId=${guildId}`,
            cancel_url: `${process.env.DASHBOARD_URL}/cancel`,
            metadata: { guildId, type: 'premium_upgrade' }
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Premium Redeem
app.post('/api/premium/redeem', verifyUser, async (req, res) => {
    const { guildId, key } = req.body;
    try {
        const keyRef = db.collection('premium_keys').doc(key);
        const keyDoc = await keyRef.get();

        if (!keyDoc.exists || keyDoc.data().used) {
            return res.status(400).json({ error: '无效或已被领取的激活码 (QAQ)' });
        }

        await db.runTransaction(async (t) => {
            t.update(keyRef, { used: true, usedBy: req.user.uid, usedIn: guildId, usedAt: admin.firestore.FieldValue.serverTimestamp() });
            t.set(db.collection('guilds').doc(guildId), { isPremium: true, premiumSince: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Stripe Webhook
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const guildId = session.metadata.guildId;
        await db.collection('guilds').doc(guildId).set({
            isPremium: true,
            premiumSince: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentId: session.payment_intent
        }, { merge: true });
        console.log(`💎 Premium activated for Guild: ${guildId}`);
    }
    res.json({ received: true });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Elite Web API & Heartbeat activated on port ${port}`);
});

// --- CORE BOT LOGIC ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User] 
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

// --- MUSIC PLAYER EVENTS ---
player.events.on('playerStart', (queue, track) => {
    if (queue.metadata && queue.metadata.channel) {
        const embed = new EmbedBuilder()
            .setColor(0xffb7c5)
            .setTitle('🎶 团团电台开播啦！')
            .setDescription(`正在为主人们播放：**${track.title}**`)
            .setThumbnail(track.thumbnail)
            .setFooter({ text: '小熊猫正在卖力摇晃尾巴中... 🐾' });
        queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
    }
});

player.events.on('error', (queue, error) => {
    console.error(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.error(`[Player Error] ${error.message}`);
});

// Command loader
client.commands = new Collection();
const loadCommands = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
        }
    }
};

const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

const commands = [];
for (const command of client.commands.values()) {
    try {
        if (command.data && typeof command.data.toJSON === 'function') {
            commands.push(command.data.toJSON());
        }
    } catch (e) {
        console.error(`❌ Failed to serialize command "${command.data.name}":`, e.message);
    }
}

// Caching & Persistence
const guildConfigs = new Map();
const DEFAULT_PREFIX = '!';

async function getGuildConfig(guildId) {
    if (guildConfigs.has(guildId)) return guildConfigs.get(guildId);
    const defaultConfig = { prefix: DEFAULT_PREFIX, aiChannelId: null, isPremium: false, rainbowRoleId: null, aiEngine: 'GEMINI' };
    try {
        const docRef = db.collection('guilds').doc(guildId);
        const doc = await docRef.get();
        if (!doc.exists) {
            await docRef.set(defaultConfig);
            guildConfigs.set(guildId, defaultConfig);
            return defaultConfig;
        }
        const data = Object.assign({}, defaultConfig, doc.data());
        guildConfigs.set(guildId, data);
        return data;
    } catch (err) {
        console.error('Firebase DB Error in getGuildConfig:', err.message);
        return defaultConfig;
    }
}

// XP & Leveling Logic
const userXpCache = new Map();
async function giveXpAndRewards(guildId, userId, providedXp = null, providedBamboo = 0) {
    try {
        const key = `${guildId}-${userId}`;
        const now = Date.now();
        if (!providedXp && userXpCache.has(key) && now - userXpCache.get(key) < 60000) return null;
        if (!providedXp) userXpCache.set(key, now);

        const docRef = db.collection('guilds').doc(guildId).collection('members').doc(userId);
        const doc = await docRef.get();
        let data = doc.exists ? doc.data() : { xp: 0, level: 1, bamboo: 0 };
        
        const guildConfig = await getGuildConfig(guildId);
        const multiplier = guildConfig.isPremium ? 1.5 : 1;

        const xpToAdd = providedXp || (Math.floor(Math.random() * 15) + 10);
        const finalXpGain = Math.ceil(xpToAdd * multiplier);
        const finalBambooGain = Math.ceil(providedBamboo * multiplier);

        data.xp = (data.xp || 0) + finalXpGain;
        data.bamboo = (data.bamboo || 0) + finalBambooGain;

        let leveledUp = false;
        const nextLevelXp = (data.level || 1) * 250; 
        if (data.xp >= nextLevelXp) {
            data.level = (data.level || 1) + 1;
            data.xp = 0;
            leveledUp = true;
        }

        await docRef.set(data, { merge: true });
        return leveledUp ? data.level : null;
    } catch (e) {
        console.error('❌ Interaction XP Error:', e.message);
        return null;
    }
}

client.once('ready', async () => {
    console.log('🤖 正在加载音乐引擎...');
    const { DefaultExtractors } = require('@discord-player/extractor');
    await player.extractors.loadMulti(DefaultExtractors).catch(console.error);
    
    console.log(`🐼 团团 Kawaii Core 启动成功！已上线为：${client.user.tag}`);
    client.user.setActivity('在竹林里打滚喵 | /help', { type: ActivityType.Playing });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    // --- REAL-TIME SYNC ENGINE ---
    db.collection('guilds').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'modified') {
                const guildId = change.doc.id;
                const data = change.doc.data();
                guildConfigs.set(guildId, data); // Update cache
                const guild = client.guilds.cache.get(guildId);
                if (guild && data.nickname) {
                    const me = guild.members.me;
                    if (me && me.nickname !== data.nickname) {
                        try { await me.setNickname(data.nickname); } catch (e) {}
                    }
                }
            }
        });
    });

    // --- STARTUP COMMAND SYNC ---
    for (const [guildId, guild] of client.guilds.cache) {
        try {
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID || client.user.id, guildId), { body: commands });
            console.log(`✅ 已同步服务器: ${guild.name} (${guildId})`);
        } catch (error) { 
            console.error(`❌ 同步服务器失败 ${guildId}:`, error.message); 
        }
    }

    const syncProfile = async () => {
        try {
            const globalProfile = await db.collection('config').doc('global_profile').get();
            if (globalProfile.exists) {
                const data = globalProfile.data();
                if (data.status) client.user.setActivity(data.status, { type: ActivityType.Playing });
            }

            for (const [guildId, guild] of client.guilds.cache) {
                const config = await getGuildConfig(guildId);
                if (config.rainbowRoleId) {
                    const role = guild.roles.cache.get(config.rainbowRoleId);
                    if (role) {
                        const colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x008000, 0x0000FF, 0x4B0082, 0xEE82EE];
                        await role.setColor(colors[Math.floor(Math.random() * colors.length)]).catch(() => {});
                    }
                }
            }
        } catch (e) {
            console.error('❌ Profile Sync Error:', e.message);
        }
    };

    setInterval(syncProfile, 60000);
    syncProfile();
});

client.on('guildCreate', async guild => {
    const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 0 && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
    if (!channel) return;

    let bio = '我是由 **godking512 (团团熊猫主播)** 倾心打造的至尊版 AI 助手。我融合了先进的 Gemini 2.0 与 Groq 引擎，不仅能陪主人聊天，还能管理服务器、播放音乐、玩游戏，甚至是为您提供 24/7 的全方位守护喵！';
    try {
        const profileDoc = await db.collection('config').doc('global_profile').get();
        if (profileDoc.exists && profileDoc.data().bio) {
            bio = profileDoc.data().bio;
        }
    } catch (e) {
        console.error('Welcome Bio Fetch Error:', e);
    }

    const embed = new EmbedBuilder()
        .setColor(0xffb7c5)
        .setTitle('🎋 TuanTuan Supreme Core · 至尊团团报到喵！✨')
        .setDescription(`**“主人好！我是团团，一只在云端守护主人的AI小熊猫喵！(✿◡‿◡)”**\n\n${bio}\n\n📌 **新手指南:** 主人可以使用 \`/help\` 翻开我的秘密手册，或者使用 \`/template-setup\` 帮我一键装修新家喔！`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .addFields(
            { name: '🌟 核心技能', value: '• **双核 AI 对话**\n• **高清音乐播放**\n• **时光机备份**\n• **熊猫趣味乐园**', inline: true },
            { name: '🛡️ 安全守护', value: '• **至尊验证系统**\n• **自动身份组**\n• **高級管理日誌**', inline: true }
        )
        .setImage('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
        .setFooter({ text: '© 2026 TuanTuan Supreme Core · 感谢主人的收留 🎋' });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('进入我的小屋 🌐')
            .setStyle(ButtonStyle.Link)
            .setURL('https://tuantuanbot-28647.web.app'),
        new ButtonBuilder()
            .setLabel('加入官方支持群 🎋')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/tuantuan'), // Replace with actual support server link
        new ButtonBuilder()
            .setLabel('邀请我到别处 📩')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    );

    await channel.send({ content: '主人！团团已经背着小书包进群啦！🍢🐾', embeds: [embed], components: [row] });
});

// --- AUDIT LOGGING SYSTEM ---
client.on('messageDelete', async message => {
    if (!message.guild) return;
    try {
        const config = await getGuildConfig(message.guild.id);
        if (config.loggingModule !== 'ENABLED' || !config.logChannelId) return;
        
        const logChannel = message.guild.channels.cache.get(config.logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(0xff4757)
            .setTitle('🗑️ 消息被删除喵！')
            .setDescription(`**作者:** ${message.author}\n**频道:** ${message.channel}\n**内容:** ${message.content || '*(含有图片或嵌入内容)*'}`)
            .setFooter({ text: `ID: ${message.id} · © TuanTuan Audit 🎋` })
            .setTimestamp();
        
        await logChannel.send({ embeds: [embed] });
    } catch (e) { console.error('Logging Error:', e.message); }
});

client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (!oldMsg.guild || oldMsg.content === newMsg.content) return;
    try {
        const config = await getGuildConfig(oldMsg.guild.id);
        if (config.loggingModule !== 'ENABLED' || !config.logChannelId) return;

        const logChannel = oldMsg.guild.channels.cache.get(config.logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(0xffa502)
            .setTitle('✏️ 消息被编辑喵！')
            .addFields(
                { name: '原本内容', value: oldMsg.content || '*(无文本)*' },
                { name: '修改内容', value: newMsg.content || '*(无文本)*' }
            )
            .setDescription(`**作者:** ${oldMsg.author}\n**频道:** ${oldMsg.channel}`)
            .setFooter({ text: `ID: ${oldMsg.id} · © TuanTuan Audit 🎋` })
            .setTimestamp();
        
        await logChannel.send({ embeds: [embed] });
    } catch (e) { console.error('Logging Error:', e.message); }
});

client.on('guildMemberAdd', async member => {
    try {
        const config = await getGuildConfig(member.guild.id);
        
        // 1. Welcome Intro (Audit Style)
        if (config.loggingModule === 'ENABLED' && config.logChannelId) {
            const logChannel = member.guild.channels.cache.get(config.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0x7bed9f)
                    .setTitle('👋 欢迎新主人进群喵！')
                    .setDescription(`**欢迎:** ${member.user.tag}\n**账号创建:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: `UID: ${member.id} · © TuanTuan Audit 🎋` })
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] });
            }
        }

        // 2. Auto Role
        if (config.autoRoleModule === 'ENABLED') {
            const autoRole = member.guild.roles.cache.find(r => r.name.includes('熊猫之友')) || member.guild.roles.cache.find(r => r.name.includes('VIP'));
            if (autoRole) await member.roles.add(autoRole).catch(() => {});
        }

        // 3. Database Init
        const memberRef = db.collection('guilds').doc(member.guild.id).collection('members').doc(member.user.id);
        const doc = await memberRef.get();
        if (!doc.exists) {
            await memberRef.set({ xp: 0, level: 1, bamboo: 10, last_activity: new Date() });
        }
    } catch (e) {
        console.error('Welcome Event Error:', e.message);
    }
});

client.on('guildMemberRemove', async member => {
    try {
        const config = await getGuildConfig(member.guild.id);
        if (config.loggingModule !== 'ENABLED' || !config.logChannelId) return;

        const logChannel = member.guild.channels.cache.get(config.logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(0x2f3542)
            .setTitle('👋 有小伙伴离开了喵...')
            .setDescription(`**用户:** ${member.user.tag}\n**加入时间:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `UID: ${member.id} · © TuanTuan Audit 🎋` })
            .setTimestamp();
        
        await logChannel.send({ embeds: [embed] });
    } catch (e) { console.error('Logging Error:', e.message); }
});

client.on('interactionCreate', async interaction => {
    // 1. Modal Submit Handling
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'embed_modal' || interaction.customId === 'embedModal') {
            const title = interaction.fields.getTextInputValue('title') || interaction.fields.getTextInputValue('embedTitle');
            const description = interaction.fields.getTextInputValue('description') || interaction.fields.getTextInputValue('embedDescription');
            let color = interaction.fields.getTextInputValue('color') || interaction.fields.getTextInputValue('embedColor') || '#ff9a9e';
            
            if (!color.startsWith('#')) color = `#${color}`;
            if (!/^#[0-9A-F]{6}$/i.test(color)) color = '#ff9a9e';

            try {
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail('https://i.ibb.co/Lzdg1K6L/panda-logo.png')
                    .setFooter({ text: `来自 ${interaction.guild?.name || '团团'} 的至尊通知 🐼🎋` })
                    .setTimestamp();

                if (interaction.customId === 'embed_modal') {
                    await interaction.reply({ content: '✅ 嵌入消息已生成！', embeds: [embed] });
                } else {
                    await interaction.reply({ content: '✅ 制作成功！您的作品已发布。', ephemeral: true });
                    await interaction.channel.send({ embeds: [embed] });
                }
            } catch (e) {
                await interaction.reply({ content: '❌ 哎呀，格式好像不对喵！🐼', ephemeral: true });
            }
        }
        return;
    }

    // 1.1 Button Click Handling (New: Fusion Features)
    if (interaction.isButton()) {
        if (interaction.customId === 'verify_user') {
            try {
                const config = await getGuildConfig(interaction.guild.id);
                // We'll look for a role that the admin set up. 
                // For simplicity, we'll try to find a role named 'Verified' or from the interaction's context if we had it.
                // In a more robust system, we'd store the specific role ID in Firebase.
                const guildDoc = await db.collection('guilds').doc(interaction.guild.id).get();
                const verifyRoleId = guildDoc.data()?.verifyRoleId;
                
                const role = interaction.guild.roles.cache.find(r => r.name.includes('验证') || r.name.includes('Verified')) || 
                             (verifyRoleId ? interaction.guild.roles.cache.get(verifyRoleId) : null);

                if (!role) {
                    return interaction.reply({ content: '❌ 呜呜，团团找不到验证职位，请管理员先设置一下喔！', ephemeral: true });
                }

                await interaction.member.roles.add(role);
                await interaction.reply({ content: `✅ 验证成功！欢迎主人进入 **${interaction.guild.name}**！🍢🐾`, ephemeral: true });
            } catch (e) {
                console.error('Verification Error:', e);
                await interaction.reply({ content: '❌ 验证失败，请检查我的权限喔！', ephemeral: true });
            }
        }
        return;
    }

    // 2. Slash Command Handling
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        const guildConfig = await getGuildConfig(interaction.guild.id);
        const cmdName = interaction.commandName;

        // Module Toggle Checks
        if (['play', 'skip', 'stop', 'queue', 'nowplaying'].includes(cmdName) && guildConfig.musicModule === 'DISABLED') {
            return interaction.reply({ content: '❌ 本服务器已关闭音乐系统模块。管理员可在 Elite Hub 后台重新开启。', ephemeral: true });
        }
        if (['ask', 'chat', 'switch-ai', 'ai-roast', 'ai-story', 'ai-summarize', 'ai-translate'].includes(cmdName)) {
            if (guildConfig.aiModule === 'DISABLED') {
                return interaction.reply({ content: '❌ 本服务器已关闭 AI 对话模块。', ephemeral: true });
            }
            if (guildConfig.aiChannelId && interaction.channel.id !== guildConfig.aiChannelId) {
                return interaction.reply({ content: `❌ 呜呜，请前往专属的 <#${guildConfig.aiChannelId}> 频道使用 AI 功能喔！`, ephemeral: true });
            }
        }

        // Premium Check
        if (command.premiumOnly && !guildConfig.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('💎 需要 TuanTuan Supreme+ 授权')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/5903/5903511.png')
                .setDescription(`抱歉，该指令为 **Supreme+** 专享特权。基础版服务器暂时无法调用。\n\n**如何解锁？**\n可在官方后台获取激活码，使用 \`/redeem\` 将您的服务器升级为全速版！`)
                .setFooter({ text: 'Supreme Elite Hub' });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Execute Command
        await command.execute(interaction);

        // Give XP for using commands
        const levelUp = await giveXpAndRewards(interaction.guild.id, interaction.user.id, 5, 2);
        if (levelUp) {
            try {
                const buffer = await generateLevelUpCard(interaction.user, levelUp);
                const attachment = new AttachmentBuilder(buffer, { name: 'level-up.png' });
                const embed = new EmbedBuilder()
                    .setColor(0xffb7c5)
                    .setTitle('🎊 哇！主人升级啦！✨')
                    .setDescription(`在主人的带领下，团团又变强了喵！\n**${interaction.user.username}** 成功晋升至 **${levelUp} 级**！`)
                    .setImage('attachment://level-up.png')
                    .setFooter({ text: 'Designed by godking512 · 团团会一直守护主人喵 🐾' });
                
                await interaction.followUp({ content: '报告主人！捕捉到一个高光时刻：🍢', files: [attachment], embeds: [embed], ephemeral: true }).catch(() => {});
            } catch (e) {
                console.error('Level Up Card Error (Interaction):', e);
            }
        }
    } 
    catch (error) {
        console.error('❌ Interaction Error:', error.message);
        const errorMsg = '哎呀，团团撞到竹子了！😵 抱歉老板 (godking512)，刚才核心引擎有点小感冒，请稍后再试一下哦！🐼🎋';
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: errorMsg, ephemeral: true }).catch(() => {});
        } else {
            await interaction.followUp({ content: errorMsg, ephemeral: true }).catch(() => {});
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // --- HANDLE DM CHAT ---
    if (!message.guild) {
        await message.channel.sendTyping();
        try {
            const response = await getAIResponse(message.cleanContent, 'global');
            return await message.reply(response);
        } catch (e) {
            console.error('DM AI Error:', e);
            return await message.reply('呜呜，私聊的时候团团好像有点紧张，请稍后再试喵！🐾');
        }
    }

    // XP & Leveling
    const levelUp = await giveXpAndRewards(message.guild.id, message.author.id);
    if (levelUp) {
        try {
            const buffer = await generateLevelUpCard(message.author, levelUp);
            const attachment = new AttachmentBuilder(buffer, { name: 'level-up.png' });
            
            const embed = new EmbedBuilder()
                .setColor(0xffb7c5)
                .setTitle('🎊 哇！主人升级啦！✨')
                .setDescription(`恭喜 **${message.author.username}** 成功晋升至 **第 ${levelUp} 级**！团团超级崇拜主人的说！🍡🐼🎋`)
                .setImage('attachment://level-up.png')
                .setFooter({ text: '团团今天也要陪主人一起变强哒！🐾' })
                .setTimestamp();
                
            await message.reply({ content: `恭喜主人升级成功！团团已经帮主人存进荣誉室啦！🍢`, files: [attachment], embeds: [embed] });
        } catch (error) {
            console.error('Level Up Card Error (Message):', error);
            await message.reply(`🎊 恭喜 **${message.author.username}** 成功晋升至 **Level ${levelUp}**！团团超级开心哒！🐾✨`);
        }
    }

    // AI Chat Logic
    const config = await getGuildConfig(message.guild.id);
    const isAiChannel = config.aiChannelId === message.channel.id;
    const isMentioned = message.mentions.has(client.user);

    if (isAiChannel || (!config.aiChannelId && isMentioned)) {
        await message.channel.sendTyping();
        try {
            const response = await getAIResponse(message.cleanContent, message.guild.id);
            await message.reply(response);
        } catch (e) {
             console.error('❌ AI Reply Interaction Error:', e.message);
        }
    }

    // Custom Prefix Commands
    let prefix = config.prefix || '!';
    if (message.content.startsWith(prefix)) {
        const action = message.content.slice(prefix.length).trim();
        if (!action) return;
        try {
            // For simple prefix triggers that aren't slash commands, just give a cute reaction
            const response = await getAIResponse(`扮演可爱的熊猫机器人团团。用户发送了：${action}。请用一句超萌的第三人称反应。`, message.guild.id);
            await message.reply(response);
        } catch (e) {}
    }
});

// --- STATS SYNC ---
const syncStats = async () => {
    try {
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        
        await db.collection('global_stats').doc('aggregate').set({
            guilds: guildCount,
            users: userCount,
            last_heartbeat: new Date(),
            version: 'Supreme 8.0',
            status: 'online'
        }, { merge: true });
        
        console.log(`📊 [Sync] Supreme Core Online | Active Guilds: ${guildCount}`);
    } catch (e) {
        console.error('❌ Stats Sync Error:', e.message);
    }
};
setInterval(syncStats, 900000); // 15 mins

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN);
