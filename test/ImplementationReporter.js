const mocha = require('mocha');

exports = module.exports = ImplementationReporter;

/**
 * Custom Mocha Reporter for w3c test suites.
 *
 * @param {Function} runner - A mocha runner.
 * @param {Object} options - The command line options passed to mocha.
 */
function ImplementationReporter(runner, options) {
  mocha.reporters.Base.call(this, runner, options);
  const report = {};
  // add new fields for the final report here.
  function formatTest(test, parentSuite = '') {
    // remove line breaks and the parentSuite name
    const fullTitle = test
      .fullTitle()
      .replace(/\s\s/g, '')
      .replace(parentSuite, '')
      .trim();
    return {
      fullTitle,
      // just in case the parentSuite contains optional
      optional: /optional/i.test(test.fullTitle()),
      title: test.title.replace(/\s\s/g, ''),
      pending: test.pending,
      state: test.state,
      duration: test.duration,
      speed: test.speed,
      errors: test.err ? test.err.message : ''
    };
  }
  // recurse through suites collecting all their finished tests.
  function addSubTests(suites, title) {
    suites.forEach(s => {
      report[title] = report[title].concat(s.tests);
      if(s.suites.length) {
        addSubTests(s.suites, title);
      }
    });
  }
  runner.on(mocha.Runner.constants.EVENT_SUITE_BEGIN, function(suite) {
    // the parent suite will setup the report structure.
    if(!suite.parent) {
      suite.suites.forEach(s => {
        report[s.title] = [];
      });
    }
  });
  runner.on(mocha.Runner.constants.EVENT_SUITE_END, function(suite) {
    // we only want the top level commands.
    const topSuites = Object.keys(report);
    if(topSuites.includes(suite.title)) {
      report[suite.title] = report[suite.title].concat(suite.tests);
      addSubTests(suite.suites, suite.title);
    }
  });
  runner.on(mocha.Runner.constants.EVENT_RUN_END, function() {
    try {
      Object.keys(report).forEach(name => {
        // create a function for each test under this name
        const formatter = test => formatTest(test, name);
        // move all optional tests to the bottom
        report[name] = report[name]
          .map(formatter)
          .sort((a, b) => a.optional - b.optional);
      });
      console.log(JSON.stringify(report, null, 2));
    } catch(e) {
      console.error(e);
    }
  });
}
