# W3C Http Signatures Working Group Test Suite

This repository contains the W3C
[Http Signatures](https://tools.ietf.org/html/draft-cavage-http-signatures-11) test suite.
Any conforming implementation MUST pass all tests in the test suite.

There are multiple test suites, each of which is detailed below.

## Http Signatures Version 11 Tests

This test suite will check any application that generates [Http Signaturesl](hhttps://tools.ietf.org/html/draft-cavage-http-signatures-11) Headers to
ensure conformance with the specification.

### Running the Test Suite

1. npm install
2. Copy the `config.json.example` file to `config.json` and modify.
3. npm test

### Submit an Implementation Report

1. npm install
2. Copy the `config.json.example` file to `config.json` and modify.
3. npm run report
4. Rename implementation/results.json to
   implementation/YOUR_IMPLEMENTATION-results.json.
5. git add implementations/YOUR_IMPLEMENTATION-results.json and submit a
   pull request for your implementation.

## Contributing

You may contribute to this test suite by submitting pull requests here:

https://github.com/w3c-dvcg/http-signatures-test-suite