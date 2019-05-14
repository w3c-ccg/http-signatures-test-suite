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

  it('MUST REQUIRE a signature parameter.', async function() {

  });

  it(`MUST derive the digital signature algorithm from 
      the metadata associated with the keyId.`, async function() {
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
  it(`A server MUST use the algorithm, keyId, and base 64
      decoded signature listed in the Signature Parameters
      to verify the authenticity of the digital signature.`, async function() {

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
  it('MUST have a keyId parameter', function() {

  });
  it('MUST have a signature parameter', function() {

  });
});
