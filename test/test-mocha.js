// This module is a mocha set up file.
//
const chai = require('chai');
const mocha = require('mocha');
const ImplementationReporter = require('./ImplementationReporter');
// configure chai should
chai.should();

// add the implementation reporter
mocha.reporters.ImplementationReporter = ImplementationReporter;
