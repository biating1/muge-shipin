# PPT 设计精华参考 — "卷"主题演讲

> 来源：`D:\参考素材\乱码演讲ppt\演讲.html`
> 这是一个 32 页的演讲幻灯片，设计风格为 **暖纸质感 + 朱红点缀 + 深蓝辅色 + 芥末黄高亮**。
> 以下提取所有可复用的设计模式和 CSS 代码片段。

---

## 一、颜色系统

```
暖纸底色    #F4EFE6    页面/幻灯片主背景
更深纸色    #EDE5D2    交替背景
墨色        #16140F    主文字色（非纯黑，偏暖）
软墨色      #3A352A    次要文字
淡墨色      rgba(22,20,15,0.55)  占位/极次要文字
朱红色      #D8442C    主强调色 — 关键文字、标签、下划线
深蓝色      #1A4D8F    辅强调色 — 链接、次要标记
芥末黄      #F0C419    高亮荧光笔色
墨绿色      #3F6B3D    成功/完成标记
分割线      rgba(22,20,15,0.18)
白色卡片    #ffffff
深色底      #0c0b08    幻灯片外围背景
深色底2     #0F0E0A    深色幻灯片背景
```

### 使用模式

| 场景 | 配色 |
|------|------|
| 普通页面 | 暖纸底 + 墨色文字 + 朱红强调 |
| 深色页面 | `.dark`：`#0F0E0A` 底 + `#F4EFE6` 文字 + 芥末黄强调 |
| 红色页面 | `.red`：朱红满底 + `#FFF7E8` 文字 |
| 蓝色页面 | `.blue-bg`：深蓝满底 + `#F4EFE6` 文字 |

---

## 二、字体系统

### 字体族

| 角色 | 字体 | 用途 |
|------|------|------|
| 衬线体 | **Noto Serif SC** | 标题、大字、引言 |
| 无衬线体 | **Noto Sans SC** | 正文、说明文字 |
| 等宽体 | **JetBrains Mono** | 标签、页码、代码、编号 |

> Google Fonts 引入：
> ```html
> <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700;900&family=Noto+Sans+SC:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
> ```

### 字号层级（PPT 为 1920×1080 幻灯片设计，网页使用需等比缩小）

| 类名 | 字体 | 字重 | 字号 | 行高 | 用途 |
|------|------|------|------|------|------|
| `.h-mega` | Serif | 900 | 280px | 0.85 | 封面大字 |
| `.h-xl` | Serif | 900 | 140px | 0.95 | 章节标题 |
| `.h-l` | Serif | 700 | 88px | 1.05 | 页面标题 |
| `.h-m` | Sans | 700 | 54px | 1.2 | 卡片标题 |
| `.h-s` | Sans | 700 | 38px | 1.3 | 小组件标题 |
| `.body-l` | Sans | 400 | 42px | 1.5 | 大字正文 |
| `.body` | Sans | 400 | 34px | 1.55 | 标准正文 |

### 辅助类

```css
.serif  { font-family: "Noto Serif SC", serif; }
.mono   { font-family: "JetBrains Mono", monospace; }
.accent { color: #D8442C; }
.blue   { color: #1A4D8F; }
.yellow { background: #F0C419; }
```

---

## 三、核心组件

### 3.1 Chip 标签

```css
.chip {
  display: inline-block;
  padding: 6px 18px;
  border: 2px solid var(--ink);
  border-radius: 999px;          /* 胶囊形 */
  font-family: "JetBrains Mono", monospace;
  font-size: 18px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

变体：红底白字（`background: var(--accent); color: #fff; border-color: var(--accent)`）

### 3.2 Card 卡片

```css
.card {
  background: #fff;
  border: 1px solid rgba(22,20,15,0.18);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08),
              0 2px 6px rgba(0,0,0,0.06);
}
```

特点：白底 + 极淡边框 + 柔和双层阴影。卡片内边距通常为 36-40px。

### 3.3 Polaroid 拍立得

```css
.polaroid {
  background: #fff;
  padding: 18px 18px 60px;     /* 底部大留白模拟照片纸 */
  box-shadow: 0 18px 50px rgba(0,0,0,0.18),
              0 4px 10px rgba(0,0,0,0.08);
}
.polaroid img { display: block; width: 100%; object-fit: cover; }
.polaroid .cap {                /* 照片下方说明 */
  font-family: "JetBrains Mono", monospace;
  font-size: 18px;
  text-align: center;
  padding-top: 12px;
}
```

常用于展示 meme 图片、截图，配合 `.tilt-l` / `.tilt-r`（±3° 旋转）制造手工感。

### 3.4 高亮荧光笔

