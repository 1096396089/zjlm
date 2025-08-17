<template>
  <div class="w-screen h-screen bg-[#F4EFE7] flex flex-col">
    <!-- 顶部标题 -->
    <div class="pt-6 flex justify-center px-32">
      <div class="relative inline-block">
        <Title></Title>
        <div class="absolute top-0 -translate-y-1 translate-x-[9rem] ">
          <Logo />
        </div>
      </div>
    </div>

    <!-- 奖品卡片区域 -->
    <div class="flex-1 flex items-center justify-center px-14">
      <img :src="randomCard" alt="" srcset="">

    </div>


    <div class=" pb-32 flex justify-center px-28" role="button" tabindex="0" 
      @keydown.enter.prevent="openDialog" @keydown.space.prevent="openDialog">
      <svg id="_鍥惧眰_1" data-name="鍥惧眰 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 341.15 83.29" @click="openDialog">
        <g>
          <path
            d="M106.02,30.73l2.07.47c-.36,2.26-.81,4.46-1.35,6.61-.55,2.15-1.19,4.15-1.94,6.01-.75,1.86-1.61,3.51-2.59,4.95-.07-.22-.16-.48-.29-.79-.12-.31-.26-.63-.42-.95-.16-.32-.3-.58-.43-.77,1.27-1.87,2.31-4.16,3.11-6.88s1.42-5.59,1.84-8.64ZM101.78,29.69h11.17v2.2h-11.17v-2.2ZM103.98,40.74h1.97v18.32h-1.97v-18.32ZM104.82,40.74h7.02v15.37h-7.02v-2.16h5.08v-11.02h-5.08v-2.2ZM114.71,36.89h2.07v9.68c0,1.1-.05,2.28-.15,3.53-.1,1.25-.29,2.5-.57,3.76-.28,1.26-.69,2.48-1.22,3.65-.54,1.18-1.24,2.26-2.11,3.24-.11-.17-.27-.34-.48-.5-.21-.17-.43-.34-.65-.5s-.42-.29-.6-.36c1.11-1.22,1.93-2.57,2.44-4.03.51-1.46.85-2.96,1.02-4.48.17-1.52.25-2.96.25-4.3v-9.68ZM118.42,27.56l2.01.58c-.85,2.5-1.93,4.87-3.24,7.11s-2.73,4.15-4.25,5.71c-.09-.17-.22-.36-.38-.58-.17-.22-.34-.44-.52-.68-.18-.24-.35-.42-.5-.54,1.45-1.42,2.77-3.14,3.98-5.17,1.2-2.03,2.17-4.17,2.91-6.43ZM116.05,49.74h13.61v2.12h-13.61v-2.12ZM116.22,36.89h13.37v2.09h-13.37v-2.09ZM116.22,43.19h13.37v1.98h-13.37v-1.98ZM118.32,30.7h7.69v2.05h-8.62l.94-2.05ZM121.47,38h2.01v21.46h-2.01v-21.46ZM125.44,30.7h.5l.37-.11,1.44,1.04c-.38.77-.82,1.55-1.32,2.36-.5.8-1.02,1.57-1.55,2.3-.53.73-1.05,1.37-1.54,1.93-.2-.17-.45-.35-.73-.56-.29-.2-.55-.38-.77-.52.45-.5.9-1.11,1.35-1.82s.89-1.43,1.29-2.16c.4-.73.72-1.4.97-2v-.47ZM128.59,36.89h2.17v20.77c0,.62-.08,1.12-.23,1.49-.16.37-.43.65-.84.85-.4.19-.96.31-1.69.34-.72.04-1.61.05-2.66.05-.04-.31-.12-.68-.23-1.1s-.23-.79-.37-1.1c.76.02,1.45.04,2.09.05.63.01,1.04,0,1.22-.02.36,0,.53-.19.53-.58v-20.77Z" />
          <path
            d="M138.21,39.05h7.19v2.3h-7.19v-2.3ZM141.49,29.9l1.54-1.48c.56.5,1.15,1.07,1.79,1.69s1.24,1.23,1.82,1.82c.58.59,1.05,1.1,1.4,1.53l-1.57,1.76c-.36-.46-.82-1-1.39-1.62-.57-.62-1.17-1.26-1.8-1.91-.63-.65-1.23-1.25-1.79-1.8ZM143.43,59.1c-.07-.17-.18-.37-.33-.59-.16-.23-.31-.45-.47-.67-.16-.22-.31-.38-.47-.5.33-.26.72-.68,1.15-1.26.44-.58.65-1.28.65-2.12v-14.9h2.17v16.81c-.36.31-.67.6-.94.86-.27.26-.53.54-.8.83s-.5.57-.68.85c-.19.28-.29.51-.29.7ZM143.43,59.1l-.37-2.27.7-1.08,6.72-4.82c.07.31.17.67.32,1.06.14.4.26.71.35.95-1.61,1.2-2.89,2.17-3.86,2.9-.97.73-1.71,1.31-2.22,1.73-.51.42-.89.74-1.12.95-.23.22-.41.41-.52.58ZM157.53,27.71h2.24c0,2.57-.04,5.14-.12,7.7-.08,2.57-.26,5.08-.54,7.52-.28,2.45-.74,4.76-1.37,6.95-.63,2.18-1.51,4.2-2.62,6.05-1.11,1.85-2.54,3.44-4.28,4.79-.18-.29-.44-.59-.77-.9-.33-.31-.66-.56-.97-.76,1.69-1.27,3.07-2.77,4.14-4.5,1.07-1.73,1.89-3.64,2.47-5.72.58-2.09.99-4.29,1.24-6.61.24-2.32.39-4.7.45-7.16.05-2.46.09-4.91.12-7.36ZM159.47,38.8c.09.67.24,1.62.45,2.84.21,1.22.52,2.62.94,4.18.41,1.56.96,3.15,1.66,4.77.69,1.62,1.56,3.16,2.61,4.61,1.05,1.45,2.31,2.68,3.78,3.69-.29.24-.59.52-.9.83-.31.31-.57.62-.77.94-1.52-1.1-2.81-2.43-3.88-3.98-1.07-1.55-1.96-3.19-2.66-4.93s-1.27-3.44-1.69-5.11c-.42-1.67-.75-3.17-.99-4.52-.23-1.34-.42-2.38-.55-3.1l2-.22Z" />
          <path
            d="M182.3,27.67l1.97.58c-.87,2.38-2,4.71-3.38,7s-2.96,4.29-4.75,5.99c-.11-.12-.26-.28-.45-.47-.19-.19-.38-.38-.57-.56-.19-.18-.37-.33-.55-.45,1.14-1.03,2.2-2.22,3.19-3.56.99-1.34,1.88-2.75,2.66-4.23.78-1.48,1.4-2.91,1.87-4.3ZM176.72,44.12h10.33v2.16h-10.33v-2.16ZM177.36,52.44l1.47-1.22c.85.77,1.73,1.61,2.66,2.52s1.79,1.82,2.59,2.72c.8.9,1.45,1.7,1.94,2.39l-1.64,1.48c-.47-.72-1.09-1.54-1.87-2.47-.78-.92-1.62-1.86-2.52-2.81-.9-.95-1.78-1.82-2.62-2.61ZM180.3,38.08l1.47-.94c.65.65,1.28,1.36,1.91,2.14s1.1,1.45,1.44,2l-1.54,1.15c-.33-.6-.81-1.31-1.44-2.12-.62-.82-1.24-1.56-1.84-2.23ZM186.35,44.12h.33l.37-.14,1.44.97c-.49,1.25-1.09,2.57-1.8,3.96s-1.45,2.72-2.21,3.98c-.76,1.26-1.44,2.33-2.04,3.22-.2-.19-.46-.41-.79-.67-.32-.25-.61-.45-.85-.59.42-.58.9-1.28,1.42-2.12.52-.84,1.05-1.74,1.59-2.7s1.03-1.91,1.47-2.84c.45-.94.8-1.78,1.07-2.52v-.54ZM181.67,31.42l1.3-1.4c.85.84,1.72,1.78,2.62,2.81s1.74,2.03,2.52,2.99c.78.96,1.39,1.82,1.84,2.59l-1.37,1.69c-.47-.77-1.09-1.66-1.85-2.68-.77-1.02-1.59-2.05-2.47-3.1-.88-1.04-1.74-2.01-2.59-2.9ZM196.71,39.48h1.91c-.02,2.66-.09,5.03-.2,7.09s-.33,3.86-.67,5.4c-.33,1.54-.84,2.87-1.52,4-.68,1.13-1.58,2.08-2.71,2.86-1.12.78-2.55,1.45-4.26,2-.07-.26-.22-.56-.47-.9s-.47-.6-.67-.79c1.6-.5,2.93-1.1,3.98-1.8,1.05-.7,1.88-1.55,2.49-2.56s1.06-2.21,1.35-3.62c.29-1.4.48-3.07.58-4.99.1-1.92.16-4.15.18-6.7ZM190.33,29.76h14.77v2.16h-14.77v-2.16ZM191.2,35.84h12.87v16.92h-2.11v-15.01h-8.72v15.08h-2.04v-16.99ZM197.01,31.06l2,.54c-.31.96-.63,1.93-.97,2.9s-.66,1.82-.97,2.54l-1.77-.54c.29-.74.6-1.64.94-2.68s.59-1.96.77-2.75ZM197.68,54.42l1.37-1.3c.78.6,1.58,1.26,2.41,1.98.82.72,1.61,1.43,2.36,2.12.75.7,1.35,1.32,1.82,1.87l-1.4,1.51c-.47-.55-1.07-1.19-1.8-1.93s-1.52-1.47-2.36-2.21c-.84-.74-1.63-1.43-2.39-2.05Z" />
          <path
            d="M225.83,45.2h2.34c-.2,1.61-.5,3.1-.9,4.48-.4,1.38-.95,2.65-1.64,3.8-.69,1.15-1.6,2.19-2.72,3.11-1.13.92-2.52,1.73-4.18,2.41-1.66.68-3.66,1.25-6,1.71-.09-.29-.24-.64-.45-1.04-.21-.41-.43-.73-.65-.97,2.23-.38,4.12-.88,5.68-1.48,1.56-.6,2.85-1.31,3.88-2.12,1.02-.82,1.84-1.73,2.46-2.74.61-1.01,1.08-2.11,1.4-3.29.32-1.19.59-2.48.79-3.87ZM211.79,40.96c1.07-.5,2.36-1.15,3.86-1.94s3.05-1.61,4.63-2.45l.57,1.94c-1.38.79-2.78,1.59-4.2,2.39-1.41.8-2.7,1.53-3.86,2.18l-1-2.12ZM212.22,48.08h29.22v2.16h-29.22v-2.16ZM212.76,30.55l1.74-.94c.67.84,1.31,1.79,1.94,2.84.62,1.06,1.07,1.97,1.34,2.74l-1.87,1.12c-.25-.79-.67-1.73-1.27-2.81s-1.23-2.06-1.87-2.95ZM219.64,27.67h2.14v17.57h-2.14v-17.57ZM239.4,30.77h.47l.43-.11,1.3.72c-.89,2.9-2.2,5.27-3.93,7.11s-3.75,3.28-6.08,4.32c-2.33,1.04-4.88,1.83-7.64,2.36-.04-.19-.14-.41-.28-.67-.15-.25-.3-.5-.45-.76-.16-.25-.31-.45-.47-.59,2.67-.43,5.13-1.1,7.37-2.02,2.24-.91,4.16-2.17,5.75-3.78,1.59-1.61,2.77-3.67,3.53-6.19v-.4ZM230.17,27.6l2.17.72c-.76,1.63-1.83,3.2-3.21,4.72-1.38,1.51-2.86,2.75-4.45,3.71-.11-.17-.25-.36-.4-.58s-.32-.43-.5-.65c-.18-.22-.35-.4-.5-.54,1-.58,1.96-1.27,2.86-2.07s1.71-1.67,2.41-2.59c.7-.92,1.24-1.83,1.62-2.72ZM228.4,49.52c1.03,2.62,2.7,4.63,5.01,6.03,2.32,1.4,5.25,2.32,8.79,2.75-.18.17-.36.38-.54.65-.18.26-.34.52-.48.77-.15.25-.26.5-.35.74-2.45-.41-4.62-1.04-6.5-1.89s-3.48-1.98-4.8-3.38c-1.31-1.4-2.36-3.13-3.14-5.17l2.01-.5ZM227.4,35.95l1.67-1.08c.6.48,1.21,1.03,1.84,1.66.62.62,1.21,1.24,1.75,1.85.55.61.99,1.16,1.32,1.64l-1.74,1.22c-.31-.5-.73-1.07-1.25-1.69-.52-.62-1.1-1.25-1.72-1.87-.62-.62-1.25-1.2-1.87-1.73ZM228.9,30.77h10.9v2.09h-10.9v-2.09Z" />
        </g>
        <path
          d="M317.1,82.14c-82.75.29-167.26,1.94-250.14.69-7.85-.1-29.82-.25-37.52-.27-3.13-.05-6.34.15-9.45-.39-9.56-1.48-17.53-9.36-19.4-18.81-.76-3.63-.41-8.86-.51-12.57-.02-6.23-.05-18.78-.06-25.01C-.47,15.53,6.28,5.46,16.03,2.17c2.53-.96,5.23-1.32,7.92-1.41C57.3.47,90.65.25,124.01.17c61.46-.2,126.32-.33,187.6.27,4.22.05,8.62-.11,12.7,1.24,10.51,3.29,17.58,13.93,16.78,24.86-.02,3.95-.18,14.67-.21,18.76-.05,4.17-.09,8.34-.1,12.51.11,4.21-.95,8.45-2.95,12.15-4.09,7.44-12.25,12.26-20.73,12.19h0ZM317.1,81.84c8.32,0,16.34-4.8,20.28-12.14,1.92-3.65,2.92-7.76,2.77-11.9,0-4.17-.05-8.34-.1-12.51l-.14-12.51c-.1-3.59.15-8.87-.59-12.34-2.04-9.96-11.32-17.74-21.5-17.76-63.39.58-130.26.56-193.82.31-33.35-.09-66.7-.3-100.05-.59-2.51.06-5.04.35-7.42,1.22-5.28,1.75-9.79,5.58-12.52,10.44-1.93,3.57-2.97,7.6-2.87,11.72l-.03,12.51c-.02,4.13-.03,14.76-.05,18.76-.81,12.83,9.24,24.11,22.15,24.37,11.08.08,32.41-.17,43.76-.26,82.91-1.27,167.36.4,250.14.69h0Z" />
      </svg>
    </div>

    <!-- Dialog Modal -->
    <div v-show="showDialog" class="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog"
      @click.self="closeDialog">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50"></div>
      <!-- Panel (Redesigned) -->
      <div class="relative z-10 w-[100%]">
        <div class="relative flex  justify-center items-center ">
          <!-- close button -->

          <!-- Step: QR code -->
          <div v-show="step === 'qrcode'"
            class=" rounded-2xl  w-[21rem]  h-[21rem]  py-16 flex flex-col items-center bg-cover bg-center bg-no-repeat "
            :style="{ backgroundImage: `url(${fangxing})` }">
            <img class="h-24 w-24 object-contain" src="https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/qrcode.png"
              alt="客服二维码" />
            <div class="my-2  text-[9px] leading-6 text-gray-800">
              <p>长按图片保存蹀愫管家二维码</p>
              <p>添加客服获取兑换奖品信息</p>
              <p>超过7天不领取视为自动放弃奖品</p>
            </div>
            <button type="button" class=" rounded-md bg-[#50744E] text-xs px-4 py-1 text-white shadow cursor-pointer"
              @click="toForm">
              返回研究
            </button>
          </div>

          <!-- Step: Form -->
          <div v-show="step === 'form'" class=" rounded-2xl w-[332px] h-[367px] flex flex-col items-center bg-cover bg-center bg-no-repeat "
            :style="{ backgroundImage: `url(${changxing})` }">
            <div class="text-center text-[12px] mt-8 font-semibold text-black">
              <p>请仔细填写收件信息</p>
              <p class="">填写错误视为自动放弃奖品</p>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <input v-model.trim="form.name" type="text" placeholder="请输入收件人"
                  class="w-full rounded-xl border border-black/70 bg-transparent px-5 py-1.5 text-xs placeholder:text-xs placeholder:text-gray-400 focus:outline-none" />
                <p v-if="errors.name" class="mt-1 text-left text-xs text-red-600">{{ errors.name }}</p>
              </div>
              <div>
                <input v-model.trim="form.phone" type="tel" placeholder="请输入手机号码"
                  class="w-full rounded-xl border border-black/70 bg-transparent px-5 py-1.5 text-xs placeholder:text-xs placeholder:text-gray-400 focus:outline-none" />
                <p v-if="errors.phone" class="mt-1 text-left text-xs text-red-600">{{ errors.phone }}</p>
              </div>
              <div>
                <textarea v-model.trim="form.address" rows="3" placeholder="请输入收件地址"
                  class="w-full resize-none rounded-xl border border-black/70 bg-transparent px-5 py-1.5 text-xs placeholder:text-xs placeholder:text-gray-400 focus:outline-none"></textarea>
                <p v-if="errors.address" class="mt-1 text-left text-xs text-red-600">{{ errors.address }}</p>
              </div>
            </div>

            <!-- button bar outside the card bottom -->
            <div class=" flex justify-between  mt-4">
              <button type="button"
                class=" whitespace-nowrap mr-2 rounded-md bg-[#9C7D5E] text-xs px-2 py-1.5 text-white shadow"
                @click="confirmForm">是，确认无误</button>
              <button type="button"
                class=" whitespace-nowrap ml-2 rounded-md bg-[#50744E] text-xs px-2 py-1.5 text-white shadow"
                @click="closeDialog">否，需要修改</button>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Title from './title.vue'
