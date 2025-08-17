<template>
  <div class=" relative flex flex-col   h-dvh ios-safe zaodian">
    <div class="p-14 flex justify-center items-center w-full">
      <Title />
    </div>
    <div class="w-full p-2">
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(item, i) in items"
          :key="item.url"
          style="
               width: 177.49px;
               height: 133.12px;
               background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
               filter: drop-shadow(0px 0px 32.3px rgba(0, 0, 0, 0.03));
               border-radius: 45px;
               position: relative;
               overflow: hidden;
             "
        >
          <div :style="getFillStyle(item.defaultPercents, item.bubblecolors)" class="progress-fill"></div>
          <img :src="item.url" alt="shoe" class="relative z-10 w-full h-full object-contain" />
          <!-- <div class="absolute bottom-2 left-3 z-20 text-white text-xs font-bold drop-shadow">{{ item.defaultPercents }}%</div> -->
        </div>
      </div>
    </div>

    <div class=" flex mt-24 justify-center items-center">
      <svg width="80" height="13" viewBox="0 0 80 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.10831 9.33873C2.76118 10.3435 2.17108 11.4522 1.58097 12.1105L0.886719 11.7294C1.47683 11.1404 2.03222 10.0663 2.37935 9.13086L3.10831 9.33873ZM9.53009 4.17632V8.26468H2.2405V4.17632H9.53009ZM2.96946 7.43315H8.76642V5.0425H2.96946V7.43315ZM4.91334 9.37337C5.08691 10.2049 5.19105 11.279 5.19105 11.9026L4.42737 12.0412C4.42737 11.3829 4.32324 10.3089 4.18439 9.47733L4.91334 9.37337ZM6.19771 0.226562V4.66139H5.43403V0.226562H6.19771ZM10.3632 1.64712V2.5133H5.78115V1.64712H10.3632ZM7.13494 9.26945C7.48207 10.0317 7.82919 11.1057 7.96804 11.7294L7.23908 11.9719C7.13494 11.3136 6.78781 10.2396 6.4754 9.44269L7.13494 9.26945ZM9.35653 9.0269C9.91193 9.82378 10.5367 10.9325 10.8144 11.6601L10.0855 12.0065C9.84251 11.2789 9.21768 10.1703 8.66228 9.33873L9.35653 9.0269Z"
          fill="black" />
        <path
          d="M24.4218 5.25037V6.15123H14.9453V5.25037H24.4218ZM23.6581 2.27074V3.17155H15.7437V2.27074H23.6581ZM16.6462 7.19064V10.4821H23.2068V11.3829H15.8478V7.19064H16.6462ZM20.0827 0.226562V11.0711H19.2844V0.226562H20.0827ZM23.4845 7.19064V12.1451H22.7209V7.19064H23.4845Z"
          fill="black" />
        <path
          d="M37.9935 0.8125V12.142H37.2299V1.64404H29.6625V12.142H28.9336V0.8125H37.9935ZM37.6464 10.7562V11.5531H29.3154V10.7562H37.6464ZM35.5636 2.96059L35.6678 2.92596L36.0843 3.23779C34.9735 5.3859 32.4048 6.77178 30.218 7.39542C30.1485 7.18754 29.975 6.80643 29.8708 6.66785C31.9883 6.18279 34.4876 4.86619 35.4248 3.09919V2.96059H35.5636ZM33.1685 2.19838C32.5437 3.37638 31.537 4.5197 30.6345 5.24729C30.5304 5.1087 30.2527 4.83153 30.0791 4.69294C31.0163 4.03465 31.9536 2.99523 32.509 1.95582L33.1685 2.19838ZM31.3635 8.50411C32.8214 8.71199 34.7306 9.19707 35.7719 9.61284L35.4248 10.3058C34.3834 9.89001 32.509 9.33565 30.9816 9.12777L31.3635 8.50411ZM36.9869 6.56389C36.848 6.73712 36.6397 7.04894 36.5703 7.25683C34.557 6.73712 32.5437 5.55913 31.4676 3.96537L32.023 3.65353C32.9602 5.03941 34.9735 6.11348 36.9869 6.56389ZM35.6678 2.96059V3.68817H31.8147L32.2313 2.96059H35.6678ZM32.4048 6.91036C33.2726 7.11824 34.3834 7.53402 34.9736 7.88049L34.6611 8.50411C34.071 8.15764 32.9602 7.70723 32.0924 7.4647L32.4048 6.91036Z"
          fill="black" />
        <path
          d="M44.7637 0.365159V4.79999C44.7637 7.43316 44.5901 10.101 43.028 12.2144C42.8892 12.0066 42.6462 11.6947 42.4727 11.5215C43.8612 9.61592 44.0347 7.15598 44.0347 4.79999V0.365159H44.7637ZM50.1441 6.53233V12.1451H49.3457V7.43315H44.2083V6.53233H50.1441ZM49.7623 3.48339V4.3842H44.2777V3.48339H49.7623ZM49.7623 0.226562V4.00309H48.9639V0.226562H49.7623Z"
          fill="black" />
        <path
          d="M59.3423 5.97799L59.4465 6.80949C58.301 7.22525 57.0513 7.67567 56.1141 7.98749L55.8711 7.12132C56.7736 6.84414 58.0927 6.4284 59.3423 5.97799ZM59.6895 2.85977V3.72594H56.0447V2.85977H59.6895ZM58.301 0.226562V10.9671C58.301 11.4868 58.1968 11.7294 57.9191 11.868C57.6414 12.0066 57.1902 12.0412 56.4265 12.0412C56.3918 11.7987 56.2877 11.4522 56.1835 11.2097C56.7042 11.2443 57.1902 11.2097 57.329 11.2097C57.4679 11.2097 57.5373 11.1404 57.5373 10.9671V0.226562H58.301ZM64.5492 5.97799L64.688 5.94331L65.174 6.2205C64.2021 9.61591 61.7375 11.4175 59.0994 12.1798C59.0299 11.9372 58.8564 11.5562 58.7175 11.3483C61.1821 10.7246 63.5425 9.02689 64.3756 6.11655V5.97799H64.5492ZM61.4251 0.711628V2.16683C61.4251 3.34482 61.1127 4.7307 59.7936 5.63152C59.6895 5.45829 59.4465 5.11181 59.2729 4.97322C60.4879 4.14169 60.6961 3.06761 60.6961 2.13215V0.711628H61.4251ZM64.688 5.97799V6.84417H59.6547V5.97799H64.688ZM65.9724 11.3136C65.7988 11.5215 65.5906 11.9026 65.4864 12.1451C62.8483 11.4175 60.9391 9.58128 59.9324 6.84417L60.592 6.56697C61.4945 8.99226 63.4037 10.6899 65.9724 11.3136ZM63.7508 0.711628V1.54316H60.9044V0.711628H63.7508ZM64.1327 0.711628V3.72594C64.1327 4.10706 64.1674 4.21096 64.3409 4.21096C64.4798 4.21096 65.0699 4.21096 65.2087 4.21096C65.3823 4.21096 65.5906 4.17633 65.7294 4.14169C65.7294 4.38421 65.7641 4.7307 65.7988 4.93858C65.66 5.00788 65.417 5.00786 65.2087 5.00786C65.0352 5.00786 64.4103 5.00786 64.2715 5.00786C63.5425 5.00786 63.369 4.66137 63.369 3.69126V0.67699H64.1327V0.711628Z"
          fill="black" />
        <path
          d="M72.9846 9.48106C72.325 10.4165 71.2837 11.3174 70.3811 11.8717C70.2423 11.6985 69.9646 11.4213 69.791 11.248C70.7282 10.763 71.7002 10.0008 72.2903 9.16923L72.9846 9.48106ZM79.6493 8.06054V8.82276H69.8951V8.06054H79.6493ZM79.441 0.75V1.51226H69.9993V0.75H79.441ZM78.9204 2.55167V5.5313H70.6588V2.55167H78.9204ZM78.3302 6.39747V7.12505H71.2142V6.39747H78.3302ZM71.3531 4.80372H78.1567V3.24461H71.3531V4.80372ZM73.8176 1.06183V5.21947H73.1234V1.06183H73.8176ZM75.1367 8.26842V12.1489H74.3731V8.26842H75.1367ZM76.3169 1.06183V5.21947H75.588V1.06183H76.3169ZM76.907 9.23851C77.8096 9.8275 78.9551 10.6937 79.5799 11.2827L78.9898 11.837C78.4344 11.248 77.2889 10.3472 76.3516 9.72357L76.907 9.23851Z"
          fill="black" />
      </svg>

    </div>



  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Title from './title.vue'
