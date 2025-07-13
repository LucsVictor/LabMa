<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal of 1000px width</a-button>
    <a-modal
      :visible="open"
      @update:visible="val => open = val"

      v-model:open="open" width="1000px" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script setup>

import { Modal } from 'ant-design-vue';

import { nextTick, ref } from 'vue'
const open = ref(false);
const showModal = async () => {
  await nextTick();
  open.value = true;
};
const handleOk = e => {
  console.log(e);
  open.value = false;
};
</script>
