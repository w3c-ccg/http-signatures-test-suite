const config = require('../../config.json');
const util = require('./util');
const {expect} = require('chai');
const {registry, keys} = require('./input/algorithms');
const path = require('path');

// base64 string should only consist of letters,
// numbers, and end with an = sign.
const base64Signature = /signature=[\"\'][a-z0-9=\/\+]+[\"\']/i;
const privateKeys = Object.keys(keys.private);

describe('Sign', function() {
  let generatorOptions = null;
  beforeEach(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'sign',
      args: {},
      date: new Date().toGMTString(),
    };
  });

  it(`A client MUST generate a signature by base 64 encoding
      the output of the digital signature algorithm.`, async function() {
    // The `signature` is then generated by base 64
    // encoding the output of the digital signature algorithm.
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'digest';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    const result = await util.generate(
      'default-test', generatorOptions);
    expect(result, 'Expected sign to return a Signature').to.exist;
    result.should.match(base64Signature);
  });
  it(`A client MUST use the headers and algorithm values as
      well as the contents of the HTTP message,
      to create the signature string.`, async function() {
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'date';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    const result = await util.generate(
      'basic-request', generatorOptions);
    expect(result, 'Expected sign to return a Signature').to.exist;
    result.should.match(base64Signature);
  });
  //TODO while for an hmac this might work
  //this would mean exposing the private key via the keyId
  // better to say A client MUST a private key of the type in
  // the metadata derefernced from the keyId to generate a digital signature.
  it.skip(`A client MUST use the key associated with keyId to 
      generate a digital signature on the
      signature string.`, async function() {
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'date';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    // Use the key associated with `keyId`
    // to generate a digital signature on the signature string.
    const result = await util.generate(
      'basic-request', generatorOptions);
    expect(result, 'Expected sign to return a Signature').to.exist;
    result.should.match(base64Signature);
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
      generatorOptions.args['private-key'] = path.join(
        __dirname, '../keys/rsa.private');
      generatorOptions.args['headers'] = 'date';
      generatorOptions.args['algorithm'] = 'hs2019';
      generatorOptions.args['key-type'] = 'unknown';
      let error = null;
      try {
        await util.generate('basic-request', generatorOptions);
      } catch(e) {
        error = e;
      }
      expect(error, 'Expected an error to be thrown.')
        .to.not.be.null;
    });

    it(`Signature scheme MUST be in the
        HTTP Signatures Algorithms Registry.`, async function() {
      generatorOptions.args['private-key'] = path.join(
        __dirname, '../keys/rsa.private');
      generatorOptions.args['headers'] = 'date';
      generatorOptions.args['algorithm'] = 'unknown';
      generatorOptions.args['key-type'] = 'rsa';
      let error = null;
      try {
        await util.generate('basic-request', generatorOptions);
      } catch(e) {
        error = e;
      }
      expect(error,
        'Expected an error to be thrown.')
        .to.not.be.null;
    });

    describe('signature scheme', function() {
      registry.forEach(({scheme, deprecated}) => {
        if(deprecated) {
          it(`MUST reject deprecated algorithm ${scheme}.`, async function() {
            let error = null;
            generatorOptions.args['private-key'] = path.join(
              __dirname, '../keys/test_ed');
            generatorOptions.args['headers'] = 'date';
            generatorOptions.args['algorithm'] = scheme;
            generatorOptions.args['key-type'] = 'ed25519';
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
          it(`MUST sign for algorithm ${scheme}.`, async function() {
            generatorOptions.args['private-key'] = path.join(
              __dirname, '../keys/rsa.private');
            generatorOptions.args['headers'] = 'date';
            generatorOptions.args['algorithm'] = scheme;
            generatorOptions.args['key-type'] = 'rsa';
            const result = await util.generate(
              'basic-request', generatorOptions);
            result.should.match(base64Signature);
          });
        }
      });
    });
  });

  // TODO should sign check the algorithm vs keyMeta functions?
  it.skip(`MUST be able to discover metadata
      about the key from the keyId.`, async function() {
    /**
      * Implementations MUST be able to discover metadata
      * about the key from the `keyId` such that they can
      * determine the type of digital signature algorithm
      * to employ when creating or verifying signatures.
    */
    let error = null;
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'date';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    try {
      await util.generate(
        'nokeymetadata-request', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });

  it(`MUST NOT process a signature with a
      created timestamp value that is in the future.`, async function() {
    /**
     * A signature with a `created` timestamp value
     * that is in the future MUST NOT be processed.
    */
    let error = null;
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'date';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    generatorOptions.args['created'] = Date.now() + 1000;
    try {
      await util.generate('created-in-future', generatorOptions);
    } catch(e) {
      error = e;
    }
    expect(error, 'Expected an Error').to.not.be.null;
  });

  it(`MUST NOT process a signature with an expires
      timestamp value that is in the past.`, async function() {
    /**
      * A signatures with a `expires` timestamp
      * value that is in the past MUST NOT be processed.
    */
    let error = null;
    generatorOptions.args['private-key'] = path.join(
      __dirname, '../keys/rsa.private');
    generatorOptions.args['headers'] = 'date';
    generatorOptions.args['algorithm'] = 'hs2019';
    generatorOptions.args['key-type'] = 'rsa';
    generatorOptions.args['expires'] = Date.now() - 1000;
    try {
      await util.generate('expired', generatorOptions);
    } catch(e) {
      error = e;
    }
    error.should.not.be.null;
  });
  describe('Private Keys', function() {
    privateKeys.forEach(key => {
      it(`should sign with a/an ${key} private key.`, async function() {
        const filePath = path.join(__dirname, '..', 'keys', keys.private[key]);
        generatorOptions.args['private-key'] = filePath;
        generatorOptions.args['headers'] = ['host', 'digest'];
        generatorOptions.args['algorithm'] = 'hs2019';
        generatorOptions.args['key-type'] = key;
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected sign to return a Signature').to.exist;
        result.should.match(base64Signature);
      });
    });
  });
});
