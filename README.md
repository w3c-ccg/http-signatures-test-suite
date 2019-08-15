# W3C Signing HTTP Messages Working Group Test Suite

This repository contains the W3C
[Signing HTTP Messages draft v11](https://tools.ietf.org/html/draft-cavage-http-signatures-11) test suite.
Any conforming implementation MUST pass all tests in the test suite.

There are multiple test suites, each of which is detailed below.

## Signing HTTP Messages Tests

This test suite will check any application that generates headers compliant with
[Signing HTTP Messages](https://tools.ietf.org/html/draft-cavage-http-signatures)
to ensure conformance with the specification.


### Creating a Binary
The implementation will need to be accessible from the command line.
It will also need to accept the following command line parameters:

```
Usage: <implementation_binary> [options] [command]

Options:
  -V, --version                    output the version number
  -d, --headers <headers>          A list of header names.
  -c, --construct <construct>      (Signature|Authorization)
  -k, --keyId <keyId>              A Key Id string.
  -p, --private-key <privateKey>.  A private key file name filename.
  -t, --key-type <keyType>         The type of the keys.
  -u, --public-key <publicKey>.    A public key file name filename.
  -a, --algorithm [algorithm]      One of: rsa-sha1, hmac-sha1, rsa-sha256, hmac-sha256, hs2019.
  -c, --created [created]          The created param for the signature.
  -e, --expires [expires]          The expires param for the signature.
  -h, --help                       output usage information

Commands:
  canonicalize
  sign
  verify
```
All tests will run against the implementation's binary and assume that an exit code greater
than 0 represents an error.
The binary will receive an [HTTP message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) via [standard in](https://en.wikipedia.org/wiki/Standard_streams):

Here is an example HTTP request the binary should receive via stdin:
```
POST /foo?param=value&pet=dog HTTP/1.1
Host: example.com
Date: Sun, 05 Jan 2014 21:31:40 GMT
Content-Type: application/json
Digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=
Content-Length: 18
```

### Creating a Config File
1. Copy the `config.json.example` file to `config.json` and modify.
2. The generator should be a path to the app's binary.

This is an example local configuration for the test suite. To use:
```
{
  "generator": "../my-http-signatures-library/bin",
}
```

### Running the Test Suite

1. Install the suite's dependencies and set it up for execution with
  ``npm install``
2. Copy the `config.json.example` file to `config.json` and modify with
  the path of the generator. Note this path must be executable.
3. ``npm test``

### Submit an Implementation Report

1. Create a fork of the repository <https://github.com/w3c-dvcg/http-signatures-test-suite> on GitHub.
2. ``npm install``
3. Copy the `config.json.example` file to `config.json` and modify.
4. ``npm run report``
5. Rename ``implementation/results.json`` to
   ``implementation/YOUR_IMPLEMENTATION-results.json``.
6. ``git add implementations/YOUR_IMPLEMENTATION-results.json`` and push to your forked repository
7. Submit a pull request for the results of your implementation to the master repository.

## Contributing

You may contribute to this test suite by submitting pull requests here:

<https://github.com/w3c-dvcg/http-signatures-test-suite/pulls>
