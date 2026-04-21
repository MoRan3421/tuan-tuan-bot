# 🔍 机器人不在线诊断指南

## 📊 当前状态

- ✅ Hugging Face Space: Running
- ❌ Discord Bot: Offline
- ⏳ GitHub Actions: Loading error

---

## 🔴 可能的原因

### 1. Discord Token 未配置（最可能）

机器人需要 `DISCORD_TOKEN` 环境变量才能连接 Discord。

---

## 🔧 诊断步骤

### 步骤 1: 检查 Hugging Face Secrets

访问 https://huggingface.co/spaces/tuantuanbot/tuan-tuan-bot/settings

检查以下 Secrets 是否已配置：

| Secret Name | 说明 |
|-------------|------|
| `DISCORD_TOKEN` | Discord Bot Token（必需） |
| `GOOGLE_API_KEY` | Google AI API Key（必需） |
| `FIREBASE_PROJECT_ID` | Firebase 项目 ID（可选） |
| `FIREBASE_CLIENT_EMAIL` | Firebase 服务账号邮箱（可选） |
| `FIREBASE_PRIVATE_KEY` | Firebase 私钥（可选） |

**如果缺少 `DISCORD_TOKEN` 或 `GOOGLE_API_KEY`，机器人将无法启动！**

---

### 步骤 2: 检查 GitHub Secrets

访问 https://github.com/MoRan3421/tuan-tuan-bot/settings/secrets/actions

检查相同的 Secrets 是否已配置。

---

### 步骤 3: 获取 Discord Token

1. 访问 https://discord.com/developers/applications
2. 选择你的应用
3. 进入 "Bot" 标签
4. 点击 "Reset Token" 复制 Token
5. 添加到 Hugging Face Secrets 和 GitHub Secrets

---

### 步骤 4: 获取 Google API Key

1. 访问 https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 添加到 Hugging Face Secrets 和 GitHub Secrets

---

## 🚀 修复步骤

### 如果 Hugging Face Secrets 缺失

1. 访问 https://huggingface.co/spaces/tuantuanbot/tuan-tuan-bot/settings
2. 点击 "New Secret"
3. 添加缺失的 Secrets
4. Space 会自动重启

### 如果 GitHub Secrets 缺失

1. 访问 https://github.com/MoRan3421/tuan-tuan-bot/settings/secrets/actions
2. 点击 "New repository secret"
3. 添加缺失的 Secrets
4. GitHub Actions 会自动重新部署

---

## 📋 必需的 Secrets

### 最小配置（机器人可以启动）

| Secret Name | 必需 |
|-------------|------|
| `DISCORD_TOKEN` | ✅ 必需 |
| `GOOGLE_API_KEY` | ✅ 必需 |

### 完整配置（所有功能）

| Secret Name | 必需 |
|-------------|------|
| `DISCORD_TOKEN` | ✅ 必需 |
| `GOOGLE_API_KEY` | ✅ 必需 |
| `FIREBASE_PROJECT_ID` | ⭕ 推荐 |
| `FIREBASE_CLIENT_EMAIL` | ⭕ 推荐 |
| `FIREBASE_PRIVATE_KEY` | ⭕ 推荐 |
| `STRIPE_SECRET_KEY` | ❌ 可选 |
| `STRIPE_WEBHOOK_SECRET` | ❌ 可选 |
| `Groq_Cloud_API` | ❌ 可选 |

---

## 🔥 紧急修复

如果机器人仍然不在线，请：

1. **确认 Discord Token 有效**
   - Token 必须是有效的 Bot Token
   - Bot 必须已被邀请到服务器

2. **检查 Hugging Face 日志**
   - 访问 https://huggingface.co/spaces/tuantuanbot/tuan-tuan-bot
   - 查看是否有错误信息

3. **重启 Space**
   - 在 Hugging Face 设置中点击 "Restart"

---

## 📞 需要帮助？

如果按照上述步骤操作后机器人仍然不在线，请提供：
1. Hugging Face Secrets 配置截图
2. Hugging Face 日志错误信息
3. GitHub Actions 错误信息

---

**请按照上述步骤检查并修复，然后告诉我结果。** 🔥🐼
