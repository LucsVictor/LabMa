<script setup>
import { reactive } from 'vue'
import { Button } from 'ant-design-vue'

const versions = reactive({ ...window.electron.process.versions })
</script>

<template>

  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="新增物品"
    sub-title="    "
    @back="() => null"
  />

  <ul class="versions">
    <Button>开始</Button>
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
  </ul>
</template>
