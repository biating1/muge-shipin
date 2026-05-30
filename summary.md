# 项目总结

> 最后更新：2026-05-30（新增：Excel 导入导出、应用场景字段、序号重算、音乐按钮位置修复）

---

## 一、需求

**业务方**：牧哥生物（火锅供应链企业）

**展示页**：5 个产品系列（牛油/火锅底料/烤鱼料/龙虾料/汤料），产品卡片 + 详情弹窗（逐条动画 + 油滴滚动指示器）+ 独立 BGM + 教学视频 + 固定导航平滑滚动 + 手机适配

**后台管理**：密码登录 → 分区/产品增删改（图片/BGM/视频/工艺/规格/应用场景/SOP）→ PDF 产品手册导出 → Excel 批量导入导出 → localStorage 前后台共享

---

## 二、技术方案

| 层级 | 选型 |
|------|------|
| 框架 | Vue 3（CDN Options API，无构建工具） |
| 样式 | 原生 CSS + CSS 自定义属性（暖纸 `#F4EFE6` + 朱砂红 `#D8442C` + 墨色 `#16140F`） |
| 字体 | Google Fonts：Noto Serif SC / Noto Sans SC / JetBrains Mono |
| 数据流 | JS 内嵌默认值 → localStorage 覆盖 → 后台修改即时生效 |
| Excel | SheetJS (xlsx) v0.20.0 CDN |
| PDF | html2canvas v1.4.1 + jsPDF v2.5.1，逐页渲染，`[292, 196]` mm 横版 |
| 后端 | 暂无（Step 14 待做：Express + SQLite） |

**视频方案**：B站 → 中间层弹窗；抖音 → 弹窗 + `target="_blank"`；直链 mp4 → 原生 `<video>`

**文件结构**：
```
├── index.html          ← 展示页
├── admin.html          ← 后台管理（含 PDF 导出、Excel 导入导出）
├── style.css           ← 展示页样式
├── card-shared.css     ← 卡片共享样式
├── products.json       ← 产品数据
├── images/             ← 产品封面图
├── music/              ← BGM mp3
├── videos/             ← 产品视频 mp4
├── design-system/      ← 设计系统文档 + CSS tokens
├── server.ps1          ← PowerShell 本地服务器（端口 3000）
├── server.js           ← Node.js 本地服务器（端口 3000）
└── backup-*/           ← 代码备份
```

---

## 三、进度

| 步骤 | 内容 | 状态 |
|------|------|------|
| 1-7 | 静态页面 + 样式 + 卡片 + 动画 + 弹窗 | ✅ |
| 8 | 视频播放 | ✅ |
| 9 | 产品系列分区 + 导航 | ✅ |
| 10 | 移动端适配 | ✅ |
| 11-12 | JSON 数据分离 + Vue.js 迁移 | ✅ |
| 13 | 后台管理系统（含排序/批量操作/PDF 导出） | ✅ |
| 13.5 | Excel 批量导入导出 + 应用场景字段 | ✅ |
| 14 | Express + SQLite 后端 | ⏳ |
| 15 | GitHub Pages 部署上线 | ⏳ |

---

## 四、数据结构

### 产品对象（完整字段）

```json
{
  "id": 1,
  "name": "蜀忆老火锅牛油",
  "subtitle": "PRODUCT · 01",
  "description": "产品描述...",
  "image": "images/product1.jpg",
  "bgm": "music/Plastic-Sunlight.mp3",
  "video": "https://www.douyin.com/video/...",
  "videoAspect": "9/16",
  "crafts": [
    {"icon": "🔥", "label": "手工熬制"}
  ],
  "specs": [
    {"label": "规格", "value": "20kg / 箱"}
  ],
  "scenarios": [
    {"icon": "🏪", "label": "火锅餐饮"}
  ],
  "sop": {
    "materials": ["主料1"],
    "auxiliaries": ["辅料1"],
    "steps": [
      {"type": "产品准备", "icon": "product", "title": "原料验收", "content": "..."}
    ]
  }
}
```

