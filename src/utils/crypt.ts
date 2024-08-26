import CryptoJS from 'crypto-js'
import Utf8 from 'crypto-js/enc-utf8.js';
import Hex from 'crypto-js/enc-hex.js';
import AES from 'crypto-js/aes.js';
import Base64 from 'crypto-js/enc-base64.js'

const KEY_SIZE = 16

const getCryptoKey = () => {
  const STATIC_KEY = "unregistered"
  const buffer = Buffer.alloc(KEY_SIZE);
  buffer.write(STATIC_KEY)
  return Utf8.parse(buffer.toString())
}

export const encrypt = (payload: string) => {
  const randomWord = CryptoJS.lib.WordArray.random(KEY_SIZE)
  const key = getCryptoKey()
  let encrypted = AES.encrypt(payload, key, {
    mode: CryptoJS.mode.CBC,
    iv: randomWord,
    padding: CryptoJS.pad.ZeroPadding,
    keySize: KEY_SIZE,
  }).toString()
  encrypted = Hex.stringify(randomWord) + Hex.stringify(Base64.parse(encrypted));
  return Base64.stringify(Hex.parse(encrypted))
}

export const decrypt = (payload: string) => {
  const hexBuffer = Buffer.from(payload, 'base64').toString('hex')
  const iv = Hex.parse(hexBuffer.slice(0, 2 * KEY_SIZE))
  const key = getCryptoKey()
  let decrypted = AES.decrypt(payload, key, {
    mode: CryptoJS.mode.CBC,
    iv,
    padding: CryptoJS.pad.ZeroPadding,
    keySize: KEY_SIZE,
  }).toString(Hex)
  decrypted = decrypted.slice(2 * KEY_SIZE, decrypted.length)
  return Buffer.from(decrypted, 'hex').toString('utf8')
}