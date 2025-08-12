<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">


    <!-- 内容区域 -->
    <div class="content-wrapper ">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {

  background-color: #F4F1E9;
}


/* 内容包装器 */
.content-wrapper {
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; 
}
</style>
