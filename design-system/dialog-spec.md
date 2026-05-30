# 产品详情弹窗 + 视频弹窗 — 规则文档

## Part A：产品详情弹窗（Modal Dialog）

### A.1 触发条件

| 规则 | 实现 |
|------|------|
| 点击产品卡片 | `@click="openModal(p)"` |
| 单例 | `v-if="selectedProduct"`（Vue 响应式控制） |
| 打开时锁定 body | `document.body.style.overflow = 'hidden'` |
| 关闭时恢复 body | `document.body.style.overflow = ''` |

### A.2 DOM 结构

```
modal-overlay                    ← 遮罩层（rgba 75%）
└── .modal                       ← 弹窗主体（白底圆角卡片）
    ├── .modal-close             ← × 按钮（白色毛玻璃圆形）
    ├── .modal-image             ← 产品封面大图
    ├── .modal-scroll-indicator  ← 自定义油滴滚动指示器
    │   ├── .modal-oil-trail     ←   拖尾线（静态，高 4px）
    │   └── .modal-oil-drop      ←   油滴（随滚动移动，4×6px）
    └── .modal-body              ← 内容区
        ├── h2                   ←   产品名称
        ├── .modal-tag           ←   副标题（PRODUCT · 01）
        ├── .modal-desc          ←   产品描述正文
        ├── .modal-detail-grid   ←   2 列 grid
        │   ├── 左列
        │   │   ├── h4           ←     "工艺亮点"
        │   │   └── ul > li      ←     ● + emoji + 文字
        │   └── 右列
        │       ├── h4           ←     "产品规格"
        │       └── .spec-row    ←     label : value
        └── .modal-actions
            └── .btn-video       ←     ▶ 观看教学视频
```

### A.3 视觉规范

| 属性 | 桌面 | 平板（≤1024px） | 手机（≤640px） |
|------|------|-----------------|-----------------|
| 遮罩背景 | `rgba(12,11,8,0.75)` | 同 | 同 |
| 弹窗 max-width | 720px | 90vw | 100vw |
| 弹窗 max-height | 85vh | 80vh | 100vh |
| 弹窗圆角 | `var(--radius-xl)` 12px | 同 | 0（全屏） |
| 弹窗阴影 | `var(--shadow-xl)` | 同 | 同 |
| 封面图高度 | 360px | 260px | 220px |
| 封面图 fit | `object-fit: cover` | 同 | 同 |
| 内容区内边距 | `24px 32px` | 同 | 16px |
| 产品名字体 | `var(--font-serif)` | 同 | `--text-xl`(20px) |
| 产品名字号 | `var(--text-3xl)` 30px | 同 | — |
| 产品名字重 | `var(--font-bold)` 700 | 同 | 同 |
| 副标题字体 | `var(--font-mono)` | 同 | 同 |
| 副标题字号 | `var(--text-sm)` 14px | 同 | 同 |
| 副标题颜色 | `var(--color-ink-muted)` | 同 | 同 |
| 副标题 letter-spacing | 0.1em | 同 | 同 |
| 描述字号 | `var(--text-base)` 16px | 同 | 同 |
| 描述行高 | `var(--leading-relaxed)` 1.75 | 同 | 同 |
| 描述颜色 | `var(--color-ink-soft)` | 同 | 同 |
| grid 列数 | 2 列（1fr 1fr） | 1 列 | 1 列 |
| grid 间距 | `var(--space-6)` 24px | `var(--space-4)` 16px | `var(--space-4)` 16px |
| h4（工艺/规格标题） | `--font-mono`, `--text-xs`, uppercase | 同 | 同 |
| 关闭按钮尺寸 | 40×40px | 同 | 36×36px |
| 关闭按钮位置 | top:12px, right:16px | 同 | top:8px, right:8px |

### A.4 动画时间线

基类动画 `revealItem`：从下方 24px 淡入，`0.5s cubic-bezier(0.2, 0.7, 0.2, 1)`。

| 元素 | 动画 | 持续时间 | 延迟 | 缓动 |
|------|------|----------|------|------|
| modal-overlay | `fadeIn` | 0.3s | 0 | ease |
| modal 弹窗 | `pop` | 0.5s | 0 | `cubic-bezier(0.2, 1.4, 0.4, 1)` |
| modal-image | `fadeIn` | 0.5s | 0 | ease |
| h2 产品名 | `revealItem` | 0.5s | 0.10s | ease-out |
| .modal-tag | `revealItem` | 0.5s | 0.18s | ease-out |
| .modal-desc | `revealItem` | 0.5s | 0.26s | ease-out |
| h4 标题 | `revealItem` | 0.5s | 0.36s | ease-out |
| li 工艺项 | `revealItem` | 0.45s | 0.42s + i × 0.10s | ease-out |
| .spec-row | `revealItem` | 0.45s | 0.42s + (crafts.length + i) × 0.10s | ease-out |

