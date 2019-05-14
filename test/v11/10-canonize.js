const config = require('../../config.json');
const util = require('./util');
const {algorithms} = require('./input/algorithms');
const {expect} = require('chai');

describe('Canonize', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'c14n',
      args: {},
      date: new Date().toGMTString(),
    };
  });
  describe('Signature String', function() {
    it(
      'For valid options MUST return a valid signature string.',
      async function() {
        generatorOptions.args.headers = ['date'];
        const result = await util.generate(
          'basic-request', generatorOptions);
        result.should.not.be.null;
        result.should.be.a('string');
        result.should.equal(`date: ${generatorOptions.date}\n`
          , `expected signature string to match`);
      });
    it.skip('If a value is not the last value then append an ASCII newline.',
      async function() {
      /**
        * If value is not the last value then append an ASCII newline `\n`.
      */
        generatorOptions.args.headers = ['Digest', 'Host'];
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        let expected =
          'digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=\n';
        // the last line should not have a new line block
        expected += 'host: example.com';
        result.should.equal(expected);
      });

    describe('Header Parameter', function() {
      it(`The client MUST use the values of each HTTP header field
        in the headers Signature Parameter, in the order they appear
        in the headers Signature Parameter.`, async function() {
      /**
        * In order to generate the string that is signed with a key, the client
        * MUST use the values of each HTTP header field in the `headers`
        * Signature Parameter, in the order they appear in the `headers`
        * Signature Parameter.
       */
        generatorOptions.args.headers = ['Content-Length', 'Host'];
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        let expected = 'content-length: 18\n';
        expected += 'host: example.com\n';
        result.should.equal(expected, 'expected signature string to match');
      });

      it(`All header field values associated with the header field
        MUST be concatenated, separated by an ASCII comma and an ASCII space,
        and used in the order in which they will appear in the
        transmitted HTTP message.`, async function() {
      /**
        * If there are multiple instances of the same header
        * field, all header field values associated with the
        * header field MUST be concatenated, separated by an
        * ASCII comma and an ASCII space `, `, and used in the
        * order in which they will appear in the transmitted HTTP message.
      */
      });

      it(`If a header specified in the headers parameter cannot be
        matched with a provided header in the message, the implementation
        MUST produce an error.`, async function() {
      /**
        * If a header specified in the headers parameter is
        * malformed or cannot be matched with a provided
        * header in the message, the implementation
        * MUST produce an error.
      */
        let error = null;
        try {
          generatorOptions.args.headers = ['not-in-request'];
          await util.generate('basic-request', generatorOptions);
        } catch(e) {
          error = e;
        }
        expect(error, 'Expected an error to be thrown').to.exist;
      });
      it.skip(`If a header specified in the headers parameter is
        malformed the implementation MUST produce an error.`, async function() {
      /**
        * If a header specified in the headers parameter is
        * malformed or cannot be matched with a provided
        * header in the message, the implementation
        * MUST produce an error.
      */
        let error = null;
        generatorOptions.args.headers = ['Server'];
        try {
          await util.generate(
            'malformed-request', generatorOptions);
        } catch(e) {
          error = e;
        }
        expect(error, 'Expected an error to be thrown').to.exist;
      });

      it(`If the header value is a zero-length string,
          the signature string line correlating with
          that header will simply be the (lowercased) header name,
          an ASCII colon :, and an ASCII space.`, async function() {
        /**
         * If the header value (after removing leading and trailing whitespace)
         * is a zero-length string, the signature string line correlating with
         * that header will simply be the (lowercased) header name,
         * an ASCII colon `:`, and an ASCII space ` `.
         */
      });

      it('SHOULD change capitalized Headers to lowercase.', async function() {
        /**
          * Create the header field string by concatenating the lowercased
          * header field name followed with an ASCII colon `:`,
          * an ASCII space ` `, and the header field value.
          * Leading and trailing optional whitespace (OWS) in the
          * header field value MUST be omitted
          * (as specified in RFC7230, Section 3.2.4).
         */
      });

      it(`If the header field name is (request-target) then generate
          the header field value by concatenating the lowercased :method,
          an ASCII space, and the :path pseudo-headers.`, async function() {
        /**
         * If the header field name is `(request-target)` then generate
         * the header field value by concatenating the lowercased :method,
         * an ASCII space, and the :path pseudo-headers
         * (as specified in HTTP/2, Section 8.1.2.3).
         * Note: For the avoidance of doubt, lowercasing only applies
         * to the :method pseudo-header and not to the :path pseudo-header.
        */
        generatorOptions.args.headers = ['(request-target)'];
        const result = await util.generate(
          'basic-request', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        const expected = '(request-target): get /basic/request\n';
        result.should.equal(expected, 'expected signature string to match');
      });

      it.skip(
        'SHOULD return "" if the headers paramter is empty.', async function() {
          const result = await util.generate(
            'invalidheaders-request', generatorOptions);
          expect(result, 'Expected a result').to.exist;
          result.should.be.an('object');
        });
      it.skip(`If the header parameter is not specified, implementations
        MUST operate as if the field were specified with a single
        value, (created), in the list of HTTP headers.`, async function() {
        /**
            * If not specified (the header parameter),
            * implementations MUST operate as if the field were specified with a
            * single value, `(created)`, in the list of HTTP headers.
          */
        const result = await util.generate(
          'basic-request', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        const expected = `created: ${generatorOptions.date}\n`;
        result.should.equal(expected, 'expected signature string to match');
      });
      //TODO: should (created) & algorithm be in canonize or sign?
      ['created', 'expires']
        .forEach(param => {
          algorithms.forEach(algorithm => {
            const algTest = `If the header field name is (${param}) and the
            algorithm parameter starts with ${algorithm} an implementation
            MUST produce an error.`;
            it(algTest, async function() {
              /**
               * If the header field name is `(created)` and the `algorithm`
               * parameter starts with `rsa`, `hmac`, or `ecdsa`
               * an implementation MUST produce an error.
              */
              /**
               * If the header field name is `(expires)` and the `algorithm`
               * parameter starts with `rsa`, `hmac`, or `ecdsa` an implementation
               * MUST produce an error.
              */
              generatorOptions.args.headers = [`(${algorithm})`];
              let error = null;
              try {
                await util.generate(
                  `created-${algorithm}`, generatorOptions);
              } catch(e) {
                error = e;
              }
              expect(error, 'expected an error').to.exist;
            });
          });
          const unDefined = `If the ${param} Signature Parameter is
          not specified, an implementation MUST produce an error.`;
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
              await util.generate(`not-${param}`, generatorOptions);
            } catch(e) {
              error = e;
            }
            expect(error, 'expected and error to be thrown').to.exist;
          });
          const notInt = `If the ${param} Signature Parameter is
          not an integer or unix timestamp, an 
          implementation MUST produce an error.`;
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
              await util.generate(
                `${param}-not-int`, generatorOptions);
            } catch(e) {
              error = e;
            }
            expect(error, 'Expected an error to be thrown').to.exist;
          });
          it.skip(`If given valid options SHOULD return (${param}).`,
            async function() {
              generatorOptions.args.headers = [`(${param})`];
              const result = await util.generate(
                `${param}`, generatorOptions);
              const expected = `(${param}): 1\n`;
              expect(result, 'Expected a result').to.exist;
              result.should.be.a('string');
              result.should.equal(
                expected, 'expected signature string to match');
            });
        });
    });
  });
});
