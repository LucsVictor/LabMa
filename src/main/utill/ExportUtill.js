const ExcelJS = require('exceljs')
const { Notification } = require('electron')

const exportData = (columns, data, filePath) => {
  // // 添加表头
  // worksheet.columns = [
  //   { header: 'Name', key: 'name', width: 20 },
  //   { header: 'Age', key: 'age', width: 10 },
  //   { header: 'City', key: 'city', width: 20 }
  // ]
  //
  // // 添加数据
  // const data = [
  //   { name: 'John Doe', age: 30, city: 'New York' },
  //   { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  //   { name: 'Mike Johnson', age: 40, city: 'Chicago' }
  // ]
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  worksheet.columns = JSON.parse(columns)
  worksheet.columns.forEach((column) => {
    column.width = 20
  })
  data = JSON.parse(data)

  data.forEach((row) => worksheet.addRow(row))

  try {
    // 将工作簿写入文件 这里是异步的
    workbook.xlsx
      .writeFile(filePath)
      .then((err) => {
        console.log('文件保存成功========', err)

        new Notification({ title: '提醒', body: '文件保存成功' }).show()

        return true
      })
      .catch((err) => {
        console.log('文件保存失败========', err)
        new Notification({ title: '提醒', body: '文件保存失败' }).show()
        return false
      })
    // console.log('文件保存成功:')
  } catch (err) {
    console.error('保存文件失败:', err)
    new Notification({ title: '提醒', body: '保存文件失败' }).show()
    return false
  }
}

export { exportData }
