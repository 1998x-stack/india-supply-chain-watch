# 印链观察 · India Supply Chain Watch

面向中国企业的印度产业政策、PCB/PCBA、半导体与跨境合作信息平台。**本仓库是可部署的 MVP 源代码，不是已上线的网站。**

## 已实现功能

- 首页、产业情报库、按分类/关键词/标签搜索、情报详情页、项目台账、三篇深度专题、原始来源目录、移动端布局、基础 SEO。
- `data/articles.json` 中的 28 条带日期、来源发布日、核验日和原始链接的初始研究资料。包含 19 条新整理内容。全部为编辑自行整理的简短摘要，不搬运原文，不伪造真实企业投诉。
- `data/projects.json` 中另有 16 家出自印度政府公开批准名单的 PCB、覆铜板、连接器及 SFP 项目主体，仅记录“官方公布获批”，并不代表已投产或具备特定量产能力。
- PostgreSQL + Prisma 的企业经验投稿数据库；公共投稿默认 PENDING，只能由管理员选择发布。
- Cloudflare Turnstile 人机验证、提交长度限制、每 IP 摘要每小时最多 3 条投稿（简易限制）。
- 管理员密码 + 签名 HttpOnly Cookie、单独的审核台；发布只能使用单独审校过的公开标题和正文，联系方式不出现在公开经验库。
- 更正/回应投稿类型、撤回状态、`robots.txt`、`sitemap.xml`。

**上线前注意：** 这是初始版本。尚未提供邮箱真实性验证、证据上传、身份审核、申诉工单、专业法律审校、验证码之外的分布式限流和完整审计日志。不应在没有运营审核人员与数据保护安排的情况下大规模开放投稿。只凭填写的“回应”类型无法证明投稿人就是相关企业的代表，审核时必须另行核对授权。

## 1. 本地启动（Node.js 20+）

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。数据库和验证码未配置时，公开资讯站点仍应可浏览；投稿服务保持关闭。`npm run test:content` 检查初始内容结构。

## 2. 启用 PostgreSQL 投稿数据库

在 PostgreSQL 托管服务中创建数据库（如 Neon、Supabase 或自建受管实例），从其后台复制 PostgreSQL 连接串填写 `.env.local` 的 `DATABASE_URL`。连接数据库后执行：

```bash
npm run db:generate
npm run db:push
```

`db:push` 会根据 `prisma/schema.prisma` 创建或同步表结构。正式生产版本建议在独立环境采用经过审查的 Prisma migration，而不是反复对生产库执行 `db:push`。**切勿把真实密码、连接串或用户投稿提交到 GitHub。**

## 3. 配置投稿与管理系统

参考 `.env.example` 设置：

| 变量 | 用途 |
| --- | --- |
| `DATABASE_URL` | 有效的 PostgreSQL URL，仅服务端使用 |
| `ADMIN_PASSWORD` | 至少 16 字符的独立管理员密码；不得重复使用 GitHub 或邮箱密码 |
| `SESSION_SECRET` | 至少 32 字符的随机密钥，用于管理员 Cookie 和匿名访客摘要 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile **公开**站点密钥 |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile **私有**校验密钥，只能放在 Vercel 的服务器环境变量中 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 公开展示的专门平台联系邮箱，用于处理更正、隐私和撤稿请求 |
| `NEXT_PUBLIC_SITE_URL` | 部署后的规范 HTTPS 域名，用于 sitemap |

`NEXT_PUBLIC_` 是允许在浏览器中公开的变量前缀，**绝不用于数据库密码或私有密钥。** `SESSION_SECRET` 建议用操作系统的密码生成器创建。普通访客投稿必须通过 Turnstile 服务端核验并写入数据库，只有具备全部服务参数时才会开放。

### 审稿

访问 `/admin`，使用 `ADMIN_PASSWORD` 登录；所有内容默认不公开。选择投稿后可以编辑**公开版**标题、正文与编辑说明，设置为 `PUBLISHED` 才会在 `/submissions` 出现。`REJECTED` / `WITHDRAWN` 不展示。联系邮箱仅在受限审核台和数据库中保存，不能复制进公开版正文。发布涉及具名当事方的指控前，应核查法律与证据风险，给相关方提供回应与更正渠道。

管理员入口应配置 Vercel 防火墙/WAF 与额外身份或 IP 限制。当前密码登录未提供完整的分布式抗暴力破解和审计功能，在对公众开放投诉系统前必须补强。

## 4. GitHub + Vercel 部署

1. 在自己的 GitHub 账户创建全新仓库，例如 `india-supply-chain-watch`。不要将源码上传至其他无关项目。
2. 在项目根目录执行下面的命令（替换成自己实际仓库地址）：

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial India supply chain watch platform"
git remote add origin https://github.com/YOUR_USERNAME/india-supply-chain-watch.git
git push -u origin main
```

3. 登录 Vercel，选择 **Add New → Project → Import Git Repository**，选择该仓库。Framework 选择 Next.js，Root Directory 保持项目根目录，Build Command 使用默认 `npm run build`。
4. 第一次可以不配置数据库和验证码，仅上线**公开资料浏览版**；如果要开放投稿，先创建生产数据库、执行 `npm run db:push`、配置上述所有变量并通过端到端检查。
5. Vercel 的 Settings → Environment Variables 设置 Production 变量，注意不要把私有密钥设置为 `NEXT_PUBLIC_`。GitHub `main` 推送触发生产部署，其他分支生成预览部署。
6. 设置 `NEXT_PUBLIC_SITE_URL` 为实际的 `https://...vercel.app` 或自定义域名地址，**重新部署**以更新 sitemap。

