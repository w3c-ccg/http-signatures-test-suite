const config = require('../../config.json');
const chai = require('chai');
const util = require('./util');

// configure chai
chai.should();
chai.use(require('chai-as-promised'));

describe.skip('Sign Requests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'sign',
      date: new Date().toGMTString(),
      headers: []
    };
  });

  it.skip('should fail if there is no keyId', async function() {
    let error = null;
    try {
      await util.generate('nokeyid-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it.skip('should fail if there is no signature parameter', async function() {
    let error = null;
    try {
      await util.generate('nosignature-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it.skip('should succeed with out algorithm parameter', async function() {
    const result = await util.generate(
      'noalgorithm-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
  });

  it.skip('should not process if created is in the future', async function() {
    let error = null;
    try {
      const result = await util.generate('created-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it.skip('should return an empty Signing String', async function() {
    const result = await util.generate(
      'invalidheaders-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.an('object');
  });

});
