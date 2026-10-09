const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = __dirname;
const html = readFileSync(join(root, 'app.template.html'), 'utf8');
const css = readFileSync(join(root, 'app.css'), 'utf8');
const js = readFileSync(join(root, 'app.js'), 'utf8');
const logo = `data:image/png;base64,${readFileSync(join(root, 'Лого реготделения.png')).toString('base64')}`;

const result = html
  .replace('<link rel="icon" href="Лого реготделения.png" type="image/png">', `<link rel="icon" href="${logo}" type="image/png">`)
  .replace('<link rel="stylesheet" href="app.css">', `<style>\n${css}\n</style>`)
  .replace('  <script src="app.js" defer></script>', '')
  .replace('</body>', `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n</script>\n</body>`)
  .replaceAll('src="Лого реготделения.png"', `src="${logo}"`);

if (result.includes('href="app.css"') || result.includes('src="app.js"') || result.includes('src="Лого реготделения.png"')) {
  throw new Error('An external local asset was not embedded.');
}
writeFileSync(join(root, 'app.html'), result, 'utf8');
writeFileSync(join(root, 'vercel-site', 'index.html'), result, 'utf8');
console.log(`Built standalone app.html (${Buffer.byteLength(result)} bytes)`);
