<template>
  <a-layout style="height: 100vh; width: 100vw">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu
        style="margin: 50px 0"
        v-model:selectedKeys="selectedKeys"
        @click="click_item"
        theme="dark"
        mode="inline"
      >
        <a-sub-menu v-for="item in category_1" :key="item.id">
          <template #title>
            <span>
              <user-outlined />
              <span>{{ item.name }}</span>
            </span>
          </template>
          <a-menu-item v-for="item_1 in item.children" :key="item_1.id">{{
            item_1.name
          }}</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout style="height: 100vh">
      <a-layout-header style="background: #202127; padding: 0; height: 10px"> </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ category_1_1 }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ category_1_2 }}</a-breadcrumb-item>
        </a-breadcrumb>

        <a-layout style="height: 100vh" v-if="idType > 0">
          <a-row justify="end">
            <a-col>
              <AButton style="margin: 3px 5px" @click="goToAbout">新增 </AButton>
              <AButton style="margin: 3px 5px" @click="count++">导出清单 </AButton>
            </a-col>
          </a-row>

          <a-table
            :columns="columns"
            :data-source="dataSource"
            :scroll="{ x: 1000, y: 700 }"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <span>
                  <a-popconfirm
                    v-if="dataSource.length"
                    title="您确定要删除 ?"
                    @confirm="onDelete(record)"
                  >
                    <a>Delete</a>
                  </a-popconfirm>
                  <a-divider type="vertical" />
                  <a @click="onEdit(record)">Edit</a>
                  <a-divider type="vertical" />
                  <a @click="onAction(record)">action</a>
                  <a-divider type="vertical" />
                </span>
              </template>
            </template>
          </a-table>
          <a-modal
            :visible="modal2Visible"
            @update:visible="(val) => (modal2Visible = val)"
            v-model:open="modal2Visible"
            :title="'物品名称：' + current_record.name"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            :loading="loading"
            :disabled="loading"
          >
            <!--      <p>{{ modalText }}</p>-->

            <a-radio-group style="margin: 15px 0" v-model:value="record_type">
              <a-radio value="1">出库</a-radio>
              <a-radio value="2">入库</a-radio>
            </a-radio-group>
            <a-row align="middle" style="margin: 15px 0">
              <a-col :span="5">{{ record_type === '1' ? '出库数量' : '入库数量' }}</a-col>
              <a-col :span="12">
                <a-input-number
                  style="width: 100%"
                  v-model:value="formState.amount"
                  :min="0"
                  :max="1000000"
              /></a-col>
            </a-row>
            <a-row align="middle" style="margin: 15px 0">
              <a-col :span="5"> 操作人</a-col>
              <a-col :span="12">
                <a-input v-model:value="formState.name" placeholder="姓名" />
              </a-col>
            </a-row>
          </a-modal>
        </a-layout>
        <a-layout v-if="idType === -2">
          <a-row justify="end">
            <a-col>
              <AButton style="margin: 3px 5px" @click="count++">导出记录 </AButton>
            </a-col>
          </a-row>

          <a-table
            :columns="columns_record"
            :data-source="dataSource_record"
            :scroll="{ x: 1000, y: 700 }"
            size="middle"
          >
            <template #bodyCell="{ column, record }"> </template>
          </a-table>
        </a-layout>

        <a-layout style="height: 100vh" v-if="idType === -4">
          <a-descriptions title="服务信息">
            <a-descriptions-item label="联系电话：">19940891022</a-descriptions-item>
            <a-descriptions-item label="客服QQ：">969439608</a-descriptions-item>
            <a-descriptions-item label="系统版本：">V 1.0.0</a-descriptions-item>
            <a-descriptions-item label="Address">
              ChengDu, SiChuan, China
            </a-descriptions-item>
          </a-descriptions>
        </a-layout>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        实验室仓库管理系统 ©2025 Created by 福源科技
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
// import amad from './demo//mode/5.vue'
const confirmLoading = ref(false)

