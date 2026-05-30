# 牧哥生物 — 设计系统文档

## 一、设计定位

参考 CEO 演讲 PPT（"卷"主题）设计风格，传递专业、稳重、有文化底蕴的品牌形象。

**关键词**：暖纸底色 | 朱红点缀 | 墨色文字 | 克制留白

---

## 二、颜色系统

### 主色调

| 变量 | 色值 | 色块 | 用途 |
|------|------|------|------|
| `--color-bg` | `#F4EFE6` | ██ 暖纸色 | 页面主背景 |
| `--color-bg-alt` | `#EDE5D2` | ██ 深暖纸 | 交替区块背景 |
| `--color-ink` | `#16140F` | ██ 墨色 | 主要文字 |
| `--color-ink-soft` | `#3A352A` | ██ 软墨 | 次要文字 |
| `--color-ink-muted` | `rgba(22,20,15,0.55)` | ██ 淡墨 | 辅助/禁用文字 |

### 强调色

| 变量 | 色值 | 色块 | 用途 |
|------|------|------|------|
| `--color-accent` | `#D8442C` | ██ 朱砂红 | 按钮、标签、关键标记、油滴 |
| `--color-accent-light` | `rgba(216,68,44,0.12)` | ██ 浅朱砂 | 选中背景 |
| `--color-blue` | `#1A4D8F` | ██ 深蓝 | 链接、辅助强调 |
| `--color-highlight` | `#F0C419` | ██ 芥末黄 | 高亮/荧光笔效果 |

### 其他颜色

| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-green` | `#3F6B3D` | 成功/完成状态 |
| `--color-line` | `rgba(22,20,15,0.18)` | 分割线 |
| `--color-white` | `#FFFFFF` | 卡片/弹窗背景 |
| `--color-dark-bg` | `#0C0B08` | HTML 根背景（防白闪） |

### 配色使用规则

| 场景 | 颜色 |
|------|------|
| 页面底色 | 暖纸 `#F4EFE6` |
| 卡片/弹窗 | 白色 `#FFFFFF` |
| 标题文字 | 墨色 `#16140F` |
| 正文 | 软墨 `#3A352A` |
| 导航交互 | 朱砂红 `#D8442C`（hover 下划线 + 高亮态） |
| 关闭按钮 hover | 朱砂红底 + 白字 |
| 产品卡片悬浮 | 上浮 + 朱砂红顶部边框 |
| 视频加载提示 | `rgba(255,255,255,0.6)` 文字居中 |

---

## 三、字体系统

### 字体栈

| 角色 | 字体 | 用途 |
|------|------|------|
| 标题 | `"Noto Serif SC", "STSong", "SimSun", serif` | Hero、产品名、区块标题 |
| 正文 | `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif` | 描述、导航、规格 |
| 标签/编号 | `"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, monospace` | PRODUCT·01、SERIES·01、按钮文字 |

> 字体从 Google Fonts 加载（`fonts.googleapis.com`），国内访问建议后续替换为本地托管或国内 CDN。

### 字号层级

| 变量 | 值 | 用途 |
|------|------|------|
| `--text-xs` | 12px | 标签、工艺标题 h4 |
| `--text-sm` | 14px | 副标题、nav-link、spec-label、video-loading |
| `--text-base` | 16px | 正文描述 |
| `--text-2xl` | 24px | 卡片产品名 h3 |
| `--text-3xl` | 30px | 弹窗产品名、系列标题 |
| `--text-5xl` | 48px | Hero 大标题 |

### 字重

| 变量 | 值 | 使用 |
|------|------|------|
| `--font-bold` | 700 | 弹窗 h2、hero h1 |
| `--font-black` | 900 | hero `.accent` 极端强调 |

---

## 四、间距系统（4px 网格）

| 变量 | 值 | 典型用途 |
|------|------|------|
| `--space-2` | 8px | 图标-文字间距、craft-item gap |
| `--space-4` | 16px | 卡片内边距、modal-body 小屏内边距 |
| `--space-6` | 24px | modal-body 标准内边距、card-grid gap |
| `--space-8` | 32px | 空分区占位 padding |
| `--space-12` | 48px | 系列区域上下 padding |
| `--space-16` | 64px | hero 底部 padding |
| `--space-20` | 80px | hero 顶部 padding |

---

## 五、组件规范