关闭：无退出动画，直接 `v-if` 卸载 DOM。

### A.5 关闭方式

| 方式 | 实现 |
|------|------|
| 点击 × 按钮 | `@click="closeModal"` — 清空 `selectedProduct` + 恢复 body 滚动 |
| 点击遮罩背景 | `@click.self="closeModal"` — 仅在点击 overlay（非 modal）时触发 |
| Esc 键 | `keydown` 监听 — **优先关视频**，视频没开才关弹窗 |
| 打开其他产品 | 直接切换 `selectedProduct`（Vue 复用同一个弹窗） |

```javascript
// Esc 键优先级
if (e.key === 'Escape') {
  if (self.showVideo) self.closeVideo();
  else if (self.selectedProduct) self.closeModal();
}
```

### A.6 油滴滚动指示器

**原理**：隐藏原生滚动条，用自定义油滴替代，显示阅读进度。

| 属性 | 值 |
|------|------|
| 位置 | 弹窗右侧 `right: 8px`，纵向范围 `top: 0` 到底部 |
| 拖尾线 `.modal-oil-trail` | 宽度 4px，圆角 2px，背景 `var(--color-line)` |
| 油滴 `.modal-oil-drop` | 宽 4px × 高 6px，背景 `var(--color-accent)` 朱砂红，圆角 50% |
| 油滴初始位置 | `top: 20px`（顶部留白） |
| 油滴位置公式 | `top = 20 + (scrollTop / scrollableHeight) × (clientHeight - 40)` |
| 显示条件 | `v-show="showOilDrop"` — `scrollHeight > clientHeight` 时显示，否则隐藏 |
| 原生滚动条 | 隐藏：`scrollbar-width: none` + `::-webkit-scrollbar { display: none }` |
| 滚动高亮 | 滚动事件 → `modal.classList.add('scrolling')` → 200ms 后移除 |
| `.scrolling` 态 | 油滴 `opacity: 0.85` + `transform: scaleY(1.2)` |
| 移动端 | `display: none` — 恢复原生滚动条 |
| 节流 | `clearTimeout(scrollTimer)` → 每次滚动重置 200ms 定时器 |

### A.7 BGM 交互

| 事件 | 行为 |
|------|------|
| 打开弹窗 | 若 `product.bgm ≠ 当前 bgm.src` → 切换 `<audio>` src → 若 musicPlaying 则 `play()` |
| 关闭弹窗 | **不停止音乐**（仅清空 `selectedProduct`） |
| 打开视频 | **暂停音乐**（`bgm.pause()`） |
| 关闭视频 | **恢复音乐**（若 musicPlaying 则 `bgm.play()`） |

### A.8 数据字段映射

| 字段 | 类型 | 渲染位置 | 为空时 |
|------|------|----------|--------|
| `name` | string | modal-body > h2 | — |
| `subtitle` | string | .modal-tag | — |
| `description` | string | .modal-desc | 不显示该元素（`v-if`） |
| `image` | string | .modal-image src | 显示占位图 |
| `crafts` | `[{icon, label}]` | .modal-craft-list > li | 列表为空 |
| `specs` | `[{label, value}]` | .modal-spec-list > .spec-row | 列表为空 |
| `video` | string | .btn-video 的 click 参数 | 无视频时按钮不显示 |
| `bgm` | string | 切换 `<audio>` src | 不切换，保持当前音乐 |
| `videoAspect` | string | 设置 `.video-container` aspect-ratio | 默认 `'9/16'` |

---

## Part B：视频弹窗（Video Popup）

### B.1 触发条件

| 规则 | 实现 |
|------|------|
| 点击"观看教学视频"按钮 | `@click="openVideo(selectedProduct)"` |
| 无视频链接 | `alert('该产品暂未上传教学视频')` |
| 打开时锁定 body | `document.body.style.overflow = 'hidden'` |
| 暂停背景音乐 | `bgm.pause()` |

### B.2 平台识别与播放策略

```
openVideo(product)
  │
  ├─ detectPlatform(url) ──→ 识别平台
  │
  ├─ "bilibili" → iframe 嵌入 B站播放器
  │   URL: https://player.bilibili.com/player.html?isOutside=true&bvid=XXX&page=1&high_quality=1&danmaku=0&autoplay=1&as_wide=1
  │   sandbox: "allow-scripts allow-same-origin allow-presentation"（无 allow-popups，无 allow-top-navigation）
  │   防跳转：sandbox 阻止 window.open + window.top.location
  │
  ├─ "douyin" → 新标签页打开
  │   window.open(url, '_blank')
  │   （抖音无可靠的公开嵌入 API，新标签页打开最稳定）
  │
  ├─ "direct"（.mp4 / .webm / .m4v）→ 原生 <video> 标签
  │   videoSrc = url → <video controls> 原生播放 ✅
  │   不跳转，完整控制条
  │
  └─ "other"（视频号等）→ 新标签页打开
      window.open(url, '_blank')
```