```css
.hl {
  position: relative;
}
.hl::before {
  content: "";
  position: absolute;
  left: -6px; right: -6px;
  top: 55%; bottom: 6%;
  background: #F0C419;          /* 芥末黄 */
  z-index: -1;
  transform: skew(-3deg);       /* 微斜，手写感 */
}
```

### 3.5 动画下划线

```css
.underline-acc {
  position: relative;
  display: inline-block;
}
.underline-acc::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -6px;
  height: 14px;
  background: #F0C419;
  z-index: -1;
  transform-origin: left;
  transform: scaleX(0);
  animation: underline 0.9s 0.4s cubic-bezier(0.2,0.7,0.2,1) forwards;
}
```

### 3.6 跑马灯

```css
.marquee {
  display: flex; gap: 60px;
  font-family: "Noto Serif SC", serif;
  font-weight: 900; font-size: 160px;
  color: rgba(22,20,15,0.06);  /* 极淡，做背景纹理 */
  white-space: nowrap;
  animation: march 28s linear infinite;
  pointer-events: none;
}
@keyframes march {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### 3.7 引号装饰

```css
.quote-mark {
  font-family: "Noto Serif SC", serif;
  font-size: 340px;
  line-height: 0.6;
  color: #D8442C;
  opacity: 0.9;
}
```

### 3.8 进度条

```css
.bar {
  height: 36px;
  background: #1A4D8F;
  border-radius: 4px;
  transform-origin: left;
  animation: barGrowKey 0.9s cubic-bezier(0.2,0.7,0.2,1) both;
}
@keyframes barGrowKey {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

---

## 四、动画系统

### 4.1 入场动画

| 类名 | 效果 | 时长 | 缓动 |
|------|------|------|------|
| `.anim-rise` | 从下方 40px 淡入上升 | 0.8s | cubic-bezier(.2,.7,.2,1) |
| `.anim-slide` | 从左方 40px 淡入滑入 | 0.7s | cubic-bezier(.2,.7,.2,1) |
| `.anim-fade` | 纯淡入 | 0.9s | ease |
| `.anim-pop` | 缩放弹出（0.6→1.06→1）+ 微旋转 | 0.7s | cubic-bezier(.2,1.4,.4,1) |

### 4.2 循环动画

| 类名 | 效果 | 时长 |
|------|------|------|
| `.anim-blink` | 闪烁（0.2 透明度） | 1.1s 循环 |
| `.anim-drift` | 上下漂浮 ±10px | 4.5s 循环 |
| `.anim-wobble` | 左右摇摆 ±2° | 2.4s 循环 |

### 4.3 延迟工具类

```css
.d1  { animation-delay: 0.15s; }
.d2  { animation-delay: 0.30s; }
.d3  { animation-delay: 0.45s; }
.d4  { animation-delay: 0.60s; }
.d5  { animation-delay: 0.75s; }
.d6  { animation-delay: 0.90s; }
.d7  { animation-delay: 1.05s; }
.d8  { animation-delay: 1.20s; }
.d9  { animation-delay: 1.35s; }
.d10 { animation-delay: 1.50s; }
```

### 4.4 使用模式

每个需要动画的元素组合一个动画类和延迟类：
```html
<h2 class="anim-rise d1">标题先出现</h2>
<p  class="anim-rise d2">正文 0.3s 后出现</p>
<div class="anim-pop  d4">卡片 0.6s 后弹出</div>
```

---

## 五、纹理与氛围效果

### 5.1 纸质颗粒纹理

```css
.grain::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1.5px),
    radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1.5px);
  background-size: 5px 5px, 11px 11px;
  background-position: 0 0, 2px 3px;
  mix-blend-mode: multiply; opacity: 0.5;
}
```

### 5.2 扫描线

```css
.scanlines {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0, transparent 3px,
    rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
  );
  z-index: 2; mix-blend-mode: multiply;
}
```

深色变体：白色扫描线 + `mix-blend-mode: screen`

### 5.3 浮动粒子

使用大量绝对定位的 `<span>` 元素 + CSS 动画实现：
- **灰尘粒子** (.dust)：缓慢上升 + 水平漂移
- **二进制雨** (.bin-rain)：竖排文字下落
- **气泡** (.bubbles)：半透明圆圈上升
- **符号漂移** (.symbols)：数学符号横向漂移
- **火花** (.embers)：从底部冒出，带发光
- **流星** (.stars)：对角线快速划过

---

## 六、布局模式

### 6.1 幻灯片结构

每页幻灯片结构：
```html
<section class="grain" data-label="页面名">
  <!-- 顶栏：圆点 + 章节名 | 英文标签 -->
  <div class="topbar">
    <div><span class="dot"></span>PART · 01</div>
    <div>WHAT AI GETS WRONG</div>
  </div>

  <!-- 主内容区，绝对定位 -->
  <div style="position:absolute; left:120px; top:160px; right:120px">
    ...
  </div>

  <!-- 页码 -->
  <div class="pageno"><b>01</b> / 32</div>
</section>
```

### 6.2 常见内容布局

| 布局 | 用法 | CSS |
|------|------|-----|
| 左文右图 | 文字 left:120px right:880px，图片 right:120px | absolute 定位 |
| 居中大字 | left:120px right:120px text-align:center | 封面/章节页 |
| 多列卡片 | grid-template-columns: repeat(3, 1fr) | 三列卡片 |
| 四列卡片 | grid-template-columns: repeat(4, 1fr) | 四列卡片 |
| 底栏卡片 | bottom:120px + grid | 页面下方卡片组 |

### 6.3 装饰元素

```css
.stamp {       /* 邮戳/角标 */
  position: absolute;
  font-family: "JetBrains Mono", monospace;
  font-size: 18px; letter-spacing: 0.2em;
  color: #3A352A; text-transform: uppercase;
}
.pageno {      /* 页码 */
  position: absolute; bottom: 38px; right: 60px;
  font-family: "JetBrains Mono", monospace;
  font-size: 18px;
}
.pageno b { color: #D8442C; }  /* 当前页用红色 */
```

### 6.4 旋转倾斜

```css
.tilt-l   { transform: rotate(-3deg); }
.tilt-r   { transform: rotate(3deg); }
.tilt-l2  { transform: rotate(-1.5deg); }
.tilt-r2  { transform: rotate(1.5deg); }
```

配合 polaroid 使用，制造手工拼贴感。

---

## 七、深色/红色/蓝色页面变体

### 深色页 `.dark`

```css
.dark { background: #0F0E0A; color: #F4EFE6; }
.dark .body, .dark .body-l { color: rgba(244,239,230,0.8); }
.dark .pageno, .dark .topbar { color: rgba(244,239,230,0.6); }
```

### 红色页 `.red`

```css
.red { background: #D8442C; color: #FFF7E8; }
.red .body, .red .body-l { color: rgba(255,247,232,0.92); }
```

### 蓝色页 `.blue-bg`

```css
.blue-bg { background: #1A4D8F; color: #F4EFE6; }
.blue-bg .body { color: rgba(244,239,230,0.85); }
```

---

## 八、循环图组件（复杂组件参考）

用于展示工作流循环，由以下部分组成：
- **环形轨道**：虚线圆环，正/反向旋转动画
- **中心枢纽**：圆形，深色底 + 脉冲光环
- **4 个节点**：分布在上/右/下/左，圆形白色卡片
- **弧形箭头**：SVG path + 芥末黄虚线动画

关键动画：
- `orbit`：正向 60s 旋转
- `orbit-rev`：反向 90s 旋转
- `pulse-ring`：光环脉冲扩散
- `flow-dash`：虚线流动

---

## 九、设计原则总结

1. **色彩克制**：一页最多 3 种颜色（暖纸 + 朱红 + 芥末黄），深蓝仅作辅色
2. **字体分工明确**：Serif 标题 → Sans 正文 → Mono 标签，三种字体各司其职
3. **质感优先**：纸质颗粒、扫描线、柔和阴影，比纯扁平设计更有温度
4. **动画克制但有层次**：入场动画 + 延迟类，逐层出现，不混乱
5. **手工感**：拍立得倾斜、胶带效果、荧光笔高亮，打破数字化的冰冷感
6. **深色外围**：幻灯片外围 `#0c0b08`，让内容区暖纸色更突出（像灯箱效果）

---

## 十、如何应用到我们的产品展示页

| PPT 元素 | 我们的对应用法 |
|----------|---------------|
| 暖纸背景 `#F4EFE6` | 页面主背景 |
| 朱红 `#D8442C` | 按钮、链接、卖点标签 |
| 深蓝 `#1A4D8F` | 次要标记、系列导航 |
| 芥末黄 `#F0C419` | 关键卖点高亮文字 |
| Noto Serif SC | 产品名称、系列标题 |
| Noto Sans SC | 产品描述、卖点文字 |
| JetBrains Mono | 产品编号、价格标签、技术参数 |
| `.card` | 产品卡片 |
| `.polaroid` | 产品大图展示 |
| `.chip` | 系列标签、新品标签 |
| `.hl` | 核心卖点荧光笔效果 |
| `.anim-rise` + `.d*` | 产品卡片逐层入场 |
| `.grain` 纹理 | Hero 区域背景装饰 |
| `.dark` | 页脚或特色区域 |
