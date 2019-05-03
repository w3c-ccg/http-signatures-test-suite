const config = require('../../config.json');
const chai = require('chai');
const util = require('./util');

// configure chai
chai.should();
chai.use(require('chai-as-promised'));

describe('Canonize Tests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      args: config.generatorOptions,
      date: new Date().toGMTString(),
      headers: []
    };
  });

  it('should return a valid signature', async function() {
    generatorOptions.headers = ['date'];
    const result = await util.generate('basic-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
  });
});
