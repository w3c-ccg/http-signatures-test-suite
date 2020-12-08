'use strict';

const path = require('path');
const {exec} = require('child_process');

async function generate(file, options) {
  options = options || {};
  const filePath = path.join(__dirname, 'input', `${file}.httpMessage`);
  const date = options.date || new Date().toGMTString();
  const latestDate = `Date: ${date}`;
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
  const inputStr = `${latestDate}\n\n{"hello": "world"}`;
  const httpMessage =
    `cat ${filePath} - | `;
  const binaryOps = `${options.generator} ${options.command} `;
  const command = httpMessage + binaryOps + args;
  const result = await runTest(command, inputStr);
  return result;
}

function runTest(command, inputStr) {
  return new Promise((resolve, reject) => {
    const child = exec(command);
    child.stdin.end(inputStr);
    const streams = Promise.all([
      streamToString(child.stdout),
      streamToString(child.stderr)
    ]);
    child.addListener('exit', async code => {
      const [stdout, stderr] = await streams;
      if(code === 0) {
        resolve(stdout);
      } else {
        const error = new Error(
          `Driver exited with error code ${code}. \n ${stderr}`);
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
    stream.on('end', () => resolve(chunks.join('')));
  });
}

/**
 * Takes in a javascript ms timestamp and converts it to an unix
 *  timestamp in seconds.
 *
 * @param {object} options - Options to use.
 * @param {number} [options.time=Date.now()] - Number of Ms since epoch.
 *
 * @returns {number} Number of seconds since epoch.
*/
function getUnixTime({time = Date.now()} = {}) {
  // in the case of NaN return 0
  return Math.floor(time / 1000) | 0;
}

module.exports = {
  generate,
  getUnixTime
};