Vercel 文档：https://vercel.com/docs/git/vercel-for-github

**个人资料与跨境合规：** 正式开放投稿前，明确站点经营主体、隐私告知、保留期限、更正删除渠道、服务部署位置与适用监管要求。若需要中国大陆本地化部署，请单独评估可达性、备案和个人信息处理要求。本文档不等于法律审查。

## 5. 结构

```text
app/
  page.tsx                 # 首页
  insights/                # 产业情报库和静态详情
  dossiers/                # 三篇跨政策与产业链的深度专题
  projects/                # 官方获批企业项目台账
  sources/                 # 原始信息来源与核查方法
  submissions/             # 只显示人工审核后的公开经验
  submit/                  # 投稿与更正表单
  about/                   # 审核规则与隐私告知
  admin/                   # 内部审核台
  api/submissions/         # Turnstile 验证 + 私密入库
  api/admin/               # 登录、读取、审批及退出
components/                # 导航、卡片、投稿表单、审核台
prisma/schema.prisma       # 数据模型
data/articles.json         # 28 条初始带原始链接的政策和产业资料
data/projects.json         # 16 家官方获批主体的项目跟踪台账
tests/                     # 内容及源码静态检查
```

## 6. 运营与采编守则

每个新条目记录：原文 URL、原始机构、**事件发生/生效日期**、公开发布日期、最后核验日期、行业分类、事实摘要、对企业的具体影响、证据类型和更新状态。未公开投稿不作为统计样本；匿名观点不写成国家机关已认定事实；一般商业合作不能自动等同于商业秘密窃取。严格区分商业争议、监管措施和已被确认的违法事件。

本次研究内容复核截止于 2026-09-24；数据在仓库内静态维护，不会自动联网更新。未来数据和法规可能更新；发布前要核对原始来源的修订公告与项目后续状态。

## 7. 发布前核验与服务条款

运行 `npm test` 对内容与源码进行静态检查；在有正常 npm 网络访问的环境运行 `npm install && npm run typecheck && npm run build`，再完成数据库、投稿、编辑权限和域名的端到端验证。静态检查不能替代生产构建、安全审查或法律审校。

Vercel Hobby 计划仅供个人非商业用途；拟作为商业信息服务经营时，应先核对 Vercel Pro/Enterprise 的适用条款及费用：https://vercel.com/docs/plans/hobby 。如向中国大陆用户提供经营性互联网信息服务，还须在正式上线前独立评估主体、备案或许可、隐私告知和服务部署等合规要求。

## 8. 第二轮增量更新（2026-09-24）

- 公开研究条目从 9 条扩充为 28 条，内容涵盖 ECMS 政策与项目、PCB 两类不同反倾销案件、服务器 IT 硬件 PLI、印度投资准入、半导体制造项目、中方对外投资法规与商业秘密保护。
- 单独建立 16 条项目记录，均对应印度政府公布的获批申请方；与待审核用户投诉完全隔离。
- 资讯文章新增 `publishedAt`、`checkedAt`、`sourceType`、`verification` 和 `tags`，避免把旧事件当成最新发生事件。
- 添加 `/dossiers`（三篇深度专题）、`/projects`（项目台账）和 `/sources`（原始来源目录），并将其纳入导航和 sitemap。
- **真实生产部署尚未执行；本次测试为内容、文件结构和 TypeScript 转译语法检查，并不构成完整 npm 构建、数据库或安全端到端测试。**

## 7. V3.0：GitHub Trending 式情报模式

推荐 GitHub 仓库名称：`india-supply-chain-watch`，展示名：`印链观察 / India Supply Chain Watch`。这只是推荐名称；本交付不意味着已在 GitHub 创建该仓库。

V3.0 将 `/` 改为 GitHub Trending 风格的列表页：深色导航、紧凑横向情报列表、主题侧栏、项目/专题入口、关键词搜索、行业筛选、今日/本周/本月/近一年/全部时间筛选、发布日期排序。原 `/insights`、`/projects`、`/dossiers`、`/sources` 及经审核的合作经验页面继续保留。

**趋势数据口径：** 所有条目依据 `data/articles.json` 的 `publishedAt`（资料发布日期）排序和筛选；使用当前数据的 `checkedAt` 最大值作为**静态快照日期**。只显示“已收录资料数量”，不显示虚构的 Stars、浏览量、上升幅度、情报热度或真实用户数量。“今日/本周/本月”是相对于**数据快照日**，而非访问网站的真实今天，避免停止更新后继续伪装实时榜单。每条记录都可进入资料详情并跳转原始来源。

若后续希望实现真正的 GitHub Trending 式用户关注度，应增加有防刷机制的访问/收藏埋点、去重、时段聚合和统计透明度，并标注“真实用户互动热度”；在收集到可用数据前保持按发布时间排序。

本地验证：`npm run test` 会额外检查趋势页面、行业/时间筛选的实现结构和内容数据。完整 Next.js 生产构建仍需联网安装依赖后运行 `npm install && npm run build`，以及实际浏览器验证。
