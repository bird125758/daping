# Netlify 回退方案

如果 Cloudflare Pages 在中国大陆访问效果不好，或者一体机 Chromium 打不开，可以升级 Netlify 付费模式并继续使用原来的 Netlify 项目。

## 当前 Netlify 项目

截图中的项目地址：

- `https://gorgeous-frangollo-98ae80.netlify.app`

Netlify 后台提示团队积分已用完，所以 GitHub 推送后不会继续构建发布。升级团队后，原项目通常可以继续使用，不需要重新建站。

## Netlify 原部署配置

如果需要重新确认配置：

- Repository: `bird125758/daping`
- Base directory / Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist` 或在 root 为 `frontend` 时填 `dist`
- Environment variable: `VITE_API_URL=你的 Railway 后端地址`

## 回退步骤

1. 在 Netlify 升级团队或恢复构建额度。
2. 回到原项目 `gorgeous-frangollo-98ae80`。
3. 进入 `Deploys`。
4. 选择最新一次 GitHub commit，点击重新部署，或重新 push 一次 GitHub。
5. 部署完成后打开 Netlify 地址检查大屏。

## 这次 Cloudflare 配置对 Netlify 的影响

新增的两个文件：

- `frontend/public/_redirects`
- `frontend/public/_headers`

对 Netlify 也是常见静态站点配置，不会破坏 Netlify 部署。即使 Cloudflare 不用，这两个文件也可以保留。
