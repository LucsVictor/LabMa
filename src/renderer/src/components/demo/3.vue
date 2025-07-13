
<template>
  <div class="div1">这是第一个 div</div>
  <div class="div2">这是第二个 div</div>
  <Main />
</template>


<style>
/* 第一个 div */
.div1 {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightblue;
  z-index: 1;
}

/* 第二个 div */
.div2 {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightcoral;
  z-index: 2;
  transform: translateZ(0);
}
</style>
<script setup lang="ts">
// 使用 transform 属性也会影响 z-index 的堆叠顺序

import Main from './mode/2.vue'
</script>