interface ShoeItem { url: string; bubblecolors: string; defaultPercents: number }
const items = ref<ShoeItem[]>([])
const modules = import.meta.glob('@/assets/images/*.{png,jpg,jpeg,gif,svg}', { eager: true, import: 'default' }) as Record<string, string>
const srcList = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, v]) => v)

// 示例百分比，可替换为接口返回
const defaultPercents = [50, 20, 10, 9, 6, 5]
// 柔和配色，用于初始化到每个对象里
const palette = ['#F7B6C2', '#C7DAFF', '#F8B2D0', '#F7D5A4', '#C9D7F2', '#BFE6D6']
items.value = srcList.map((url, i) => ({
  url,
  bubblecolors: palette[i % palette.length],
  defaultPercents: defaultPercents[i] ?? 0,
}))



function getFillStyle(percent: number, color: string) {
  return {
    position: 'absolute',
    right: '0',
    top: '0',
    bottom: '0',
    width: `${percent}%`,
    background: color,
    opacity: '0.6',
    borderRadius: '45px',
    zIndex: '0',
  } as Record<string, string>
}



// 在 onMounted 生命周期钩子中设置噪点背景，避免 SSR/TS 报错
onMounted(() => {
  // 可在此处从接口获取真实投票百分比并更新 votes.value
});