### 产品序号规则

- **存储**：`subtitle` 基于产品 `id`（如 `PRODUCT · 01`）
- **前端展示**：`getDisplaySubtitle()` 方法按分区内位置动态重算（`pi + 1`），不依赖存储值
- **PDF 导出**：导出队列中按 `productIndex` 重算，SOP 页与产品页同号

---

## 五、Excel 批量导入导出（2026-05-29）

### 技术方案

- SheetJS (xlsx) v0.20.0 CDN
- 固定列结构（29 列）：分区 | 名称 | 描述 | 工艺1-6(图标+名称) | 规格/保质期/储存 | 应用场景1-4(图标+名称) | SOP主料/辅料/步骤
- 第 1 行列标题（加粗），第 2 行填写说明（灰底），数据从第 3 行开始，冻结前两行
- SOP 步骤格式：`类型|icon|标题|内容`，每步一行 Alt+Enter 换行

### 导入模式

- **增量导入**（默认）：只新增+更新，不删除已有产品
- **按分区替换**：Excel 涉及的分区内，以 Excel 为准——不在 Excel 中的产品被删除；未涉及分区不变
- 预览弹窗：新增（绿）、更新（金）、删除（红删除线）、错误（红）四色标记

### 导入逻辑

- 按"分区名 + 产品名"匹配已有产品
- 分区名不存在 → 自动创建
- 更新模式保留原 `id`/`subtitle`/`image`/`bgm`/`video`/`videoAspect`

---

## 六、应用场景（2026-05-30）

### 数据模型

```json
"scenarios": [{"icon": "🏪", "label": "火锅餐饮"}, ...]
```

与 `crafts` 同结构（icon + label）

### 前端展示

- 产品详情弹窗：产品规格下方、SOP 上方
- 双栏网格（桌面）/ 单列（移动）
- 逐条渐入动画，延迟串联

### PDF 导出

- 产品页左列，工艺亮点下方
- 黑金样式：`#C8A96E` 标题 + 金线分隔 + `#E8E4DC` 文字

### 后台编辑

- 产品编辑弹窗内"应用场景"区块（规格和 SOP 之间）
- 支持增删 icon + label

---

## 七、关键迭代

### 视频方案
- B站 iframe → sandbox 无法同时支持播放和防跳转 → 中间层弹窗
- 抖音无公开嵌入 API → 中间层弹窗 + `target="_blank"`
- 唯一 100% 可控方案：自托管 mp4 + 原生 `<video>`

### 移动端优化
- 导航横向滚动 + 渐变遮罩提示
- 音频按钮移至右下角（拇指热区）
- 弹窗全屏 + `safe-area-inset-bottom`
- 触屏禁用 hover 放大、`aspect-ratio` 自适应

### 性能优化
- 图片 `loading="lazy"` + `@error` SVG 降级
- 音频 `preload="none"` 按需加载
- 离屏系列 `content-visibility: auto`
- 卡片 `will-change: transform` GPU 预合成

### PDF 导出（最终方案 2026-05-29）

**技术栈**：html2canvas v1.4.1 + jsPDF v2.5.1，逐页渲染，`[292, 196]` mm 横版

**页面队列**：封面 → 系列分隔页 → 产品页 → [SOP页] → ...

**关键坑：**

1. **`createPattern` 0×0 错误**：html2canvas v1.4.1 有已知 bug，CSS 渐变中 `transparent` 或 `rgba(…, 0)` 会被浏览器优化为 `transparent` 关键字，触发 `createPattern` 崩溃。修复：所有渐变改为纯色 + `box-shadow`。
   - 金线：`linear-gradient(...)` → `rgba(200,169,110,0.3)` 等固定色
   - 图片遮罩：渐变叠加层 → `rgba(12,11,8,0.55)` 均匀遮罩
   - SOP 背景：双层 `radial-gradient(...)` → 单个 `box-shadow`
   - **2026-05-29 产品页渐变**：`rgba(12,11,8,0.01)` → `rgba(12,11,8,0.78)` 过渡（0→32%→52%→78%），html2canvas 已验证通过

