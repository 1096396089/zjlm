<template>
  <div class="p-5 bg-gray-100 min-h-screen">
    <div class="ticket w-[1588px] h-[760px] mx-auto relative overflow-hidden" ref="ticketRef" 
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
              <div class="relative w-44 h-44 mx-auto mb-4">
                <!-- 外层金色装饰环 -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-0.5 shadow-xl">
                  <!-- 中层蓝色环 -->
                  <div class="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5">
                    <!-- 内层白色背景 -->
                    <div class="w-full h-full rounded-lg bg-white p-3 relative overflow-hidden">
                      <!-- 背景装饰图案 -->
                      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-70"></div>
                      <div class="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                      <div class="absolute bottom-3 left-3 w-4 h-4 bg-blue-400 rounded-full opacity-30"></div>
                      <div class="absolute top-1/3 left-2 w-2 h-2 bg-amber-400 rounded-full opacity-40"></div>
                      
                      <!-- 二维码容器 -->
                      <div class="relative z-10 w-full h-full flex items-center justify-center">
                        <div class="bg-white rounded-lg p-2 shadow-inner border border-gray-100">
                          <canvas ref="qrCanvas" width="144" height="144" class="rounded-md"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 顶部VIP标签 -->
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-yellow-400">
                  <span class="mr-1">⭐</span>VIP QR<span class="ml-1">⭐</span>
                </div>
                
                <!-- 底部装饰线 -->
                <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
                
                <!-- 四角钻石装饰 -->
                <div class="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 transform rotate-45 shadow-md"></div>
                <div class="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 transform rotate-45 shadow-md"></div>
                <div class="absolute -bottom-2 -left-2 w-3 h-3 bg-indigo-500 transform rotate-45 shadow-md"></div>
                <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-400 transform rotate-45 shadow-md"></div>
              </div>
              
              <!-- 票号区域 -->
              <div class="text-center">
                <div class="text-xs text-gray-600 mb-2 flex items-center justify-center gap-2">
                  <div class="w-8 h-0.5 bg-gradient-to-r from-transparent to-yellow-400"></div>
                  <span class="px-2 bg-blue-50 rounded-full border border-blue-200 text-blue-800 font-medium">票号 TICKET</span>
                  <div class="w-8 h-0.5 bg-gradient-to-l from-transparent to-yellow-400"></div>
                </div>
                <div class="text-sm font-bold text-blue-900 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl px-4 py-2 inline-block shadow-sm">
                  {{ ticketNumber }}
                </div>
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
      <div class="mb-4 flex items-center gap-3">
        <label class="min-w-[100px] font-medium">票号:</label>
        <input 
          v-model="ticketNumber"
          @input="updateQRContent"
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
import QRCode from 'qrcode'

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
  if (!qrCanvas.value) return
  
  try {
    await QRCode.toCanvas(qrCanvas.value, qrContent.value, {
      width: 144,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
  } catch (error) {
    console.error('二维码生成失败:', error)
    // 如果二维码生成失败，显示错误信息
    const ctx = qrCanvas.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, 144, 144)
      ctx.fillStyle = '#ff0000'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('二维码生成失败', 72, 72)
    }
  }
}

// 更新二维码内容
const updateQRContent = () => {
  qrContent.value = ticketNumber.value
  generateQR()
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
    // 初始化时让二维码内容和票号保持一致
    qrContent.value = ticketNumber.value
    generateQR()
  })
})
</script>
