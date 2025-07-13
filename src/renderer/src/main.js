// import './assets/main.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { createApp } from 'vue'
import App from './App.vue'
// import App from './app2.vue'
// import App from './auto_complete.vue'
import router from './router/router'

// // import moment from 'moment'
// // moment.locale('zh-cn')
//
// // 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
// import { defineComponent } from 'vue';
// dayjs.locale('zh-cn');
//
// defineComponent({
//   value: dayjs('2015-01-01', 'YYYY-MM-DD'),
//   dayjs,
//   locale
// })

const app = createApp(App)
app.use(Antd, { locale: zhCN })
app.use(router)
app.mount('#app')
