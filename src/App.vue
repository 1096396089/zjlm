<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const audioEl = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const playBgm = async () => {
  const el = audioEl.value
  if (!el) return
  try {
    el.loop = true
    await el.play()
    isPlaying.value = true
  } catch (err) {
    console.error('Failed to play BGM', err)
  }
}

const pauseBgm = () => {
  const el = audioEl.value
  if (!el) return
  el.pause()
  isPlaying.value = false
}
</script>

<template>
  <div class="app-container">

    <!-- 内容区域 -->
    <div class="content-wrapper  relative">
      <div class="absolute top-2 left-2 z-40">
        <template v-if="!isPlaying">
          <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg"  @click="playBgm" style="cursor: pointer;">
            <path
              d="M13.3672 16.5234C13.3672 15.5569 14.1507 14.7734 15.1172 14.7734H18.8672V16.4734C18.8672 17.4675 18.0613 18.2734 17.0672 18.2734H15.1172C14.1507 18.2734 13.3672 17.4899 13.3672 16.5234Z"
              stroke="#333333" stroke-width="1.5" stroke-linejoin="round" />
            <path
              d="M1.36719 18.5234C1.36719 17.5569 2.15069 16.7734 3.11719 16.7734H6.36719V18.4734C6.36719 19.4675 5.56129 20.2734 4.56719 20.2734H3.11719C2.15069 20.2734 1.36719 19.4899 1.36719 18.5234Z"
              stroke="#333333" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M6.36719 8.29544L18.8672 5.33594" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.36719 18.2734V4.27344L18.8672 1.27344V16.1196" stroke="#333333" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.26562 1.53125L22.8008 20.3828" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </template>

        <template v-else>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" @click="pauseBgm"  style="cursor: pointer;">
            <path
              d="M13 16.5781C13 15.6116 13.7835 14.8281 14.75 14.8281H18.5V16.5281C18.5 17.5222 17.6941 18.3281 16.7 18.3281H14.75C13.7835 18.3281 13 17.5446 13 16.5781Z"
              stroke="#333333" stroke-width="1.5" stroke-linejoin="round" />
            <path
              d="M1 18.5781C1 17.6116 1.7835 16.8281 2.75 16.8281H6V18.5281C6 19.5222 5.1941 20.3281 4.2 20.3281H2.75C1.7835 20.3281 1 19.5446 1 18.5781Z"
              stroke="#333333" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M6 8.35013L18.5 5.39062" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6 18.3281V4.32812L18.5 1.32812V16.1743" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </template>



      </div>
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
      <audio ref="audioEl" src="/tietu/1.mp3" preload="auto" loop playsinline></audio>
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

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 300ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
