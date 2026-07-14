# 中企云链经营监控大屏（纯前端版）

这是一个可直接部署的静态 Vue 大屏，不包含后台、接口或数据库。

## 数据位置

所有图表数据位于 `src/data/dashboard-data.json`，修改后执行构建并重新部署即可生效。

## 本地运行

```bash
npm install
npm run dev
```

## 静态部署

将此目录作为部署根目录：

- 构建命令：`npm run build`
- 发布目录：`dist`

适用于 Netlify、Cloudflare Pages 和 Vercel。部署时无需配置 `VITE_API_URL`，也无需部署后端服务。
