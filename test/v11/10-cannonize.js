const config = require('../../config.json');
const util = require('./util');

describe('Canonize should', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'c14n',
      args: {},
      date: new Date().toGMTString(),
    };
  });

  it('return a valid signature string', async function() {
    generatorOptions.args.headers = ['date'];
    const result = await util.generate('basic-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
    result.should.equal(
      `date: ${generatorOptions.date}\n`, `expected signature string to match`);
  });

  it('return fail is a header is not in the request', async function() {
    let error = null;
    try {
      generatorOptions.args.headers = ['date', 'not-in-request'];
      await util.generate('basic-request.txt', generatorOptions);
    } catch(e) {
      error = e;
      error.should.not.be.null;
    }
  });
  it.skip('conform to 2.1.6 - if no header param only return (created)',
    async function() {
      /**
        * If not specified (the header parameter),
        * implementations MUST operate as if the field were specified with a
        * single value, `(created)`, in the list of HTTP headers.
      */
      const result = await util.generate('basic-request.txt', generatorOptions);
      result.should.not.be.null;
      result.should.be.a('string');
      const expected = `created: ${generatorOptions.date}\n`;
      result.should.equal(expected, 'expected signature string to match');
    });

  describe('conform to 2.3 - Signature String Construction ', async function() {
    //TODO: should (created) & algorithm be in canonize or sign?
    it('- 2. should throw if (created) & algorithm rsa', async function() {
      /**
       * If the header field name is `(created)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(created)'];
      let error = null;
      try {
        await util.generate('created-rsa.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });
    it('- 2. should throw if (created) & algorithm hmac', async function() {
      /**
       * If the header field name is `(created)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(created)'];
      let error = null;
      try {
        await util.generate('created-hmac.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });
    it('- 2. should throw if (created) & algorithm ecdsa', async function() {
      /**
       * If the header field name is `(created)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(created)'];
      let error = null;
      try {
        await util.generate('created-ecdsa.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });

    it('- 2. should throw if (created) & created parameter is not defined',
      async function() {
        /**
          * If the `created` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(created)'];
        let error = null;
        try {
          await util.generate('not-created.txt', generatorOptions);
        } catch(e) {
          error = e;
          error.should.not.be.null;
        }
      });

    it('- 2. should throw if (created) & created parameter is not an integer',
      async function() {
        /**
          * If the `created` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(created)'];
        let error = null;
        try {
          await util.generate('created-not-int.txt', generatorOptions);
        } catch(e) {
          error = e;
          error.should.not.be.null;
        }
      });

    it.skip('- 2. should return (created)',
      async function() {
        /**
          * If the `created` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(created)'];
        const result = await util.generate('created.txt', generatorOptions);
        const expected = '(created): 1\n';
        result.should.not.be.null;
        result.should.be.a('string');
        result.should.equal(expected, 'expected signature string to match');
        console.log(result);
      });
    it('- 2. should throw if (expires) & algorithm rsa', async function() {
      /**
       * If the header field name is `(expires)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(expires)'];
      let error = null;
      try {
        await util.generate('expires-rsa.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });
    it('- 2. should throw if (expires) & algorithm hmac', async function() {
      /**
       * If the header field name is `(expires)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(expires)'];
      let error = null;
      try {
        await util.generate('expires-hmac.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });
    it('- 2. should throw if (expires) & algorithm ecdsa', async function() {
      /**
       * If the header field name is `(expires)` and the `algorithm`
       * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
       * MUST produce an error.
      */
      generatorOptions.args.headers = ['(expires)'];
      let error = null;
      try {
        await util.generate('expires-ecdsa.txt', generatorOptions);
      } catch(e) {
        error = e;
        error.should.not.be.null;
      }
    });

    it('- 2. should throw if (expires) & expires parameter is not defined',
      async function() {
        /**
          * If the `expires` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(expires)'];
        let error = null;
        try {
          await util.generate('not-expires.txt', generatorOptions);
        } catch(e) {
          error = e;
          error.should.not.be.null;
        }
      });

    it('- 2. should throw if (expires) & expires parameter is not an integer',
      async function() {
        /**
          * If the `expires` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(expires)'];
        let error = null;
        try {
          await util.generate('expires-not-int.txt', generatorOptions);
        } catch(e) {
          error = e;
          error.should.not.be.null;
        }
      });

    it.skip('- 2. should return (expires)',
      async function() {
        /**
          * If the `expires` Signature Parameter is
          * not specified, or is not an integer, an implementation MUST
          * produce an error.
        */
        generatorOptions.args.headers = ['(expires)'];
        const result = await util.generate('expires.txt', generatorOptions);
        const expected = '(expires): 1\n';
        result.should.not.be.null;
        result.should.be.a('string');
        result.should.equal(expected, 'expected signature string to match');
        console.log(result);
      });

    it('- should match the order of the headers parameter', async function() {
      /**
        * In order to generate the string that is signed with a key, the client
        * MUST use the values of each HTTP header field in the `headers`
        * Signature Parameter, in the order they appear in the `headers`
        * Signature Parameter.
       */
      generatorOptions.args.headers = ['Content-Length', 'Host'];
      const result = await util.generate(
        'default-test.httpMessage', generatorOptions);
      result.should.not.be.null;
      result.should.be.a('string');
      let expected = 'content-length: 18\n';
      expected += 'host: example.com\n';
      result.should.equal(expected, 'expected signature string to match');
    });

    it('- should accept (request-target)', async function() {
      /**
       * If the header field name is `(request-target)` then generate
       * the header field value by concatenating the lowercased :method,
       * an ASCII space, and the :path pseudo-headers
       * (as specified in HTTP/2, Section 8.1.2.3).
       * Note: For the avoidance of doubt, lowercasing only applies
       * to the :method pseudo-header and not to the :path pseudo-header.
      */
      generatorOptions.args.headers = ['(request-target)'];
      const result = await util.generate('basic-request.txt', generatorOptions);
      result.should.not.be.null;
      result.should.be.a('string');
      const expected = '(request-target): get /basic/request\n';
      result.should.equal(expected, 'expected signature string to match');
    });
  });
});
