<template>
  <div class="w-screen h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#f6d9cf_0%,_#f1b9b1_45%,_#f7ddd4_100%)]">
    <div class="pt-8 flex justify-center z-10">
      <TitleCom class="w-[180px] h-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]" />
    </div>

    <div class="flex-1 flex items-center justify-center px-6 z-0">
      <div class="w-full max-w-[390px] aspect-[1/1]">
        <Three />
      </div>
    </div>

    <div class="px-8 pb-24 text-center text-white/95 tracking-[0.2em] text-[18px] z-10">
      「 属 于 你 的 糖 果 德 训 」
    </div>

    <div class="absolute bottom-8 left-0 right-0 px-8 z-10">
      <button
      @click="$router.push('model')"
       class="w-full max-w-[260px] mx-auto block rounded-full bg-white/80 text-[#f39aa0] backdrop-blur py-3 text-sm shadow-[0_10px_28px_rgba(0,0,0,0.18)] active:scale-[0.98]">
        定制专属配色，参与抽奖
      </button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import Three from './dan_three.vue'
import TitleCom from './title.vue'
</script>
