# 🔐 GitHub Secrets 配置指南

## 📋 必需的 GitHub Secrets

访问 https://github.com/MoRan3421/tuan-tuan-bot/settings/secrets/actions

### 🔑 Discord 相关

| Secret Name | 说明 | 获取方式 |
|-------------|------|----------|
| `DISCORD_TOKEN` | Discord Bot Token | Discord Developer Portal |
| `CLIENT_ID` | Discord Application ID | Discord Developer Portal |

### 🔥 Firebase 相关

| Secret Name | 说明 | 获取方式 |
|-------------|------|----------|
| `FIREBASE_PROJECT_ID` | Firebase 项目 ID | Firebase Console |
| `FIREBASE_CLIENT_EMAIL` | Firebase 服务账号邮箱 | Google Cloud Console |
| `FIREBASE_PRIVATE_KEY` | Firebase 服务账号私钥 | Google Cloud Console |

### 🧠 AI API 相关

| Secret Name | 说明 | 获取方式 |
|-------------|------|----------|
| `GOOGLE_API_KEY` | Google Generative AI API Key | Google AI Studio |
| `Groq_Cloud_API` | Groq API Key | https://console.groq.com |

### 💳 Stripe 相关 (可选)

| Secret Name | 说明 | 获取方式 |
|-------------|------|----------|
| `STRIPE_SECRET_KEY` | Stripe Secret Key | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret | Stripe Dashboard |

### ☁️ GCP 相关

| Secret Name | 说明 | 获取方式 |
|-------------|------|----------|
| `GCP_SA_KEY` | GCP Service Account Key (Base64) | Google Cloud Console |

---

## 🔧 详细配置步骤

### 1. Discord Token

1. 访问 https://discord.com/developers/applications
2. 选择你的应用
3. 进入 "Bot" 标签
4. 点击 "Reset Token" 复制 Token
5. 添加到 GitHub Secrets: `DISCORD_TOKEN`

### 2. Firebase 凭据

#### 获取服务账号密钥：

1. 访问 https://console.cloud.google.com/iam-admin/serviceaccounts
2. 选择项目 `tuantuanbot-28647`
3. 点击服务账号 `firebase-adminsdk-fbsvc@tuantuanbot-28647.iam.gserviceaccount.com`
4. 点击 "密钥" → "添加密钥" → "创建新密钥"
5. 选择 JSON 格式并下载

#### 提取信息：

