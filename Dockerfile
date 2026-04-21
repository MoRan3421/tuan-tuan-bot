FROM node:22-slim

# 安装系统依赖 (FFmpeg 用于音乐, 其他用于加密库编译, cloudflared 用于代理)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++ \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 安装 Cloudflare WARP 客户端（轻量级代理）
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared \
    && chmod +x /usr/local/bin/cloudflared

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

# 设置代理环境变量（如果需要通过外部代理）
ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""
ENV NO_PROXY=""

# 启动脚本：尝试使用 cloudflared 作为 SOCKS5 代理
RUN echo '#!/bin/sh\n\
if [ -n "$USE_WARP_PROXY" ]; then\n\
    echo "🌐 Starting Cloudflare WARP proxy..."\n\
    cloudflared access tcp --hostname discord.com --url 127.0.0.1:1080 &\n\
    sleep 5\n\
    export HTTP_PROXY="socks5://127.0.0.1:1080"\n\
    export HTTPS_PROXY="socks5://127.0.0.1:1080"\n\
fi\n\
echo "🚀 Starting TuanTuan Bot..."\n\
exec node index.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# 启动团团核心！
CMD ["/app/start.sh"]
