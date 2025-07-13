<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="编辑物品信息"
    sub-title="    "
    @back="
      () => {
        router.back()
      }
    "
  />
  <div style="margin: 21px 100px">
    <a-form ref="formRef" :model="formState" @finish="onFinish">
      <a-row :gutter="24">
        <template v-for="item in columns_1" :key="item.key">
          <a-col :span="8">
            <a-form-item
              :name="item.key"
              :label="item.title"
              :rules="[{ required: item.required, message: '必填项！' }]"
            >
              <a-auto-complete
                :options="options"
                @search="onSearch"
                v-if="item.type === 1"
                v-model:value="formState[item.key]"
                placeholder=" "
              ></a-auto-complete>
              <a-date-picker v-if="item.type === 2"  :locale="locale"  v-model:value="formState[item.key]" />
              <a-cascader
                v-if="item.type === 3"
                v-model:value="formState[item.key]"
                :options="category_1"
                expand-trigger="hover"
                placeholder="Please select"
              />
              <a-input-number
                v-if="item.type === 4"
                style="width: 100%"
                disabled="true"
                v-model:value="formState[item.key]"
                :min="1"
                :max="10"
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
import { onMounted, reactive, ref } from 'vue'
const formRef = ref()

import { notification } from 'ant-design-vue'

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

const onSearch = (searchText) => {
  // console.log('searchText', searchText)
  let words = auto_complete_words.filter((item) => {
    return item.value.includes(searchText)
  })
  options.value = !searchText ? [] : words
}

//列表栏
const category_1 = ref([])
const loading = ref(false)

// 访问路由信息
console.log(cureentRoute.path) // 当前路径，例如 "/user/123"
console.log(cureentRoute.params) // 动态参数，例如 { id: '123' }
console.log(cureentRoute.query.category_1) // 查询参数，例如 { name: 'John' }
console.log(cureentRoute.query.record) // 查询参数，例如 { name: 'John' }
let category = JSON.parse(cureentRoute.query.category_1)
const record = JSON.parse(cureentRoute.query.record)
console.log('record -> ', record)

// keys.push(format(now, 'YYYY-M-D'))
import dayjs from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const dateFormat = 'YYYY-M-D'

var editArticles = {}
category.forEach((item) => {
  // console.log(item)
  item.value = item.id
  item.label = item.name
  item.children.forEach((item_1) => {
    // console.log(item)
    item_1.value = item_1.id
    item_1.label = item_1.name
    if (item_1.value === record.category_id) {
      editArticles.category = [item.value, item_1.value]
    }
  })
})
category = category.filter(item => item.id > 0);

category_1.value = category
editArticles.name = record.name
editArticles.number = record.number
editArticles.specification = record.specification
editArticles.amount = record.amount
editArticles.concentration = record.concentration
editArticles.manufacturer = record.manufacturer
editArticles.in_name = record.in_name
editArticles.batch_number = record.batch_number
editArticles.storage_condition = record.storage_condition
editArticles.manufacturer = record.manufacturer
editArticles.art_comment = record.art_comment
editArticles.storage_place = record.storage_place

editArticles.produced_date = dayjs(record.produced_date, dateFormat)
editArticles.expiry_date = dayjs(record.expiry_date, dateFormat)

const formState = reactive(editArticles)
// console.log('formState -> ', formState)
// 定义事件
// const emit = defineEmits(['return-data'])

const onFinish = (values) => {
  console.log('Received values of form: ', values.produced_date.format('YYYY-M-D'))
  console.log('formState: ', values.expiry_date.format('YYYY-M-D'))
  let keys = []
  keys.push(values.category[1])
  keys.push(values.name)
  keys.push(values.number)
  keys.push(values.specification)
  keys.push(parseFloat(values.amount))
  keys.push(values.concentration)
  keys.push(values.manufacturer)
  keys.push(values.produced_date.format('YYYY-M-D'))
  keys.push(values.batch_number)
  keys.push(values.expiry_date.format('YYYY-M-D'))
  keys.push(values.in_name)
  keys.push(values.storage_place)
  keys.push(values.storage_condition)
  keys.push(values.art_comment)
  keys.push(dayjs().format('YYYY-M-D'))
  keys.push(record.id)


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

  updateArticles(keys)
}

const  set_auto_complete_words = async () => {
  localStorage.setItem(auto_complete_key, JSON.stringify(auto_complete_words))
}

const pushWords = (arrays,newElement) =>{
  let isDuplicate = arrays.some(item =>
    item.value === newElement.value );

  if (!isDuplicate) {
    arrays.push(newElement);
  }
  return arrays;
}

//更新物品
const updateArticles = (keys) => {
  loading.value = true

  if (!window.db) {
    console.log('This code is not running in an Electron environment.')
    loading.value = false
  }
  console.log('key', keys.length, keys)

  // let params = []
  // console.log('key', params.length, params)

  let promise = window.db.run(
    'UPDATE articles SET ' +
      ' category_id = ? , name =? ,  number =? ,   specification =? ,  amount =? ,  concentration =? ' +
      ',  manufacturer =? ,  produced_date =? ,batch_number = ? , expiry_date =? ,  in_name =?  ' +
      ',  storage_place =? ,  storage_condition =? ,  art_comment =? ,  record_time = ?' +
      ' where id = ?;',
    keys
  )

  promise
    .then((result) => {
      console.log('query result ', result)
      // data.value = result
      // open(keys[1])

      notification.open({
        message: '通知：  ' + keys[1],
        description: result === 0 ? '保存成功！' : '保存失败了 !!',
        duration: 5,
        style: {
          backgroundColor: result === 0 ? '#f9f' : '#fff',
          borderRadius: '8px',
          color: '#000',
          border: '1px solid #d9d9d9'
        }
      })
      // const data = { message_type: 1};
      // emit('return-data', data); // 触发事件并传递数据
      router.back()
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
