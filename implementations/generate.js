/**
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
*/
'use strict';

/**
 * Generates the HTTP Signatures Implementation Report given
 * a set of *-report.json files.
 */
const fs = require('fs');
const path = require('path');
const testConfig = require('./test.json');
const template = require('./handlebars');

// extract the results from all of the test files
const dirContents = fs.readdirSync(__dirname);
const files = dirContents.filter(
  contents => contents.match(/.*-report.json/ig));

if(!files.length) {
  throw new Error(
    'Failed to find any reports in the form of your_program-report.json ' +
    `in the dir ${__dirname}`);
}

//masterName is the name of the main report
//used to get the title of all tests for the spec
function makeMaster(masterName) {
  const context = {
    implementations: [],
    tests: {}
  };
  const masterFile = `${masterName}-report.json`;
  const masterPath = files.find(f => f === masterFile);
  if(!masterPath) {
    throw new Error(`Unable to find json report at ${masterPath}
      for ${masterName}. This file is used to generate
      the report and is set in test.json`);
  }
  const masterJson = require(path.join(__dirname, masterFile));
  const testNames = Object.keys(masterJson);
  testNames.forEach(name => {
    context.tests[name] = {};
    masterJson[name].forEach(t => {
      if(!t.pending) {
        context.tests[name][t.fullTitle] = [];
      }
    });
  });
  return context;
}

function makeContext(masterName) {
  const context = makeMaster(masterName);
  const testNames = Object.keys(context.tests);
  // process each test file
  files.forEach(file => {
    const implementation = file.match(/(?<title>.*)-report.json/).groups.title;
    context.implementations.push(implementation);
    const results = require(path.join(__dirname, file));
    // valid tests are tests that are
    // not pending and in the master implementation.
    testNames.forEach(name => {
      results[name].forEach(test => {
        if(context.tests[name][test.fullTitle]) {
          context.tests[name][test.fullTitle].push(test);
        }
      });
    });
  });
  return context;
}

const context = makeContext(testConfig.implementation);
const output = template(context);
// output the implementation report
fs.writeFileSync(path.join(__dirname, 'index.html'), output);

console.log('Generated new implementation report.');
