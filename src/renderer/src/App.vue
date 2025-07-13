<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/')
</script>

<template style="height: 100vh; width: 100vw">
  <router-view v-slot="{ Component }">
    <keep-alive exclude="EditArticles,Articles">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
