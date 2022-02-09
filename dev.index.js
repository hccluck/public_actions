const path = require('path');
const fs = require('fs');
const util = require('util');

const resolve = (dir) => path.join(__dirname, dir);

const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);
const rm = util.promisify(fs.rm);

(async () => {
  const EnvReg = new RegExp(`^\.env\.${process.argv.slice(2)[0]}\.local$`);

  const root = './';

  const files = await readdir(resolve(root));

  for (let filename of files) {
    if (EnvReg.test(filename)) {
      await copyFile(resolve(`${root}/${filename}`), resolve(`${root}/.env`));

      require('dotenv').config();

      await rm(resolve(`${root}/.env`));

      require(resolve(`${root}/index.js`));

      break;
    }
  }
})();
