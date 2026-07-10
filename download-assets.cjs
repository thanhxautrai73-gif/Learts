const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://html-demo-orcin.vercel.app/premium/learts/';

const files = [
  'assets/css/vendor/bootstrap.min.css',
  'assets/css/vendor/fontawesome.min.css',
  'assets/css/vendor/themify-icons.css',
  'assets/css/vendor/customFonts.css',
  'assets/css/style.min.css',
  'assets/images/logo/logo.webp',
  'assets/images/logo/logo-2.webp'
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${url} -> ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  console.log('Downloading template assets...');
  for (const file of files) {
    const fileUrl = `${BASE_URL}${file}`;
    const destPath = path.join(__dirname, 'public', file);
    try {
      await downloadFile(fileUrl, destPath);
    } catch (err) {
      console.error(`Error downloading ${file}:`, err.message);
    }
  }
  console.log('Done downloading assets!');
}

start();
