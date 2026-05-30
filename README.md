# 牧哥生物 — 火锅供应链产品展示网站

纯前端项目，展示页 + 后台管理，零构建工具。

## 快速开始

```bash
# 启动本地服务器（必须，否则 PDF 导出因 canvas 污染报错）
powershell -File server.ps1

# 访问
# 展示页: http://localhost:3000/index.html
# 后台管理: http://localhost:3000/admin.html
```

## 目录结构

```
├── index.html           展示页（含前端 PDF 导出）
├── admin.html           后台管理（.gitignore 排除，不上传公网）
├── style.css            展示页样式
├── card-shared.css      卡片共享样式
├── products.json        产品数据
├── images/              产品封面图
│   ├── logo.png         公司 Logo（7425×3914）
│   ├── product1.webp    压缩后 WebP（原 product1.jpg）
│   ├── product5.webp
│   ├── product7.webp
│   ├── 封面3.webp       封面压缩版
│   └── product2-4,6.jpg 小图（保持原样）
├── music/               BGM mp3
├── videos/              产品视频 mp4
├── optimize.ps1         资源压缩脚本
├── deploy.ps1           一键部署脚本
└── server.ps1           本地服务器
```

## 图片压缩

```bash
# 大图（21.6MB → ~0.9MB）自动转换为 WebP
powershell -File optimize.ps1
```

- product1/5/7.jpg → WebP q85 + 5000px 宽
- 封面3.png → WebP 无损
- 原始文件备份到 `resources-original/`
- 小图（product2/3/4/6.jpg）保持原样

## 部署到 GitHub Pages

### 前提
1. 安装 Git：https://git-scm.com/downloads/win
2. 创建 GitHub 账号和仓库

### 步骤

```bash
# 1. 创建 GitHub 仓库
# 在 GitHub 上创建一个新的公开仓库（不要勾选 README/.gitignore）

# 2. 运行部署脚本
powershell -File deploy.ps1

# 3. 首次需要指定远程仓库 URL
#    https://github.com/用户名/仓库名.git

# 4. 在 GitHub 仓库启用 Pages
#    Settings → Pages → Source: Deploy from branch main → / (root) → Save
```

### 线上地址

```
https://用户名.github.io/仓库名/
https://用户名.github.io/仓库名/index.html
```

### 自定义域名（可选）

1. 在域名 DNS 添加 CNAME 记录指向 `用户名.github.io`
2. 在 GitHub: Settings → Pages → Custom domain → 输入域名 → Save
3. 或创建 `CNAME` 文件（内容为域名，如 `www.example.com`）后推送

### jsDelivr CDN（可选）

部署后图片/视频可通过 jsDelivr CDN 加速：

```
https://cdn.jsdelivr.net/gh/用户名/仓库名@latest/images/product1.webp
```

### 更新线上内容

```bash
# 简单方式：双击 deploy.ps1
# 或手动：
git add -A
git commit -m "更新说明"
git push
```

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Vue 3（CDN Options API） |
| 样式 | 原生 CSS + 自定义属性 |
| 字体 | Google Fonts: Noto Serif SC / Noto Sans SC / JetBrains Mono |
| PDF | html2canvas v1.4.1 + jsPDF v2.5.1（[292, 196]mm 横版） |
| Excel | SheetJS (xlsx) v0.20.0 |
| 数据 | JSON 内嵌默认值 → localStorage 覆盖 |

## 开发指南

### PDF 导出优化

- **scale**: 1x（平衡速度与质量）
- **进度条**: 实时显示当前页数 + 产品名
- **取消按钮**: 随时中止渲染
- **图片预加载**: 渲染前预热到浏览器缓存
- **空闲避让**: setTimeout 每页间让出主线程
- **Logo**: CSS filter 实时转黑金（`sepia+saturate+hue-rotate+brightness`）

### 微信浏览器兼容

- 音乐自动播放被微信阻止 → 首次交互触发
- 外部视频链接 → 引导用户点击跳转
- PDF 下载 → 微信内置浏览器可能拦截，建议用右上角"在浏览器打开"
