const config = require('../../config.json');
const util = require('./util');
const {algorithms} = require('./input/algorithms');
const {expect} = require('chai');

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

  it.skip('conform to 2.1.6 - if no header param only return (created)',
    async function() {
      /**
        * If not specified (the header parameter),
        * implementations MUST operate as if the field were specified with a
        * single value, `(created)`, in the list of HTTP headers.
      */
      const result = await util.generate('basic-request.txt', generatorOptions);
      expect(result, 'Expected a result').to.exist;
      result.should.be.a('string');
      const expected = `created: ${generatorOptions.date}\n`;
      result.should.equal(expected, 'expected signature string to match');
    });

  it.skip('should return an empty String if headers is empty', async function() {
    const result = await util.generate(
      'invalidheaders-request.txt', generatorOptions);
    expect(result, 'Expected a result').to.exist;
    result.should.be.an('object');
  });

  describe('conform to 2.3 - Signature String Construction ', async function() {
    //TODO: should (created) & algorithm be in canonize or sign?
    [{number: 2, param: 'created'}, {number: 3, param: 'expires'}]
      .forEach(({number, param}) => {
        const title = `- ${number}. should`;
        algorithms.forEach(algorithm => {
          const algTest = `${title} throw if (${param}) & algorithm ${algorithm}`;
          it(algTest, async function() {
            /**
             * If the header field name is `(created)` and the `algorithm`
             * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
             * MUST produce an error.
            */
            /**
             * If the header field name is `(expires)` and the `algorithm`
             * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
             * MUST produce an error.
            */
            generatorOptions.args.headers = [`(${algorithm})`];
            let error = null;
            try {
              await util.generate(`created-${algorithm}.txt`, generatorOptions);
            } catch(e) {
              error = e;
            }
            expect(error, 'expected an error').to.exist;
          });
        });
        const unDefined = `${title} throw if (${param}) & ${param} is not defined`;
        it(unDefined, async function() {
          /**
            * If the `created` Signature Parameter is
            * not specified, or is not an integer, an implementation MUST
            * produce an error.
          */
          /**
            * If the `expires` Signature Parameter is
            * not specified, or is not an integer, an implementation MUST
            * produce an error.
          */
          generatorOptions.args.headers = [`(${param})`];
          let error = null;
          try {
            await util.generate(`not-${param}.txt`, generatorOptions);
          } catch(e) {
            error = e;
          }
          expect(error, 'expected and error to be thrown').to.exist;
        });
        const notInt = `${title} should throw if (${param}) & ${param} is not an integer`;
        it(notInt, async function() {
          /**
            * If the `created` Signature Parameter is
            * not specified, or is not an integer, an implementation MUST
            * produce an error.
          */
          /**
            * If the `expires` Signature Parameter is
            * not specified, or is not an integer, an implementation MUST
            * produce an error.
          */
          generatorOptions.args.headers = [`(${param})`];
          let error = null;
          try {
            await util.generate(`${param}-not-int.txt`, generatorOptions);
          } catch(e) {
            error = e;
          }
          expect(error, 'Expected an error to be thrown').to.exist;
        });
        it.skip(`${title} should return (${param})`,
          async function() {
            /**
              * If the `created` Signature Parameter is
              * not specified, or is not an integer, an implementation MUST
              * produce an error.
            */
            /**
              * If the `expires` Signature Parameter is
              * not specified, or is not an integer, an implementation MUST
              * produce an error.
            */
            generatorOptions.args.headers = [`(${param})`];
            const result = await util.generate(
              `${param}.txt`, generatorOptions);
            const expected = `(${param}): 1\n`;
            expect(result, 'Expected a result').to.exist;
            result.should.be.a('string');
            result.should.equal(expected, 'expected signature string to match');
          });
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
      expect(result, 'Expected a result').to.exist;
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
      expect(result, 'Expected a result').to.exist;
      result.should.be.a('string');
      const expected = '(request-target): get /basic/request\n';
      result.should.equal(expected, 'expected signature string to match');
    });

    it('- 4. should change capitalized Headers to lowercase', async function() {
      /**
        * Create the header field string by concatenating the lowercased
        * header field name followed with an ASCII colon `:`,
        * an ASCII space ` `, and the header field value.
        * Leading and trailing optional whitespace (OWS) in the
        * header field value MUST be omitted
        * (as specified in RFC7230, Section 3.2.4).
       */
    });

    it('- 4a. should convert multiple headers to a list', async function() {
      /**
        * If there are multiple instances of the same header
        * field, all header field values associated with the
        * header field MUST be concatenated, separated by an
        * ASCII comma and an ASCII space `, `, and used in the
        * order in which they will appear in the transmitted HTTP message.
      */
    });

    it('- 4b. should include empty headers', async function() {
      /**
       * If the header value (after removing leading and trailing whitespace)
       * is a zero-length string, the signature string line correlating with
       * that header will simply be the (lowercased) header name,
       * an ASCII colon `:`, and an ASCII space ` `.
       */
    });
    it('- 4d. throws if a header is not in the request', async function() {
      /**
        * If a header specified in the headers parameter is
        * malformed or cannot be matched with a provided
        * header in the message, the implementation
        * MUST produce an error.
      */
      let error = null;
      try {
        generatorOptions.args.headers = ['not-in-request'];
        await util.generate('basic-request.txt', generatorOptions);
      } catch(e) {
        error = e;
      }
      expect(error, 'Expected an error to be thrown').to.exist;
    });
    it.skip('- 4d. throws if a header is malformed', async function() {
      /**
        * If a header specified in the headers parameter is
        * malformed or cannot be matched with a provided
        * header in the message, the implementation
        * MUST produce an error.
      */
      let error = null;
      generatorOptions.args.headers = ['Server'];
      try {
        await util.generate('malformed-request.txt', generatorOptions);
      } catch(e) {
        error = e;
      }
      expect(error, 'Expected an error to be thrown').to.exist;
    });

    it('- 5. if not last value should end with \\n', async function() {
      /**
        * If value is not the last value then append an ASCII newline `\n`.
      */
      generatorOptions.args.headers = ['Digest', 'Host'];
      const result = await util.generate(
        'default-test.httpMessage', generatorOptions);
      expect(result, 'Expected a result').to.exist;
      let expected =
        'digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=\n';
      // the last line should not have a new line block
      expected += 'host: example.com';
      result.should.equal(expected);
    });

  });
});
