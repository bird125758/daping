# 中企云链经营监控大屏 - 线上部署指南

## 📋 项目概述

这是一个基于Vue 3 + ECharts的数据可视化大屏项目，包含：
- **前端**：Vue 3 + Vite + ECharts（运行在3000端口）
- **后端**：Node.js + Express（运行在3001端口）

## 🚀 部署步骤

### 第一步：部署后端到 Render

1. **访问 Render**: https://render.com
2. **注册/登录** GitHub账号
3. **创建新服务**：
   - 点击 "New +" → "Web Service"
   - 连接您的GitHub仓库：`bird125758/daping`
   - 配置：
     - **Name**: `daping-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && node src/server.js`
     - **Plan**: `Free`
4. **点击 "Create Web Service"**
5. **等待部署完成**（约2-3分钟）
6. **记录后端URL**：类似 `https://daping-backend.onrender.com`

### 第二步：部署前端到 Vercel

1. **访问 Vercel**: https://vercel.com
2. **注册/登录** GitHub账号
3. **导入项目**：
   - 点击 "Add New..." → "Project"
   - 导入GitHub仓库：`bird125758/daping`
   - 配置：
     - **Framework Preset**: `Vite`
     - **Root Directory**: `frontend`（重要！）
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. **添加环境变量**：
   - 点击 "Environment Variables"
   - 添加：
     - **Key**: `VITE_API_URL`
     - **Value**: 第一步得到的后端URL（例如：`https://daping-backend.onrender.com`）
5. **点击 "Deploy"**
6. **等待部署完成**（约1-2分钟）
7. **获得前端URL**：类似 `https://daping.vercel.app`

## ✅ 访问您的应用

部署完成后，您可以通过以下链接访问：

- **前端页面**（数据大屏）：`https://你的项目名.vercel.app`
- **前端页面**（后台管理）：`https://你的项目名.vercel.app/admin`
- **后端API**：`https://你的后端名.onrender.com/api/data`

## 📝 修改数据

任何人都可以通过以下链接修改数据：
- 访问：`https://你的项目名.vercel.app/admin`
- 点击任意模块（如"产业链长走势图"）
- 修改数据
- 点击"保存"

## 🔄 更新代码

当您修改了本地代码后：

1. **提交到GitHub**：
   ```bash
   git add .
   git commit -m "更新说明"
   git push origin main
   ```

2. **自动部署**：
   - Vercel和Render会自动检测GitHub的更新
   - 自动重新构建和部署
   - 约1-2分钟后生效

## ⚠️ 注意事项

1. **Render免费套餐**：
   - 15分钟无访问会自动休眠
   - 首次访问需要等待30秒唤醒
   - 每月750小时免费运行时间

2. **Vercel免费套餐**：
   - 无限部署
   - 自动HTTPS
   - 全球CDN加速

3. **数据持久化**：
   - Render的免费套餐数据存储在临时文件系统
   - 重启后数据会丢失
   - 如需持久化，建议升级到付费套餐或使用数据库

## 🆘 常见问题

**Q: 前端无法连接后端？**
A: 检查前端的环境变量 `VITE_API_URL` 是否正确设置为后端URL

**Q: 保存数据失败？**
A: 检查后端是否正常部署，访问 `https://你的后端名.onrender.com/api/data` 看是否能返回数据

**Q: 页面显示空白？**
A: 打开浏览器控制台（F12）查看错误信息，通常是API连接问题

## 📧 技术支持

如有问题，请联系项目维护者或查看GitHub仓库：
https://github.com/bird125758/daping