</script>

<style scoped>
/* iOS bottom bar safe-area padding for full-bleed pages */
.ios-safe {
  padding-bottom: calc(constant(safe-area-inset-bottom) + 12px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}

/* 颗粒消散 + 淡入淡出 */
.dissolve-enter-active,
.dissolve-leave-active {
  transition: opacity 360ms ease;
  /* 同步粒子遮罩动画时长 */
}

.dissolve-enter-from,
.dissolve-leave-to {
  opacity: 0;
}

/* 粒子遮罩实现：使用子层遮罩在切换时制造"砂化"效果 */
.dissolve-wrap {
  position: relative;
}

.dissolve-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.12), transparent 40%),
    radial-gradient(circle at 70% 40%, rgba(0, 0, 0, 0.10), transparent 42%),
    radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.08), transparent 45%),
    radial-gradient(circle at 85% 75%, rgba(0, 0, 0, 0.06), transparent 46%),
    radial-gradient(circle at 10% 80%, rgba(0, 0, 0, 0.06), transparent 44%);
  opacity: 0;
  mask-image: radial-gradient(120px 120px at 30% 30%, #000 20%, transparent 60%),
    radial-gradient(100px 100px at 70% 20%, #000 18%, transparent 55%),
    radial-gradient(140px 140px at 50% 70%, #000 22%, transparent 60%),
    radial-gradient(120px 120px at 80% 80%, #000 18%, transparent 58%);
  -webkit-mask-image: radial-gradient(120px 120px at 30% 30%, #000 20%, transparent 60%),
    radial-gradient(100px 100px at 70% 20%, #000 18%, transparent 55%),
    radial-gradient(140px 140px at 50% 70%, #000 22%, transparent 60%),
    radial-gradient(120px 120px at 80% 80%, #000 18%, transparent 58%);
  mix-blend-mode: multiply;
}

.dissolve-leave-active .dissolve-wrap::before,
.dissolve-enter-active .dissolve-wrap::before {
  animation: particle-dissolve 360ms ease forwards;
}

@keyframes particle-dissolve {
  0% {
    opacity: 0;
    filter: blur(0px);
  }

  50% {
    opacity: 0.35;
    filter: blur(0.8px);
  }

  100% {
    opacity: 0;
    filter: blur(0px);
  }
}
</style>