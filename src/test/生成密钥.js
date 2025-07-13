const crypto = require('crypto')
const fs = require('fs')
const dayjs = require('dayjs')

// 读取公钥和私钥
const publicKey = fs.readFileSync('./public.pem', 'utf8')
const privateKey = fs.readFileSync('./private.pem', 'utf8')

// 要加密的数据
let time = dayjs().format('YYYY-MM-DD')
time = '2025-5-30'
let data = JSON.stringify({
  validity: time,
  deviceId: 'bdd7b1f8fd4752de76f111fb94584ef4a2af98b79e68579205a2061e0adf1b7d'
})
// 4717ae388a08d6d69f5da6ab1bf5b50b16ceb3d7cd90ecfc6aa07c977d87cb9d
// 4717ae388a08d6d69f5da6ab1bf5b50b16ceb3d7cd90ecfc6aa07c977d87cb9d
// bdd7b1f8fd4752de76f111fb94584ef4a2af98b79e68579205a2061e0adf1b7d
// 使用公钥加密
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data))
// console.log(encrypted)
// console.log('加密后的数据:', Buffer.from(encrypted).toString('base64'))

data = encrypted.toString('base64')
console.log(data)
// data = " kHdgFdM9DKllQ6LyLrxBcyJvMFAQrFjqK9/FDxgkJZ+6gsmIdjFab/fr0hzj+SFXhTdhc+uYNkwGEqLdXRrllxHrsRC3LrgTY2fRyLeV7Si68u5jp1IIH/kXhCtsciOA9/XhsA5GWuj0UE6KZSIGA4vSmSjikuPYO1/4+/AQZD7fIumROvUKYhgIar3JP9gibUP2KdH6M2DKg7aR18OyzqKsSDsPGYuQqUg2ssW2oujq55/Im98ALmvHcIGUb0u98vKWcscgMQDSSm3BaG7PKHHte/8tut9U+51MHooq4WEGyrmnUPDBsq/R3ayBwIcNYW3h10tprO3DNLDg==\n"
// data =  "jQBQJctFaPjYln4PyOma0MVU47W7sbLHAE0b5OQ7lh65KLLyV/VizTVY6g+J71SARjA2DGkAxRbu7VClavPR6KYKgP7xYqaQNJbTz3YHb47HI8nzAjRmpsA3DZisnpW8H8dy1w1kx8SbHceliNB6I7WX88memkNgRoE73I5UDyIxedMeVPeQkVuQaQkzgeq2Tpid2DMjudgHM7pIaU0KuDvYjzfrTo/N8q0U5oITClDVz4im04gSi7SkLAWwgIVoHIXGKpqQUR5WVq41rJFQ7aAyaI4HqlbdPz4Oyk7TAvsNTpT3aiz/i9z4kqkKzBbICyYxtNKv/HMT5y9A==" +
//   "\n"
// data = "slHYiADjYHCzIRp6OIPJt6cfj5fgT3zOPqI9JvOSY1pXLGfQJzB2CCCpg28GodaqcLfN4TGi0Dh0f/fRBLvh0Bpk1te5t5sP/TnbQq7mxO2tPe2VHFVg1wG4m7alw8kkjCDgoJA/kUG64EmQ//gbZuryY0BmpIWGNDPDoVyim+3ZpxvXvbG73z5HoTf/IKUoJ1VtkjkRrbjhzsGkFcGbgYPNVEvpuKKnmwSUhYulJMUNHaZkdfuVtg8mh4+eiAPfSxwouuX3B6mOxk9/68z9eKKtuCuRqR7S0xRY2yU+LoVtiC+y9JPqNgnQCbJU8bls+3Dec79jNhTFtBhFCuyQoQ==\n" +
// "\n"

const decodedData = Buffer.from(data, 'base64');
// console.log('解码后的数据:', decodedData);

// 使用私钥解密
const decrypted = crypto.privateDecrypt(
  {
    key: privateKey,
    passphrase: 'my-passphrase' // 如果私钥加密了，需要提供密码
  },
  decodedData
)
console.log('解密后的数据:', decrypted.toString('utf8'))


// /usr/local/bin/node /Users/wote/WebstormProjects/Store/StoreManage/src/renderer/src/test/EncryptAAa.js
// <Buffer 90 77 60 15 d3 3d 0c a9 65 43 a2 f2 2e bc 41 73 22 6f 30 50 10 ac 58 ea 2b df c5 0f 18 24 25 9f ba 82 c9 88 76 31 5a 6f f7 eb d2 1c e3 f9 21 57 85 37 ... 206 more bytes>
// 加密后的数据: 解码后的数据: <Buffer 90 77 60 15 d3 3d 0c a9 65 43 a2 f2 2e bc 41 73 22 6f 30 50 10 ac 58 ea 2b df c5 0f 18 24 25 9f ba 82 c9 88 76 31 5a 6f f7 eb d2 1c e3 f9 21 57 85 37 ... 206 more bytes>
// 解密后的数据: {"validity":"2025-03-24","deviceId":"2c98c08e8ed962552f7edd97977683b2"}
//
// 进程已结束，退出代码为 0



