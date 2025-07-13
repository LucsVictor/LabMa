<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="新增物品"
    sub-title="    "
    @back="
      () => {
        router.back()
      }
    "
  />
  <div style="margin: 21px 100px;">
    <a-form ref="formRef" :model="formState" @finish="onFinish" @keydown="handleKeyDown">
      <a-row :gutter="24">
        <template v-for="(item,index) in columns_1" :key="item.key">
          <a-col :span="8">
            <a-form-item
              :name="item.key"
              :label="item.title"
              :rules="[{ required: item.required, message: '必填项！' }]"
            >

              <a-auto-complete
                :options="options"
                @search="onSearch"
                :ref = "inputs[item.id]"
                v-if="item.type === 1"
                v-model:value="formState[item.key]"
                placeholder=" "
              ></a-auto-complete>
              <a-date-picker
                :ref = "inputs[item.id]"  :locale="locale"  v-if="item.type === 2" v-model:value="formState[item.key]" />
              <a-cascader
                :ref = "inputs[item.id]"
                v-if="item.type === 3"
                v-model:value="formState[item.key]"
                :options="category_1"
                expand-trigger="hover"
                placeholder="Please select"
              />
              <a-input-number
                :ref = "inputs[item.id]"
                v-if="item.type === 4"
                style="width: 100%"
                v-model:value="formState[item.key]"
                :min="0"
                :max="1000000"
              />
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" :loading="loading" :disabled="loading" html-type="submit"
            >提交保存</a-button
          >
          <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">清空重填</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <contextHolder />
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
const cureentRoute = useRoute()
const router = useRouter()

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zhCN.locale')

// const now = new Date()
// console.log(format(now, 'yyyy-MM-dd')); // 输出: "2023-10-05"
import { onMounted, reactive, ref } from 'vue'
const formRef = ref()

const inputs = ref([]);

// 设置预选词语
const options = ref([])
// Key
const auto_complete_key = 'auto_complete'
//预选词语
var auto_complete_words = []
const  get_auto_complete_words = async () => {
  let sss = JSON.parse(localStorage.getItem(auto_complete_key))
  auto_complete_words = sss ? sss : auto_complete_words
}
get_auto_complete_words()
const  set_auto_complete_words = async () => {
  localStorage.setItem(auto_complete_key, JSON.stringify(auto_complete_words))
}
//搜索预选词语
const onSearch = (searchText) => {
  // console.log('searchText', searchText)
  let words = auto_complete_words.filter((item) => {
    return item.value.includes(searchText)
  })
  options.value = !searchText ? [] : words
}



const handleKeyDown = (e) => {
  const currentIndex = inputs.value.indexOf(e.target)
  console.log("inputs",inputs.value)
  console.log("target",e.target)
  console.log("currentIndex",e.key)
  console.log("currentIndex",currentIndex)

  if (e.key === 'ArrowUp' && currentIndex > 0) {
    inputs.value[currentIndex - 1].focus();
  } else if (e.key === 'ArrowDown' && currentIndex < inputs.value.length - 1) {
    inputs.value[currentIndex + 1].focus();
  }
};

import { notification } from 'ant-design-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
// const [api, contextHolder] = notification.useNotification()
// const open = (placement) => openNotification(placement)
// const openNotification = (placement) => {
//   api.info({
//     message: `Notification ${placement}`,
//     description: '保存成功了！',
//     placement
//   })
// }

//列表栏
const category_1 = ref([])
const loading = ref(false)
const formState = reactive({})
const onFinish = (values) => {
  console.log('Received values of form: ', values.produced_date.format('YYYY-M-D'))
  console.log('formState: ', values.expiry_date.format('YYYY-M-D'))
  let keys = []
  keys.push(values.category[1])
  keys.push(values.name)
  keys.push(values.number)
  keys.push(values.specification)
  keys.push(values.amount)
  keys.push(values.concentration)
  keys.push(values.manufacturer)
  keys.push(values.produced_date.format('YYYY-M-D'))
  keys.push(values.batch_number)
  keys.push(values.expiry_date.format('YYYY-M-D'))
  keys.push(values.in_name)
  keys.push(dayjs().format('YYYY-M-D'))
  keys.push(values.storage_place)
  keys.push(values.storage_condition)
  keys.push(values.art_comment)
  keys.push(dayjs().format('YYYY-M-D'))


  auto_complete_words = pushWords(auto_complete_words,{ value: values.name })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.in_name })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.manufacturer })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.specification })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.concentration })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.storage_place })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.concentration })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.storage_condition })
  auto_complete_words = pushWords(auto_complete_words,{ value: values.art_comment })

  set_auto_complete_words()

  // (category_id,name,number,specification,amount,concentration,manufacturer,produced_date,
  // batch_number,expiry_date,in_name,in_date,storage_place,storage_condition,art_comment,record_time)

  // ' (category_id,name,number,specification,amount,concentration,manufacturer,produced_date,' +
  // 'batch_number,expiry_date,in_name,in_date,storage_place,storage_condition,art_comment,record_time)
  addNew(keys)
  // getWUPing(keys)
}

