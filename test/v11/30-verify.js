const config = require('../../config.json');
const util = require('./util');

describe('should verify http message', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'verify',
      args: {},
      date: new Date().toGMTString(),
    };
  });

  it('should conform to 2.1.1 - fail if no keyId paramater', function() {

  });
  it('should conform to 2.1.2 - fail if no signature paramater', function() {

  });

  it.skip('conform to 2.2 - Ambiguous Parameters', async function() {
    /**
      * If any of the parameters listed above are erroneously duplicated in
      * the associated header field, then the last parameter defined MUST be
      * used.
    */
    const result = await util.generate(
      'duplicate-headers-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
    result.should.equal('duplicate: last\n');
  });
});
