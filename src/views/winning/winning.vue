<template>
  <div class="w-screen h-screen bg-[#F4EFE7] flex flex-col">
    <!-- 顶部标题 -->
    <div class="pt-6 flex justify-center">
      <Title />
    </div>

    <!-- 奖品卡片区域 -->
    <div class="flex-1 flex items-center justify-center px-6">
      <div class="relative w-[260px] md:w-[300px]">
        <!-- 底部压影 -->
        <div
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-[88%] rounded-md bg-black/30 opacity-40 blur-[2px]"
        />
        <!-- 单层卡片 + 贴纸/围巾 -->
        <div class="relative h-[360px] md:h-[400px]">
          <!-- 主卡片（单层） -->
          <div class="absolute inset-0 rotate-[-2deg] bg-[#B984C7] rounded-[14px] ring-1 ring-black/20 z-10" />

          <!-- 顶部贴纸（在卡片之上） -->
          <div class="absolute top-3 left-1/2 -translate-x-1/2 -rotate-6 z-20">
            <div
              class="px-6 py-1 bg-[#A9825F] text-white text-sm tracking-widest rounded shadow-[0_4px_0_rgba(0,0,0,0.25)] ring-1 ring-black/10"
            >
              {{ level }}
            </div>
          </div>

          <!-- 围巾式底部带：左右尾端在卡片下方，中央在卡片上方 -->
          <!-- 左尾端（在卡片下方） -->
          <div class="absolute bottom-10 left-2 rotate-[-6deg] z-0">
            <div class="w-16 h-6 bg-[#56724F] rounded-sm ring-1 ring-black/10 shadow-[0_3px_0_rgba(0,0,0,0.2)]" />
          </div>
          <!-- 右尾端（在卡片下方） -->
          <div class="absolute bottom-9 right-2 rotate-[-6deg] z-0">
            <div class="w-16 h-6 bg-[#56724F] rounded-sm ring-1 ring-black/10 shadow-[0_3px_0_rgba(0,0,0,0.2)]" />
          </div>
          <!-- 中央前景条（在卡片上方） -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 -rotate-6 z-20">
            <div class="px-5 py-2 bg-[#56724F] text-white text-xs rounded shadow-[0_4px_0_rgba(0,0,0,0.25)] ring-1 ring-black/10">
              {{ desc }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="pb-10 flex justify-center">
      <button
        class="w-[220px] h-[40px] rounded-full border border-black/60 bg-white/80 text-black text-sm tracking-widest shadow-[0_2px_0_rgba(0,0,0,0.35)] active:translate-y-[1px]"
        @click="$router.push('/')"
      >
        确认领奖
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Title from './title.vue'

const route = useRoute()
const level = computed(() => {
  const v = (route.query.level as string) || '二等奖'
  try { return decodeURIComponent(v) } catch { return v }
})
const desc = computed(() => {
  const v = (route.query.desc as string) || '蹬愉小程序德训鞋优惠券99元'
  try { return decodeURIComponent(v) } catch { return v }
})
</script>

<style scoped>
</style>