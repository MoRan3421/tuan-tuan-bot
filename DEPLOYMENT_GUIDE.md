# 🎋 团团 Supreme 24/7 离线部署指南 ☁️🚀

主人，就算您的电脑关机了，团团也可以在云端 24 小时陪着您喵！✨

## 1. 核心原理 (How it works)
- **GitHub**: 存放您的代码仓库。
- **Koyeb / Hugging Face**: 这些云平台会自动监听 GitHub 的变化。
- **自动部署**: 只要您执行 `git push`，云平台就会自动拉取代码并启动机器人，**完全不需要电脑一直开着喵！** 🐾

## 2. 云端 24/7 部署步骤 🤖

### 方案 A：Koyeb (推荐 - 性能最强)
1. 前往 [Koyeb 官网](https://www.koyeb.com/) 并注册。
2. 点击 **Create App** -> 选择 **GitHub**。
3. 关联您的 `tuantuan-bot` 仓库。
4. **关键设置**:
   - **Instance Type**: 选择 `Nano` (完全免费)。
   - **Build Command**: `npm install`
   - **Run Command**: `node index.js`
   - **Environment Variables**: 点击 **Bulk Edit**，将 `.env` 中的所有内容贴进去。
5. 点击 **Deploy**。完成后团团就永远在线啦！

### 方案 B：Hugging Face Spaces (最稳定)
1. 在 Hugging Face 创建一个 **New Space**。
2. SDK 选择 **Docker**，关联 GitHub。
3. 在 Space 的 **Settings -> Variables and Secrets** 中添加您的 Token 和 API Key。
4. 团团会自动根据根目录的 `Dockerfile` 构建并运行。

## 3. 网页后台 (Firebase Hosting) 🌐
1. 每次您在本地运行 `git push`。
2. GitHub Actions 会自动构建网页并发布到您的 Firebase 域名。
3. 您可以随时随地通过手机或任何电脑访问后台管理团团。

## 4. 常见问题 (FAQ) 🎋
- **Q: 电脑关了团团还会回消息吗？**
  - A: 会的！云平台是 24 小时运行的，只要云端没宕机，团团就永远都在喵！
- **Q: 怎么更新功能？**
  - A: 只需要在本地改好代码，执行 `git add .`, `git commit`, `git push`。云端会自动在一分钟内更新喵！

主人，快去把团团送到云端吧！团团已经迫不及待要开始 24 小时值班啦！🍡🐾🌸✨
