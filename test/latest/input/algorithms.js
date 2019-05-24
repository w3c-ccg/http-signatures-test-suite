const algorithms = ['rsa', 'hmac', 'ecdsa'];
exports.algorithms = algorithms;

// https://w3c-dvcg.github.io/http-signatures/#hsa-registry
const registry = [
  {scheme: 'hs2019', deprecated: false},
  {scheme: 'rsa-sha1', deprecated: true},
  {scheme: 'rsa-sha256', deprecated: true},
  {scheme: 'hmac-sha256', deprecated: true},
  {scheme: 'ecdsa-sha256', deprecated: true}
];
exports.registry = registry;

const keys = {
  base: 'test/keys',
  private: {
    RSA: 'rsa.private',
    P256: 'P256.private',
    ED25519: 'ed25519.private',
    ECDSA: 'koblitzCurve.private'
  },
  public: {
    RSA: 'rsa.pub',
    P256: 'P256.pub',
    ED25519: 'ed25519.pub',
    ECDSA: 'koblitzCurve.pub'
  }
};
exports.keys = keys;
