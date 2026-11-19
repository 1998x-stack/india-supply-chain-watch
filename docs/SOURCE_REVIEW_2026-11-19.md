# 印链观察｜2026-11-19 官方来源复核及内容迭代

> 编辑原则：只有实际核对过的**政府/监管公开来源**才更新对应资料的 `checkedAt`。新增内容并不代表全部历史条目都已重新核验。此文档仅是来源追踪与项目工程记录，不构成投资、进出口或法律意见。

## 官方证据矩阵

| 事项 | 日期与口径 | 核实的事实 | **不能**据此声称 | 原始来源 |
|---|---|---|---|---|
| ECMS 新一批申请 | 2026-11-06（公告及获批日期） | 新增 12 项批准申请；ECMS 累计 118 项、34 类产品、16 邦，预计投资 ₹77,051 crore | 已经有 118 座工厂投产，或每项投资已经到位 | [印度电子与信息技术部 PIB #2333716](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2333716&lang=2&reg=3) |
| PCB Tools 反倾销调查 | 2026-09-25（DGTR 最终调查结论发布日期） | 案件 06/46/2025-DGTR 的官方页面列出 Final Findings | 财政/海关部门已实际征税、适用税率和生效日期已经确认 | [DGTR 案件官方页面](https://dgtr.gov.in/en/anti-dumping-cases/anti-dumping-investigation-concerning-imports-printed-circuit-board-tools) |
| 外资政策实施情况 | 2026-08-21 公告，统计截至 2026-08-20 | 修订框架下报告 29 项拟议投资，总额 ₹4,895.65 crore；部分不超过 10% 的非控制性受益所有权可依条件适用自动途径 | 所有中国/接壤国家投资都自动获批，或报告金额全部实际到账 | [印度工商部 PIB #2301992](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2301992&lang=1&reg=48) |

### ECMS 新增主体样例（选择性收录）

原始公报中确实提及以下四家主体及其获批领域，已录入 `data/projects.json`，但**不是完整的 12 项申请明细**：

1. NeST ICELR Private Limited — 多层 PCB。
2. Indo Asia Copper Limited — 铜箔（与 PCB 用覆铜板及电池产业链相关）。
3. Voltix Semicon Private Limited — 特种陶瓷。
4. Wipro Pari Robotics Private Limited — 工厂自动化及系统集成资本设备。

“公司被列为获批申请方”不等于“工厂建成”“相关产品质量已认证”“产品已形成稳定交付”。即使同一公司同时在多个产品类别获批，也不得据此推断为不同独立企业。

## 数据维护的具体规则

- 原始 `data/articles.json` 的 28 条旧条目仍保留原有核验日期 **2026-09-24**。本轮新增 3 条记录各自标注 `checkedAt=2026-11-19`，合计 **31** 条。
- 原始 `data/projects.json` 的 16 条记录继续保留真实的历史核验日期。本轮选择性新增 4 条官方审批主体，共 **20** 条。
- 看板显示每条资料的 `checkedAt` 和超过 30 天未核验的历史条目数量。**最新一条来源已经复核不意味着整个研究资料库都已更新。**
- 专题文稿同步更新相关章节及官方来源链接；不以近期发布的政策公告覆盖独立发生在 2023–2025 年的历史事件。
- 依赖关系：`data/*.json` 是唯一事实数据源，`exports/*.csv` 通过 `npm run exports:write` 再生成；`npm run exports:check` 及 GitHub CI 防止 CSV 与 JSON 口径不一致。
- 输出 CSV 防止引号/逗号/换行符损坏，并对 spreadsheet formula injection 做基本文本保护。
- 审核更正时保留旧条目和日期，不得通过更改旧资料的全部 `checkedAt` 来制造“全库已核验”的错觉。

## 部署与风险边界

GitHub PR 的 CI 应先通过内容、回归测试、TypeScript、Next.js 生产构建、12 路由本地冒烟和 CSV 漂移校验，再由合并到 `main` 触发 Vercel Production。

Vercel 部署 `READY` 只证明构建/部署通过。实际匿名公网访问、Deployment Protection、PostgreSQL、Turnstile 与管理员审核系统仍需各自验收；为了尽快发布研究资料，不得放开投稿或调整现有平台访问保护。

## 后续应调查的来源

- CBIC / 印度海关正式反倾销征税通知，确认 PCB Tools 是否实际落地措施及 HS 范围；DGTR Final Findings 不能代替。
- ECMS 118 项完整申请名单及各公司实质建设进度；本轮项目名单只选择性收录四家主体。
- 2026-09-24 之前条目的原始链接可达性、政策修订、归档凭据和资料使用授权。
- 将中国出口管制、印度 FDI、税收、公司法和知识产权事件分为独立核验层级，不做国籍推断或未经确认的商业指控。

## 验收命令

```bash
npm install --no-audit --no-fund
npm test
npm run exports:check
npm run typecheck
npm run build
# 另行启动生产模式进程并运行现有只读路由冒烟测试
npm run start -- --port 3137
SMOKE_BASE_URL=http://127.0.0.1:3137 npm run smoke
```

当前仍缺少版本锁定的 `package-lock.json`，尚不宣称 `npm ci` 可复现；应在有 npm registry 访问的工程环境中生成、审查并提交依赖锁后再改为 `npm ci`。
