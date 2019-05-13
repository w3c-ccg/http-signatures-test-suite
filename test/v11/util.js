'use strict';
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

async function generate(file, options) {
  options = options || {};
  const filePath = path.join(__dirname, 'input', `${file}.httpMessage`);
  const date = options.date || new Date().toGMTString();
  const latestDate = `date: ${date}`;
  let args = '';
  for(const key in options.args) {
    let value = options.args[key];
    if(Array.isArray(value)) {
      value = `--${key} "${value.join(' ')}" `;
    } else {
      value = `--${key} ${value} `;
    }
    args += value;
  }
  // this cat filePath - the dash is the last pipe op
  const httpMessage = `echo ${latestDate} | cat ${filePath} - | `;
  const generate = `${options.generator} ${options.command} `;
  const {stdout, stderr} = await exec(httpMessage + generate + args);
  if(stderr) {
    throw new Error(stderr);
  }
  return stdout;
}

module.exports = {
  generate
};
