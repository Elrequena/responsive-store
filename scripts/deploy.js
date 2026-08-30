const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'dist', 'browser');
const tmpDir = path.join(__dirname, '..', '.deploy-tmp');

if (!fs.existsSync(srcDir)) {
  console.error('Build output not found:', srcDir);
  process.exit(1);
}

// Clean temp dir
if (fs.existsSync(tmpDir)) {
  fs.rmSync(tmpDir, { recursive: true });
}

// Copy build to temp
fs.cpSync(srcDir, tmpDir, { recursive: true });

// Init git and push
const cmds = [
  `cd "${tmpDir}"`,
  'git init',
  'git checkout -b gh-pages',
  'git add -A',
  'git commit -m "Deploy"',
  'git remote add origin ' + execSync('git remote get-url origin', { encoding: 'utf8' }).trim(),
  'git push -f origin gh-pages',
];

try {
  execSync(cmds.join(' && '), { stdio: 'inherit', shell: true });
  console.log('Deployed to gh-pages!');
} catch (e) {
  console.error('Deploy failed:', e.message);
  process.exit(1);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
