const config = require('../../config.json');
const util = require('./util');

describe('Canonize ', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      command: 'c14n',
      args: {},
      date: new Date().toGMTString(),
    };
  });

  it('should return a valid signature string', async function() {
    generatorOptions.args.headers = ['date'];
    const result = await util.generate('basic-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
    result.should.equal(
      `date: ${generatorOptions.date}\n`, `expected signature string to match`);
  });

  it('should return fail is a header is not in the request', async function() {
    let error = null;
    try {
      generatorOptions.args.headers = ['date', 'not-in-request'];
      await util.generate('basic-request.txt', generatorOptions);
    } catch(e) {
      error = e;
      error.should.not.be.null;
    }
  });
  it.skip('should conform to 2.1.6 - if no header param only return (created)',
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
  it('conform to 2.2 - Ambiguous Parameters', async function() {
    /**
      * If any of the parameters listed above are erroneously duplicated in
      * the associated header field, then the last parameter defined MUST be
      * used.
    */
    generatorOptions.args.headers = ['Duplicate'];
    const result = await util.generate(
      'duplicate-headers-request.txt', generatorOptions);
    result.should.not.be.null;
    result.should.be.a('string');
    result.should.equal('duplicate: last\n');
  });

  it('should conform to 2.3 - Signature String Construction', async function() {

  });
});
