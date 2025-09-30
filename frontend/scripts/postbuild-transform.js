const path = require('path');
const fs = require('fs');
const { transformSync } = require('@babel/core');
const glob = require('glob');

const buildDirs = [
  path.join(__dirname, '..', '.next', 'server'),
  path.join(__dirname, '..', '.next', 'static')
];

const plugins = [
  require.resolve('@babel/plugin-transform-optional-chaining'),
  require.resolve('@babel/plugin-transform-nullish-coalescing-operator'),
  require.resolve('@babel/plugin-transform-logical-assignment-operators')
];

function transformFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = transformSync(code, {
    filename: filePath,
    plugins,
    configFile: false,
    babelrc: false,
    compact: false
  });

  if (result && result.code) {
    fs.writeFileSync(filePath, result.code, 'utf8');
  }
}

for (const dir of buildDirs) {
  if (!fs.existsSync(dir)) {
    continue;
  }

  const pattern = path.join(dir, '**', '*.{js,mjs}');
  const files = glob.sync(pattern, {
    nodir: true,
    ignore: ['**/*.map']
  });

  files.forEach((file) => {
    try {
      transformFile(file);
    } catch (err) {
      console.warn(`Failed to transform ${file}:`, err.message);
    }
  });
}