const pushWords = (arrays,newElement) =>{
  let isDuplicate = arrays.some(item =>
    item.value === newElement.value );

  if (!isDuplicate) {
    arrays.push(newElement);
  }
  return arrays;
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
// (category_id,name,number,specification,amount,concentration,manufacturer,produced_date,batch_number,expiry_date,in_name,in_date,storage_place,storage_condition,art_comment,record_time)
//新增物品
const addNew = (keys) => {
  loading.value = true

  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
    loading.value = false
  }
  console.log('key', keys)

  let promise = window.db.run(
    'INSERT INTO articles' +
      ' (category_id,name,number,specification,amount,concentration,manufacturer,produced_date,' +
      'batch_number,expiry_date,in_name,in_date,storage_place,storage_condition,art_comment,record_time) VALUES' +
      ' (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
    keys
  )

  promise
    .then((result) => {
      console.log('query result ', result)
      // data.value = result
      // open(keys[1])
      notification.open({
        message: '通知：  ' + keys[1],
        description: '保存成功了',
        duration: 5,
        style: {
          backgroundColor: '#f9f',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
      loading.value = false
    })
    .catch((error) => {
      console.error('query error ', error.message)
      notification.open({
        message: '通知：  ' + keys[1],
        description: '保存失败了',
        style: {
          backgroundColor: 'aquamarine',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
      loading.value = false
    })
}

//查询商品是否存在
const getWUPing = (keys) => {
  loading.value = true

  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
    loading.value = false
  }
  console.log('key', keys)

  let promise = window.db.get('select * from  articles  where category_id = ? and name = ?', [keys[0], keys[1]])

  promise
    .then((result) => {
      console.log('query result ', result)
      if(result){
        notification.open({
          message: '通知：  ' + keys[1],
          description: '物品已存在～',
          style: {
            backgroundColor: '#909090',
            borderRadius: '8px',
            color: '#000',
            border: '1px solid #d9d9d9'
          }
        })
        loading.value = false
      } else {
        addNew(keys)
      }

    })
    .catch((error) => {
      console.error('query error ', error.message)
      loading.value = false
    })
}

// 访问路由信息
console.log(cureentRoute.path) // 当前路径，例如 "/user/123"
console.log(cureentRoute.params) // 动态参数，例如 { id: '123' }
console.log(cureentRoute.query.category_1) // 查询参数，例如 { name: 'John' }
let category = JSON.parse(cureentRoute.query.category_1)

category.forEach((item) => {
  // console.log(item)
  item.value = item.id
  item.label = item.name
  item.children.forEach((item_1) => {
    // console.log(item)
    item_1.value = item_1.id
    item_1.label = item_1.name
  })
})
category = category.filter(item => item.id > 0);

category_1.value = category

const columns_1 = [
  {
    title: '名称',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    type: 1,
    required: true
  },
  {
    title: '类别',
    width: 100,
    dataIndex: 'category',
    key: 'category',
    fixed: 'left',
    type: 3,
    required: true
  },
  {
    title: '备注',
    dataIndex: 'art_comment',
    width: 100,
    type: 1,

    key: 'art_comment'
  },
  {
    title: '有效期至',
    dataIndex: 'expiry_date',
    key: 'expiry_date',
    type: 2,
    width: 150,
    required: true
  },
  {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount',
    type: 4,
    width: 150,
    required: true
  },
  {
    title: '生产厂家',
    dataIndex: 'manufacturer',
    type: 1,
    key: 'manufacturer',
    width: 150,
    required: true
  },
  {
    title: '生产日期',
    dataIndex: 'produced_date',
    key: 'produced_date',
    type: 2,
    width: 150,
    required: true
  },

  {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 150,
    type: 1,

    required: true
  },

  {
    title: '批号',
    dataIndex: 'batch_number',
    type: 1,
    key: 'batch_number',
    width: 150
  },

  {
    title: '浓度',
    dataIndex: 'concentration',
    type: 1,
    key: 'concentration',
    width: 150
  },
  {
    title: '入库人',
    dataIndex: 'in_name',
    width: 100,
    type: 1,
    required: true,
    key: 'in_name'
  },
  {
    title: '存放条件',
    dataIndex: 'storage_condition',
    width: 100,
    type: 1,

    key: 'storage_condition'
  },
  {
    title: '存放地点',
    dataIndex: 'storage_place',
    type: 1,
    width: 100,
    key: 'storage_place',
    required: true
  },
  {
    title: '编号',
    width: 100,
    dataIndex: 'number',
    key: 'number',
    type: 1,
    required: true
  }
]

onMounted(() => {
  // const jsonData = useRouter.prototype.jsonData // 解析字符串
  // console.log(jsonData) // { name: 'John', age: 30 }
  // console.log(router.query.jsonData); // { name: 'John', age: 30 }
})
</script>
<style scoped>
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
[data-theme='dark'] .ant-advanced-search-form {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #434343;
  padding: 24px;
  border-radius: 2px;
}
[data-theme='dark'] #components-form-demo-advanced-search .search-result-list {
  border: 1px dashed #434343;
  background: rgba(255, 255, 255, 0.04);
}
</style>
