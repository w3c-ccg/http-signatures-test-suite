'use strict';

const path = require('path');
const {exec} = require('child_process');

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
  return new Promise((resolve, reject) => {
    const child = exec(httpMessage + generate + args);
    const streams = Promise.all([
      streamToString(child.stdout),
      streamToString(child.stderr)
    ]);
    child.addListener('exit', async (code, signal) => {
      console.log('code', code);
      console.log('signal', signal);
      const [stdout, stderr] = await streams;
      if(code !== 0) {
        resolve(stdout);
      } else {
        const error = new Error(`Driver exited with error code ${code}.`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

module.exports = {
  generate
};