打开下载的 JSON 文件，找到：
```json
{
  "project_id": "tuantuanbot-28647",
  "client_email": "firebase-adminsdk-fbsvc@tuantuanbot-28647.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCb29V9wmoGx+jG\nBzemg29LbcKXyqWzCJYkA44QWltNDP54toyVbkPw+4dA7UA/uDml4S1CNAX1DzW7\nQ2+a6oV4ckrkmgx4lvrwvEvWEZoL3stDIXriq/OkWowCnsirtDtbXFHy/zTlqgu4\nMfj7GUTyPk8Ki0izR+KTSRSymPo0m694nKNToqhjQwVquzufbzlDFI5heiCZQ109\nU1KwC6TnO248Jps1r6fpG9135zJTlgrXgSiup1neCHbnv47GzJ07EGWF0aFDlaQR\nryfxUD/S2EskFM8ZVeGovcHxn/5AiU7eRBUQNpc/tP1/GyH8G4yOm4XteF5qJ6Ew\n6gndFgjdAgMBAAECggEAAsSoyg8F6xDp5XqDVoXHGEPezOtgfgmNAR6/CzNPo9Kz\nQlmbrZvDwSf2gwSzu23+OCADucVKxct7XNQZy1qW/EirY9wIlKu50UTG5Apz/fn7\nCjoyAIylSyoAiptfXQ1acIj3O6Wkvt+CTcc1cOBGBTduF/XZWLXSJGOL5pApAX4r\nSowuVEvWy8lLJdmpaC8KPcJ7xbsKZ8RvfO7wPYOvIrCf/9knUPGqMHRZVUnLGQFO\n7hWgl+VPkHaZy4X/Q1XRgeCJwaWW41JA5gs31xSB8uY7l3PiSO5yAfUVHLo18RlB\n8vuCyzo3K1Xr88ym4aNcgfgx+0AUVOEZWJGQX6VOUQKBgQDNMh+W7b0RcHQwsEaG\nFOSmHrEtC1KL2aXTAybScNuF5a8MrM0j2cZzRwaB8aaHXcwLpm7ceSxr9pSCHq8E\nks0SC2Dp46CiNHdX1mHyxrqex5J60X2DeXJEhlYxlcYNUq6HPR6eAi9pegWvLTBJ\nu5f8h/LhCde745DK3RepnGv42wKBgQDCcpc/US+vqcVjbp8ZbIhIMIuCuBCtpJlO\nGtmMdqCVPy6J7FjFMXfpY/HGfaXAVngyWWqPnN50/dmB9DeDwIQyZqiGluYaIVdu\nnebyEt0OWniWYh31mt3so7A/LyDTYct6CFBG4bpNoX2WQzPIsM7Ra8yZ0oFCr/erN\nKdWwCqG2pwKBgQCg5TiX4/pofkDdHJtv71oKV+6dX09ukU7RUptST2QSbbMAwU5p\nWg2dvod/xLfLVOT2DZ7ICcunLEXucZjSgTmDeKCZRP9jsLgTi+ppryIN9ncJDtLY\nEJZk3OEhKEuPjtGDAY3MX/JFRoTGgyxl5E6cmQz9H/alQR77srknKZwQGQKBgQC6\n1ZZETYLvW8YA61rN9/3et15lhOzpm91+MchU8esMXMAf4EvPdd/NDq5SVYp9C9jE\nMCx2v3j0mrFy77Cj1MhxETje0YFZHC5BRZGBSAIWZ/Ch5ZX1q1kYkfH/kWhNjdoE\nzLnWJ9FVmUwi3PnYxPmH5lhN+XhqOjlxVsAvPZfywwKBgA01LLiOgQPt2za02VY1\nvfTk1V8WaQ+waP65naC3ffSIsGz2EYIkvM4+ixajjIJ6dKWnXq3Iy4zqu0+eYI/c\nxkMU0nHUugA/OUHLjYRqWzu18OubVZFgPtjjCbkb+d524Qw+Y46V7QprVC/nS4zE\n76WKSvv4TqXxSCJx63V5T3TI\n-----END PRIVATE KEY-----\n"
}
```

#### 添加到 GitHub Secrets：

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_PROJECT_ID` | `tuantuanbot-28647` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@tuantuanbot-28647.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | 上面的完整私钥（包含换行符） |

**注意**: `FIREBASE_PRIVATE_KEY` 必须包含完整的 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`，换行符用 `\n` 表示。

### 3. Google API Key

1. 访问 https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 添加到 GitHub Secrets: `GOOGLE_API_KEY`

### 4. Groq API Key

1. 访问 https://console.groq.com
2. 注册并登录
3. 创建 API Key
4. 添加到 GitHub Secrets: `Groq_Cloud_API`

### 5. GCP Service Account Key (Base64)

1. 访问 https://console.cloud.google.com/iam-admin/serviceaccounts
2. 创建新的服务账号密钥 (JSON)
3. 在本地转换为 Base64:
   ```bash
   base64 -i key.json | pbcopy  # macOS
   base64 -w 0 key.json > key.b64  # Linux
   ```
4. 添加到 GitHub Secrets: `GCP_SA_KEY`

---

## ✅ 验证配置

配置完成后，GitHub Actions 会自动运行部署流程。你可以访问：
- https://github.com/MoRan3421/tuan-tuan-bot/actions

查看部署状态。

---

## 🆘 常见问题

### Q: Firebase 认证失败怎么办？
A: 检查 `FIREBASE_PRIVATE_KEY` 是否完整，确保包含 `BEGIN` 和 `END` 标记，换行符用 `\n` 表示。

### Q: Discord Bot 无法连接？
A: 检查 `DISCORD_TOKEN` 是否正确，确保 Bot 已被邀请到服务器。

### Q: AI 功能无法使用？
A: 检查 `GOOGLE_API_KEY` 和 `Groq_Cloud_API` 是否正确配置。

---

## 🎋 开发者

Designed & Developed by **godking512 (团团熊猫主播)**

© 2026 TuanTuan Supreme Core. All Rights Reserved. 🐾
