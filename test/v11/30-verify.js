const config = require('../../config.json');
const util = require('./util');

describe('Verify should', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'verify',
      args: {},
      date: new Date().toGMTString(),
    };
  });
  describe('conform to 2.5', function() {
    it('by deriving the signature algorithim from the keyid', async function() {
      /**
        * The `algorithm`, `keyId`, and base 64 decoded `signature`
        * listed in the Signature Parameters are then used to verify
        * the authenticity of the digital signature.
        * Note: The application verifying the signature MUST derive
        * the digital signature algorithm from the metadata associated
        * with the `keyId` and MUST NOT use the value of
        * `algorithm` from the signed message.
      */
    });
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
