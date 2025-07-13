const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');

// 添加表头
worksheet.columns = [
  { header: 'Name', key: 'name', width: 20 },
  { header: 'Age', key: 'age', width: 10 },
  { header: 'City', key: 'city', width: 20 }
];

// 添加数据
const data = [
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { name: 'Mike Johnson', age: 40, city: 'Chicago' }
];

data.forEach(row => worksheet.addRow(row));

const fs = require('fs')
const path = require('path')
const folderPath = path.join('./', 'outfile')
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
  console.log('文件夹创建成功')
} else {
  console.log('文件夹已存在')
}
const file = path.join('./outfile', 'output.xlsx')
// 保存文件
workbook.xlsx.writeFile(file)
  .then(() => {
    console.log('Excel 文件已成功导出！');
  })
  .catch(err => {
    console.error('导出失败:', err);
  });