// import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, onBeforeUnmount, onActivated, reactive } from 'vue'
const collapsed = ref(false)
//上一个选中的key
const selectedKeys = ref(['1'])
const count = ref(0)
// 数据库缓存
const category = ref([])
//列表栏
const category_1 = ref([])
// 标签1
const category_1_1 = ref('理化试剂耗材')
//标签2
const category_1_2 = ref('理化试剂')
const columns = ref([])
const columns_record = ref([])
const dataSource = ref([])
const dataSource_record = ref([])

import { useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()

const formState = reactive({})
const record_type = ref('1')

const goToAbout = () => {
  router.push({
    name: 'Articles',
    query: {
      category_1: JSON.stringify(category_1.value) // 将 JSON 转换为字符串
    }
  })
}
const onDelete = (record) => {
  console.log(record)
  delectXX(record)
}
const onEdit = (record) => {
  console.log('onEdit', record)
  router.push({
    name: 'EditArticles',
    query: {
      category_1: JSON.stringify(category_1.value), // 将 JSON 转换为字符串
      record: JSON.stringify(record) // 将 JSON 转换为字符串
    }
  })
  // editableData[key] = dataSource.value.filter((item) => key === item.key)[0]
}
// const emit = defineEmits(['return-data'])
onActivated(() => {
  console.log('接收到子组件的数据:')
  query(current_item)
})

const current_record = ref({})
const modal2Visible = ref(false)

const onAction = (record) => {
  console.log('onAction', record)
  current_record.value = record

  if (modal2Visible.value === false) {
    modal2Visible.value = true
  } else {
    modal2Visible.value = false
  }
}
const handleOk = (e) => {
  console.log(e)
  console.log(formState)
  if (!formState.amount || formState.amount === 0) {
    notification.open({
      message: '      ERR：  ',
      description: '数量不能为空 !!',
      duration: 5,
      style: {
        backgroundColor: '#ff9',
        borderRadius: '8px',
        color: '#000',
        border: '1px solid #d9d9d9'
      }
    })
    return
  }
  if (!formState.name || formState.name === 0) {
    notification.open({
      message: '      ERR：  ',
      description: '操作人姓名不能为空 !!',
      duration: 5,
      style: {
        backgroundColor: '#ff9',
        borderRadius: '8px',
        color: '#000',
        border: '1px solid #d9d9d9'
      }
    })
    return
  }

  if (record_type.value === '1' && formState.amount > current_record.value.amount) {
    notification.open({
      message: '      ERR：  ',
      description: '库存数量不足 !!',
      duration: 5,
      style: {
        backgroundColor: '#ff9',
        borderRadius: '8px',
        color: '#000',
        border: '1px solid #d9d9d9'
      }
    })
    return
  }
  // record_type
  //formState.amount
  let cureent_amount = 0
  if (record_type.value === '1') {
    cureent_amount = current_record.value.amount - formState.amount
  } else {
    cureent_amount = current_record.value.amount + formState.amount
  }
  let arg1 = [cureent_amount, current_record.value.id, current_record.value.amount]
  let arg2 = [
    current_record.value.name,
    current_record.value.id,
    record_type.value,
    dayjs().format('YYYY-MM-DD HH:mm:ss'),
    formState.amount,
    dayjs().format('YYYY-MM-DD HH:mm:ss'),
    formState.name
  ]
  updateAmountAndRecord(arg1, arg2)
  // modal2Visible.value = false

  // {access_type: '1', amount: 1, name: '11111'}
}
const loading = ref(false)

//更新剩余量
const updateAmountAndRecord = (arg1, arg2) => {
  console.log(arg1, arg2)

  loading.value = true

  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
    loading.value = false
  }

  // let params = []
  // console.log('key', params.length, params)

  let promise = window.db.updateAmountAndRecord(arg1, arg2)

  promise
    .then((result) => {
      console.log('updateAmountAndRecord result ', result)
      // data.value = result
      // open(keys[1])

      notification.open({
        message: '通知：  ',
        description: result === 0 ? '出入库登记完成！' : '保存失败了 !!',
        duration: 5,
        style: {
          backgroundColor: result === 0 ? '#f9f' : '#fff',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
      query(current_item)
      // const data = { message_type: 1};
      // emit('return-data', data); // 触发事件并传递数据
      modal2Visible.value = false
    })
    .catch((error) => {
      console.error('query error ', error.message)
      notification.open({
        message: '通知：  ',
        description: '出入库失败了!!!',
        style: {
          backgroundColor: 'aquamarine',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })

      loading.value = false
      modal2Visible.value = false
    })
}

var current_item = {}
const idType = ref(1)
const click_item = (item) => {
  console.log(item)
  //更新标题
  category.value.forEach((item_1) => {
    if (item_1.id === item.keyPath[0]) {
      console.log(item_1.name)
      category_1_1.value = item_1.name
    }
    if (item_1.id === item.keyPath[1]) {
      console.log(item_1.name)
      category_1_2.value = item_1.name
    }
  })
  idType.value = item.keyPath[1]
  if (item.keyPath[1] < 0) {
    queryRecord()
    return
  }
  current_item = item.keyPath[1]

  console.log(item.keyPath[0], item.keyPath[1])
  query(item.keyPath[1])

  //上一个选中的id
  // let key_id  = selectedKeys.value[0]
  // console.log(key_id)
}
// 类别id category_id
// 名称 name
// 编号（或CAS）  number
// 规格 specification
// 数量 amount
// 浓度 concentration
// 生产厂家 manufacturer
// 生产日期 produced_date
// 批号 batch_number
// 有效期至 expiry_date
// 入库人   in_name
// 入库时间 in_date
// 出库人 out_name

// 出库时间 out_date
// 存放地点 storage_place
// 存放条件 storage_condition
// 备注 art_comment
// 记录时间 record_time

const columns_1 = [
  {
    title: '物品名称',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left'
  },
  {
    title: '编号',
    width: 100,
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 100
  },
  {
    title: '剩余数量',
    dataIndex: 'amount',
    key: 'amount',
    width: 100
  },
  {
    title: '浓度',
    dataIndex: 'concentration',
    key: 'concentration',
    width: 100
  },
  {
    title: '生产厂家',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    width: 100
  },
  {
    title: '生产日期',
    dataIndex: 'produced_date',
    key: 'produced_date',
    width: 100
  },
  {
    title: '批号',
    dataIndex: 'batch_number',
    key: 'batch_number',
    width: 100
  },
  {
    title: '有效期至',
    dataIndex: 'expiry_date',
    key: 'expiry_date',
    width: 100
  },
  {
    title: '登记人',
    dataIndex: 'in_name',
    width: 100,

    key: 'in_name'
  },
  {
    title: '登记时间',
    dataIndex: 'in_date',
    width: 100,
    key: 'in_date'
  },
  // {
  //   title: '出库人',
  //   dataIndex: 'out_name',
  //   width: 100,
  //   key: 'out_name'
  // },
  // {
  //   title: '出库时间',
  //   dataIndex: 'out_time',
  //   width: 100,
  //
  //   key: 'out_time'
  // },
  {
    title: '备注',
    dataIndex: 'art_comment',
    width: 100,

    key: 'art_comment'
  },
  {
    title: '存放条件',
    dataIndex: 'storage_condition',
    width: 100,

    key: 'storage_condition'
  },
  {
    title: '存放地点',
    dataIndex: 'storage_place',
    width: 100,
    key: 'storage_place'
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 200
  }
]
//
columns.value = columns_1

const columns_1_record = [
  {
    title: '物品名称',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left'
  },
  {
    title: '编号',
    width: 100,
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '剩余数量',
    dataIndex: 'amount',
    key: 'amount',
    width: 100
  },
  {
    title: '生产日期',
    dataIndex: 'produced_date',
    key: 'produced_date',
    width: 100
  },
  {
    title: '出库 or 入库',
    dataIndex: 'in_out',
    key: 'in_out',
    width: 100
  },

  {
    title: '时间',
    dataIndex: 'in_out_date',
    key: 'in_out_date',
    width: 100
  },
  {
    title: '数量',
    dataIndex: 'in_out_amount',
    key: 'in_out_amount',
    width: 100
  },
  {
    title: '操作人',
    width: 100,
    dataIndex: 'record_name',
    key: 'record_name',
    fixed: 'right'
  }
]

columns_record.value = columns_1_record
//删除物品
const delectXX = (record) => {
  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
  }
  console.log('key', record)

  let promise = window.db.get(' delete  from  articles  where id = ? ', [record.id])

  promise
    .then((result) => {
      console.log('query result ', result)
      dataSource.value = dataSource.value.filter((item) => item.id !== record.id)
      notification.open({
        message: '通知：  ',
        description: '删除成功～',
        style: {
          backgroundColor: '#fdd',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
    })
    .catch((error) => {
      console.error('query error ', error.message)
      notification.open({
        message: '通知：  ',
        description: '删除失败～',
        style: {
          backgroundColor: '#909090',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
    })
}

//
// for (let i = 0; i < 100; i++) {
//   data.value.push({
//     key: i,
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`
//   })
// }
// const handleResize = () => {
//
//   console.log( aLoyoutContent.value)
//
//   if (aLoyoutContent.value) {
//     scrollxy.value.y = aLoyoutContent.value.offsetHeight
//     console.log(aLoyoutContent.value)
//   }
//   console.log(` handleResize is now resize.`)
// };

// 创建 ResizeObserver 实例
// let resizeObserver;

onMounted(() => {
  // if (aLoyoutContent.value) {
  //   resizeObserver = new ResizeObserver((entries) => {
  //     console.log(` ResizeObserver is now resize.`)
  //     for (const entry of entries) {
  //       scrollxy.value.y = entry.target.offsetHeight;
  //     }
  //   });
  //   resizeObserver.observe(aLoyoutContent.value)
  // }

  // window.addEventListener('resize', handleResize);
  // console.log( aLoyoutContent.value)
  //
  // if (aLoyoutContent.value) {
  //   console.log( "scrollxy.value.y ",scrollxy.value.y)
  //
  //   console.log( "offsetHeight",aLoyoutContent.value.offsetHeight)
  //   scrollxy.value.y = aLoyoutContent.value.offsetHeight
  //   console.log( "scrollxy.value.y ",scrollxy.value.y)
  //
  // }
  ipcHandle()
  query(5)
  console.log(`the component is now mounted.`)
})

// window.onload = function () {
//   const element = document.getElementById('aLoyoutContent');
//   const height = element.offsetHeight
//   console.log(window.onload,height);
// };

onBeforeUnmount(() => {
  // window.removeEventListener('resize', handleResize);
})
//查询数据
const query = (key) => {
  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
  }
  console.log('key', key)

  let promise = window.db.all('select * from  articles where category_id = ?', [key])

  promise
    .then((result) => {
      console.log('query result ', result)
      // result.forEach((item) => {
      //   item
      // })
      dataSource.value = result
    })
    .catch((error) => {
      console.error('query error ', error.message)
    })
}

//查询数据
const queryRecord = (key) => {
  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
  }
  console.log('key', key)

  let promise = window.db.all(
    'select * from  records left join articles on articles.id = records.articles_id  order by records.id DESC;',
    [key]
  )

  promise
    .then((result) => {
      console.log('query result ', result)

      result.forEach((item) => {
        if (item.in_out === '1') {
          item.in_out = '出库'
        } else if (item.in_out === '2') {
          item.in_out = '入库'
        }
      })

      dataSource_record.value = result
    })
    .catch((error) => {
      console.error('query error ', error.message)
    })
}

// 刷新栏目
const ipcHandle = () => {
  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
  } else {
    console.log('window.db ok!')
    let promise = window.db.all('select * from  category ', [])
    promise
      .then((result) => {
        category.value = result
        category.value.push(
          {
            name: '系统管理',
            id: -1,
            parent_id: 0
          },
          { name: '出入库记录', id: -2, parent_id: -1 },
          {
            name: '售后服务',
            id: -3,
            parent_id: 0
          },
          { name: '关于我们', id: -4, parent_id: -3 }
        )

        let category_cache = []

        result.forEach((item) => {
          // console.log(item)
          if (item.parent_id == 0) {
            item.children = []
            category_cache.push(item)
          }
        })

        result.forEach((item) => {
          // console.log(item)
          category_cache.forEach((item_1) => {
            if (item_1.id == item.parent_id) {
              item_1.children.push(item)
            }
          })
        })
        category_1.value = category_cache
        console.log('category_cache ', category_cache)
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
</script>
<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
