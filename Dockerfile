# 使用官方的 Node.js 16 镜像作为基础镜像
FROM node:16

# 设置工作目录为 /app
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建 Vite 项目
RUN npm run build

# 暴露应用的端口
EXPOSE 3000

# 启动 Vite 应用
CMD ["npm", "run", "preview"]