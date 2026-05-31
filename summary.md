# 项目总结

> 最后更新：2026-05-31（第三轮优化）

---

## 一、需求与部署

**业务方**：牧哥生物（火锅供应链企业）
**展示页**：http://localhost:3000/index.html
**后台**：http://localhost:3000/admin.html（密码 muge2024）
**线上**：https://biating1.github.io/muge-shipin/

**架构**：Vue 3 CDN + 原生 CSS，无需构建工具。数据源为 `products.json`，admin 编辑双写到 localStorage + 服务器文件，index 从 localStorage → API → 硬编码降级加载。GitHub Pages 静态部署，`admin.html`/`server.js` 被 `.gitignore` 仅本地可用。

---

## 二、已上线功能

| 功能 | 说明 |
|------|------|
| 产品展示 | 6 分区 + 7 产品卡片 + 详情弹窗（工艺/规格/场景/SOP） |
| 背景音乐 | 独立 BGM，首次交互启动，浮动按钮切换 |
| 教学视频 | B站/抖音/自托管 mp4 + 弹窗播放 |
| 导航 | 固定导航 + IntersectionObserver 滚动高亮 |
| 公司简介 | Hero 下方介绍区，左对齐排版，后台可编辑 |
| SOP 折叠展示 | 主料/辅料双栏 + 步骤列表，详情弹窗内折叠 |
| PDF 导出 | 后台操作，黑金横版（封面+分隔+产品+SOP 页），~7MB |
| 视频自动压缩 | server.js 中间件，首次请求 lazy 压缩，71MB→20MB |
| 产品图压缩 | 3 张大图 21MB→1MB/张 |
| Excel 导入导出 | 后台 SheetJS，增量/替换两种模式 |
| 批量操作 | 批量删除 + 排序 |
| 视频暂停 BGM | 打开视频自动暂停背景音乐，关闭后恢复 |
| Slogan 编辑 | "火锅供应链先行者" 后台可编辑，前端 + PDF 同步更新 |

---

## 三、关键架构决策

1. **数据文件即数据库**：`products.json` 是唯一数据源，本地编辑 → git push → GitHub Pages 自动同步
2. **不要 SQLite**：静态站点 + JSON 文件已满足需求，加数据库反而破坏部署兼容性
3. **前后端分离**：后端只做静态文件 + API 持久化 + 视频压缩，展示逻辑全在前端
4. **原子写入**：服务器写文件用 `writeFileSync(tmp) → renameSync(tmp, target)` 防止中断损坏
5. **视频 lazy 压缩**：首次请求触发后台 ffmpeg，后续命中缓存，不阻塞启动

---

## 四、经验教训

### 本轮（2026-05-31 第三轮）

1. **Slogan 编辑要独立按钮** — 介绍文字和 slogan 如果共用一个"保存"按钮，改一个必须填另一个，反直觉。各自独立保存互不影响
2. **PDF 颜色先确认再替换** — 全局替换 `#C8A96E` 前要确认不影响到 admin UI 的其他部分（如 Excel 预览）

### 上轮（2026-05-31 第二轮）

1. **不要擅自实现未确认的需求** — 用户列待做清单不等于确认要做，必须先逐条确认再动手。PDF 前端导出按钮、SOP 填充、SQLite 全部被撤回。→ [[lesson-dont-implement-unasked]]
2. **公司简介要可编辑** — 硬编码文案迟早要改，直接做成后台可编辑面板，数据随 products.json 同步
3. **GitHub Pages 优先** — 任何改动前先想 "这个在 GitHub Pages 上能工作吗"
4. **API 测试注意副作用** — `POST -d '[]'` 会真清空 products.json，用测试标记或独立文件

### 上轮（2026-05-31 第一轮）

1. **localStorage 前后台数据隔离** — 不同端口/线上不互通，数据必须写入文件才能 git push 同步
2. **Express 中间件顺序** — 自定义路由必须在 `express.static` 之前
3. **UTF-8 BOM 问题** — 编辑器可能写入多重 BOM 导致字符串匹配失败
4. **`.gitignore` 策略** — 数据文件（JSON）永远不要 gitignore，脚本文件可以按需忽略

---

## 五、PDF 导出要点（最终方案）

- 技术栈：`html2canvas v1.4.1 + jsPDF v2.5.1`，逐页串联渲染
- 格式：`[292, 196]mm` 横版，`JPEG q0.88 @ scale 2.5`（239 DPI 印刷级）
- 封面/分隔页：`scale 2 + JPEG q0.88`（~55-60KB/页）
- 产品页：`scale 2.5 + JPEG q0.88`（~450-630KB/页，含图）
- SOP 页：`scale 2 + PNG`（~200KB/页，文字密集）
- 黑金色 `#E9C499`（原 `#C8A96E`），2026-05-31 第三轮调整
- LOGO 黑金：Canvas `ctx.filter` 预处理，不用 CSS filter（html2canvas 不支持）
  - `processLogo` 自适应多尺寸（`parseFloat(img.style.height)`）
  - 右上角 logo 56px（原 42px），封面大 logo 72px 带倒影
- **坑：`createPattern 0×0`** — 渐变中不能用 `transparent`/`rgba(…,0)`，用 `rgba(…,0.005)` 或纯色 + box-shadow

---

## 六、后续不再做的

- ❌ 前端 PDF 导出按钮 — 后台导出已够用
- ❌ SQLite 后端 — 破坏 GitHub Pages 兼容性
- ❌ SOP 数据填充 — 由用户自行在后台编辑