2. **`SecurityError: Tainted canvases`**：从 `file://` 协议打开页面时，浏览器把每个本地文件视为独立安全源，图片画到 canvas 后 canvas 被"污染"，`toDataURL()` 被阻止。**必须通过本地服务器访问**（`http://localhost:3000`），此时所有文件同源。

**本地服务器**：
- PowerShell：`powershell -File server.ps1`（端口 3000，纯 .NET，无需安装）
- Node.js：`node server.js`（端口 3000，需 Express）

**历史方案记录：**
- `createPattern` 0×0 错误 → `rgba()` 替代 `transparent`
- `rgba(…,0)` 仍被优化 → `rgba(…,0.005)` 仍不够 → 最终纯色方案
- 左右白边 → 自定义 `[292, 196]` mm 格式
- 封面/分隔页 inline 样式（html2canvas 不认 CSS class 的 radial-gradient）
- html2pdf.bundle → 独立 html2canvas + jsPDF（避免 worker 管线兼容问题）
- 产品页渐变：4 层纯色 step div（样式生硬）→ CSS `linear-gradient` with `rgba(…,0.01)`（已验证通过）

### SOP 操作流程

**数据结构**：产品可选 `sop` 字段，含 `materials[]`（主料）、`auxiliaries[]`（辅料）、`steps[]`（步骤，每步含 `type`/`icon`/`title`/`content`）。无 sop 字段的产品不受影响。旧数据自动迁移补全空数组。

**预设 Icon**：5 个黑金 SVG inline data URL（product/main/aux/process/check），支持上传自定义 SVG。

**前端（index.html）**：详情弹窗折叠区块，主料/辅料双栏卡片 + 竖线时间线步骤，移动端单列适配。

**PDF 导出（admin.html）**：
- 导出弹窗：有 SOP 的产品旁显示 `[导出 SOP (N步) ☐]`，默认不勾选
- 页面队列：`封面 → 分隔页 → 产品页 → [SOP页] → ...`
- SOP 页黑金排版：标题 → 主料+辅料双栏（带英文 Main/Auxiliary Ingredients）→ 步骤列表（带英文 STEPS）
- 封面/分隔页改用全 inline 样式（html2canvas 不认 CSS class 的 radial-gradient）；步骤内容换行保留（`\n`→`<br>` + `white-space:pre-wrap`）

**后台编辑（admin.html）**：
- 产品编辑弹窗内"SOP 操作流程"区块，支持主料/辅料增删、步骤增删/排序
- 步骤顺序即数组顺序，保存时连带 sop 字段一同持久化到 localStorage

### 序号重算（2026-05-29）

- **前端展示**：`getDisplaySubtitle()` 按分区内产品位置动态返回 `PRODUCT · 01, 02...`
- **PDF 导出**：`selectedProducts.forEach` 中 `productIndex++`，`Object.assign` 浅拷贝覆盖 subtitle，原始数据不变，SOP 页复用同一 `productCopy`

### 音乐按钮位置（2026-05-30）

- **桌面端**：`position: fixed; bottom: 24px; right: 24px`
- **移动端**：`bottom: 20px; right: 16px`（含 `safe-area-inset-bottom`）
- 从右上角移开，避免遮挡顶部导航栏和 Hero 区域

---

## 八、部署上线方案（2026-05-30 已测试确认，待实施）

### 资源压缩（实测确认）

| 类型 | 文件 | 方案 | 目标 |
|------|------|------|------|
| 大图 | product1/5/7（各 21.6MB JPEG，6777×4518） | WebP q85 + 5000px 宽 | ~964KB |
| 小图 | product2/3/4/6（各 200-300KB） | 不转换，保持原样 | 原样 |
| 封面图 | 封面3.png（4MB，1920×1080） | WebP 无损 | ~1,420KB |
| 视频 | 咸蛋海鲜粥.mp4（71MB，1分09秒） | ffmpeg 1080p H.264 CRF 23 | ~30-40MB |
| 音乐 | ~5MB mp3 | **不压缩** | 原样 |