### 5.1 导航栏 `.navbar`

- 位置：`sticky`，顶部吸附
- 高度：内容自适应（logo + nav-links）
- 背景：`rgba(244,239,230,0.85)` + `backdrop-filter: blur(12px)`
- 底部边框：`1px solid var(--color-line)`
- z-index：`--z-sticky`(200)
- 当前系列高亮：朱砂红文字 + 朱砂红下划线（`::after` 伪元素，居中 20px 宽）
- hover 态：朱砂红文字

### 5.2 Hero 区域 `.hero`

- 背景：`--color-bg` + `paper-texture.png`（纸纹叠加，`background-blend-mode: multiply`）
- 大标题：`--font-serif`，`--text-5xl`(48px)，`--font-black`(900)
- "生物" 用 `--color-accent` 朱砂红（`.accent` 类）
- 副标题：`--font-sans`，`--text-lg`，`--font-light`(300)，letter-spacing `0.18em`

### 5.3 产品卡片 `.card`

布局结构（从上到下）：
```
┌──────────────────────────┐
│ 产品图 (aspect-ratio: 4/3, object-fit: cover) │
├──────────────────────────┤
│ 产品名 h3                 │  ← card-intro 区
│ 副标题 (PRODUCT·01)       │
│ 描述文字                  │
├──────────────────────────┤
│ 🔥 工艺1    ⏱ 工艺2      │  ← card-craft 区
│ 🌶 工艺3    🏅 工艺4      │     CSS Grid 2 列
├──────────────────────────┤
│ 规格      20kg/箱        │  ← card-specs 区
│ 保质期    12 个月         │
│ 储存方式  阴凉干燥处保存   │
└──────────────────────────┘
```

| 属性 | 值 |
|------|------|
| 背景 | `--color-white` |
| 圆角 | `--radius-lg`(8px) |
| 阴影 | `--shadow-md` |
| 过渡 | `transform 0.3s ease, box-shadow 0.3s ease` |
| hover | `translateY(-6px)` + `--shadow-card-hover` + 顶部朱砂红边框 |
| 入场动画 | `cardReveal 0.6s`（从下方淡入），延迟 = 索引 × 0.10s |
| 网格 | `grid-template-columns: repeat(3, 1fr)`（桌面） |
| 平板 | `repeat(2, 1fr)` @ 1024px |
| 手机 | `repeat(1, 1fr)` @ 640px |

**card-craft 区**：
- 2 列 grid（`grid-template-columns: 1fr 1fr`）
- 每项 `.craft-item`：flex 排列，图标 + 标签
- 图标兼容 emoji 文字和 `<img>` 图片两种来源
- 标签字体：`--font-mono`，`--text-xs`，大写

**card-specs 区**：
- 顶部分割线 `1px solid --color-line`
- label：`--font-mono`，`--text-xs`，`--color-ink-muted`
- value：`--font-mono`，`--text-xs`，`--color-ink`

### 5.4 产品系列区 `.series-section`

- 交替背景：偶数组用 `--color-bg-alt`（深暖纸 `#EDE5D2`）
- 顶部 banner：大标题 + 描述居中
- `.chip` 标签：`--font-mono`，`--text-xs`，letter-spacing `0.15em`，朱砂红文字
- 标题：`--font-serif`，`--text-3xl`，"系列" 用朱砂红
- 空分区占位：居中 mono 字体灰色提示 "暂无产品，敬请期待"

### 5.5 产品详情弹窗 `.modal-overlay`

详见 [dialog-spec.md](dialog-spec.md)

| 属性 | 值 |
|------|------|
| 遮罩 | `rgba(12,11,8,0.75)` |
| 弹窗最大宽度 | 720px |
| 弹窗最大高度 | 85vh（移动端 90vh） |
| 圆角 | `--radius-xl`(12px，移动端 0) |
| 封面图高度 | 360px（移动端 240px） |
| 关闭按钮 | 白色毛玻璃圆形，hover 朱砂红 |
| 工艺列表 | 红色圆点(8px) + emoji + 标签，flex column |
| 规格列表 | label-value 行，flex column |
| 滚动指示器 | 自定义油滴（隐藏原生滚动条） |

