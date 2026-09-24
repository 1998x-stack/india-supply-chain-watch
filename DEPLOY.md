# 部署说明（2026-09-24）

当前仓库已创建、已配置 GitHub Actions 代码检查，但完整 V3 网站源码尚未进入仓库，尚未在 Vercel 上线。不要将当前仓库状态误认为网站已发布。

## 导入网站源码

下载聊天中提供的 `india-supply-chain-watch-trending-v3.zip` 和 `upload-india-watch-to-github.sh`，放到本机下载目录。在 macOS 终端执行：

```bash
bash ~/Downloads/upload-india-watch-to-github.sh ~/Downloads/india-supply-chain-watch-trending-v3.zip
```

需要本机 GitHub 推送权限。上传后检查仓库是否出现 `package.json`、`app/`、`components/`、`data/`。在本仓库 Actions 页面查看 CI 是否通过，再进行线上部署。

## Vercel

在 Vercel 连接 GitHub，导入 `1998x-stack/india-supply-chain-watch`。Next.js 框架，项目根目录 `./`；首次部署不启用 PostgreSQL 和 Turnstile 配置，因此仅开放静态公开资料浏览，投稿保持关闭。商业使用须选择符合 Vercel 服务条款的计划。部署后核对首页、产业情报、项目台账、来源页面，并配置 `NEXT_PUBLIC_SITE_URL` 为实际域名后重新部署。

只有在完成 GitHub 源码提交、CI 通过、Vercel 项目成功构建并打开实际 URL 验证后，才能标记为部署完成。
