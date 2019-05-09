const algorithms = ['rsa', 'hmac', 'ecdsa'];
// https://w3c-dvcg.github.io/http-signatures/#hsa-registry
const registry = [
  'hs2019',
  'rsa-sha1',
  'rsa-sha256',
  'hmac-sha256',
  'ecdsa-sha256'
];
exports.algorithms = algorithms;
exports.registry = registry;
