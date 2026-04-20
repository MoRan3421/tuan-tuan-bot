import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, LogOut, Activity, Settings,
  Database, User as UserIcon, MessageSquare, Hash, Award, Globe, 
  Sparkles, Zap, Shield, Crown, CreditCard, Key, Music, Gift, Trophy, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithRedirect, OAuthProvider, onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import "./App.css";

// Firebase Config
const firebaseConfig = {
  projectId: "tuantuanbot-28647",
  appId: "1:372694962939:web:888b767d62eef744f2565e",
  storageBucket: "tuantuanbot-28647.firebasestorage.app",
  apiKey: "AIzaSyBvqS8HIJ-yacn_YQfGt49Pb6IVpXw4igE",
  authDomain: "tuantuanbot-28647.firebaseapp.com",
  messagingSenderId: "372694962939",
  measurementId: "G-2MYN99G2KZ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const DISCORD_PROVIDER_ID = import.meta.env.VITE_DISCORD_PROVIDER_ID || 'oidc.discord';
const provider = new OAuthProvider(DISCORD_PROVIDER_ID);
provider.addScope('identify');
provider.addScope('guilds');

// Translations
const t = {
  ZH: {
    heroTitle: "团团的小屋",
    heroSubtitle: "“ 团团会一直陪着主人哒！🌸 ”",
    btnOpen: "开启小屋 🐾",
    btnInvite: "找团团玩 🎟️",
    selectServer: "请在左边选一个服务器，让团团为您效劳吧！🐾",
    statusReport: "团团的状态报告",
    family: "大家庭 🏠",
    welcome: "欢迎光临团团的控制中心喵~",
    supremeWelcome: "🏆 尊贵的至尊服务器 · Supreme+ 激活中 ✨",
    cuteMaster: "最可爱的小主人 💖",
    supremeMaster: "至尊熊猫金主 💎",
    pandaStats: "我的熊猫数据",
    currentLevel: "当前成长等级",
    bambooP: "竹子库存",
    upgradeNotice: "距离下次升级还有很多竹子喵！",
    hugs: "收到抱抱",
    kisses: "收到亲亲",
    brain: "智能大脑",
    geminiTitle: "✨ 聪明版 (Gemini)",
    geminiDesc: "更有智慧，能陪您聊很久",
    groqTitle: "⚡ 极速版 (Groq)",
    groqDesc: "秒回消息，最适合急性子",
    features: "功能模块",
    aiChat: "AI 交谈 💬",
    music: "音乐播放 🎵",
    economy: "经济系统 🎁",
    leaderboard: "至尊英雄榜 🏆",
    settings: "至尊服务设置 ✨",
    prefixLabel: "主人的指令暗号 (Bot Prefix)",
    aiChannelLabel: "AI 聊天专属频道 ID",
    aiChannelPlaceholder: "在这里粘贴频道 ID 喵...",
    nicknameLabel: "团团在服务器的小外号",
    engineLabel: "团团的大脑引擎 (AI Provider)",
    btnClearCache: "刷新缓存 🐾",
    btnClearRam: "清理内存 🍔",
    supremeActivation: "至尊激活 💎",
    supremeUpgrade: "升级 Supreme+",
    supremeUnlock: "解锁 1.5x 经验与高级 AI 引擎",
    inputKey: "输入秘钥喵...",
    btnActivate: "确认激活 (兑换码)",
    btnMonthly: "月付开通",
    btnLifetime: "永久买断",
    botProfileTitle: "团团的样貌 (Profile)",
    botNameLabel: "团团的大名 (Username)",
    botAvatarLabel: "团团的头像 (Avatar URL)",
    botStatusLabel: "团团的签名 (Status)",
    btnUpdateProfile: "保存团团新样貌 🐼",
    aiConfigTitle: "AI 脑回路配置",
    shopTitle: "至尊特权商店",
    shopMonthly: "Supreme+ 月度会员",
    shopLifetime: "Supreme+ 永久买断",
    shopDesc: "解锁 1.5x 经验、专属至尊指令、AI 记忆与高级引擎",
    shopFeatures: "包含：/marry, /backup, /template-setup, /ai-roleplay 等",
    alertSuccess: "激活成功，团团吃到黄金竹子啦！🍡",
    changelogTitle: "团团的进化日记 🎋",
    featuresTitle: "团团的百宝袋 🎒",
    updateDate: "更新日期: 2026-04-20",
    updateV8: "v8.0 至尊版正式发布！✨",
    updateV8Desc: "全新玻璃态 UI、双核 AI 引擎、私聊模式开启！",
    featAiTitle: "深度 AI 交流",
    featAiDesc: "支持 Gemini 2.0 与 Groq，更有个性的熊猫灵魂。",
    featMusicTitle: "高清电台播放",
    featMusicDesc: "秒速加载，支持 Spotify/YT 全平台点歌。",
    featEconomyTitle: "熊猫养成系统",
    featEconomyDesc: "经验、等级、竹子货币，打造活跃社区。",
    supremeLabsTitle: "至尊实验室 (Supreme Labs) 🧪",
    commandListTitle: "指令大百科 (800+)",
    cmdAi: "🧠 智能对话",
    cmdMusic: "🎶 音乐播放",
    cmdEco: "🏆 经济养成",
    cmdFun: "🧸 娱乐交互",
    cmdAdmin: "🛡️ 管理审计",
    cmdGame: "🎮 熊猫游乐场",
    cmdSupreme: "💎 至尊专属",
    fusionTitle: "团团的进化之魂",
    fusionDesc: "集管理、趣味与安全于一身，打造独一无二的至尊团团。",
    copyrightLabel: "© 2026 TuanTuan Supreme Core by godking512 · 版权所有",
    apiOnline: "核心引擎在线",
    apiOffline: "核心引擎维护中",
    logout: "登出小屋"
  },
  EN: {
    heroTitle: "TuanTuan's Hub",
    heroSubtitle: "\"TuanTuan will always be with you! 🌸\"",
    btnOpen: "Open Hub 🐾",
    btnInvite: "Invite TuanTuan 🎟️",
    selectServer: "Please select a server on the left to let TuanTuan serve you! 🐾",
    statusReport: "TuanTuan's Status",
    family: "Servers Family 🏠",
    welcome: "Welcome to TuanTuan's Control Center meow~",
    supremeWelcome: "🏆 Supreme Server · Supreme+ active ✨",
    cuteMaster: "Cutest Master 💖",
    supremeMaster: "Supreme Panda Patron 💎",
    pandaStats: "My Panda Stats",
    currentLevel: "Current Level",
    bambooP: "Bamboo Points",
    upgradeNotice: "Keep collecting bamboo to level up!",
    hugs: "Hugs Received",
    kisses: "Kisses Received",
    brain: "AI Brain Engine",
    geminiTitle: "✨ Smart Mode (Gemini)",
    geminiDesc: "More intelligent, great for deep chats",
    groqTitle: "⚡ Fast Mode (Groq)",
    groqDesc: "Instant replies, for impatient ones",
    features: "Feature Modules",
    aiChat: "AI Chat 💬",
    music: "Music Player 🎵",
    economy: "Economy 🎁",
    leaderboard: "Supreme Leaderboard 🏆",
    settings: "Supreme Settings ✨",
    prefixLabel: "Bot Command Prefix",
    aiChannelLabel: "AI Chat Channel ID",
    aiChannelPlaceholder: "Paste Channel ID here...",
    nicknameLabel: "TuanTuan's Nickname",
    engineLabel: "AI Provider Engine",
    btnClearCache: "Clear Cache 🐾",
    btnClearRam: "Clear RAM 🍔",
    supremeActivation: "Supreme Activation 💎",
    supremeUpgrade: "Upgrade to Supreme+",
    supremeUnlock: "Unlock 1.5x XP and Premium AI logic",
    inputKey: "Enter license key...",
    btnActivate: "Activate Key",
    btnMonthly: "Monthly",
    btnLifetime: "Lifetime",
    botProfileTitle: "Bot Profile Settings",
    botNameLabel: "Bot Username",
    botAvatarLabel: "Bot Avatar URL",
    botStatusLabel: "Bot Status",
    btnUpdateProfile: "Update Profile 🐼",
    aiConfigTitle: "AI Brain Config",
    shopTitle: "Supreme Shop",
    shopMonthly: "Supreme+ Monthly",
    shopLifetime: "Supreme+ Lifetime",
    shopDesc: "Unlock 1.5x XP, Premium Commands, AI Memory & Pro Engines",
    shopFeatures: "Includes: /marry, /backup, /template-setup, /ai-roleplay, etc.",
    alertSuccess: "Activated successfully, TuanTuan got the golden bamboo! 🍡",
    changelogTitle: "Evolution Journal 🎋",
    featuresTitle: "TuanTuan's Toolbox 🎒",
    updateDate: "Updated: 2026-04-20",
    updateV8: "v8.0 Supreme Release! ✨",
    updateV8Desc: "New Glass UI, Dual AI Engine, DM mode enabled!",
    featAiTitle: "Deep AI Chat",
    featAiDesc: "Gemini 2.0 & Groq support with unique personality.",
    featMusicTitle: "HD Radio Player",
    featMusicDesc: "Instant loading, supports Spotify & YouTube.",
    featEconomyTitle: "Panda Leveling",
    featEconomyDesc: "XP, Levels, and Bamboo currency system.",
    supremeLabsTitle: "Supreme Labs 🧪",
    commandListTitle: "Command Wiki (800+)",
    cmdAi: "🧠 AI Chat",
    cmdMusic: "🎶 Music Player",
    cmdEco: "🏆 Economy",
    cmdFun: "🧸 Fun Social",
    cmdAdmin: "🛡️ Moderation",
    cmdGame: "🎮 Games",
    cmdSupreme: "💎 Supreme Only",
    fusionTitle: "TuanTuan Evolution Soul",
    fusionDesc: "Combining management, fun, and security into one unique experience.",
    copyrightLabel: "© 2026 TuanTuan Supreme Core by godking512 · All Rights Reserved",
    apiOnline: "Core Engine Online",
    apiOffline: "Core Engine Maintenance",
    logout: "Logout"
  }
};

const LuxuryCard = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="zen-card"
  >
    <div className="card-title">
        <div className="p-4 rounded-[22px] bg-pink-400/10 text-pink-500 shadow-sm border border-pink-100/50"><Icon size={24} /></div>
        {title}
    </div>
    <div className="card-body">{children}</div>
  </motion.div>
);

