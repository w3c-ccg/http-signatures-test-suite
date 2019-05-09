const config = require('../../config.json');
const util = require('./util');
const {expect} = require('chai');
const {registry} = require('./input/algorithms');

// base64 string should only consist of letters,
// numbers, and end with an = sign.
const base64String = /[A-Za-z0-9+/=]=$/;

describe.skip('Sign should', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'sign',
      date: new Date().toGMTString(),
      headers: []
    };
  });

  describe('2.4 Creating a Signature', function() {
    it('should return a base64 string', async function() {
      const result = await util.generate('basic-request.txt', generatorOptions);
      expect(result, 'Expected sign to return a Signature').to.exist;
      result.should.match(base64String);
      console.log(result);
    });
    it('should return a valid signature string', async function() {
      const result = await util.generate('basic-request.txt', generatorOptions);
      expect(result, 'Expected sign to return a Signature').to.exist;
      result.should.match(base64String);
      console.log(result);
    });
    it('should use the key from keyId', async function() {
      const result = await util.generate('basic-request.txt', generatorOptions);
      expect(result, 'Expected sign to return a Signature').to.exist;
      result.should.match(base64String);
      console.log(result);
    });
  });

  it.skip('should conform to 2.1.1 - fail if there is no keyId', async function() {
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



});
