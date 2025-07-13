<template>
  <div  >
<!--    <div class="bottom-div">这是下层的 div</div>-->
<!--    <div class="top-div">这是上层的 div</div>-->
    <Main  />
  </div>
</template>
<script setup lang="ts">
import Main from './mode/6.vue'
</script>
<style>

/* 第一个 div */
.bottom-div {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: lightblue;
  z-index: 1;
}

/* 第二个 div */
.top-div {
  position: absolute;
  width: 80vw;
  height: 80vh;
  align-items: center;
  background-color: lightcoral;
  z-index: 2;
}
</style>
