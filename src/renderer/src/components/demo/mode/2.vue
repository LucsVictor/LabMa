<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <AModal
      :visible="modal2Visible"
      @update:visible="val => modal2Visible = val"

      v-model:open="modal2Visible"
      title="Basic Modal"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleOk"
    >

      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </AModal>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
const modal2Visible = ref(false)

const showModal = () => {
  console.log(open.value)
  if (open.value === false) {
    open.value = true
  }else {
    open.value = false
  }
}


const handleOk = (e) => {
  console.log(e)
  open.value = false
}
</script>
<style lang="less">


/* 第二个 div */
//.top-div {
//  background-color: #32363f;
//}

.full-modal {
  .ant-modal {
    min-width: 100vw;
    height: 100vh;
    top: 10px;
    padding-bottom: 0;
    margin: 0;
    background-color: #32363f;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    min-width: 100vw;
    height: 100vh;
    background-color: #32363f;

  }
  .ant-modal-body {
    flex: 1;
    min-width: 100vw;
    height: 100vh;
    background-color: #32363f;

  }
}
</style>
