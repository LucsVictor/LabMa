// npm install xlsx

const XLSX = require('xlsx');
const fs = require('fs')
const path = require('path')
const folderPath = path.join('./', 'outfile')
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
  console.log('文件夹创建成功')
} else {
  console.log('文件夹已存在')
}

// 示例数据
const data = [
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { name: 'Mike Johnson', age: 40, city: 'Chicago' }
];

// 将数据转换为工作表
const worksheet = XLSX.utils.json_to_sheet(data);

// 创建一个新的工作簿
const workbook = XLSX.utils.book_new();

// 将工作表添加到工作簿中
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

const fol = path.join('./outfile', 'output.xlsx')
// 将工作簿写入文件
XLSX.writeFile(workbook, fol);

console.log('Excel 文件已成功导出！');
