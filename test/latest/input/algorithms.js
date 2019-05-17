const algorithms = ['rsa', 'hmac', 'ecdsa'];
// https://w3c-dvcg.github.io/http-signatures/#hsa-registry
const registry = [
  {scheme: 'hs2019', deprecated: false},
  {scheme: 'rsa-sha1', deprecated: true},
  {scheme: 'rsa-sha256', deprecated: true},
  {scheme: 'hmac-sha256', deprecated: true},
  {scheme: 'ecdsa-sha256', deprecated: true}
];
exports.algorithms = algorithms;
exports.registry = registry;
