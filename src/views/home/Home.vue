<template>
  <div class="p-4  relative  h-screen  flex flex-col items-center">
    <transition name="fade">
      <div v-if="isIntroPlaying" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div v-if="isLoadingIntro" ref="lottieRef" class="w-[400px] h-[400px]"></div>
        <canvas v-else ref="canvasRef" class="w-full h-full pointer-events-none select-none"></canvas>
      </div>
    </transition>
    <div class="mt-5 flex justify-center items-center">
      <Title />
    </div>

    <div class=" w-full h-20  pt-16 flex justify-center items-center">
        <img
          class=" w-[90%] block select-none img-smooth"
          :src="carouselImages[currentCarouselIndex]"
          alt=""
          decoding="async"
        />
    </div>

    <div class="  absolute bottom-16  flex flex-col items-center justify-between">
      <Info class="mt-20"></Info>
      <div class=" mt-8" :class="['button-zoom', { 'is-animating': isButtonAnimating }]" @click="handleButtonClick">
        <svg width="159" height="60" viewBox="0 0 119 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M112.254 29.806L94.7158 29.7817L77.1779 29.7333L42.1022 29.5878L7.02654 29.4422H6.47674L5.91313 29.4145C5.53767 29.3769 5.16624 29.3062 4.80318 29.2032C4.07719 28.9907 3.39626 28.6467 2.79421 28.188C1.57853 27.2652 0.752959 25.9186 0.480958 24.4149C0.416793 24.0418 0.383263 23.664 0.38069 23.2854V22.1871V19.9905C0.38069 18.5284 0.346107 17.0629 0.332276 15.5973C0.318445 14.1317 0.290782 12.6696 0.256204 11.2041L0.207801 9.00743L0.183594 7.90915V7.3617C0.183594 7.17807 0.183594 6.97368 0.183594 6.77965C0.27949 5.18252 0.979372 3.68204 2.1407 2.58387C3.31286 1.47813 4.85996 0.859086 6.46983 0.851562L24.0077 0.882733H32.7766L41.5455 0.924308L76.6212 1.08714L94.1556 1.12178C100.003 1.12178 105.85 1.15296 111.693 1.12178H112.243L112.814 1.14605C113.195 1.18128 113.572 1.24967 113.941 1.35046C115.056 1.66792 116.06 2.28971 116.842 3.14629C117.625 4.00287 118.154 5.06054 118.37 6.20108C118.437 6.58105 118.476 6.96553 118.485 7.35129V8.44966L118.512 10.6462L118.564 15.0394L118.616 19.4327L118.64 21.6293V23.2785C118.64 23.4621 118.64 23.6701 118.619 23.8676C118.496 25.4802 117.772 26.9872 116.591 28.0894C115.409 29.1915 113.857 29.8081 112.243 29.8164M112.243 28.6904C113.584 28.6917 114.876 28.188 115.864 27.2793C116.852 26.3706 117.462 25.1232 117.575 23.7844L117.686 15.0394L117.738 10.6462L117.762 8.44966V7.35129C117.763 7.00339 117.737 6.65592 117.686 6.31188C117.457 4.92763 116.717 3.68059 115.611 2.81953C115.058 2.39344 114.431 2.07382 113.761 1.87706C113.421 1.78276 113.074 1.71677 112.724 1.67963L112.202 1.65189H111.687C105.843 1.60684 99.9958 1.62763 94.1487 1.65189L76.6143 1.68657L41.5386 1.8494L32.7697 1.89093H24.0008L6.46292 1.92214C5.11636 1.92375 3.81808 2.42487 2.81842 3.32883C1.81112 4.24184 1.17575 5.49535 1.0342 6.84893C1.0342 7.02216 1.00654 7.1954 1.00309 7.36517V7.91261L0.978878 9.0109L0.933926 11.2075C0.897043 12.6743 0.87054 14.1387 0.854403 15.6008C0.854403 17.0663 0.80599 18.5319 0.80599 19.994V22.1906V23.2889C0.805132 23.6441 0.834048 23.9988 0.892434 24.3491C1.1387 25.7588 1.90524 27.0241 3.03972 27.8935C3.60186 28.3256 4.24161 28.6456 4.9242 28.8359C5.26333 28.9315 5.61061 28.9953 5.96154 29.0265L6.49058 29.0507H7.04036L42.1161 28.9052L77.1918 28.7597L94.7296 28.7112L112.243 28.6904Z" fill="black"/>
