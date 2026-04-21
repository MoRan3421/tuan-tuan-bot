# 🎋 TuanTuan Supreme Bot · 更新日志

## v8.1 (2026-04-21) 🎉

### ✨ 新增指令

**🔧 实用工具**
- `/botinfo` - 查看团团机器人的详细信息（服务器数量、运行时间、版本等）
- `/serverinfo` - 查看当前服务器的详细信息（成员数、频道数、Boost等级等）

**🎮 趣味游戏**
- `/8ball` - 魔法8球，让团团帮你做决定
- `/dice` - 掷骰子游戏（已优化，移除重复的 roll.js）

### 📱 移动端支持
- ✅ 添加 PWA（渐进式 Web 应用）支持
- ✅ 网页支持手机安装为 App
- ✅ 添加 Service Worker 离线缓存
- ✅ 支持 iOS/Android 安装到主屏幕

### 🔧 修复与优化
- 🔧 修复 Firebase 认证错误，添加内存降级模式
- 🔧 移除重复的 roll.js 指令
- 🔧 增强 Firebase 初始化错误处理和日志
- 🔧 添加 Discord Bot 头像动态获取功能
- 🔧 优化指令加载逻辑

### 📝 文档更新
- 📝 更新 README.md 添加完整指令分类列表
- 📝 添加详细的功能介绍和使用说明
- 📝 添加技术栈说明

---

## v8.0 (2026-04-20) 🚀

### 🌟 核心功能
- 🧠 双核 AI 引擎（Gemini 2.0 + Groq Llama 3.3）
- 🎵 高清音乐电台（YouTube/Spotify/SoundCloud）
- 🛡️ 服务器时光机（备份与恢复）
- 🎮 熊猫乐园（800+ 指令）
- 🌐 Elite Hub 网页控制台
- 💎 至尊特权系统（Stripe 支付）

### 📚 指令分类

**🤖 AI 对话**
- `/ask` - 与团团 AI 对话
- `/switch-ai` - 切换 AI 引擎
- `/ai-story` - AI 故事创作
- `/ai-roast` - AI 幽默吐槽
- `/ai-translate` - AI 翻译
- `/ai-summarize` - AI 文本摘要

**🎵 音乐系统**
- `/play` - 播放音乐
- `/skip` - 跳过当前歌曲
- `/stop` - 停止播放
- `/queue` - 查看播放列表
- `/nowplaying` - 当前播放信息

**💰 经济系统**
- `/balance` - 查看竹子余额
- `/daily` - 每日签到
- `/work` - 打工赚取竹子
- `/shop` - 商店购物
- `/pay` - 转账给其他用户
- `/leaderboard` - 排行榜
- `/rank` - 查看等级卡片
- `/profile` - 查看个人资料

**🎮 趣味游戏**
- `/dice` - 掷骰子
- `/8ball` - 魔法8球
- `/cat` - 随机猫咪图片
- `/dog` - 随机狗狗图片
- `/joke` - 随机笑话
- `/fortune` - 今日运势
- `/marry` - 结婚系统
- `/kiss` - 亲亲互动
- `/hug` - 拥抱互动

**🔧 管理工具**
- `/botinfo` - 机器人信息
- `/serverinfo` - 服务器信息
- `/ping` - 延迟测试
- `/clear` - 清理消息
- `/kick` - 踢出成员
- `/ban` - 封禁成员
- `/mute` - 禁言成员
- `/poll` - 投票系统
- `/backup` - 服务器备份
- `/setup` - 快速设置

**💎 至尊功能 (Premium)**
- `/generate-key` - 生成激活码
- `/redeem` - 兑换激活码
- `/rainbow-role` - 彩虹角色
- `/xp-admin` - 经验管理
- `/template-setup` - 模板设置

---

## 🔧 部署说明

### 云端部署
- 🤗 Hugging Face Spaces: https://huggingface.co/spaces/tuantuanbot/tuan-tuan-bot
- ☁️ GCP Cloud Run: 自动部署
- 🔥 Firebase Hosting: https://tuantuanbot-28647.web.app

### 本地运行
```bash
cd bot
npm install
npm start
```

---

## 🎋 开发者

Designed & Developed by **godking512 (团团熊猫主播)**

© 2026 TuanTuan Supreme Core. All Rights Reserved. 🐾
