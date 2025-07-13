import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const fs = require('fs')
const path = require('path')
import sqlite3, { OPEN_CREATE } from 'sqlite3'
// const { Sequelize } = require('sequelize')
import { decryptedss } from './encry.js'

const category =
  'CREATE TABLE IF NOT EXISTS category (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
  'name TEXT NOT NULL,' +
  'parent_id INTEGER' +
  ');'
const articles =
  'CREATE TABLE IF NOT EXISTS articles (' +
  ' id INTEGER PRIMARY KEY AUTOINCREMENT,' +
  ' category_id INTEGER,' +
  ' name TEXT NOT NULL,' +
  ' number TEXT ,' +
  ' specification TEXT ,' +
  ' amount REAL ,' +
  ' concentration TEXT ,' +
  ' manufacturer TEXT ,' +
  ' produced_date TEXT ,' +
  ' batch_number TEXT ,' +
  ' expiry_date TEXT ,' +
  ' in_name TEXT ,' +
  ' in_date TEXT ,' +
  ' out_name TEXT ,' +
  ' out_date TEXT ,' +
  ' storage_place TEXT ,' +
  ' storage_condition TEXT ,' +
  ' art_comment TEXT ,' +
  ' record_time TEXT' +
  ');'
const records =
  'CREATE TABLE IF NOT EXISTS records (' +
  'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
  'name TEXT NOT NULL,' +
  'articles_id INTEGER,' +
  'in_out TEXT,' +
  'in_out_date TEXT,' +
  'in_out_amount REAL,' +
  'record_time TEXT,' +
  'record_name TEXT' +
  ');'

const categorys =
  "INSERT INTO category (id,name, parent_id) VALUES (1,'理化试剂耗材', 0);" +
  "INSERT INTO category (id,name, parent_id) VALUES (2,'微生物试剂耗材', 0);" +
  "INSERT INTO category (id,name, parent_id) VALUES (3,'临床试剂耗材', 0);" +
  "INSERT INTO category (id,name, parent_id) VALUES (4,'通用试剂耗材', 0);" +
  "INSERT INTO category (id,name, parent_id) VALUES (5,'理化试剂', 1);" +
  "INSERT INTO category (id,name, parent_id) VALUES (6,'理化耗材', 1);" +
  "INSERT INTO category (id,name, parent_id) VALUES (7,'微生物试剂', 2);" +
  "INSERT INTO category (id,name, parent_id) VALUES (8,'微生物耗材', 2);" +
  "INSERT INTO category (id,name, parent_id) VALUES (9,'临床试剂', 3);" +
  "INSERT INTO category (id,name, parent_id) VALUES (10,'临床耗材', 3);" +
  "INSERT INTO category (id,name, parent_id) VALUES (11,'通用试剂', 4);" +
  "INSERT INTO category (id,name, parent_id) VALUES (12,'通用耗材', 4);"

// ;(async () => {
// 这里写异步代码
// })();

console.log('Backup start')
console.log('sqlite3.Database', sqlite3)
// 定义要创建的文件夹路径
// const folderPath = path.join(__dirname, 'database')
const folderPath = path.join('C:\\', 'database')
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
  console.log('文件夹创建成功')
} else {
  console.log('文件夹已存在')
}
const dbPath = path.join('C:\\', 'database/database.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connected to the database.')
  }
})
console.log('database ->', db)
db.run(category, (err) => {
  if (err) {
    console.error('创建表时出错:', err.message)
  } else {
    console.log('表创建成功')
    db.exec(categorys, (err) => {
      if (err) {
        console.error('数据加载出错:', err.message)
      } else {
        console.log('数据加载成功')
      }
    })
  }
})
db.run(articles, (err) => {
  if (err) {
    console.error('创建表时出错:', err.message)
  } else {
    console.log('表创建成功')
  }
})
db.run(records, (err) => {
  if (err) {
    console.error('创建表时出错:', err.message)
  } else {
    console.log('表创建成功')
  }
})

console.log('Backup completed')

// // 方法 2: 分别传递参数 (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: dbPath
// })
//
// ;(async () => {
// // 这里写异步代码
//   try {
//     sequelize.authenticate()
//     console.log('sequelize Connection has been established successfully.')
//   } catch (error) {
//     console.error('sequelize Unable to connect to the database:', error)
//   }
// })();

// 暴露数据库操作给渲染进程
contextBridge.exposeInMainWorld('db', {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        console.log('db.run - >', err)
        if (err) {
          console.error(err.message)
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, function (err) {
        if (err) {
          console.error(err.message)
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          console.error(err.message)
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  },
  updateAmountAndRecord: (arg1, arg2) => {
    return new Promise((resolve, reject) => {
      // 开始事务
      db.serialize(() => {
        db.run('BEGIN TRANSACTION')

        const UPDATE = db.prepare('UPDATE articles SET  amount =?   where id = ? and amount = ? ;')
        UPDATE.run(arg1, (err) => {
          if (err) {
            console.log('IN333SERT', err)

            // 发生错误，回滚事务
            db.run('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                reject(err)
                console.error('UPDATE', rollbackErr.message)
              }
              console.log('Transaction rolled back due to error.')
            })
          }
        })
        UPDATE.finalize()

        const INSERT = db.prepare(
          'INSERT INTO records (name, articles_id,in_out,in_out_date,in_out_amount,record_time,record_name) VALUES (?,?,?, ?,?,?,?);'
        )
        INSERT.run(arg2, (err) => {
          if (err) {
            console.log('IN111SERT', err)

            // 发生错误，回滚事务
            db.run('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                console.error('INSERT', rollbackErr.message)
                reject(err)
              }
              console.log('Transaction rolled back due to error.')
            })
          }
        })
        INSERT.finalize()

        // 提交事务
        db.run('COMMIT', (err) => {
          console.log('COM222MIT', err)

          if (err) {
            console.error('COMMIT', err.message)
            reject(err)
          } else {
            resolve(0)
            console.log('Transaction committed successfully.')
          }
        })
      })
    })
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error(err.message)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
})

contextBridge.exposeInMainWorld('fykj', {
  mima: (data) => {
    try {
      let res = decryptedss(data)
      console.log(res)
      return res
    } catch (e) {
      return undefined
    }
  }})

// 暴露 showSaveDialog 方法到渲染进程
contextBridge.exposeInMainWorld('dialog', {
  showSaveDialog: (columns, data, options) =>
    ipcRenderer.invoke('show-save-dialog', columns, data, options)
})

contextBridge.exposeInMainWorld('electronAPI', {
  getDeviceId: () => ipcRenderer.invoke('get-device-id')
})

// Custom APIs for renderer
const api = {}
// const database = { sqlite3: sqlite3 }

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  console.log('process.contextIsolated true')
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('database', database)
  } catch (error) {
    console.error(error)
  }
} else {
  console.log('process.contextIsolated false')
  window.electron = electronAPI
  // window.dialog = dialog
  // window.sequelize = sequelize
  window.api = api
}
