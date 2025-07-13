import crypto from 'crypto'
const privateKey =
  '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
  '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\n' +
  '-----END ENCRYPTED PRIVATE KEY-----\n'

import fs from 'fs'
const decryptedss = (data) => {
  const decodedData = Buffer.atob(data, 'base64')
  console.log('解码后的数据:', decodedData)

  // const privateKey = fs.readFileSync('./private.pem', 'utf8')
  // 使用私钥解密
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: 'my-passphrase' // 如果私钥加密了，需要提供密码
    },
    decodedData
  )
  console.log('解密后的数据:', decrypted.toString('utf8'))
  return JSON.parse(decrypted.toString('utf8'))
}
export { decryptedss }
// let data = "slHYiADjYHCzIRp6OIPJt6cfj5fgT3zOPqI9JvOSY1pXLGfQJzB2CCCpg28GodaqcLfN4TGi0Dh0f/fRBLvh0Bpk1te5t5sP/TnbQq7mxO2tPe2VHFVg1wG4m7alw8kkjCDgoJA/kUG64EmQ//gbZuryY0BmpIWGNDPDoVyim+3ZpxvXvbG73z5HoTf/IKUoJ1VtkjkRrbjhzsGkFcGbgYPNVEvpuKKnmwSUhYulJMUNHaZkdfuVtg8mh4+eiAPfSxwouuX3B6mOxk9/68z9eKKtuCuRqR7S0xRY2yU+LoVtiC+y9JPqNgnQCbJU8bls+3Dec79jNhTFtBhFCuyQoQ==\n" +
//   "\n"
// decryptedss(data)
