import { promises as fsPromises } from 'fs';
import { minify } from 'html-minifier';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
const options = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: false,
  collapseWhitespace: false,
  preserveLineBreaks: false,
  conservativeCollapse: false,
  noNewlinesBeforeTagClose: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
};

async function processDirectory(dirPath) {
  const files = await fsPromises.readdir(dirPath);
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const stats = await fsPromises.stat(filePath);

      if (stats.isDirectory()) {
        await processDirectory(filePath);
      } else if (path.extname(filePath) === '.html') {
        const html = await fsPromises.readFile(filePath, 'utf8');
        const minifiedHtml = minify(html, options);
        await fsPromises.writeFile(filePath, minifiedHtml, 'utf8');
      }
    })
  );
}

processDirectory(distPath).catch((err) => {
  console.error(err);
  process.exit(1);
});