import Logo from './logo.vue'

import fangxing from './fangxing.png'
import changxing from './changxing.png'

import one from './one.png'
import tow from './tow.png'
import te from  './te.png'


const cards = [one, tow, te]
const randomCard =cards[Math.floor(Math.random() * cards.length)]

const route = useRoute()
const level = computed(() => {
  const v = (route.query.level as string) || '二等奖'
  try { return decodeURIComponent(v) } catch { return v }
})
const desc = computed(() => {
  const v = (route.query.desc as string) || '蹬愉小程序德训鞋优惠券99元'
  try { return decodeURIComponent(v) } catch { return v }
})

const showDialog = ref(false)
const step = ref<'qrcode' | 'form'>('qrcode')
const form = ref({ name: '', phone: '', address: '' })
const errors = ref<{ name?: string; phone?: string; address?: string }>({})

const resetState = () => {
  step.value = 'qrcode'
  form.value = { name: '', phone: '', address: '' }
  errors.value = {}
}

const openDialog = () => {
  resetState()
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
  resetState()
}
const toForm = () => { step.value = 'form' }

const validateForm = (): boolean => {
  const currentErrors: { name?: string; phone?: string; address?: string } = {}
  if (!form.value.name) currentErrors.name = '请输入收件人'
  const phone = form.value.phone
  if (!phone) {
    currentErrors.phone = '请输入手机号码'
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    currentErrors.phone = '请输入有效的手机号'
  }
  if (!form.value.address) currentErrors.address = '请输入收件地址'
  errors.value = currentErrors
  return Object.keys(currentErrors).length === 0
}

