'use strict';
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

async function generate(file, options) {
  options = options || {};
  const filePath = path.join(__dirname, 'input', file);
  const date = options.date || new Date().toGMTString();
  const latestDate = `date: ${date}`;
  const headers = `--headers ${options.headers.join(',') || ''} `;
  // this cat filePath - the dash is the last pipe op
  const httpMessage = `echo ${latestDate} | cat ${filePath} -`;
  const {stdout, stderr} = await exec(httpMessage + ' | ' +
    options.generator + ' ' + options.args + headers);
  if(stderr) {
    throw new Error(stderr);
  }
  return stdout;
}

module.exports = {
  generate
};
