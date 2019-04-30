const config = require('../../config.json');
const chai = require('chai');
const {expect} = chai;
const util = require('./util');

// configure chai
const should = chai.should();
chai.use(require('chai-as-promised'));

describe('Basic Requests', function() {
  let generatorOptions = null;
  before(function() {
    generatorOptions = {
      generator: config.generator,
      args: ''
    };
  });
  it('should return a valid signature', async function() {
    const result = await util.generate('basic-request.json', generatorOptions);
    console.log('result', result);
  });
});
