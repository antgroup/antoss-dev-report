/**
 * 使用 fontmin 压缩字体文件（字符子集）
 * @description 使用方法：node scripts/fontmin.cjs
 */

import Fontmin from 'fontmin';

new Fontmin()
  .src('./public/fonts/*.ttf') // 源字体文件路径
  .dest('./public/fonts/min') // 输出路径
  .use(Fontmin.glyph({ text: '你的字符集' })) // 需要的字符集
  .run((err, files) => {
    if (err) {
      console.error(err);
    }
    console.log('Font minification complete!');
  });
