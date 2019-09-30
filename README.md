W3C Signing HTTP Messages Working Group Test Suite
==================================================

This repository contains the W3C
[Signing HTTP Messages draft v11](https://tools.ietf.org/html/draft-cavage-http-signatures-11) test suite.
Any conforming implementation MUST pass all tests in the test suite.

# Signing HTTP Messages Tests

The test suite will check an implentation that generates and validates signatures
compliant with
[Signing HTTP Messages](https://tools.ietf.org/html/draft-cavage-http-signatures)
to ensure conformance with the specification.

This suite requires a functioning installation of
[nodejs](https://nodejs.org) (>v8.12), and specifically
the ``npm`` commmand (>v6.4).

## Creating a Generator
The Signing HTTP Mesages implementation being tested will need to be
accessible via a "generator" from the command line. This generator
is invoked independently for each test, and state is not expected to be
preserved between tests.

The generator will need to accept the following command line parameters
to control behavior for each test:

```
Usage: <implementation_binary> <command> [options]

Options:
  -V, --version                    Output the version number
  -d, --headers <headers>          A list of header names, optionally quoted
  -a, --add <header>               Add a (Signature|Authorization) header
  -k, --keyId <keyId>              A Key Id string.
  -p, --private-key <privateKey>   A private key file name filename.
  -t, --key-type <keyType>         The type of the keys.
  -u, --public-key <publicKey>     A public key file name filename.
  -a, --algorithm <algorithm>      One of: rsa-sha1, hmac-sha1, rsa-sha256, hmac-sha256, hs2019.
  -c, --created <created>          The created param for the signature.
  -e, --expires <expires>          The expires param for the signature.
  -h, --help                       Output usage information

Modes:
  canonicalize
  sign
  verify
```

Each test will provide the generator with an
[HTTP message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)
via [standard in](https://en.wikipedia.org/wiki/Standard_streams),
for example:

```
POST /foo?param=value&pet=dog HTTP/1.1
Host: example.com
Date: Sun, 05 Jan 2014 21:31:40 GMT
Content-Type: application/json
Digest: SHA-256=X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=
Content-Length: 18

{"hello": "world"}
```

The generator is expected to parse the input HTTP message, perform
test-specific actions depending on the ``mode``, and return:

- on success: an exit code of ``0`` as well as mode-specific content on
  [standard out](https://en.wikipedia.org/wiki/Standard_streams) as
  described below
- on failure: an exit code of ``1`` or greater. This includes both
  unexpected errors and any expected failure modes such as:
    - refusing to sign an message with invalid parameters
    - failure to validate a signature
    - etc

## Test Mode: 'canonicalize'

The ``canonicalize`` mode tests the implementation's ability to correctly
perform [Signature String construction](https://tools.ietf.org/html/draft-cavage-http-signatures-11#section-2.3)
, aka "canonicalisation".

Using the provided headers, the implementation must parse the input HTTP
Message and produce a Signature String on
[standard out](https://en.wikipedia.org/wiki/Standard_streams). Take care
not to emit a trailing newline character as the output must match the
expected Signature String exactly.

## Test Mode: 'sign'

The ``sign`` mode will be called with various command-line parameters on
the commandline such as a path to a key file, a keyId etc, as well as
the mesage to be signed on standard in.

The generator is expeced to emit an entire HTTP message including the
created ``Authorization: Signature`` header on standard out if the signature
is successfully created, or exit with a code of 1 or greater if an error
is produced.

## Test Mode: 'verify'

The ``verify`` mode will be called with a candidate signed HTTP message on
standard in, a path to a public key and the keyId for the provided key.

The generator is expeced to exit with code ``0`` on successful validation
of the message with the provided parameters, or ``1`` or greater if the
signature cannot be validated for any reason.

No output is expected on an exit code of ``0``.

# Running the Test Suite

1. Install the suite's dependencies and set it up for execution with
  ``npm install``
2. Copy the `config.json.example` file to `config.json` and provide
  the path of the generator.

Note: The path provided for the ``generator`` command must be executable, ie
can be launched from a commandline.

Once the suite is configured, launch the test suite with the command:

```shell
npm test
```

# Submit an Implementation Report

1. Create a fork of the repository <https://github.com/w3c-dvcg/http-signatures-test-suite> on GitHub.
2. ``npm install``
3. Copy the `config.json.example` file to `config.json` and modify.
4. ``npm run report``
5. Rename ``implementation/results.json`` to
   ``implementation/YOUR_IMPLEMENTATION-results.json``.
6. ``git add implementations/YOUR_IMPLEMENTATION-results.json`` and push to your forked repository
7. Submit a pull request for the results of your implementation to the master repository.

# Contributing

You may contribute to this test suite by submitting pull requests here:

<https://github.com/w3c-dvcg/http-signatures-test-suite/pulls>