const LuxuryToggle = ({ label, description, value, onToggle }) => (
  <div className="toggle-row group p-4 hover:bg-white/40 transition-all rounded-3xl border border-transparent hover:border-white/60">
    <div className="flex flex-col flex-1">
        <div className="text-[10px] font-black text-pink-400 uppercase tracking-[2px] mb-1">{label}</div>
        <div className="text-sm font-bold opacity-80">{value === 'ENABLED' ? '✅ Active' : '❌ Disabled'}</div>
        <div className="text-[10px] opacity-40 font-medium mt-1">{description}</div>
    </div>
    <div 
        className={`toggle-switch ${value === 'ENABLED' ? 'on' : ''}`} 
        onClick={() => onToggle(value === 'ENABLED' ? 'DISABLED' : 'ENABLED')}
    />
  </div>
);

const App = () => {
  const [lang, setLang] = useState(() => localStorage.getItem("tt_lang") || "ZH");
  const [authUser, setAuthUser] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [guildConfig, setGuildConfig] = useState({});
  const [userStats, setUserStats] = useState({ xp: 0, level: 1, bamboo: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [premiumKey, setPremiumKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  
  // Bot Profile States
  const [botProfile, setBotProfile] = useState({ nickname: "", avatar: "", status: "", bio: "" });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://tuantuanbot-tuan-tuan-bot.hf.space";
  const ONLY_GUILD_ID = import.meta.env.VITE_GUILD_ID || "";
  const l = useMemo(() => t[lang], [lang]);

  useEffect(() => {
    localStorage.setItem("tt_lang", lang);
  }, [lang]);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => setApiOnline(r.ok))
      .catch(() => setApiOnline(false));
  }, [API_BASE]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        refreshGuilds();
      } else {
        setAuthUser(null);
      }
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const credential = OAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            localStorage.setItem("dc_token", credential.accessToken);
            refreshGuilds();
          }
        }
      })
      .catch((error) => {
        console.error("Auth Redirect Error:", error);
        if (error.code === 'auth/operation-not-allowed') {
          alert("❌ 登录失败：请确保 Firebase 控制台中已启用 'oidc.discord' 提供者喵！🐾");
        } else if (error.code === 'auth/invalid-credential') {
          alert("❌ 登录失败：Discord 凭证无效，请检查 Client ID 和 Secret 喔！🐾");
        } else {
          alert(`❌ 登录出错啦：${error.message}`);
        }
      });
  }, []);

  const refreshGuilds = async () => {
    const token = localStorage.getItem("dc_token");
    if (!token) return;
    try {
        const res = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { authorization: `Bearer ${token}` }
        });
        const list = await res.json();
        if (Array.isArray(list)) {
            // 过滤：用户必须拥有 管理服务器 (0x20) 或 管理员 (0x8) 权限
            const filtered = list.filter(g => (BigInt(g.permissions) & 0x28n) !== 0n);
            setGuilds(filtered);
        }
    } catch (e) {
        console.error("Guild Fetch Error:", e);
    }
  };

  const login = () => signInWithRedirect(auth, provider);

  const handleUpdateProfile = async () => {
    setBusy(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const payload = { ...botProfile };
      if (selectedGuild) payload.guildId = selectedGuild.id;
      
      const res = await fetch(`${API_BASE}/api/bot/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${idToken}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(l.alertSuccess);
        // Reset only if global update, keep if per-guild? Or just notify
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(false);
  };

  const handleUpdateConfig = async (updates) => {
    if (!selectedGuild) return;
    setBusy(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/guilds/${selectedGuild.id}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${idToken}` },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setGuildConfig(prev => ({ ...prev, ...updates }));
        // Visual feedback
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-8 right-8 bg-pink-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce';
        notification.innerText = '✨ 配置已同步喵！';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    } catch (e) {
      console.error("Config update failed:", e);
    }
    setBusy(false);
  };

  const handleStripeCheckout = async (plan) => {
    if (!selectedGuild) return;
    setBusy(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ guildId: selectedGuild.id, plan })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert("Checkout error: " + e.message);
    }
    setBusy(false);
  };

  const handleRedeem = async () => {
    if (!selectedGuild || !premiumKey) return;
    setBusy(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/premium/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ guildId: selectedGuild.id, key: premiumKey })
      });
      if (res.ok) alert(l.alertSuccess);
      else {
        const err = await res.json();
        alert(err.error || "Redeem failed");
      }
    } catch (e) {
      alert("Redeem error: " + e.message);
    }
    setBusy(false);
  };

  useEffect(() => {
    if (!selectedGuild) return;
    const unsubConfig = onSnapshot(doc(firestore, "guilds", selectedGuild.id), (doc) => {
      if (doc.exists()) setGuildConfig(doc.data());
    });

    if (authUser?.providerData[0]?.uid) {
        const discordId = authUser.providerData[0].uid;
        const unsubStats = onSnapshot(doc(firestore, "guilds", selectedGuild.id, "members", discordId), (doc) => {
            if (doc.exists()) setUserStats(doc.data());
        });
        return () => { unsubConfig(); unsubStats(); };
    }
    return unsubConfig;
  }, [selectedGuild, authUser]);

  useEffect(() => {
    if (!selectedGuild) return;
    const fetchLeaderboard = async () => {
        const q = query(collection(firestore, "guilds", selectedGuild.id, "members"), where("xp", ">", 0));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }))
            .sort((a,b) => b.xp - a.xp)
            .slice(0, 5);
        setLeaderboard(list);
    };
    fetchLeaderboard();
  }, [selectedGuild]);

  const updateConfig = async (key, val) => {
    if (!selectedGuild) return;
    await setDoc(doc(firestore, "guilds", selectedGuild.id), { [key]: val }, { merge: true });
  };

  const startCheckout = async (plan) => {
    if (!selectedGuild || !authUser) return;
    setBusy(true);
    try {
      const idToken = await authUser.getIdToken();
      const r = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ guildId: selectedGuild.id, plan }),
      });
      const data = await r.json();
      if (data?.url) window.location.href = data.url;
      else throw new Error(data?.error || "Checkout error");
    } catch (e) { alert(e.message); } finally { setBusy(false); }
  };

  const redeemKey = async () => {
    if (!selectedGuild || !authUser || !premiumKey.trim()) return;
    setBusy(true);
    try {
      const idToken = await authUser.getIdToken();
      const r = await fetch(`${API_BASE}/api/premium/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ guildId: selectedGuild.id, key: premiumKey.trim() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Redeem failed");
      setPremiumKey("");
      alert(l.alertSuccess);
    } catch (e) { alert(e.message); } finally { setBusy(false); }
  };

  const inviteBot = () => {
    window.open(`https://discord.com/api/oauth2/authorize?client_id=1481640516931031050&permissions=8&scope=bot%20applications.commands`, "_blank");
  };

  if (!authUser) {
    return (
      <div className="supreme-layout justify-center items-center">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="landing-hero relative overflow-hidden"
        >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"></div>
            
            <motion.img 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="/panda-mascot.png" 
                className="w-[180px] h-[180px] mx-auto mb-8 object-contain drop-shadow-2xl" 
                alt="Mascot" 
            />
            
            <h1 className="text-7xl font-black mb-4">{lang === 'ZH' ? <>团团 <span>小屋</span></> : <>TuanTuan <span>Hub</span></>}</h1>
            <p className="text-xl font-medium opacity-60 mb-10 italic">{l.heroSubtitle}</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button onClick={login} className="btn-premium-cta w-full sm:w-auto justify-center">
                    <Sparkles size={20} /> {l.btnOpen}
                </button>
                <button onClick={inviteBot} className="btn-premium-cta w-full sm:w-auto justify-center bg-white !text-pink-500 border-2 border-pink-100 shadow-xl hover:bg-pink-50">
                    <Gift size={20} /> {l.btnInvite}
                </button>
            </div>
            
            <div className="mt-12 flex justify-center gap-6">
                <div onClick={() => setLang("ZH")} className={`cursor-pointer text-xs font-bold tracking-widest uppercase ${lang === 'ZH' ? 'text-pink-500' : 'opacity-30'}`}>中文</div>
                <div onClick={() => setLang("EN")} className={`cursor-pointer text-xs font-bold tracking-widest uppercase ${lang === 'EN' ? 'text-pink-500' : 'opacity-30'}`}>English</div>
            </div>
            
            <p className="text-[10px] font-black opacity-20 mt-10 uppercase tracking-[4px]">Elite Hub v8.0 · godking512 Edition</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="supreme-layout">
      {/* Sidebar */}
      <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="side-tray">
        <div className="logo-wrap cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedGuild(null)}>
            <img src="/panda-mascot.png" className="w-16 h-16 drop-shadow-lg" alt="Logo" />
        </div>
        <div className="server-list-v">
            {guilds
              ?.filter(g => (g.permissions & 0x8) === 0x8 || (g.permissions & 0x20) === 0x20)
              .map(guild => (
                <div 
                    key={guild.id} 
                    className={`server-node ${selectedGuild?.id === guild.id ? 'active' : ''}`}
                    onClick={() => setSelectedGuild(guild)}
                >
                    {guild.icon 
                        ? <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} /> 
                        : <span className="font-black text-xl text-pink-400">{guild.name.charAt(0)}</span>
                    }
                    <div className="node-tooltip">{guild.name}</div>
                </div>
            ))}
            <div onClick={inviteBot} className="server-node border-2 border-dashed border-pink-200 bg-pink-50/30 text-pink-300 hover:text-pink-500 hover:bg-pink-50 hover:border-pink-300">
                <Plus size={28} />
                <div className="node-tooltip">Invite Bot</div>
            </div>
        </div>
        <div onClick={() => signOut(auth)} className="mt-auto cursor-pointer p-4 hover:bg-red-50 rounded-3xl transition-all text-red-300 hover:text-red-500 group">
            <LogOut size={28} />
            <div className="absolute left-24 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{l.logout}</div>
        </div>
      </motion.div>

      {/* Main Workspace */}
      <div className="workspace">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="top-nav">
            <div className="guild-info">
                <div className="flex items-center gap-3">
                    <h1 className="flex items-center gap-4">
                        {selectedGuild ? selectedGuild.name : l.family}
                        {selectedGuild && guildConfig.isPremium && <Crown size={32} className="text-yellow-400 drop-shadow-md animate-pulse" />}
                    </h1>
                </div>
                <p className="flex items-center gap-2">
                    {selectedGuild && guildConfig.isPremium ? <Shield size={16} /> : <Sparkles size={16} />}
                    {selectedGuild && guildConfig.isPremium ? l.supremeWelcome : l.welcome}
                </p>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="flex items-center bg-white/60 backdrop-blur-md p-2 pl-4 rounded-[28px] border-2 border-white shadow-sm gap-4">
                    <div className="flex flex-col items-end">
                        <div className="text-sm font-black text-gray-700">{authUser.displayName}</div>
                        <div className="text-[10px] text-pink-500 font-black uppercase flex items-center gap-2">
                             {guildConfig.isPremium ? l.supremeMaster : l.cuteMaster}
                             <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <img src={authUser.photoURL} className="w-12 h-12 rounded-[18px] border-2 border-pink-200 shadow-md" alt="Avatar" />
                </div>
            </div>
        </motion.div>

        <AnimatePresence mode="wait">
        <motion.div 
            key={selectedGuild?.id || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="view-port"
        >
            {!selectedGuild ? (
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black mb-4 tracking-tighter">至尊管理中心 🐼</h2>
                            <p className="text-lg opacity-90 font-medium max-w-xl">
                                欢迎回到团团的秘密基地！在这里，您可以像魔法师一样操控团团在各个服务器的表现喵！✨
                            </p>
                            <div className="mt-8 flex gap-4">
                                <button onClick={inviteBot} className="bg-white text-pink-500 px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">
                                    + 邀请团团入驻新群
                                </button>
                            </div>
                        </div>
                        <motion.img 
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            src="/panda-mascot.png" 
                            className="absolute -right-10 -bottom-10 w-80 opacity-20 grayscale brightness-200" 
                        />
                    </div>
                    
                    <LuxuryCard title="我的服务器管辖区" icon={Globe}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guilds.map(guild => (
                                <div 
                                    key={guild.id}
                                    onClick={() => setSelectedGuild(guild)}
                                    className="p-6 rounded-[35px] bg-white border-2 border-pink-50 hover:border-pink-300 hover:shadow-2xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        {guild.icon 
                                            ? <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} className="w-16 h-16 rounded-[24px] shadow-lg group-hover:rotate-6 transition-transform" alt="" />
                                            : <div className="w-16 h-16 rounded-[24px] bg-pink-100 flex items-center justify-center text-2xl font-black text-pink-400">{guild.name.charAt(0)}</div>
                                        }
                                        <div className="flex-1 overflow-hidden">
                                            <div className="font-black text-gray-800 truncate">{guild.name}</div>
                                            <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mt-1">点击进入管理 🐾</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LuxuryCard>
                </div>
            ) : (
                <>
                {/* Stats Card */}
                <LuxuryCard title={l.pandaStats} icon={UserIcon} delay={0.1}>
                    <div className="p-8 bg-gradient-to-br from-pink-50 to-white rounded-[40px] border-4 border-white shadow-xl mb-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-5xl font-black text-pink-500 tracking-tighter">LV.{userStats.level || 1}</div>
                                <div className="text-[11px] font-black text-pink-300 uppercase tracking-widest mt-1">{l.currentLevel}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-gray-700 flex items-center gap-2 justify-end">{userStats.bamboo || 0} <span className="text-2xl">🎋</span></div>
                                <div className="text-[11px] font-black opacity-30 uppercase tracking-widest mt-1">{l.bambooP}</div>
                            </div>
                        </div>
                        <div className="relative w-full h-6 bg-white rounded-full overflow-hidden border-4 border-white shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((userStats.xp || 0) / ((userStats.level || 1) * 250)) * 100)}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"
                            />
                        </div>
                        <div className="text-[10px] font-black opacity-30 mt-4 text-center uppercase tracking-[3px]">{l.upgradeNotice}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/60 p-6 rounded-[32px] border-2 border-white text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-2xl font-black text-pink-500">{userStats.hugs || 0}</div>
                            <div className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{l.hugs}</div>
                        </div>
                        <div className="bg-white/60 p-6 rounded-[32px] border-2 border-white text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-2xl font-black text-pink-500">{userStats.kisses || 0}</div>
                            <div className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{l.kisses}</div>
                        </div>
                    </div>
                </LuxuryCard>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI Configuration */}
                <LuxuryCard title={l.aiConfigTitle} icon={Sparkles} delay={0.2}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-2">{l.engineLabel}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleUpdateConfig({ aiEngine: 'GEMINI' })}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${guildConfig.aiEngine === 'GEMINI' ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white/50'}`}
                        >
                          <div className="font-bold text-sm">Gemini 💎</div>
                          <div className="text-[10px] opacity-60">{l.geminiDesc}</div>
                        </button>
                        <button 
                          onClick={() => handleUpdateConfig({ aiEngine: 'GROQ' })}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${guildConfig.aiEngine === 'GROQ' ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white/50'}`}
                        >
                          <div className="font-bold text-sm">Groq ⚡</div>
                          <div className="text-[10px] opacity-60">{l.groqDesc}</div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-2">{l.aiChannelLabel}</label>
                      <input 
                        className="glass-input" 
                        placeholder={l.aiChannelPlaceholder}
                        value={guildConfig.aiChannelId || ""}
                        onChange={(e) => handleUpdateConfig({ aiChannelId: e.target.value })}
                      />
                    </div>
                  </div>
                </LuxuryCard>

                {/* Bot Profile (Per-Guild or Global) */}
                <LuxuryCard title={l.botProfileTitle} icon={UserIcon} delay={0.3}>
                  <div className="space-y-4">
                    <p className="text-[10px] opacity-40 italic">
                      {selectedGuild ? `正在调整在 ${selectedGuild.name} 的样貌喵！` : '正在调整全局默认样貌喵！'}
                    </p>
                    
                    {/* Live Preview Module */}
                    <div className="p-4 rounded-[30px] bg-pink-50/50 border-2 border-white shadow-inner mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <img src={botProfile.avatar || "https://i.ibb.co/Lzdg1K6L/panda-logo.png"} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="" />
                            <div>
                                <div className="text-xs font-black text-gray-700">{botProfile.nickname || "团团 Supreme"}</div>
                                <div className="text-[8px] text-pink-400 font-bold">{botProfile.status || "正在吃竹子喵... 🎋"}</div>
                            </div>
                        </div>
                        <div className="text-[9px] opacity-50 line-clamp-2 leading-relaxed">
                            {botProfile.bio || "这是一只可爱的 AI 熊猫管家喵！"}
                        </div>
                    </div>

                    <input 
                      className="glass-input" 
                      placeholder={l.botNameLabel} 
                      value={botProfile.nickname}
                      onChange={e => setBotProfile({...botProfile, nickname: e.target.value})}
                    />
                    {!selectedGuild && (
                      <>
                        <input 
                          className="glass-input" 
                          placeholder={l.botAvatarLabel}
                          value={botProfile.avatar}
                          onChange={e => setBotProfile({...botProfile, avatar: e.target.value})}
                        />
                        <input 
                          className="glass-input" 
                          placeholder={l.botStatusLabel}
                          value={botProfile.status}
                          onChange={e => setBotProfile({...botProfile, status: e.target.value})}
                        />
                        <textarea 
                          className="glass-input h-24 resize-none" 
                          placeholder="团团的个人简介 (Bio/About Me) 🎋"
                          value={botProfile.bio}
                          onChange={e => setBotProfile({...botProfile, bio: e.target.value})}
                        />
                      </>
                    )}
                    <button 
                      className="supreme-btn w-full" 
                      disabled={busy}
                      onClick={handleUpdateProfile}
                    >
                      {selectedGuild ? '保存群内昵称 🎋' : l.btnUpdateProfile}
                    </button>
                  </div>
                </LuxuryCard>

                {/* Shop / Premium */}
                <LuxuryCard title={l.shopTitle} icon={CreditCard} delay={0.4}>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-white">
                      <div className="font-black text-lg">{l.shopMonthly}</div>
                      <div className="text-[10px] opacity-90 mb-1">{l.shopDesc}</div>
                      <div className="text-[9px] font-bold text-pink-100 mb-3">{l.shopFeatures}</div>
                      <button 
                        className="bg-white/20 hover:bg-white/30 w-full py-2 rounded-xl font-bold transition-all backdrop-blur-md"
                        onClick={() => handleStripeCheckout('monthly')}
                      >
                        $9.9 / Month
                      </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <div className="font-black text-lg">{l.shopLifetime}</div>
                      <div className="text-[10px] opacity-90 mb-1">{l.shopDesc}</div>
                      <div className="text-[9px] font-bold text-indigo-100 mb-3">{l.shopFeatures}</div>
                      <button 
                        className="bg-white/20 hover:bg-white/30 w-full py-2 rounded-xl font-bold transition-all backdrop-blur-md"
                        onClick={() => handleStripeCheckout('lifetime')}
                      >
                        $49.9 / Once
                      </button>
                    </div>
                    <div className="pt-2 border-t border-pink-100">
                      <div className="flex gap-2">
                        <input 
                          className="glass-input text-xs" 
                          placeholder={l.inputKey}
                          value={premiumKey}
                          onChange={e => setPremiumKey(e.target.value)}
                        />
                        <button className="supreme-btn text-xs px-4" onClick={handleRedeem}>{l.btnActivate}</button>
                      </div>
                    </div>
                  </div>
                </LuxuryCard>
              </div>

              {/* Changelog & Features Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <LuxuryCard title={l.changelogTitle} icon={Activity} delay={0.7}>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-black text-pink-500">{l.updateV8}</div>
                        <div className="text-[10px] opacity-40 font-bold">{l.updateDate}</div>
                      </div>
                      <div className="text-sm opacity-70 leading-relaxed">
                        {l.updateV8Desc}
                      </div>
                    </div>
                    <div className="text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
                      More updates coming soon...
                    </div>
                  </div>
                </LuxuryCard>

                <LuxuryCard title={l.featuresTitle} icon={Globe} delay={0.8}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-pink-400" />
                        <div className="font-bold text-sm">{l.featAiTitle}</div>
                      </div>
                      <div className="text-[10px] opacity-60">{l.featAiDesc}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Music size={16} className="text-indigo-400" />
                        <div className="font-bold text-sm">{l.featMusicTitle}</div>
                      </div>
                      <div className="text-[10px] opacity-60">{l.featMusicDesc}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Award size={16} className="text-emerald-400" />
                        <div className="font-bold text-sm">{l.featEconomyTitle}</div>
                      </div>
                      <div className="text-[10px] opacity-60">{l.featEconomyDesc}</div>
                    </div>
                  </div>
                </LuxuryCard>
              </div>

              {/* Module Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <LuxuryCard title={l.features} icon={Zap} delay={0.5}>
                  <div className="space-y-4">
                    <LuxuryToggle 
                      label={l.aiChat} 
                      description="AI 对话与智能问答功能"
                      value={guildConfig.aiModule || 'ENABLED'} 
                      onToggle={v => handleUpdateConfig({ aiModule: v })} 
                    />
                    <LuxuryToggle 
                      label={l.music} 
                      description="支持 Spotify/YT 的音乐播放功能"
                      value={guildConfig.musicModule || 'ENABLED'} 
                      onToggle={v => handleUpdateConfig({ musicModule: v })} 
                    />
                    <LuxuryToggle 
                      label={l.economy} 
                      description="等级、竹子与排行榜系统"
                      value={guildConfig.economyModule || 'ENABLED'} 
                      onToggle={v => handleUpdateConfig({ economyModule: v })} 
                    />
                    <LuxuryToggle 
                      label="高级日誌系統" 
                      description="記錄消息刪除、編輯與成員變動 (審計日誌)"
                      value={guildConfig.loggingModule || 'DISABLED'} 
                      onToggle={v => handleUpdateConfig({ loggingModule: v })} 
                    />
                    <div>
                      <label className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-2">日誌接收頻道 ID</label>
                      <input 
                        className="glass-input text-xs" 
                        placeholder="填入頻道 ID 喵..."
                        value={guildConfig.logChannelId || ""}
                        onChange={(e) => handleUpdateConfig({ logChannelId: e.target.value })}
                      />
                    </div>
                  </div>
                </LuxuryCard>

                <LuxuryCard title={l.leaderboard} icon={Trophy} delay={0.6}>
                  <div className="space-y-3">
                    {leaderboard.map((user, idx) => (
                      <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/40 border border-pink-50/50">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-pink-100 text-pink-400'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">User #{user.id.slice(-4)}</div>
                          <div className="text-[10px] opacity-50">Level {user.level} · {user.xp} XP</div>
                        </div>
                        <div className="text-pink-500 font-black">🎋 {user.bamboo || 0}</div>
                      </div>
                    ))}
                  </div>
                </LuxuryCard>
              </div>

              {/* Command Encyclopedia Section */}
              <div className="mt-6">
                <LuxuryCard title={l.commandListTitle} icon={BookOpen} delay={0.7}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: l.cmdAi, color: 'bg-emerald-50 text-emerald-600', count: '150+', desc: 'Gemini/Groq 双核对话' },
                            { name: l.cmdMusic, color: 'bg-indigo-50 text-indigo-600', count: '50+', desc: 'Spotify/YT 高清电台' },
                            { name: l.cmdEco, color: 'bg-yellow-50 text-yellow-600', count: '100+', desc: '竹子经济与养成' },
                            { name: l.cmdFun, color: 'bg-pink-50 text-pink-600', count: '300+', desc: '30+ 种萌萌互动' },
                            { name: l.cmdAdmin, color: 'bg-red-50 text-red-600', count: '80+', desc: '时光机备份与审计' },
                            { name: l.cmdGame, color: 'bg-orange-50 text-orange-600', count: '40+', desc: '钓鱼/转盘/小游戏' },
                            { name: l.cmdSupreme, color: 'bg-purple-50 text-purple-600', count: 'Premium', desc: '变身术与至尊特权' },
                            { name: 'API Hooks', color: 'bg-gray-50 text-gray-600', count: '60+', desc: '开发者聚合接口' },
                        ].map((item, i) => (
                            <div key={i} className={`p-5 rounded-[35px] border border-white/60 flex flex-col items-center justify-center text-center gap-2 hover:scale-105 transition-all cursor-default group ${item.color}`}>
                                <div className="text-xs font-black uppercase tracking-tighter group-hover:tracking-widest transition-all">{item.name}</div>
                                <div className="text-[10px] font-bold opacity-60">{item.count} Commands</div>
                                <div className="text-[8px] opacity-40 font-medium leading-tight px-2">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-[10px] opacity-40 text-center font-medium italic">
                        * 指令总数包含动态社交动作、百科知识库与 API 聚合接口喵！🎋
                    </p>
                </LuxuryCard>
              </div>

              {/* Copyright Footer */}
              <div className="mt-12 mb-6 text-center">
                <div className="text-[10px] font-bold text-pink-400 uppercase tracking-[4px] opacity-40">
                  {l.copyrightLabel}
                </div>
              </div>
                </>
            )}
        </motion.div>
        </AnimatePresence>
        
        <div className="p-8 opacity-20 text-[10px] font-black uppercase tracking-[5px] text-center flex items-center justify-center gap-4">
             <div className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400'} animate-pulse`}></div>
             TuanTuan Supreme Core · Elite Hub v8.0 · Designed with Love by godking512
        </div>
      </div>
    </div>
  );
};

export default App;
