# W3C Http Signatures Working Group Test Suite

This repository contains the W3C
[Http Signatures](https://tools.ietf.org/html/draft-cavage-http-signatures-11) test suite.
Any conforming implementation MUST pass all tests in the test suite.

There are multiple test suites, each of which is detailed below.

## Http Signatures Version 11 Tests

This test suite will check any application that generates [Http Signatures](hhttps://tools.ietf.org/html/draft-cavage-http-signatures-11) Headers to
ensure conformance with the specification.


### Creating a Binary
You web application will need to be accessible from the command line.
It will also need to accept the following command line parameters:

```
Usage: http-signature-header [options] [command]

Options:
  -H, --headers <headers>                   A list of header names.
  -k, --keyId <keyId>                       A Key Id <string>.
  -pk, --private-key <privateKey>.          A private key file name <filename>.
  -pkt, --private-key-type <privateKeyType  The type of the private key.
  -a, --algorithm [algorithm]               One of: rsa-sha1, hmac-sha1, rsa-sha256, hmac-sha256, hs2019.
  -c, --created [created]                   The created param for the signature.
  -e, --expires [expires]                   The expires param for the signature.
  -h, --help                                output usage information

Commands:
  c14n|C
  sign|S [options]
  verify|V
```
All tests will run against your binary and assume that an exit code greater
than 0 represents an error.
Your binary will receive an [http message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) via [standard in](https://en.wikipedia.org/wiki/Standard_streams):

```
POST /foo?param=value&pet=dog HTTP/1.1
Host: example.com
Date: Sun, 05 Jan 2014 21:31:40 GMT
Content-Type: application/json
Digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=
Content-Length: 18
```

### Creating a config file
An example local configuration for the test suite. To use:

1. Copy this file to one called config.json.
2. Modify the file and replace with appropriate values for your system.
3. the args become command line arguments.

```
{
  "generator": "../my-http-signatures-library/bin",
  "command": "verify",
  "args": {
    "keyId": "ED25519TestKey",
    "headers": ["date", "etag"],
    "private-key": "~/.ssh/id_ed25519",
    "private-key-type": "ED25519",
    "algorithm": "hs2019",
    "created": "1556933492763",
    "expires": "1956933492763"
  }
}
```

### Running the Test Suite

1. npm install
2. Copy the `config.json.example` file to `config.json` and modify.
3. All that is needed is a path to the binary that runs the tests
4. npm test
5. git add implementations/YOUR_IMPLEMENTATION-results.json and submit a
    pull request for your implementation.

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