const confirmForm = () => {
  if (!validateForm()) return
  // TODO: 在此处提交表单到后端接口
  closeDialog()
  // 重置状态
  step.value = 'qrcode'
}

// 生成噪点图片的工具函数
function generateNoise(opacity: number = 0.06, size: number = 100): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imageData = ctx.createImageData(size, size);
  const buffer = imageData.data;

  for (let i = 0; i < buffer.length; i += 4) {
    const value = Math.random() * 255;
    buffer[i] = value;     // R
    buffer[i + 1] = value; // G
    buffer[i + 2] = value; // B
    buffer[i + 3] = Math.floor(opacity * 255); // Alpha
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

onMounted(() => {
  const targetDiv = document.querySelector('div.zaodian') as HTMLElement | null;
  if (targetDiv) {
    const noiseURL = generateNoise(0.08, 1000); // 不透明度 & 噪点尺寸
    targetDiv.style.backgroundImage = `url(${noiseURL})`;
    targetDiv.style.backgroundBlendMode = 'multiply';
    targetDiv.style.backgroundRepeat = 'repeat';
  }
})
</script>



<style scoped>
.cls-1 {
  fill: #fff;
}

.cls-2 {
  fill: none;
}

.cls-3 {
  fill: #ddcab5;
}

.cls-4 {
  fill: #50744e;
}

.cls-5 {
  clip-path: url(#clippath);
}

.cls-6 {
  fill: #9c7d5e;
}
</style>