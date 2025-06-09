<template>
  <div class="p-5 bg-gray-100 min-h-screen">
    <div class="w-[1588px] h-[726px] mx-auto relative overflow-hidden" ref="ticketRef" 
         style="background: linear-gradient(135deg, #f5f5dc 0%, #faf0e6 100%);">
      
      <!-- 顶部标题栏 -->
      <div class="h-20 px-8 flex justify-between items-center text-white"
           style="background: linear-gradient(90deg, #1e3a8a 0%, #3730a3 100%);">
        <div class="flex flex-col items-start">
          <span class="text-2xl font-bold text-yellow-400 mb-1 leading-none">香港国际机场</span>
          <span class="text-lg font-semibold tracking-wide leading-none">HONG KONG INTERNATIONAL AIRPORT</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-2xl font-bold tracking-widest leading-none">BOARDING PASS</span>
          <span class="text-base text-yellow-400 mt-1 leading-none">登机牌</span>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex h-[646px] relative">
        <!-- 左侧主要信息 -->
        <div class="flex-1 px-10 py-5 flex flex-col justify-between">
          <!-- 航班信息行 -->
          <div class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-4">
              <span class="text-yellow-400 text-3xl transform -rotate-45">✈</span>
              <span class="text-4xl font-bold text-blue-900">{{ flightNumber }}</span>
            </div>
            <div class="bg-blue-900 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide">
              VIP PRIORITY
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-900">{{ flightDate }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ dayOfWeek }}</div>
            </div>
            <div class="text-yellow-400 text-3xl">★</div>
          </div>

          <!-- 路线信息 -->
          <div class="flex items-center justify-between mb-15">
            <div class="text-center">
              <div class="text-7xl font-bold text-blue-900 leading-none">HKG</div>
              <div class="text-base text-gray-600 mt-2">香港国际机场</div>
            </div>
            <div class="flex-1 flex items-center mx-10">
              <div class="flex-1 h-1 rounded"
                   style="background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);"></div>
              <div class="text-yellow-400 text-5xl font-bold ml-2">→</div>
            </div>
            <div class="text-center">
              <div class="text-7xl font-bold text-blue-900 leading-none">CDG</div>
              <div class="text-base text-gray-600 mt-2">法国巴黎</div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="mb-10">
            <div class="flex justify-between mb-8">
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">登机时间 BOARDING</div>
                <div class="text-2xl font-bold text-blue-900">{{ boardingTime }}</div>
              </div>
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">起飞 DEPARTURE</div>
                <div class="text-2xl font-bold text-blue-900">{{ departureTime }}</div>
              </div>
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">到达 ARRIVAL</div>
                <div class="text-2xl font-bold text-blue-900">次日 {{ arrivalTime }}</div>
              </div>
            </div>
            <div class="flex justify-between mb-8">
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">登机口 GATE</div>
                <div class="text-2xl font-bold text-blue-900">{{ gate }}</div>
              </div>
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">座位 SEAT</div>
                <div class="text-2xl font-bold text-blue-900">{{ seat }}</div>
              </div>
              <div class="text-left">
                <div class="text-sm text-gray-600 mb-2">舱位 CLASS</div>
                <div class="text-2xl font-bold text-blue-900">商务舱</div>
              </div>
            </div>
          </div>

          <!-- 底部说明 -->
          <div class="text-center text-base text-gray-600 tracking-wide border-t-2 border-yellow-400 pt-5">
            贵宾通道优先登机 PRIORITY BOARDING THROUGH VIP CHANNEL
          </div>
        </div>

        <!-- 分割线 -->
        <div class="w-0.5 my-5 relative"
             style="background: linear-gradient(to bottom, transparent 0%, #ddd 20%, #ddd 80%, transparent 100%);">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-dashed border-gray-300"
               style="background: #f5f5dc;"></div>
        </div>

        <!-- 右侧乘客信息 -->
        <div class="w-[420px] px-10 py-5 flex flex-col relative">
          <div class="text-center mb-8">
            <span class="text-yellow-400 text-lg font-bold block mb-1">贵宾乘客 VIP</span>
            <span class="text-blue-900 text-base font-bold">PASSENGER</span>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="mb-5">
              <div class="text-xs text-gray-600 mb-2">姓名 NAME</div>
              <div class="text-xl font-bold text-blue-900 leading-tight whitespace-pre-line">{{ passengerName }}</div>
            </div>

            <div class="mb-5">
              <div class="text-xs text-gray-600 mb-2">证件号 ID</div>
              <div class="text-lg font-bold text-blue-900">{{ idNumber }}</div>
            </div>

            <div class="mb-6">
              <div class="text-xs text-gray-600 mb-2">会员编号 VIP NO.</div>
              <div class="text-lg font-bold text-blue-900 mb-2">{{ vipNumber }}</div>
              <div class="inline-block bg-yellow-400 text-blue-900 px-3 py-1 rounded text-xs font-bold border-2 border-blue-900">
                GOLD
              </div>
            </div>

            <!-- 二维码区域 -->
            <div class="mb-6 text-center flex-1 flex flex-col justify-center">
              <div class="w-36 h-36 mx-auto border-2 border-blue-900 bg-white flex items-center justify-center mb-4">
                <canvas ref="qrCanvas" width="144" height="144"></canvas>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-600 mb-1">票号 TICKET:</div>
                <div class="text-sm font-bold text-blue-900 px-2">{{ ticketNumber }}</div>
              </div>
            </div>
          </div>

          <div class="absolute bottom-8 right-8 text-yellow-400 text-2xl">★</div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="max-w-[1588px] mx-auto mt-5 p-5 bg-white rounded-lg shadow-md">
      <h3 class="mb-5 text-blue-900 text-lg font-semibold">机票信息编辑</h3>
      <div class="mb-4 flex items-center gap-3">
        <label class="min-w-[100px] font-medium">二维码内容:</label>
        <input 
          v-model="qrContent" 
          @input="generateQR" 
          placeholder="输入二维码内容"
          class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4 flex items-center gap-3">
        <label class="min-w-[100px] font-medium">航班号:</label>
        <input 
          v-model="flightNumber"
          class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4 flex items-center gap-3">
        <label class="min-w-[100px] font-medium">乘客姓名:</label>
        <input 
          v-model="passengerName"
          class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        @click="downloadTicket" 
        :disabled="isDownloading"
        class="bg-blue-900 text-white border-none px-6 py-3 rounded-md text-base font-bold cursor-pointer transition-colors duration-300 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isDownloading ? '下载中...' : '下载机票' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'

