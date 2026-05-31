# 项目总结

> 最后更新：2026-05-31（代码清理：删除死代码 + 抽取 versionUrl 共用函数）

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

---

## 十、PDF 导出体积优化（2026-05-31）

### 最终方案：单层 JPEG 直通

放弃双层 PNG 叠加方案，改用**单层 JPEG 高品质渲染**。

**原因**：jsPDF 无法直通 PNG 数据，需解压 RGBA → Flate 重压缩 + 生成 Alpha 软遮罩 → 膨胀 **10 倍**（诊断 10MB 数据 → 103MB PDF）

| 方案 | 每页数据 | PDF 实际大小 | 效果 |
|---|---|---|---|
| ~~双层（底层 JPEG + 上层 PNG 透明）~~ | ~550KB | **103MB**（膨胀 10x） | ❌ |
| **单层 JPEG q0.88 @ scale 2.5** | ~500KB | **~500KB**（JPEG 直通） | ✅ |

**最终参数**：
- 渲染：`html2canvas scale 2.5`（2750×1850 → 239 DPI 印刷级）
- 格式：`JPEG q0.88`（文字压缩痕迹肉眼不可见）
- 封面/分隔页：`scale 2 + JPEG q0.88`
- SOP 页：`scale 2 + PNG`（无图片，PNG 体积可控）

**各页实测**：
- 封面/分隔：~55-60KB/页
- 产品页（含图）：~450-630KB/页
- SOP 页：~200KB/页
- **合计 12 页 PDF：~7MB**

### 关键发现

1. **jsPDF `addImage(canvas, 'PNG', ...)`**：canvas 对象传参 vs data URL 字符串传参都会触发 PNG → Flate 重编码，膨胀 10x。**JPEG 是唯一直通格式**（DCTDecode pass-through）
2. **文字清晰度**：239 DPI + JPEG q0.88 下文字约 7MB 压缩痕迹，印刷不可见
3. **`renderProductPage()` 作用域注意**：内部 `.catch()` 不能引用 `renderNext()` 的 `i` 参数（不在作用域链上）

### 历史方案

| 日期 | 方案 | 结果 |
|------|------|------|
| 初版 | scale 3 PNG 单层 | PDF 过大 |
| 5/30 | 双层抠图叠加（底层 JPEG + 上层 PNG 透明） | 数据 10MB → PDF 103MB（jsPDF PNG 膨胀） |
| **5/31 终版** | **单层 scale 2.5 JPEG q0.88** | **~7MB PDF，文字印刷级清晰 ✅** |

### 更新入口

`http://localhost:3000/admin.html` → 导出 PDF

---

## 十一、产品图压缩（2026-05-31）

### 最终参数

| 图片 | 原大小 | 压缩后 | 方案 |
|------|--------|--------|------|
| product1.jpg | 21.2MB (6777×4518) | **989KB** (4000×2667) | ffmpeg `-q:v 5` |
| product5.jpg | 21.2MB (6777×4518) | **989KB** (4000×2667) | ffmpeg `-q:v 5` |
| product7.jpg | 21.2MB (6777×4518) | **989KB** (4000×2667) | ffmpeg `-q:v 5` |

- 其余 product2/3/4/6.jpg 原 200-300KB 未修改
- `resources-original/` 保留原始文件备份
- `images/*.webp` 已排除不提交（旧测试图）

### 压缩命令

```bash
ffmpeg -y -i "resources-original/product1.jpg" ^
  -vf "scale=4000:-1" -q:v 5 -update 1 -frames:v 1 ^
  "images/product1.jpg"
```

- `scale=4000:-1`：宽边 4000px，高按比例
- `-q:v 5`：JPEG 质量 5/31（值越小质量越高），约 1MB
- 画质：肉眼与原图无异

## 十一、PDF 封面 LOGO 黑金修复（2026-05-31）

### 问题
html2canvas v1.4.1 不支持 CSS `filter` 属性，`filter: sepia(100%) saturate(400%) hue-rotate(350deg) brightness(0.85)` 在预览可见但导出丢失。

### 解决方案
在 `doExport()` 开头用 Canvas API 预处理：
1. build 函数中 LOGO 加 `data-gold-logo="1"` 标记，去掉 CSS filter
2. `doExport()` 扫描标记图片 → Canvas `ctx.filter` 实时转为黑金色 data URL → 替换 img.src
3. html2canvas 直接捕获处理后的像素

### 涉及位置
admin.html：buildCoverHTML / buildDividerHTML / buildProductHTML / buildSopHTML / buildProductTextHTML + doExport 开头

### 后续修复（2026-05-31）

**Bug 1：`drawImage` 未缩放**
- `ctx.drawImage(img, 0, 0)` 以原始尺寸（7425×3914）绘制在仅 68×36 的 Canvas 上，只画出左上角一小块
- 修复：改为 `ctx.drawImage(img, 0, 0, dispW, 36)` 目标缩放

**Bug 2：onload 死循环**
- data URL 替换 `img.src` 后再次触发 `onload`，递归调用 `processLogo` 无限循环
- 修复：`processLogo` 内加 `img.onload = null`，onload 回调内加 `this.onload = null`

**Bug 3：封面页 LOGO 仍然红色**
- 处理完 data URL 后 html2canvas 立即捕获，浏览器可能未完成渲染
- 修复：在 `renderNext(0)` 前加 `requestAnimationFrame` 确保渲染完成

**清晰度提升**
- Canvas 预处理从 1x（42px）提升至 **2x（84px）**，html2canvas 有 4x 像素可采样
- CSS 保持 `height:42px`，浏览器平滑下采样，导出后 LOGO 文字轮廓更锐利

## 十二、代码清理（2026-05-31）

### 删除死代码
- **`buildProductTextHTML(p)`** — 双层 PNG 方案遗留，与 `buildProductHTML` 90% 相同，未调用 → 删除 ~43 行
- **`makeTextLayerTransparent(canvas, threshold)`** — 双层 PNG 抠图遗留，未调用 → 删除 ~13 行
- **`logoPending`** — `doExport()` 中声明的计数器变量，从未读取使用 → 删除

### 抽取共用函数
- **`versionUrl(filename, ver)`** — 全局函数，统一处理图片 URL 版本化逻辑（`data:/blob:/http` 原样返回，否则加 `?v=`）
- 替换 4 处重复代码：`imgUrl()`、`previewBgUrl()`、`confirmExportPdf`、`buildProductHTML`

### 保留不动的
- **`resolveSopIcon` Vue 方法** — 看似冗余（仅转发到全局函数），但 Vue 模板不能直接调用全局函数，必须保留
