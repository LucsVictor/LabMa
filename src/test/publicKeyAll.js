const crypto = require('crypto')
const fs = require('fs')

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // 密钥长度
  publicKeyEncoding: {
    type: 'spki', // 格式
    format: 'pem' // 编码格式
  },
  privateKeyEncoding: {
    type: 'pkcs8', // 格式
    format: 'pem', // 编码格式
    cipher: 'aes-256-cbc', // 加密算法（可选）
    passphrase: 'my-passphrase' // 加密密码（可选）
  }
})

// 保存公钥到文件
fs.writeFileSync('./public.pem', publicKey)
console.log('公钥已保存到 public.pem')

// 保存私钥到文件
fs.writeFileSync('./private.pem', privateKey)
console.log('私钥已保存到 private.pem')