<path d="M34.8885 17.9892L35.708 18.2249C35.5158 18.7295 35.2846 19.2184 35.0164 19.687C34.7701 20.1295 34.4692 20.5392 34.1208 20.9066L33.3359 20.4977C33.6797 20.1678 33.9754 19.7911 34.2142 19.3786C34.4802 18.9367 34.7059 18.4717 34.8885 17.9892ZM34.7605 13.2357H42.4956V17.227H34.7502L34.7605 13.2357ZM35.58 14.1227V16.3539H41.6277V14.1227H35.58ZM36.773 18.3254L37.5925 18.2525C37.6587 18.5303 37.7106 18.8114 37.7481 19.0945C37.7895 19.3948 37.8241 19.6858 37.8518 19.9676C37.8795 20.2494 37.8933 20.4884 37.8933 20.6848L37.015 20.8095C37.015 20.6017 37.015 20.3556 36.9873 20.0715C36.9597 19.7874 36.9389 19.4964 36.9009 19.1881C36.8629 18.8797 36.8075 18.5922 36.7626 18.3254H36.773ZM38.1008 9.44531H38.9686V13.693H38.1008V9.44531ZM38.5053 10.7689H43.3462V11.6524H38.5053V10.7689ZM39.1657 18.3392L39.9507 18.1521C40.0798 18.4186 40.1952 18.6915 40.2964 18.9698C40.4071 19.2654 40.5108 19.5495 40.6076 19.8221C40.6942 20.0578 40.7625 20.2999 40.8117 20.5462L39.968 20.7818C39.9195 20.5336 39.8572 20.2885 39.7812 20.0473C39.6983 19.7632 39.6014 19.4722 39.4942 19.1742C39.387 18.8762 39.2695 18.5955 39.1554 18.3392H39.1657ZM41.524 18.2388L42.2985 17.913C42.499 18.1798 42.6961 18.4639 42.8932 18.7618C43.0903 19.0598 43.2701 19.3578 43.4396 19.6558C43.5902 19.909 43.722 20.173 43.8337 20.4457L43.0143 20.8199C42.9099 20.5459 42.7863 20.2796 42.6443 20.023C42.4818 19.7216 42.2985 19.4168 42.1049 19.1049C41.9112 18.7931 41.7037 18.5055 41.5136 18.2388H41.524Z" fill="black"/>
<path d="M46.2998 14.2734H56.3758V15.2089H46.2998V14.2734ZM47.1539 11.3804H55.5805V12.3158H47.1539V11.3804ZM47.2576 16.1685H48.1705V19.2868H55.086V20.198H47.2576V16.1685ZM50.909 9.46094H51.8115V19.9104H50.909V9.46094ZM54.5051 16.1685H55.3938V20.9222H54.5051V16.1685Z" fill="black"/>
<path d="M60.8499 18.3251C61.056 18.3295 61.2526 18.4125 61.3997 18.5572C61.5725 18.7096 61.818 18.9036 62.1327 19.1254C62.5286 19.3879 62.9793 19.5563 63.4501 19.6174C64.0234 19.6914 64.601 19.726 65.179 19.7213C65.5248 19.7213 65.8706 19.7214 66.2613 19.704C66.652 19.6867 67.0082 19.6763 67.3816 19.6555C67.755 19.6347 68.1147 19.6104 68.4639 19.5793C68.8131 19.5481 69.1243 19.5204 69.4113 19.4857C69.3664 19.5818 69.3294 19.6815 69.3007 19.7837C69.2661 19.9015 69.235 20.0193 69.2073 20.1302C69.1821 20.235 69.1648 20.3415 69.1554 20.4489L68.3463 20.4871C68.0006 20.4871 67.6548 20.5182 67.2675 20.5286L66.1265 20.5598C65.7565 20.5598 65.4349 20.5598 65.1583 20.5598C64.5422 20.5684 63.9266 20.522 63.3187 20.4212C62.8306 20.3391 62.3659 20.1524 61.9564 19.8738C61.7352 19.722 61.5227 19.5577 61.3201 19.3818C61.195 19.2478 61.0278 19.1609 60.8464 19.1358C60.6771 19.1549 60.5195 19.232 60.4004 19.3541C60.2056 19.5315 60.0273 19.7263 59.8679 19.9361C59.6811 20.1752 59.484 20.4385 59.2835 20.7226L58.7061 19.8738C59.0533 19.4616 59.4389 19.0834 59.8575 18.7443C60.1343 18.5006 60.4825 18.3535 60.8499 18.3251ZM61.289 13.9595V18.7858H60.4349V14.8326H58.8375V13.9595H61.289ZM59.1971 10.2281L59.8194 9.71875C60.0373 9.91624 60.2586 10.138 60.4868 10.3839C60.715 10.6299 60.9294 10.8725 61.1334 11.1081C61.3374 11.3437 61.5034 11.5551 61.6348 11.7387L60.964 12.3381C60.8246 12.1026 60.6661 11.8789 60.4903 11.6693C60.2897 11.4233 60.0788 11.1739 59.854 10.921C59.6293 10.6681 59.4114 10.4255 59.1971 10.2281ZM62.1085 14.8569H69.1728V15.7542H62.1085V14.8569ZM62.1777 11.7144H68.9411V12.6221H62.1777V11.7144ZM63.8201 9.71875H64.6742V14.0946C64.6742 14.4942 64.6534 14.917 64.6119 15.3628C64.5685 15.8111 64.4875 16.2549 64.3699 16.6897C64.2496 17.1299 64.0705 17.5518 63.8374 17.9439C63.5906 18.3503 63.276 18.7113 62.9073 19.0111C62.8645 18.9263 62.8097 18.8481 62.7447 18.7789C62.6687 18.6923 62.5857 18.6057 62.5027 18.5225C62.4346 18.455 62.3618 18.3925 62.2848 18.3354C62.7165 17.9896 63.0641 17.5501 63.3014 17.05C63.515 16.582 63.6572 16.0844 63.7233 15.5741C63.7872 15.08 63.8196 14.5824 63.8201 14.0842V9.71875ZM66.5863 9.71875H67.4542V18.9348H66.5863V9.71875Z" fill="black"/>
<path d="M76.2822 12.3545L77.2504 12.552C77.0045 13.7585 76.6432 14.9385 76.1716 16.0756C75.7609 17.0665 75.21 17.9929 74.536 18.8266C73.8876 19.6171 73.1143 20.2959 72.247 20.8361C72.1763 20.7526 72.1013 20.6727 72.0222 20.597L71.7214 20.3164C71.6177 20.2229 71.5278 20.1466 71.4482 20.0877C72.7489 19.3721 73.8334 18.3189 74.5879 17.0387C75.414 15.585 75.987 14.0009 76.2822 12.3545ZM74.3839 10.5078L74.9164 9.71094C75.4298 10.0923 75.8944 10.5357 76.2995 11.031C76.6751 11.4955 77.0116 11.9903 77.3057 12.5104C77.5962 13.0197 77.859 13.5498 78.1045 14.0696C78.35 14.5893 78.592 15.1089 78.8444 15.6459C79.0914 16.1666 79.365 16.6744 79.6639 17.167C79.9639 17.6616 80.3113 18.1258 80.7013 18.5528C81.1217 19.0087 81.6021 19.4049 82.1293 19.7308C82.0809 19.8244 82.0291 19.9318 81.9668 20.06C81.9046 20.1882 81.8492 20.3198 81.7974 20.448C81.7525 20.5596 81.72 20.6758 81.7006 20.7945C81.1525 20.4735 80.654 20.0744 80.2206 19.6096C79.8076 19.1629 79.4393 18.6766 79.1211 18.1578C78.8075 17.6381 78.5171 17.1011 78.2497 16.5468C77.9835 15.9959 77.7276 15.4381 77.4751 14.8837C77.2227 14.3294 76.9565 13.7819 76.673 13.2553C76.3895 12.7297 76.0621 12.2289 75.6944 11.7585C75.319 11.2815 74.8777 10.8604 74.3839 10.5078Z" fill="black"/>
</svg>


      </div>

    </div>




  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import { useRouter } from 'vue-router'


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

// click zoom then navigate
const router = useRouter()
const isButtonAnimating = ref(false)
function handleButtonClick() {
  if (isButtonAnimating.value) return
  isButtonAnimating.value = true
  window.setTimeout(() => {
    router.push({ path: '/card' })
  }, 200)
}

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
    // Preload carousel images to avoid decode jank during swap (not awaited)
    ;(() => {
      carouselImages.forEach((src) => {
        const img = new Image()
        try {
          img.decoding = 'async'
          ;(img as any).loading = 'eager'
        } catch {}
        img.src = src
      })
    })()
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

.button-zoom {
  display: inline-block;
  transform: scale(1);
  transition: transform 200ms ease;
}
.button-zoom.is-animating {
  transform: scale(1.06);
}

/* iOS Safari: avoid flicker/jump during img src swap */
.img-smooth {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: opacity, transform;
}
</style>
