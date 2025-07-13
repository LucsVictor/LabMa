<template>
  <div style="background-color: #647eff; height: 50vh">
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal :visible="open"
             @update:visible="val => open = val"

             v-model:open="open" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
<!--    <aaaaa></aaaaa>-->
  </div>
</template>
<script setup>
import { ref } from 'vue'
const open = ref(false)
const showModal = () => {
  open.value = true
}
const handleOk = (e) => {
  console.log(e)
  open.value = false
}
</script>
