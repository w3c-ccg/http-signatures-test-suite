const config = require('../../config.json');
const util = require('./util');
const {algorithms} = require('./input/algorithms');
const {expect} = require('chai');

describe('Canonicalize', function() {
  let generatorOptions = null;
  beforeEach(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'canonicalize',
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
        result.should.equal(`date: ${generatorOptions.date}`
          , `expected signature string to match`);
      });
    it('If a value is not the last value then append an ASCII newline.',
      async function() {
      /**
        * If value is not the last value then append an ASCII newline `\n`.
      */
        generatorOptions.args.headers = ['digest', 'host'];
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        let expected =
          'digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=\n';
        // the last line should not have a new line block
        expected += 'host: example.com';
        result.should.equal(expected);
      });
    it.skip(`if duplicate parameters the last parameter
        defined MUST be used.`, async function() {
      /**
        * If any of the parameters listed above are erroneously duplicated in
        * the associated header field, then the last parameter defined MUST be
        * used.
      */
      generatorOptions.args.headers = ['digest', 'host'];
      const result = await util.generate(
        'duplicate-headers-request', generatorOptions);
      result.should.not.be.null;
      result.should.be.a('string');
      result.should.equal('duplicate: last\n');
    });

    describe('Header Parameter', function() {

      it(`SHOULD accept lowercase and uppercase
        HTTP header fields`, async function() {
        generatorOptions.args.headers = ['content-length', 'host', 'digest'];
        const result = await util.generate(
          'ignore-case', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        let expected = 'content-length: 18\n';
        expected += 'host: example.com\n' +
        'digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=';
        result.should.equal(expected, 'expected signature string to match');
      });

      it(`SHOULD be a lowercased, quoted list of HTTP header fields,
         separated by a single space character.`, async function() {
      /** If specified, it
       * SHOULD be a lowercased, quoted list of HTTP header fields,
       * separated by a single space character.
       */
        generatorOptions.args.headers = ['content-length', 'host', 'digest'];
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        let expected = 'content-length: 18\n';
        expected += 'host: example.com\n' +
        'digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=';
        result.should.equal(expected, 'expected signature string to match');
      });

      it(`The client MUST use the values of each HTTP header field
        in the headers Signature Parameter, in the order they appear
        in the headers Signature Parameter.`, async function() {
      /**
        * In order to generate the string that is signed with a key, the client
        * MUST use the values of each HTTP header field in the `headers`
        * Signature Parameter, in the order they appear in the `headers`
        * Signature Parameter.
       */
        generatorOptions.args.headers = ['content-length', 'host'];
        const result = await util.generate(
          'default-test', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        let expected = 'content-length: 18\n';
        expected += 'host: example.com';
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
        generatorOptions.args.headers = ['host', 'duplicate'];
        const result = await util.generate(
          'duplicate-headers-request', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        const expected = 'host: example.com\n' +
        'duplicate: one, two';
        result.should.equal(expected, 'expected signature string to match');
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
      it(`If a header specified in the headers parameter is
        malformed the implementation MUST produce an error.`, async function() {
      /**
        * If a header specified in the headers parameter is
        * malformed or cannot be matched with a provided
        * header in the message, the implementation
        * MUST produce an error.
      */
        let error = null;
        generatorOptions.args.headers = ['digest=='];
        try {
          await util.generate(
            'default-test', generatorOptions);
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
        generatorOptions.args.headers = ['zero'];
        const result = await util.generate(
          'zero-length', generatorOptions);
        const expected = 'zero: ';
        expect(result, 'Expected a result').to.not.be.null;
        result.should.equal(expected);
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
        generatorOptions.args.headers = ['connection'];
        const result = await util.generate(
          'basic-request', generatorOptions);
        const expected = 'connection: keep-alive';
        expect(result, 'Expected a result').to.not.be.null;
        result.should.equal(expected);
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
        const expected = '(request-target): get /basic/request';
        result.should.equal(expected, 'expected signature string to match');
      });

      it('SHOULD return "" if the headers paramter is empty.',
        async function() {
          generatorOptions.args.headers = ' ';
          const result = await util.generate(
            'basic-request', generatorOptions);
          expect(result, 'Expected a result').to.exist;
          result.should.equal('');
        });
      it(`If the header parameter is not specified, implementations
        MUST operate as if the field were specified with a single
        value, (created), in the list of HTTP headers.`, async function() {
        /**
            * If not specified (the header parameter),
            * implementations MUST operate as if the field were specified with a
            * single value, `(created)`, in the list of HTTP headers.
          */
        const created = Date.now() - 100;
        generatorOptions.args.headers = [''];
        generatorOptions.args.created = created;
        const result = await util.generate(
          'created', generatorOptions);
        expect(result, 'Expected a result').to.exist;
        result.should.be.a('string');
        const expected = `(created): ${created}`;
        result.should.equal(expected, 'expected signature string to match');
      });
      ['created', 'expires']
        .forEach(param => {
          algorithms.forEach(algorithm => {
            const algTest = `If (${param}) is in headers & the ` +
            `algorithm param starts with ${algorithm}` +
            ' MUST produce an error.';
            it(algTest, async function() {
              /**
               * If the header field name is `(created)` and the `algorithm`
               * parameter starts with `rsa`, `hmac`, or `ecdsa`
               * an implementation MUST produce an error.
              */
              /**
               * If the header field name is `(expires)` and the `algorithm`
               * parameter starts with `rsa`, `hmac`, or `ecdsa`
               * an implementation MUST produce an error.
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
          it(`If given valid options SHOULD return (${param}).`,
            async function() {
              generatorOptions.args.headers = [`(${param})`];
              if(param.search('created') > -1) {
                generatorOptions.args['created'] = 1;
              } else {
                generatorOptions.args['expires'] = 1;
              }
              const result = await util.generate(
                `${param}`, generatorOptions);
              const expected = `(${param}): 1`;
              expect(result, 'Expected a result').to.exist;
              result.should.be.a('string');
              result.should.equal(
                expected, 'expected signature string to match');
            });
        });
    });
  });
});
