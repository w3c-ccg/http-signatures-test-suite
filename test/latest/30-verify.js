const config = require('../../config.json');
const {registry, keys} = require('./input/algorithms');
const util = require('./util');
const path = require('path');
const {expect} = require('chai');

const publicKeys = Object.keys(keys.public);
const commonRequest = 'rsa-signed';
const commonKey = path.join(__dirname, '..', 'keys', 'rsa.pub');

function commonOptions(ops) {
  ops.args['public-key'] = commonKey;
  ops.args['headers'] = ['host', 'digest'];
  ops.args['algorithm'] = 'hs2019';
  ops.args['key-type'] = 'rsa';
  ops.args['keyId'] = 'test-rsa';
  return ops;
}

describe('Verify', function() {
  let generatorOptions = null;
  beforeEach(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'verify',
      args: {},
      date: new Date().toGMTString(),
    };
  });
  describe('Public Keys', function() {
    publicKeys.forEach(key => {
      it(`should verify for a ${key} public key`, async function() {
        const requestName = `${key.toLowerCase()}-signed`;
        const filePath = path.join(__dirname, '..', 'keys', keys.public[key]);
        generatorOptions.args['headers'] = ['host', 'digest'];
        generatorOptions.args['algorithm'] = 'hs2019';
        generatorOptions.args['key-type'] = key;
        generatorOptions.args['public-key'] = filePath;
        const result = await util.generate(requestName, generatorOptions);
        expect(result, 'Expected a result').to.not.be.null;
      });
    });
  });

  it('MUST require a signature parameter.', async function() {
    let error = null;
    const options = commonOptions(generatorOptions);
    try {
      await util.generate('nosignature-request', options);
    } catch(e) {
      error = e;
    }
    expect(error, 'Expected an error to be thrown').to.not.be.null;
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
    const options = commonOptions(generatorOptions);
    delete options.args.algorithm;
    const result = await util.generate(commonRequest, generatorOptions);
    expect(result, 'Expected a result').to.not.be.null;
  });
  // this is hard to test because only 1
  // http signature algorithm is current not deprecated.
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
    const options = commonOptions(generatorOptions);
    delete options.args.algorithm;
    const result = await util.generate(commonRequest, generatorOptions);
    expect(result, 'Expected a result').to.not.be.null;
  });
  it(`A server MUST use the received HTTP message, the headers value,
      and the Signature String Construction algorithm
      to recreate the signature.`, async function() {
    commonOptions(generatorOptions);
    const result = await util
      .generate(commonRequest, generatorOptions);
    expect(result, 'Expected there to be a result');
  });
  it(`A server MUST use the algorithm, keyId, and base 64
      decoded signature listed in the Signature Parameters
      to verify the authenticity of the digital signature.`, async function() {
    const options = commonOptions(generatorOptions);
    const result = await util.generate(commonRequest, options);
    expect(result, 'Expected a result').to.not.be.null;
  });
  it(`If a header specified in the headers value of
      the Signature Parameters (or the default item (created)
      where the headers value is not supplied) is absent from the message,
      the implementation MUST produce an error.`, async function() {
    let error = null;
    const options = commonOptions(generatorOptions);
    options.args.headers = ['not-in-request'];
    try {
      await util.generate(commonRequest, generatorOptions);
    } catch(e) {
      error = e;
    }
    expect(error, 'Expected an error to be thrown').to.not.be.null;
  });
  it('MUST have a keyId parameter.', async function() {
    let error = null;
    const options = commonOptions(generatorOptions);
    delete options.args['key-id'];
    try {
      await util.generate('nokeyid-request', options);
    } catch(e) {
      error = e;
    }
    expect(error, 'Expected an error to be thrown').to.not.be.null;
  });
  describe('Algorithm Parameter', function() {
    it(`MUST produce an error if algorithm
        parameter differs from key metadata.`, async function() {
      /**
       * If `algorithm` is provided and differs from
       * the key metadata identified by the `keyId`,
       * for example `rsa-sha256` but an EdDSA key
       * is identified via `keyId`,
       * then an implementation MUST produce an error.
      */
      let error = null;
      const options = commonOptions(generatorOptions);
      options.args['key-type'] = 'unknown';
      options.args['public-key'] = path.join(
        __dirname, '..', 'keys', 'dsa_pub.pem');
      try {
        await util.generate(commonRequest, options);
      } catch(e) {
        error = e;
      }
      expect(error, 'Expected an error to be thrown').to.not.be.null;
    });

    it(`Signature scheme MUST be in the
        HTTP Signatures Algorithms Registry.`, async function() {
      let error = null;
      const options = commonOptions(generatorOptions);
      options.args.algorithm = 'unknown';
      try {
        await util.generate(commonRequest, options);
      } catch(e) {
        error = e;
      }
      expect(error, 'Expected an error to be thrown').to.not.be.null;

    });
    describe('Signature scheme', function() {
      registry.forEach(({scheme, deprecated}) => {
        if(deprecated) {
          it(`MUST reject deprecated algorithm ${scheme}.`, async function() {
            let error = null;
            generatorOptions.args['public-key'] = commonKey;
            generatorOptions.args['headers'] = 'date';
            generatorOptions.args['algorithm'] = scheme;
            generatorOptions.args['key-type'] = 'rsa';
            generatorOptions.args['keyId'] = 'test';
            try {
              await util.generate('basic-request', generatorOptions);
            } catch(e) {
              error = e;
            }
            expect(error,
              `Expected deprecated algorithm ${scheme}
               to be rejected`).to.not.be.null;
          });
        } else {
          it(`MUST not reject algorithm ${scheme}.`, async function() {
            const options = commonOptions(generatorOptions);
            options.args['algorithm'] = scheme;
            const result = await util.generate(
              'rsa-signed', options);
            expect(result, 'Expected a result').to.not.be.null;
          });
        }
      });
    });
  });
});
