# Production Runbook · India Supply Chain Watch

> 核查时间：2026-11-19。Vercel 团队：`xiemings-projects`，项目：`india-supply-chain-watch-2po3`。
> 本文件记录**可验证的部署状态**及运行步骤。Vercel `READY` 并不保证公开域名、页面交互、数据库或投稿功能正常。

## 1. 环境清单与边界

| 组件 | 部署方式 | 当前验证边界 |
|---|---|---|
| 公开研究资料 | Next.js，来自 `data/articles.json`、`data/projects.json` | GitHub Actions 内容测试、Next 构建、CI 本地 HTTP 冒烟测试 |
| 研究目录 | `/`, `/insights`, `/dossiers`, `/projects`, `/sources` | 需要再做生产域名 HTTP 检查 |
| 内容探针 | `GET /api/health` | **只**证明公开内容应用进程能响应，主动声明 `dependenciesChecked=false` |
| 投稿 | `/submit`, `/api/submissions` | 缺少数据库、管理员、Turnstile 等任一配置时**关闭**；不得静默开放 |
| 审核台 | `/admin`, `/api/admin/**` | 仅凭管理员 Cookie 授权；生产开放前需要 WAF、审计和限流方案 |
| 数据库 | PostgreSQL + Prisma | **未**在本次代码/部署检查中验证真实数据库连接或迁移 |
| 公开域名 | `https://india-supply-chain-watch-2po3.vercel.app` | 域名存在于 Vercel 项目；外部 HTTP 可达性需要实测 |

## 2. 不触碰秘密的部署校验

1. 确认 GitHub `main` 的 commit SHA 与 Vercel 的 `Production` 部署来源一致。
2. 检查 GitHub Actions 的 `Verify India Supply Chain Watch`：数据测试、TypeScript、Next.js `build`、本地 12 路由冒烟全部通过。
3. 查看 Vercel Deployment Overview 和 Build Logs，确认目标为 `production`、状态 `READY`，并检查是否覆盖了预期生产域名。
4. 通过具备访问权限的客户端实际访问生产域名，检查首页、情报详情、专题、项目台账、来源和静态资源。
5. 请求 `GET /api/health`（只做 GET），期望 `200`、`status=ok`、`scope=public-content`，并核对 `snapshotDate`。该结果**不表示** PostgreSQL、Turnstile、管理员权限和外部来源网站已验活。
6. 在没有会话 Cookie 的情况下 `GET /api/admin/reports` 应返回 `401`。绝不把私有响应内容复制到公共构建日志。
7. 核对 `robots.txt`、`sitemap.xml` 的地址指向稳定生产域名，而非随机部署 URL。设置 `NEXT_PUBLIC_SITE_URL` 为生产域名可以消除歧义；改动后重新构建。
8. 检查最近 1 小时 Runtime Errors 与函数运行日志。**没有发现错误**不能替代访问测试，因为可能是流量不足或日志窗口不够。

本地复现：

```bash
npm install --no-audit --no-fund
npm run db:generate
npm test
npm run typecheck
npm run build
npm run start -- --port 3137
# 在另一个终端：
SMOKE_BASE_URL=http://127.0.0.1:3137 npm run smoke
```

测试不会创建投稿、修改数据库或发送电子邮件。默认仅允许 `localhost`；对外部网站执行测试前需显式确认自己拥有目标域名和访问权限，并设置 `SMOKE_ALLOW_EXTERNAL=1`。

## 3. 内容可信度和数据新鲜度

- 研究条目与项目公告的上一次资料核验日期为 **2026-09-24**，不是网页当前访问日。
- 首页会在最近一次资料核验超过 30 天时明确显示“资料陈旧提醒”；时间筛选始终相对于已知数据快照，而不伪装为实时热榜。
- `sitemap.xml` 中情报条目的 `lastModified` 使用来源核验日期 `checkedAt`，不是历史事件日期 `date`。
- 新增研究时必须填写 `date`、`publishedAt`、`checkedAt`、`sourceLabel`、`sourceUrl`、`verification`，并核实日期先后关系。内容校验使用当前 UTC 日期而非永久冻结在 2026-09-24。
- “政府公布获批”“实际投产”“已交付”“企业自述”属于不同证据等级，不可混为一谈。

## 4. 投稿系统启用前的安全门禁

默认安全姿态是**只读内容站**。配置全部变量也并不自动等于业务运营安全。需要完成：

- 独立 PostgreSQL 实例，审核迁移脚本与备份恢复方案；生产库变更尽量采用审查过的 Prisma Migrations。
- 管理员凭证与会话秘钥通过 Vercel 环境变量设置，不能写入 GitHub；确认权限最小化、管理员账户轮换与审计。
- Turnstile 完整服务端校验、网络限流（分布式限流/边缘 WAF），不得只依赖浏览器端验证或单实例内存限流。
- 对投稿中的个人信息设定收集目的、删除与更正渠道、保存期限和审校流程；明确公开联系人。
- 独立验证权限边界、CSRF、发布审批流程及原始记录绝不直接展示。正式上线前应进行安全测试。

**切勿在 CI 中输出秘密值或运行自动提交真实投稿的生产测试。**

## 5. 常见故障

| 现象 | 定位路径 | 处置 |
|---|---|---|
| Vercel READY，但页面 401/403 | Deployment Protection / SSO、域名绑定 | 分清被保护的 Deployment URL 与应公开的生产域名；不要为通过测试擅自解除保护 |
| 页面 404 / 构建输出错误 | Root Directory、Next.js 框架和构建日志 | 项目根目录为 `./`，使用 `prisma generate && next build` |
| 首页正常但 `/submit` 被禁用 | 预期安全默认态 | 缺少生产数据库、验证码或审核配置时继续保持关闭 |
| sitemap 指向临时部署域名 | `NEXT_PUBLIC_SITE_URL`、`VERCEL_PROJECT_PRODUCTION_URL` | 设置稳定 canonical，重新构建生产版本 |
| `/api/health` 返回 ok 但投稿失败 | 探针不覆盖外部依赖 | 单独检查 Prisma 连接、数据库、Turnstile、密钥与 WAF |
| 研究“今日”没有新数据 | 快照停留在历史日期 | 更新研究条目和核验日期，不得伪造实时数据 |

## 6. 回滚、问题记录与后续工程

- 推荐使用 GitHub PR + CI，并在确认 Preview 后合并主分支；主分支 Git 连接自动触发 Vercel Production 部署。
- 生产出现问题，先检查 Vercel 部署记录和上一个已知 READY 版本，评估回滚影响；若涉及数据库迁移，应在回滚前独立核对向后兼容性。
- 记录：commit SHA、部署 ID、环境、构建日志摘要、HTTP 测试结果、已知业务限制和回滚依据。
- **待办：** 增加 review 后的锁文件并改为 `npm ci`；数据库真实验收；生产 HTTP 外部验证；管理员限流和审计；定期更新研究数据与来源有效性。

## 7. 证据与限制

2026-11-19 通过账户连接确认：Production 部署 `dpl_5StWstaudfvpp92WFqiJBM9GdcZR`、Git SHA `4eee3f37...`、状态 `READY`，Vercel 过去七天的 Runtime Errors 查询未报告错误。这不是外部 HTTP 健康测试，更不证明投稿数据库已配置。
