'use strict';
const path = require('path');
const util = require('util');
const fs = require('fs');

const exec = util.promisify(require('child_process').exec);

async function generate(file, options) {
  options = options || {};
  const filePath = path.join(__dirname, 'input', file);
  let httpMessage = fs.readFileSync(filePath, 'utf8');
  const date = options.date || new Date().toGMTString();
  const latestDate = `date: ${date}`;
  httpMessage += latestDate;
  const headers = `--headers ${options.headers.join(',') || ''} `;
  const {stdout, stderr} = await exec(
    options.generator + ' ' + options.args + headers + '"' + httpMessage + '"');
  if(stderr) {
    throw new Error(stderr);
  }
  return stdout;
}

module.exports = {
  generate
};