- cwebp.exe 已下载在 `%TEMP%\libwebp\`
- ffmpeg 待下载（网络限制，后续加入 optimize.ps1）
- 原始文件备份到 `resources-original/`

### Logo 集成

- `images/logo.png`（7425×3914，218KB）
- **前端页面**：原始颜色
- **PDF 导出**：CSS filter 实时转黑金 — `sepia(100%) saturate(400%) hue-rotate(350deg) brightness(0.85)`（方案2 暗金）
- html2canvas 捕获 filter 效果，无需单独制作金色 logo

### 前端 PDF 一键导出（新增）

- index.html 右上角加"下载产品手册"按钮
- 访客可导出当前浏览产品系列
- 复用 html2canvas + jsPDF 管线

### PDF 性能优化

| 优化项 | 方案 |
|--------|------|
| scale 降级 | html2canvas scale 2x → 1x |
| 进度条 | 实时显示当前产品名 + 页数 |
| 取消按钮 | 中止后续渲染 |
| 图片预加载 | 渲染前预热所有图片到缓存 |
| 空闲避让 | setTimeout 每页间让出主线程 |

- 串行渲染 + 最后合成一个 PDF
- 50 个产品预计 1-2 分钟

### 部署架构

- admin.html 不上传公网（.gitignore 排除），本地双击 server.ps1
- GitHub Pages + 自定义域名 + HTTPS
- jsDelivr CDN 加速图片/视频
- `deploy.ps1`：双击一键 git push → 线上自动更新
- 微信浏览器兼容：禁止自动播放提示、PDF 预览替代下载

### 视频托管

- B站链接跳转（数据保护）→ 不可用
- 视频号需扫码 → 无法嵌入网页
- **最终方案**：自托管 mp4 + 原生 `<video>`

### 实施步骤（2026-05-30 已完成）

| # | 步骤 | 状态 | 说明 |
|---|------|------|------|
| 1 | 图片压缩 + `optimize.ps1` | ✅ | WebP: product1/5/7 (21MB→964KB)，封面3 (4MB→1.4MB)，备份到 resources-original/ |
| 2 | `.gitignore` | ✅ | 排除 admin.html/server.ps1/backup-*/resources-original/ |
| 3 | 前端 PDF 一键导出按钮 | ✅ | index.html 导航栏"下载产品手册"，复用 html2canvas+jsPDF，自动导出全系列 |
| 4 | Logo 集成 | ✅ | 前端 navbar 原色 logo.png，PDF 封面暗金 filter（`sepia+saturate+hue-rotate+brightness`） |
| 5 | PDF 性能优化 | ✅ | scale 2x→1x，实时进度标签，空闲避让 setTimeout(30ms)，取消中止渲染 |
| 6 | GitHub Pages 配置 | ✅ | 创建 README.md + deploy.ps1，含完整操作说明 |
| 7 | `deploy.ps1` | ✅ | 双击一键 git add→commit→push→Pages 自动更新 |
| 8 | 微信浏览器兼容 | ✅ | PDF 导出前检测 MicroMessenger，引导用户"在浏览器打开" |
| 9 | 推送上线 | ⏳ | 需用户安装 Git + 创建 GitHub 仓库后运行 `deploy.ps1` |

### 部署条件

- **安装 Git**：https://git-scm.com/downloads/win
- **创建 GitHub 仓库**（公开仓库，不勾选 README/.gitignore）
- **运行部署**：`powershell -File deploy.ps1` 或双击

---

## 九、下一步

- ~~**部署上线**：已完成代码准备和脚本，待用户安装 Git 并创建仓库后一键推送~~
- **推送上线**：用户安装 Git → 创建 GitHub 仓库 → 运行 `deploy.ps1`
- **Step 14**：Express + SQLite 后端（部署完成后再做）
- **视频压缩**：下载 ffmpeg 后运行 `optimize.ps1` 自动压缩视频
