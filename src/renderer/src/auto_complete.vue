<template>
  <a-auto-complete
    v-model:value="value"
    style="width: 200px"
    :options="options"
    @search="onSearch"
  />
  <a-button @click="clikok">提交</a-button>
  <div>{{wordsss}}</div>
</template>
<script setup>
import { ref } from 'vue'

const auto_complete_key = 'auto_complete'
var auto_complete_words = []
// for (let i = 0; i < 10; i++) {
//   auto_complete_words.push({ value: '11仅仅是计算机计算机视觉和恢复和等级划分' })
// }
const wordsss = ref()

let sss = JSON.parse(localStorage.getItem(auto_complete_key))
auto_complete_words = sss ? sss : auto_complete_words
wordsss.value = auto_complete_words

const value = ref('')
const options = ref([])

const onSearch = (searchText) => {
  console.log('searchText', searchText)
  let words = auto_complete_words.filter((item) => {
    return item.value.includes(searchText)
  })
  options.value = !searchText ? [] : words
}


const clikok = () => {
  console.log('auto_complete_words', auto_complete_words)
  auto_complete_words.push({ value: value.value })
  localStorage.setItem(auto_complete_key, JSON.stringify(auto_complete_words))
  auto_complete_words = JSON.parse(localStorage.getItem(auto_complete_key))

  wordsss.value = auto_complete_words
  console.log('words', auto_complete_words)
}

// const onSelect = (value) => {
//   console.log('onSelect', value)
// }

// watch(value, () => {
//   console.log('value', value.value)
// })
</script>
