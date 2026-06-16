# Cloudflare Pages 部署说明

这份说明用于把前端从 Netlify 迁到 Cloudflare Pages。后端 Railway 暂时不用动。

## 需要先做的事

1. 注册或登录 Cloudflare。
2. 在 Cloudflare 后台进入 `Workers & Pages`。
3. 选择 `Create application` -> `Pages` -> `Import an existing Git repository`。
4. 授权并选择 GitHub 仓库：`bird125758/daping`。

## 构建配置

在 Cloudflare Pages 创建项目时填写：

- Framework preset: `Vue` 或 `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

## 环境变量

在 `Environment variables` 添加：

- Variable name: `VITE_API_URL`
- Value: 你的 Railway 后端地址，例如 `https://xxxx.up.railway.app`

注意：不要填 `/api/data`，只填后端域名根地址。

## 已加入的配置文件

项目已新增：

- `frontend/public/_redirects`
- `frontend/public/_headers`

`_redirects` 用于让所有路径回到 `index.html`，避免刷新或直接访问子路径时 404。

`_headers` 用于让 `index.html` 不强缓存，方便大屏刷新后尽快看到新版本。

## 部署后检查

1. 打开 Cloudflare 给你的 `*.pages.dev` 地址。
2. 确认大屏能显示。
3. 点击右侧悬浮按钮进入后台。
4. 修改一个不重要的测试值，保存。
5. 返回大屏刷新，看数据是否读取 Railway 后端最新数据。

## 如果部署失败

优先看 Cloudflare Pages 的 build log：

- 如果提示找不到 `package.json`，检查 Root directory 是否是 `frontend`。
- 如果页面空白，检查 `VITE_API_URL` 是否填的是 Railway 后端根地址。
- 如果后端接口报错，直接访问 `你的Railway地址/api/data` 检查是否返回 JSON。

官方参考：

- https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/configuration/headers/
