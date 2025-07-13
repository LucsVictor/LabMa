<template>
  <div class="parent">
    <div class="child">这是子元素</div>
    <Main />
  </div>
  <div class="other-div">这是另一个 div</div>
</template>

<style>
/* 父元素 */
.parent {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightblue;
  z-index: 1;
}

/* 子元素 */
.child {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 500px;
  background-color: lightcoral;
  z-index: 10;
}

/* 另一个 div */
.other-div {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightgreen;
  z-index: 2;
}
</style>
<script setup lang="ts">
// 若两个 div 是父子关系，子元素的 z-index 会受父元素的影响。
// 即便子元素的 z-index 值很大，但如果父元素的 z-index 较小，子元素也无法显示在其他元素的上层。

import Main from './mode/2.vue'
</script>
