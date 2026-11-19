# 部署与验收 · India Supply Chain Watch

> 更新：2026-11-19。早期文件中“仓库尚未上传完整源码、没有线上部署”的描述已经过期。

## 当前已核查部署

- GitHub：**https://github.com/1998x-stack/india-supply-chain-watch**
- Vercel 项目：**https://vercel.com/xiemings-projects/india-supply-chain-watch-2po3**
- 生产域名：**https://india-supply-chain-watch-2po3.vercel.app**
- 2026-11-19 核查到的 Vercel Production 部署：`dpl_5StWstaudfvpp92WFqiJBM9GdcZR`
- Git Commit：`4eee3f37a944cd2515c7f8e7818650b9912d6a89`
- 构建状态：**READY**，Next.js 构建日志中已出现静态路由及动态路由。
- 运行错误查询：本次 Vercel 近七天 Runtime Errors 未返回错误。
- **仍未验证：** 实际公开 HTTP 可达性、关键业务交互、真实 PostgreSQL 连接与管理员工作流。请勿将构建 READY 误报为整站健康。

## GitHub Actions

`.github/workflows/verify.yml` 在 PR 和主分支推送时执行：

1. 固定 GitHub Actions 版本、安装依赖、生成 Prisma Client；
2. 内容来源/日期验证、投稿安全边界静态检查；
3. TypeScript 类型检查及 Next.js 生产构建；
4. 本地启动 Next Server，执行首页、研究列表、专题、来源、投稿只读页面、健康接口和管理员权限共 **12 项 GET 冒烟测试**。

构建没有数据库凭据，也应当能完整启动公开资料浏览。此 CI 冒烟并不连接真实生产数据库。

## Vercel 配置

- Framework：Next.js。
- Root Directory：仓库根目录 `./`。
- Build Command：`npm run build`（项目 script：`prisma generate && next build`）。
- Git：`1998x-stack/india-supply-chain-watch`，生产分支 `main`。
- Environment：**不要**在 GitHub 提交 `.env`、连接串、管理密码。
- SEO：`NEXT_PUBLIC_SITE_URL` 建议设置为 `https://india-supply-chain-watch-2po3.vercel.app`，以稳定域名生成 sitemap；如未配置，生产环境将优先尝试 Vercel 提供的 `VERCEL_PROJECT_PRODUCTION_URL`。

> 变更生产访问保护、启用投稿、设置数据库、修改 DNS 均需额外的安全和服务条款核对。本轮不自动解除任何 Deployment Protection。

## 发布检查

```bash
npm install --no-audit --no-fund
npm run db:generate
npm test
npm run typecheck
npm run build
npm run start -- --port 3137
# 第二个终端：
SMOKE_BASE_URL=http://127.0.0.1:3137 npm run smoke
```

GitHub PR 全绿之后合并到 main，再在 Vercel Deployment Overview 核对 `production` 新版本的 commit 和状态、HTTP 连通性与 Runtime Logs。只有这些检查独立完成后，才将对应验收项标记为通过。

完整安全策略、数据新鲜度、回滚、异常响应与投稿上线条件，见 [生产 Runbook](docs/PRODUCTION_RUNBOOK.md)。

## 数据快照边界

站点研究信息的最新核验日期为 **2026-09-24**。首页在超过 30 天未核验时显示过期提醒。新闻、产业政策和技术投资决策都需要以原始官方来源的最新文本重新核对，不应把历史快照解释为实时新闻。
