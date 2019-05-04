const config = require('../../config.json');
const util = require('./util');

describe('Canonize Tests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'c14n',
      args: config.args || {},
      date: new Date().toGMTString(),
    };
  });

  it('should return a valid signature', async function() {
    generatorOptions.args.headers = ['date'];
    generatorOptions.args.keyId = 'EDTestKey';
    const result = await util.generate('basic-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
  });

  it('should return fail is a header is not in the request', async function() {
    let error = null;
    try {
      generatorOptions.args.headers = ['date', 'not-in-request'];
      await util.generate('basic-request.txt', generatorOptions);
    } catch(e) {
      error = e;
      error.should.not.be.null;
    }
  });

});
