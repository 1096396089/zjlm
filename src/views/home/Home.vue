<template>
  <div class="p-4   h-screen  flex flex-col items-center justify-between">
    <transition name="fade">
      <div v-if="isIntroPlaying" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div v-if="isLoadingIntro" ref="lottieRef" class="w-40 h-40"></div>
        <canvas v-else ref="canvasRef" class="w-full h-full pointer-events-none select-none"></canvas>
      </div>
    </transition>
    <div class="mt-10 flex justify-center items-center">
      <Title />
    </div>

    <div class=" w-full h-20 ">
      <transition name="fade-img" mode="out-in">
        <img
          :key="currentCarouselIndex"
          :src="carouselImages[currentCarouselIndex]"
          alt=""
        />
      </transition>
    </div>

    <div class=" mb-20 mt-10 flex flex-col items-center justify-between">
      <Info class="mt-20"></Info>
      <div class=" mt-12" @click="$router.push({ path: `/card` })">
        <svg width="119" height="30" viewBox="0 0 119 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M37.7589 18.6182C37.3786 19.6576 36.7907 20.801 36.1683 21.5286L35.373 21.0782C35.9954 20.4546 36.5833 19.3805 36.929 18.3757L37.7589 18.6182ZM44.5362 13.248V17.5788H36.7907V13.248H44.5362ZM37.6206 16.6087H43.6717V14.1834H37.6206V16.6087ZM39.6261 18.6529C39.799 19.5191 39.9027 20.6277 39.9373 21.286L39.0729 21.4247C39.0729 20.7317 38.9691 19.623 38.8308 18.7222L39.6261 18.6529ZM41.0092 9.125V13.7331H40.1448V9.125H41.0092ZM45.4006 10.5455V11.5156H40.5251V10.5455H45.4006ZM41.9774 18.549C42.3232 19.3805 42.7035 20.4545 42.8418 21.1475L42.012 21.39C41.8737 20.6971 41.5279 19.5884 41.1821 18.7569L41.9774 18.549ZM44.3287 18.3064C44.9165 19.138 45.5735 20.2813 45.8501 21.0435L45.0202 21.4593C44.7436 20.697 44.1212 19.5191 43.5334 18.6529L44.3287 18.3064Z"
            fill="black" />
          <path
            d="M57.9528 14.3566V15.3615H47.8906V14.3566H57.9528ZM57.1229 11.2038V12.2085H48.7205V11.2038H57.1229ZM49.7233 16.4009V19.7963H56.6388V20.801H48.8242V16.4009H49.7233ZM53.3885 9.125V20.4545H52.4895V9.125H53.3885ZM56.95 16.4009V21.5632H56.051V16.4009H56.95Z"
            fill="black" />
          <path
            d="M63.2425 19.5846C64.0033 20.139 64.9714 20.2429 66.2854 20.2429C67.6339 20.2429 69.3974 20.1389 70.5039 20.0004C70.4001 20.2775 70.2618 20.7626 70.2618 21.0398C69.432 21.1091 67.3573 21.1784 66.2854 21.1784C64.8677 21.1784 63.8995 21.0398 63.0697 20.4508C62.5856 20.1043 62.2052 19.6539 61.9632 19.6539C61.5828 19.6539 60.995 20.4508 60.4072 21.3862L59.8193 20.4508C60.6146 19.446 61.3753 18.7531 61.9632 18.7531C62.3435 18.7185 62.5856 19.1342 63.2425 19.5846ZM62.3781 19.2381H61.5137V14.9765H59.9231V14.0064H62.3781V19.2381ZM60.9258 9.39844C61.5828 10.0567 62.3435 10.9921 62.7239 11.5811L62.0669 12.2048C61.7211 11.5811 60.9258 10.6111 60.3034 9.91814L60.9258 9.39844ZM70.2618 14.9765V15.9467H63.208V14.9765H70.2618ZM70.0198 11.5811V12.5513H63.2771V11.5811H70.0198ZM65.7667 9.39844V14.1451C65.7667 15.912 65.5247 18.0948 64.0033 19.4807C63.8995 19.2728 63.5538 18.8917 63.3809 18.7531C64.764 17.5058 64.9023 15.7042 64.9023 14.1451V9.43303H65.7667V9.39844ZM68.5329 9.39844V19.3767H67.6685V9.39844H68.5329Z"
            fill="black" />
          <path
            d="M77.6965 12.7975C76.8667 16.9205 75.3453 19.7616 72.7865 21.5286C72.6136 21.3207 72.2333 20.9049 71.9912 20.697C74.55 19.1379 76.0022 16.4008 76.6938 12.5897L77.6965 12.7975ZM77.4891 9.92188V10.9613H74.2042V9.92188H77.4891ZM77.9386 9.92188C77.9386 12.3472 78.1806 17.4749 82.7449 20.6278C82.5374 20.801 82.1917 21.2167 82.0534 21.4939C77.4199 18.2371 77.0396 12.4857 77.0396 9.92188H77.9386Z"
            fill="black" />
          <path
            d="M112.24 29.8086L94.7087 29.7739L77.1777 29.7393L42.1159 29.6007L7.05401 29.4621H6.50077L5.94752 29.4275C5.56717 29.3928 5.18682 29.3236 4.84104 29.2196C4.11491 29.0117 3.42334 28.6652 2.83552 28.2148C1.6253 27.314 0.795438 25.9281 0.518816 24.4383C0.449661 24.0572 0.415076 23.6761 0.415076 23.295V22.1863V20.0035C0.415076 18.5483 0.380507 17.0585 0.380507 15.6033C0.380507 14.1482 0.345925 12.6584 0.311347 11.2032L0.276767 9.02042L0.242188 7.91174V7.35735C0.242188 7.18412 0.242188 6.97625 0.242188 6.76837C0.345921 5.20926 1.03748 3.65011 2.21313 2.57606C3.35419 1.46735 4.94477 0.84375 6.53535 0.84375L24.0663 0.878389H32.849L41.6318 0.913027L76.6937 1.08626L94.2246 1.1209C100.068 1.1209 105.912 1.15555 111.756 1.1209H112.309L112.897 1.15558C113.277 1.19023 113.657 1.25951 114.038 1.36345C114.764 1.57134 115.455 1.91781 116.078 2.36822C117.323 3.26905 118.187 4.65492 118.464 6.17939C118.533 6.56051 118.567 6.94164 118.567 7.32276V8.43144L118.602 10.6142L118.637 15.0144L118.671 19.4145L118.706 21.5973V22.706V23.2604C118.706 23.4336 118.706 23.6415 118.671 23.8493C118.567 25.4431 117.807 26.9676 116.666 28.0763C115.455 29.185 113.865 29.8086 112.24 29.8086ZM112.24 28.6652C113.554 28.6652 114.868 28.1802 115.87 27.2448C116.838 26.3439 117.495 25.062 117.599 23.7454L117.703 15.0144L117.737 10.6142L117.772 8.43144V7.32276C117.772 6.97629 117.772 6.62982 117.703 6.28335C117.495 4.93212 116.735 3.65015 115.628 2.78397C115.075 2.36821 114.453 2.02176 113.761 1.84852C113.415 1.74458 113.069 1.67525 112.724 1.6406L112.205 1.60601H111.652C105.808 1.57136 99.9645 1.57136 94.1209 1.60601L76.5899 1.6406L41.5281 1.81384L32.7453 1.84852H23.9625L6.43162 1.88312C5.08309 1.88312 3.76913 2.40285 2.80095 3.30368C1.7982 4.2045 1.14121 5.45177 1.0029 6.83765C1.0029 7.01088 0.968323 7.18412 0.968323 7.35735V7.91174L0.933743 9.02042L0.899174 11.2032C0.864596 12.6584 0.830014 14.1482 0.830014 15.6033C0.830014 17.0585 0.795434 18.5483 0.795434 20.0035V22.1863V23.295C0.795434 23.6414 0.830018 23.9879 0.899174 24.369C1.14122 25.7549 1.9365 27.0715 3.04299 27.903C3.59623 28.3534 4.25321 28.6652 4.94477 28.8385C5.29055 28.9424 5.63632 28.9771 5.9821 29.0464L6.50077 29.081H7.05401L42.1159 28.9424L77.1777 28.8039L94.7087 28.7692L112.24 28.6652Z"
            fill="black" />
        </svg>
      </div>

    </div>




  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'


