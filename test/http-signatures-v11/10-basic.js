const config = require('../../config.json');
const chai = require('chai');
const util = require('./util');

// configure chai
const should = chai.should();
chai.use(require('chai-as-promised'));

describe('Basic Requests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      args: config.generatorOptions
    };
  });
  it('should return a valid signature', async function() {
    const result = await util.generate('basic-request.json', generatorOptions);
    console.log(result);
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
});
