import puppeteer from '../node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'charte-graphique.html');
const pdfPath  = path.join(__dirname, 'Charte-Graphique-BOURGEOIS-Hugo.pdf');

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--allow-file-access-from-files',
    '--disable-web-security',
  ],
  executablePath: undefined,
});

const page = await browser.newPage();

// Load the HTML file via file:// so local images resolve
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

// Extra wait for web fonts to render
await new Promise(r => setTimeout(r, 2000));

const pdf = await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});

await browser.close();

console.log('PDF genere :', pdfPath);
