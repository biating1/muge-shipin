# 牧哥生物 — 火锅供应链展示网站

## 快速启动

```bash
cd "d:/trae project"
node server.js
```

- 前台展示：http://localhost:3000/index.html
- 后台管理：http://localhost:3000/admin.html
- 线上地址：https://biating1.github.io/muge-shipin/
- 技术栈：Vue 3 CDN + 原生 CSS，无构建工具，数据源 `products.json`

## 当前完成的功能

- 产品展示（7 分区，卡片 + 详情弹窗）
- 背景音乐（浮动按钮切换，每产品可独立设置）
- 教学视频（B站/抖音/本地 mp4 弹窗播放）
- 系列产品排序（admin 分区管理：筛选→升序/降序+上下微调）
- PDF 导出（黑金横版，封面盾牌 logo）
- 上架/下架（published 字段，前台只显示已上架）
- 图片上传（multer → images/ 目录）
- Excel 导入/导出
- SOP 折叠展示
- 视频自动压缩（ffmpeg）
- 公司简介 & Slogan 后台可编辑

## 数据流

`products.json`（唯一数据源）← admin 编辑 → localStorage 缓存 → index 加载（localStorage → API → 硬编码降级）

## 待做

1. ⬜ 产品数据补充 — 很多产品图片/工艺图标/场景字段为空
2. ⬜ 后台重新上传图片（牧哥干式鲜牛油等已清空路径的产品）
3. ⬜ 牛油系列产品价值点-格式化.xlsx 数据导入 `products.json`
4. ⬜ Gitee Pages 部署（解决国内访问慢）
5. ⬜ 烤鱼料/龙虾料/汤料 三个分区产品为空，需补充
6. ✅ 2026-06-02 修复 admin 登录 bug、分区 ID 校验、新增分区列表排序按钮
7. ⬜ **提交 products.json 并 push 到 GitHub**（修复线上 `____` 系列数据损坏）
8. ⬜ 推送后验证 GitHub Pages 前端恢复正常

## 注意事项

- `summary.md` 含密码已从 git 移除（本地保留，用于经验参考）
- admin 密码在 `admin.html` 的 login 校验中，不写在文档里
- 排序功能：产品管理 + 分区管理（分区内产品排序）都有 ▲/▼ 微调 + 一键升降
- 分区列表排序：2026-06-02 新增系列（分区）本身的 ▲/▼ 排序按钮
- 不要 SQLite，不要前端 PDF 导出按钮，不要擅自实现未确认的需求
