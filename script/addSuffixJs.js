import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const getOutDir = () => {
  let parse = JSON.parse(String(readFileSync(resolve(process.cwd(), 'tsconfig.json'))));
  let oDir = parse.compilerOptions.outDir;
  return resolve(process.cwd(), oDir);
};
const reWriteFile = (path) => {
  let personList = readFileSync(path, { encoding: 'utf8' });

  const splits = personList.split('\n');
  const res = [];
  splits.forEach((row) => {
    if (row.startsWith('import') && row.includes('from') && !row.endsWith(".js'")) {
      row = row.substring(0, row.length - 2);
      row += ".js'";
    }
    res.push(row);
  });
  console.log(res);
  writeFileSync(path, res.join('\n'), { encoding: 'utf8' });
};
const buildFilePath = (res, basePath) => {
  const files = readdirSync(basePath, { encoding: 'utf-8' });
  files.forEach((fileName) => {
    let stats = lstatSync(resolve(basePath, fileName));
    if (stats.isFile()) {
      if (fileName.endsWith('.js')) {
        res.push({ path: resolve(basePath, fileName) });
      }
    } else {
      buildFilePath(res, resolve(basePath, fileName));
    }
  });
};
(() => {
  let outDir = getOutDir();
  const res = [];
  buildFilePath(res, outDir);
  res.forEach((item, index) => {
    console.log(`重写【${index + 1}】/${res.length}`);
    reWriteFile(item.path);
  });
})();
