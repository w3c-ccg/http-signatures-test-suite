const config = require('../../config.json');
const util = require('./util');

describe.skip('Verify', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'verify',
      args: {},
      date: new Date().toGMTString(),
    };
  });

  it('MUST REQUIRE a signature partamater', async function() {

  });

  it(`MUST derive the digital signature algorithm from 
      the metadata associated with the keyId`, async function() {
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
  it(`MUST NOT use the value of
      algorithm from the signed message.`, async function() {
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
  it(`A server MUST use the received HTTP message, the headers value,
     and the Signature String Construction algorithm
     to recreate the signature.`, async function() {

  });
  it(`A server MUST use the algorithm, keyId,
     and base 64 decoded signature listed in
     the Signature Parameters to verify the 
     authenticity of the digital signature.`, async function() {

  });
  it(`If a header specified in the headers value of
      the Signature Parameters (or the default item (created)
      where the headers value is not supplied) is absent from the message,
      the implementation MUST produce an error.`, async function() {

  });
  it(`MUST be able to discover metadata about the key from the keyId
      such that they can determine the type of digital signature algorithm
      to employ when verifying signatures.`, async function() {

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
      'duplicate-headers-request', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
    result.should.equal('duplicate: last\n');
  });

});