import Title from './title.vue'
import Info from './info.vue'


import jiazaiData from '../../assets/jiazai.json'

const isIntroPlaying = ref(true)
const isLoadingIntro = ref(true)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const lottieRef = ref<HTMLDivElement | null>(null)

const totalFrames = 106 // 00000 - 00106 inclusive
const fps = 24
const frameDurationMs = 1000 / fps
const devicePixelRatioClamp = 1 // keep pixel work low for smoothness
const maxConcurrency = 6

let animationHandle: number | null = null
let lastTimestampMs = 0
let accumulatedMs = 0
let currentFrameIndex = 0
let cw = 0
let ch = 0
let crop: { sx: number; sy: number; sw: number; sh: number } | null = null
const bufferedBitmaps: Map<number, ImageBitmap> = new Map()

// simple carousel for header images
const carouselImages = [
  'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/xiezipng/1.png',
  'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/xiezipng/2.png',
  'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/xiezipng/3.png',
  'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/xiezipng/4.png',
  'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/xiezipng/5.png'
]
const currentCarouselIndex = ref(0)
let carouselTimer: number | null = null

function frameUrl(index: number): string {
  const frameStr = String(index).padStart(5, '0')
  return `https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/animition/%E5%BC%80%E5%A4%B4%E5%8A%A8%E7%94%BB_${frameStr}.png`
}