### B.3 DOM 结构

```
.video-overlay                   ← 遮罩层（rgba 88%）
└── .video-container             ← 视频容器（aspect-ratio 动态设置）
    ├── .video-close             ←    × 按钮
    ├── .video-loading           ←    "加载中..."（v-if 加载态）
    ├── <video>                  ←    原生播放器（v-show 非加载且 videoSrc 有值）
    │     controls playsinline   ←    直链 mp4 或 direct 平台
    │     @error="onVideoError"  ←    播放失败 → 显示降级链接
    ├── <iframe>                 ←    B站嵌入播放器（v-if 非加载且 videoEmbed 有值）
    │     allow="autoplay; fullscreen" allowfullscreen
    │     :sandbox="iframeSandbox"
    └── .video-fallback          ←    降级链接（v-if videoError）
          "视频加载失败" + "在新页面观看" 按钮
```

### B.4 视觉规范

| 属性 | 桌面 | 手机（≤640px） | 手机横屏 |
|------|------|-----------------|-----------|
| 遮罩背景 | `rgba(12,11,8,0.88)` | 同 | 同 |
| 容器 max-width | 90vw | 95vw | 70vw |
| 容器 max-height | 85vh | 90vh | 75vh |
| 容器圆角 | 8px | 0 | 0 |
| 宽高比 | 动态 `aspectRatio`（9/16 或 16/9） | 同 | 同 |
| video/iframe | `width:100%; height:100%; object-fit:contain` | 同 | 同 |

### B.5 关闭方式

| 方式 | 实现 |
|------|------|
| 点击 × 按钮 | `@click="closeVideo"` |
| 点击遮罩背景 | `@click.self="closeVideo"` |
| Esc 键 | 优先于产品弹窗关闭 |

关闭时恢复背景音乐（若 musicPlaying）。

### B.6 Vue 数据属性

| 属性 | 初始值 | 用途 |
|------|--------|------|
| `showVideo` | false | 控制视频弹窗显示 |
| `videoSrc` | `''` | 原生 video 标签的直链（mp4/direct） |
| `videoEmbed` | `''` | iframe 嵌入的 src（B站） |
| `videoError` | false | 视频加载失败标志 |
| `videoErrorUrl` | `''` | 降级链接 URL |
| `videoLoading` | false | 加载态标志 |
| `videoFallback` | `''` | 保留字段 |
| `iframeSandbox` | `'allow-scripts allow-same-origin allow-presentation'` | iframe sandbox 属性 |
| `currentBvid` | `''` | 当前视频 BV 号 |
| `videoAspect` | `'9/16'` | 视频宽高比 |

### B.7 关键约束与教训

- **B站 API 返回 HEVC 编码** → Chrome 只能解码音频，画面黑屏。因此放弃 API 直链方案，改用 B站嵌入播放器
- **B站嵌入播放器 sandbox 悖论**：`allow-popups` 去掉 → 播放器初始化失败；`allow-popups` 保留 → 点击跳转拦不住。最终方案：去掉 `allow-popups`，依靠 `isOutside=true` 参数降低播放器对 popups 的依赖
- **抖音无可靠嵌入 API** → `open.douyin.com/player/video` 已失效，新标签页打开最稳定
- **唯一 100% 不跳转方案**：自托管 mp4 文件 + 原生 `<video>` 标签

---

## Part C：响应式总览

| 属性 | 桌面（>1024px） | 平板（≤1024px） | 手机（≤640px） |
|------|-----------------|-----------------|-----------------|
| 产品弹窗 max-width | 720px | 90vw | 100vw |
| 产品弹窗 max-height | 85vh | 80vh | 100vh |
| 弹窗圆角 | 12px | 12px | 0 |
| 封面图高度 | 360px | 260px | 220px |
| modal-detail-grid | 2 列 | 1 列 | 1 列 |
| 油滴指示器 | 显示 | 显示 | **隐藏** |
| 视频容器 max-width | 90vw | 90vw | 95vw |
| 视频容器 max-height | 85vh | 85vh | 90vh |
| 视频容器圆角 | 8px | 8px | 0 |
| 关闭按钮尺寸 | 40px（弹窗）/ 36px（视频） | 同 | 36px / 36px |
