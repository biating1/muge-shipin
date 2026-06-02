/**
 * 生成包装效果图（占位风格）
 * 使用 sharp + SVG 为每个产品创建包装图
 * 每组：400×190px（2× 显示尺寸，供 Retina）
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const products = require('./products.json');

const OUT_DIR = path.join(__dirname, 'images');

// ===== SVG 模板 =====
function svgTemplate(name, subtitle) {
  // 装饰花纹 — 顶部/底部的金线
  return `<svg width="400" height="190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 背景渐变 -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2520" />
      <stop offset="50%" stop-color="#1E1A16" />
      <stop offset="100%" stop-color="#141210" />
    </linearGradient>
    <!-- 金色渐变 -->
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E9C499" />
      <stop offset="50%" stop-color="#D4A86A" />
      <stop offset="100%" stop-color="#C49A5C" />
    </linearGradient>
    <!-- 阴影 -->
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="400" height="190" rx="10" ry="10" fill="url(#bg)" />

  <!-- 外框 -->
  <rect x="6" y="6" width="388" height="178" rx="8" ry="8"
        fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.6" />

  <!-- 内框 -->
  <rect x="14" y="14" width="372" height="162" rx="6" ry="6"
        fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.25" />

  <!-- 顶部装饰线 -->
  <line x1="60" y1="32" x2="340" y2="32" stroke="url(#gold)" stroke-width="0.5" opacity="0.2" />

  <!-- 菱形装饰（左侧） -->
  <polygon points="32,78 44,66 56,78 44,90"
           fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3" />

  <!-- 菱形装饰（右侧） -->
  <polygon points="344,78 356,66 368,78 356,90"
           fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3" />

  <!-- 产品名 -->
  <text x="200" y="92" text-anchor="middle" dominant-baseline="central"
        font-family="'Noto Serif SC','SimSun','serif'" font-size="28" font-weight="900"
        fill="url(#gold)" filter="url(#shadow)">${escapeXml(name)}</text>

  <!-- 副标题 -->
  ${subtitle ? `<text x="200" y="130" text-anchor="middle"
        font-family="'JetBrains Mono','monospace'" font-size="10" font-weight="400"
        fill="url(#gold)" opacity="0.35" letter-spacing="0.3em">${escapeXml(subtitle)}</text>` : ''}

  <!-- 底部装饰线 -->
  <line x1="60" y1="158" x2="340" y2="158" stroke="url(#gold)" stroke-width="0.5" opacity="0.2" />

  <!-- 牧哥 logo 文字 -->
  <text x="200" y="163" text-anchor="end"
        font-family="'JetBrains Mono','monospace'" font-size="7" font-weight="300"
        fill="url(#gold)" opacity="0.15" letter-spacing="0.2em">MUGE</text>
</svg>`;
}

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sanitizeFilename(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
}

async function generate() {
  let total = 0;
  let skipped = 0;

  for (const series of products.series) {
    for (const product of series.products) {
      if (product.packaging && product.packaging.startsWith('images/') && fs.existsSync(path.join(__dirname, product.packaging))) {
        console.log(`  ⏭ 跳过 id=${product.id || '?'} ${product.name}（已有包装图）`);
        skipped++;
        continue;
      }

      const name = product.name || '产品';
      const subtitle = product.subtitle || '';
      const safeName = sanitizeFilename(name);
      const filename = `包装-${safeName}.png`;
      const outPath = path.join(OUT_DIR, filename);

      const svg = svgTemplate(name, subtitle);

      try {
        await sharp(Buffer.from(svg))
          .png()
          .toFile(outPath);

        const pkgPath = `images/${filename}`;
        product.packaging = pkgPath;
        console.log(`  ✅ id=${product.id || '?'} ${product.name} → ${pkgPath}`);
        total++;
      } catch (err) {
        console.error(`  ❌ id=${product.id || '?'} ${product.name} 生成失败: ${err.message}`);
      }
    }
  }

  console.log(`\n完成：成功 ${total} 个，跳过 ${skipped} 个`);
  products._packagingGenerated = true;

  // 写回 products.json
  fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2), 'utf-8');
  console.log('已更新 products.json');
}

generate().catch(err => { console.error(err); process.exit(1); });