function resizeCanvasToWindow(canvas: HTMLCanvasElement) {
  const dpr = devicePixelRatioClamp
  const width = window.innerWidth
  const height = window.innerHeight
  cw = Math.floor(width * dpr)
  ch = Math.floor(height * dpr)
  canvas.width = cw
  canvas.height = ch
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    const done = () => resolve(image)
    image.onload = () => {
      if (typeof (image as any).decode === 'function') {
        ;(image as any).decode().then(done).catch(done)
      } else {
        done()
      }
    }
    image.onerror = reject
  })
}

function computeCoverCrop(iw: number, ih: number) {
  const targetAR = cw / ch
  const imageAR = iw / ih
  if (imageAR > targetAR) {
    const sh = ih
    const sw = Math.floor(ih * targetAR)
    const sx = Math.floor((iw - sw) / 2)
    const sy = 0
    crop = { sx, sy, sw, sh }
  } else {
    const sw = iw
    const sh = Math.floor(iw / targetAR)
    const sx = 0
    const sy = Math.floor((ih - sh) / 2)
    crop = { sx, sy, sw, sh }
  }
}

async function preloadAllFramesBitmaps() {
  let completed = 0
  let nextIndex = 0
  let inFlight = 0
  return new Promise<void>((resolve) => {
    const launchNext = () => {
      while (inFlight < maxConcurrency && nextIndex < totalFrames) {
        const index = nextIndex++
        inFlight += 1
        loadImage(frameUrl(index))
          .then(async (img) => {
            if (!crop) {
              const iw = img.naturalWidth || img.width
              const ih = img.naturalHeight || img.height
              computeCoverCrop(iw, ih)
            }
            const bmp = await createImageBitmap(
              img,
              crop!.sx,
              crop!.sy,
              crop!.sw,
              crop!.sh,
              { resizeWidth: cw, resizeHeight: ch, resizeQuality: 'high' }
            )
            bufferedBitmaps.set(index, bmp)
          })
          .catch(() => {
            // skip on error, but keep timeline moving
          })
          .finally(() => {
            inFlight -= 1
            completed += 1
            if (completed >= totalFrames) {
              resolve()
            } else {
              launchNext()
            }
          })
      }
    }
    launchNext()
  })
}

function startAnimation() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const onResize = () => resizeCanvasToWindow(canvas)
  onResize()
  window.addEventListener('resize', onResize)

  const step = (now: number) => {
    if (!lastTimestampMs) lastTimestampMs = now
    const delta = now - lastTimestampMs
    lastTimestampMs = now
    accumulatedMs += delta

    while (accumulatedMs >= frameDurationMs) {
      accumulatedMs -= frameDurationMs
      currentFrameIndex += 1
    }

    if (currentFrameIndex >= totalFrames) {
      isIntroPlaying.value = false
      cancelAnimationFrameIfAny()
      window.removeEventListener('resize', onResize)
      return
    }

    // draw only when bitmap available, keep previous frame otherwise
    const bmp = bufferedBitmaps.get(currentFrameIndex)
    if (bmp) {
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(bmp, 0, 0)
      bufferedBitmaps.delete(currentFrameIndex)
    }

    animationHandle = requestAnimationFrame(step)
  }

  animationHandle = requestAnimationFrame(step)
}

function cancelAnimationFrameIfAny() {
  if (animationHandle !== null) {
    cancelAnimationFrame(animationHandle)
    animationHandle = null
  }
}

onMounted(async () => {
  // Prepare canvas size up-front for cropping/resizing
  const tempCanvas = document.createElement('canvas')
  resizeCanvasToWindow(tempCanvas)

  // Lottie loading animation
  let lottieInstance: any | null = null
  if (lottieRef.value) {
    lottieInstance = lottie.loadAnimation({
      container: lottieRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jiazaiData as unknown as object
    })
  }

  // start carousel
  if (!carouselTimer) {
    carouselTimer = window.setInterval(() => {
      currentCarouselIndex.value = (currentCarouselIndex.value + 1) % carouselImages.length
    }, 2000)
  }

  // Preload all bitmaps before starting playback
  await preloadAllFramesBitmaps()

  isLoadingIntro.value = false
  if (lottieInstance) {
    lottieInstance.destroy()
    lottieInstance = null
  }
  requestAnimationFrame(() => {
    startAnimation()
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrameIfAny()
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
})




</script>

<style scoped>
/* 确保卡片容器有足够的空间 */
.card-container {
  min-height: 300px;
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 500ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-img-enter-active, .fade-img-leave-active {
  transition: opacity 400ms ease;
}
.fade-img-enter-from, .fade-img-leave-to {
  opacity: 0;
}
</style>
