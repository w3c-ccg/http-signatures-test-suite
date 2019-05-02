const config = require('../../config.json');
const chai = require('chai');
const util = require('./util');

// configure chai
chai.should();
chai.use(require('chai-as-promised'));

describe('Basic Requests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      args: config.generatorOptions,
      date: new Date().toGMTString()
    };
  });

  it('should return a valid signature', async function() {
    const result = await util.generate('basic-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.an('object');
    result.should.have.property('scheme');
    result.scheme.should.be.a('string');
    result.scheme.should.match(/Signature/i);
    result.should.have.property('params');
    result.params.should.be.an('object');
    result.should.have.property('signingString');
    result.should.have.property('algorithm');
    result.should.have.property('keyId');
  });

  it('should fail if there is no keyId', async function() {
    let error = null;
    try {
      await util.generate('nokeyid-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it('should fail if there is no signature parameter', async function() {
    let error = null;
    try {
      await util.generate('nosignature-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it('should succeed with out algorithm parameter', async function() {
    const result = await util.generate(
      'noalgorithm-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.an('object');
    result.should.have.property('scheme');
    result.scheme.should.be.a('string');
    result.scheme.should.match(/Signature/i);
    result.should.have.property('params');
    result.params.should.be.an('object');
    result.should.have.property('signingString');
    result.should.not.have.property('algorithm');
    result.should.have.property('keyId');
  });

  it('should not process if created is in the future', async function() {
    let error = null;
    try {
      const result = await util.generate('created-request.txt', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it('should return an empty Signing String', async function() {
    const result = await util.generate(
      'badheaders-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.an('object');
  });

});
