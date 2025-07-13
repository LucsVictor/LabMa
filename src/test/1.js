import CryptoJS from 'crypto-js';

// AES 加密
const encrypted = CryptoJS.AES.encrypt('Hello, World!', 'secret-key').toString();
console.log('加密后的数据:', encrypted);

// AES 解密
const decrypted = CryptoJS.AES.decrypt(encrypted, 'secret-key').toString(CryptoJS.enc.Utf8);
console.log('解密后的数据:', decrypted);