**动画时间线**：
| 元素 | 延迟 |
|------|------|
| overlay fadeIn | 0 |
| modal pop | 0 |
| 封面图 | 0 |
| h2 产品名 | 0.10s |
| 副标题 | 0.18s |
| 描述 | 0.26s |
| 工艺/规格标题 | 0.36s |
| 工艺项 li | 0.42s + i×0.10s |
| 规格行 | 0.42s + (crafts.length+i)×0.10s |

### 5.6 视频弹窗 `.video-overlay`

| 属性 | 值 |
|------|------|
| 遮罩 | `rgba(12,11,8,0.88)` |
| z-index | `--z-modal + 1`（高于产品弹窗） |
| 容器最大尺寸 | 90vw × 85vh（移动端 95vw × 90vh） |
| 宽高比 | 动态设置（`videoAspect` 如 `9/16` 或 `16/9`） |
| 加载态 | `video-loading`：居中 mono 文字 "加载中..." |
| 关闭按钮 | 白色半透明圆形，hover 朱砂红 |

### 5.7 音乐按钮 `.audio-btn`

- 位置：`fixed`，右下角（bottom: 24px, right: 24px）
- 形状：圆形，50px×50px
- z-index：`--z-sticky`(200)
- 三种状态：
  - `idle`（未激活）：白底 + 黑边框，显示播放三角
  - `playing`（播放中）：朱砂红底 + 白三角 + 音波律动动画
  - `muted`（暂停中）：白底 + 朱砂红边框，显示暂停图标
- 移动端：缩小到 40px，位置调整

### 5.8 页脚 `.footer`

- 居中单行文字
- `--font-mono`，`--text-xs`，`--color-ink-muted`
- 上下 padding `--space-8`

---

## 六、CSS 动画定义

| 动画名 | 效果 | 使用场景 |
|------|------|------|
| `fadeIn` | opacity 0→1 | overlay 遮罩、modal-image |
| `pop` | scale(0.9,0.95)→1 + opacity 0→1 | 弹窗主体、视频容器 |
| `cardReveal` | translateY(24px)→0 + opacity 0→1 | 产品卡片入场 |
| `revealItem` | translateY(24px)→0 + opacity 0→1 | 弹窗内文本逐条入场 |

缓动函数：
- 弹窗：`cubic-bezier(0.2, 1.4, 0.4, 1)`（弹性）
- 入场：`cubic-bezier(0.2, 0.7, 0.2, 1)`（平滑）

---

## 七、响应式断点

| 断点 | 触发条件 | 变化 |
|------|------|------|
| 平板 | `max-width: 1024px` | 卡片 2 列，hero 文字缩小 |
| 手机 | `max-width: 640px` | 卡片 1 列，弹窗全屏无边角，nav 竖向排列，油滴隐藏，音乐按钮缩小 |

---

## 八、实现技术栈

| 层 | 技术 |
|------|------|
| 框架 | Vue 3（CDN 引入，Options API，无构建工具） |
| 样式 | 原生 CSS + CSS 自定义属性 |
| 字体 | Google Fonts（Noto Serif SC + Noto Sans SC + JetBrains Mono） |
| 视频 | B站 API（pagelist → playurl → 原生 `<video>` 标签播放 mp4） |
| 数据持久化 | localStorage（key: `muge_products`），前后台共享 |
| 后台 | 独立页面 `admin.html`，Vue 3，密码 `muge2024` |

---

## 九、设计决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 主色调 | 暖纸色 + 朱砂红 | 与 CEO 演讲 PPT 风格统一，食品行业温暖感 |
| 字体 | Noto Serif/Sans SC + JetBrains Mono（Google Fonts） | 衬线体传递品质感，等宽字体增加现代感 |
| 卡片 hover | 上浮 6px + 朱砂红顶部边框 | 明确交互反馈，品牌色贯穿 |
| 弹窗滚动指示器 | 自定义油滴（隐藏原生滚动条） | 独特品牌细节，PPT 中有类似设计语言 |
| 视频播放 | 原生 `<video>`（B站 API 获取 mp4 直链） | 有进度条、无跳转、体验好 |
| iframe 降级 | B站播放器嵌入（API 获取失败时） | 保证视频始终可播放 |
| 数据分离 | JS 内嵌默认值 + localStorage 覆盖 | 免后端也能用，后台改数据前台即时生效 |
| Vue CDN | 无构建工具，直接引入 | 降低复杂度，用户无需 Node.js |
