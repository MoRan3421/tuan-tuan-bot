FROM node:22-slim

# 安装必要依赖 (FFmpeg 用于音乐服务)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制机器人文件夹的依赖
COPY bot/package*.json ./

# 安装依赖
RUN npm install --production

# 复制机器人核心代码
COPY bot/ .

# Hugging Face 必需端口
ENV PORT=7860
EXPOSE 7860

# 启动团团！
CMD ["node", "index.js"]
