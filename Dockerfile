FROM node:22-slim

# 安装系统依赖 (FFmpeg 用于音乐, 其他用于加密库编译)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制依赖文件并安装 (这样可以利用 Docker 缓存)
COPY bot/package*.json ./
RUN npm install --production

# 复制全部机器人代码
COPY bot/ .

# 验证文件是否复制成功 (会在构建日志中显示)
RUN ls -la

# Hugging Face 必需配置
ENV PORT=7860
EXPOSE 7860

# 启动团团核心！
# 使用 --stack-size 增加栈深度以防止某些复杂 AI 逻辑溢出
CMD ["node", "index.js"]