// 响应式数据
const qrContent = ref('52631561526')
const flightNumber = ref('MZH315')
const flightDate = ref('15 MAR 2000')
const dayOfWeek = ref('星期三 WED')
const boardingTime = ref('10:30')
const departureTime = ref('11:13')
const arrivalTime = ref('01:13')
const gate = ref('15')
const seat = ref('25A')
const passengerName = ref('秦淑慎\nQIN SHU SHEN')
const idNumber = ref('F52631561526')
const vipNumber = ref('VIP88888888')
const ticketNumber = ref('52631561526')
const isDownloading = ref(false)

// DOM 引用
const ticketRef = ref<HTMLElement>()
const qrCanvas = ref<HTMLCanvasElement>()

// 生成二维码
const generateQR = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (!qrCanvas.value) {
      resolve()
      return
    }
    
    const canvas = qrCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve()
      return
    }

    // 清除画布
    ctx.clearRect(0, 0, 144, 144)
    
    // 绘制一个模拟的二维码图案
    ctx.fillStyle = '#000'
    const padding = 12
    const qrSize = (144 - padding * 2) / 18
    
    // 生成一个基于内容的伪随机二维码图案
    const content = qrContent.value
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash + content.charCodeAt(i)) & 0xffffffff
    }
    
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        // 使用简单的算法生成图案
        const shouldFill = ((hash + i * 17 + j * 13) % 3) === 0
        if (shouldFill) {
          ctx.fillRect(padding + i * qrSize, padding + j * qrSize, qrSize, qrSize)
        }
      }
    }
    
    // 绘制定位标记（三个角）
    const drawPositionMarker = (x: number, y: number) => {
      // 外框
      ctx.fillRect(padding + x * qrSize, padding + y * qrSize, qrSize * 3, qrSize * 3)
      ctx.fillStyle = '#fff'
      ctx.fillRect(padding + (x + 0.5) * qrSize, padding + (y + 0.5) * qrSize, qrSize * 2, qrSize * 2)
      ctx.fillStyle = '#000'
      ctx.fillRect(padding + (x + 1) * qrSize, padding + (y + 1) * qrSize, qrSize, qrSize)
    }
    
    drawPositionMarker(0, 0)
    drawPositionMarker(15, 0)
    drawPositionMarker(0, 15)
    
    // 使用requestAnimationFrame确保渲染完成
    requestAnimationFrame(() => {
      resolve()
    })
  })
}

// 下载机票
const downloadTicket = async () => {
  if (!ticketRef.value || isDownloading.value) return
  
  isDownloading.value = true
  
  try {
    // 确保二维码已经生成
    await generateQR()
    
    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 选中目标元素
    const element = ticketRef.value
    if (!element) {
      console.error("找不到票据元素")
      return
    }

    // 计算高分辨率比例，假设目标打印 300ppi，屏幕通常是 96dpi
    const dpi = 96
    const targetPPI = 300
    const scale = targetPPI / dpi

    console.log(`开始截图，缩放比例: ${scale}`)

    // 用 html2canvas 渲染
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true
    })

    console.log(`截图完成，尺寸: ${canvas.width}x${canvas.height}px`)
    console.log(`期望尺寸: ${1588 * scale}x${726 * scale}px`)
    console.log(`元素实际尺寸: ${element.offsetWidth}x${element.offsetHeight}px`)

    // 生成图片下载
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = `boarding-pass-${flightNumber.value}-${Date.now()}.png`
    link.click()
    
  } catch (error) {
    console.error('下载失败:', error)
    alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    isDownloading.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    generateQR()
  })
})
</script>
