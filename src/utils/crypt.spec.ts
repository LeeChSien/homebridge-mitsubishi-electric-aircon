import { encrypt, decrypt } from './crypt.js';

it('encrypt / decrypt should work', () => {
  const payload = '<CSV><CONNECT>ON</CONNECT></CSV>'
  const encrypted = encrypt(payload)
  expect(decrypt(encrypted)).toBe(payload)
})
