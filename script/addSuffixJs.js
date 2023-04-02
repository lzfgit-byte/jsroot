import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const getOutDir = () => {
  let parse = JSON.parse(String(readFileSync(resolve(process.cwd(), 'tsconfig.json'))));
  let oDir = parse.compilerOptions.outDir;
  return resolve(process.cwd(), oDir);
};
const reWriteFile = (path) => {
  let personList = readFileSync(path, { encoding: 'utf8' });

  let regexpNames = /(?:export|import)(?:\s)*?(?:\{)??.*?(?:\})??(?:\s)*?from(?:\s)*?"(.+?)"/gm;

  let match = personList.matchAll(regexpNames);

  let count = 0;
  for (let item of match) {
    if (/.js$/.test(item[1])) {
      continue;
    }
    let temp = item[0];
    let index = item.index + count;
    let now = temp.replace(item[1], `${item[1]}.js`);
    let past = personList.slice(0, index);
    let feature = personList.slice(index + temp.length, personList.length);
    personList = `${past}${now}${feature}`;
    count = count + 3;
  }

  writeFileSync(path, personList, { encoding: 'utf8' });
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
