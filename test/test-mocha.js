const chai = require('chai');
const mocha = require('mocha');
const ImplementationReporter = require('./ImplementationReporter');
// configure chai
chai.should();

mocha.reporters.ImplementationReporter = ImplementationReporter;
