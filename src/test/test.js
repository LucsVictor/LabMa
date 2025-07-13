import pinyin from 'pinyin'

const chineseWords = ['北京', '上海', '广州', '深圳'];

// const sortedWords = chineseWords.sort((a, b) => {
//   const pinyinA = pinyin(a, { style: pinyin.STYLE_NORMAL }).join('');
//   const pinyinB = pinyin(b, { style: pinyin.STYLE_NORMAL }).join('');
//   return pinyinA.localeCompare(pinyinB);
// });

console.log(pinyin.compare("李氏","张三"));
