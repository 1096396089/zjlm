<template>
  <div class="ticket-container">
    <div class="ticket" ref="ticketRef">
      <!-- 顶部标题栏 -->
      <div class="header">
        <div class="airport-title">
          <span class="chinese">香港国际机场</span>
          <span class="english">HONG KONG INTERNATIONAL AIRPORT</span>
        </div>
        <div class="boarding-pass">
          <span class="boarding-text">BOARDING PASS</span>
          <span class="chinese-boarding">登机牌</span>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧主要信息 -->
        <div class="left-section">
          <!-- 航班信息行 -->
          <div class="flight-info-row">
            <div class="flight-number">
              <span class="plane-icon">✈</span>
              <span class="flight-code">{{ flightNumber }}</span>
            </div>
            <div class="vip-priority">VIP PRIORITY</div>
            <div class="flight-date">
              <div class="date">{{ flightDate }}</div>
              <div class="day">{{ dayOfWeek }}</div>
            </div>
            <div class="star-icon">★</div>
          </div>

          <!-- 路线信息 -->
          <div class="route-section">
            <div class="origin">
              <div class="airport-code">HKG</div>
              <div class="airport-name">香港国际机场</div>
            </div>
            <div class="route-arrow">
              <div class="arrow-line"></div>
              <div class="arrow-head">→</div>
            </div>
            <div class="destination">
              <div class="airport-code">CDG</div>
              <div class="airport-name">法国巴黎</div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="details-section">
            <div class="detail-row">
              <div class="detail-item">
                <div class="label">登机时间 BOARDING</div>
                <div class="value">{{ boardingTime }}</div>
              </div>
              <div class="detail-item">
                <div class="label">起飞 DEPARTURE</div>
                <div class="value">{{ departureTime }}</div>
              </div>
              <div class="detail-item">
                <div class="label">到达 ARRIVAL</div>
                <div class="value">次日 {{ arrivalTime }}</div>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <div class="label">登机口 GATE</div>
                <div class="value">{{ gate }}</div>
              </div>
              <div class="detail-item">
                <div class="label">座位 SEAT</div>
                <div class="value">{{ seat }}</div>
              </div>
              <div class="detail-item">
                <div class="label">舱位 CLASS</div>
                <div class="value">商务舱</div>
              </div>
            </div>
          </div>

          <!-- 底部说明 -->
          <div class="bottom-text">
            贵宾通道优先登机 PRIORITY BOARDING THROUGH VIP CHANNEL
          </div>
        </div>

        <!-- 分割线 -->
        <div class="separator"></div>

        <!-- 右侧乘客信息 -->
        <div class="right-section">
          <div class="vip-header">
            <span class="vip-text">贵宾乘客 VIP</span>
            <span class="passenger-text">PASSENGER</span>
          </div>

          <div class="passenger-info">
            <div class="name-section">
              <div class="label">姓名 NAME</div>
              <div class="passenger-name">{{ passengerName }}</div>
            </div>

            <div class="id-section">
              <div class="label">证件号 ID</div>
              <div class="id-number">{{ idNumber }}</div>
            </div>

            <div class="vip-number">
              <div class="label">会员编号 VIP NO.</div>
              <div class="vip-no">{{ vipNumber }}</div>
              <div class="gold-badge">GOLD</div>
            </div>

            <!-- 二维码区域 -->
            <div class="qr-section">
              <div class="qr-code" ref="qrCodeRef">
                <canvas ref="qrCanvas" width="160" height="160"></canvas>
              </div>
            </div>

            <div class="ticket-number">
              <div class="label">票号 TICKET:</div>
              <div class="ticket-no">{{ ticketNumber }}</div>
            </div>
          </div>

          <div class="star-bottom">★</div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="controls">
      <h3>机票信息编辑</h3>
      <div class="control-group">
        <label>二维码内容:</label>
        <input v-model="qrContent" @input="generateQR" placeholder="输入二维码内容" />
      </div>
      <div class="control-group">
        <label>航班号:</label>
        <input v-model="flightNumber" />
      </div>
      <div class="control-group">
        <label>乘客姓名:</label>
        <input v-model="passengerName" />
      </div>
      <button @click="downloadTicket" class="download-btn">下载机票</button>
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

// DOM 引用
const ticketRef = ref<HTMLElement>()
const qrCanvas = ref<HTMLCanvasElement>()
const qrCodeRef = ref<HTMLElement>()

// 生成二维码
const generateQR = async () => {
  if (!qrCanvas.value) return
  
  // 这里使用一个简单的二维码生成方法
  // 在实际项目中，你可能需要安装 qrcode 库
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清除画布
  ctx.clearRect(0, 0, 160, 160)
  
  // 绘制一个模拟的二维码图案
  ctx.fillStyle = '#000'
  const size = 8
  const padding = 16
  const qrSize = (160 - padding * 2) / 18
  
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
}

// 下载机票
const downloadTicket = async () => {
  if (!ticketRef.value) return
  
  try {
    const canvas = await html2canvas(ticketRef.value, {
      width: 1588,
      height: 726,
      scale: 2,
      backgroundColor: '#f5f5dc'
    })
    
    const link = document.createElement('a')
    link.download = `ticket-${flightNumber.value}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  } catch (error) {
    console.error('下载失败:', error)
  }
}

onMounted(() => {
  nextTick(() => {
    generateQR()
  })
})
</script>

<style scoped>
.ticket-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}

.ticket {
  width: 1588px;
  height: 726px;
  background: linear-gradient(135deg, #f5f5dc 0%, #faf0e6 100%);
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

/* 顶部标题栏 */
.header {
  background: linear-gradient(90deg, #1e3a8a 0%, #3730a3 100%);
  color: white;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.airport-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chinese {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 4px;
}

.english {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.boarding-pass {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.boarding-text {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.chinese-boarding {
  font-size: 16px;
  color: #ffd700;
  margin-top: 4px;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  height: 646px;
  position: relative;
}

.left-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.separator {
  width: 2px;
  background: linear-gradient(to bottom, transparent 0%, #ddd 20%, #ddd 80%, transparent 100%);
  margin: 20px 0;
  position: relative;
}

.separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #f5f5dc;
  border: 2px dashed #ddd;
  border-radius: 50%;
}

.right-section {
  width: 420px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 航班信息行 */
.flight-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.flight-number {
  display: flex;
  align-items: center;
  gap: 16px;
}

.plane-icon {
  color: #ffd700;
  font-size: 32px;
  transform: rotate(-45deg);
}

.flight-code {
  font-size: 36px;
  font-weight: bold;
  color: #1e3a8a;
}

.vip-priority {
  background: #1e3a8a;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}

.flight-date {
  text-align: right;
}

.date {
  font-size: 24px;
  font-weight: bold;
  color: #1e3a8a;
}

.day {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.star-icon {
  color: #ffd700;
  font-size: 32px;
}

/* 路线信息 */
.route-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
}

.origin, .destination {
  text-align: center;
}

.airport-code {
  font-size: 72px;
  font-weight: bold;
  color: #1e3a8a;
  line-height: 1;
}

.airport-name {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
}

.route-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 40px;
}

.arrow-line {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
  border-radius: 2px;
}

.arrow-head {
  color: #ffd700;
  font-size: 48px;
  font-weight: bold;
  margin-left: 8px;
}

/* 详细信息 */
.details-section {
  margin-bottom: 40px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.detail-item {
  text-align: left;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #1e3a8a;
}

/* 底部文字 */
.bottom-text {
  text-align: center;
  font-size: 16px;
  color: #666;
  letter-spacing: 1px;
  border-top: 2px solid #ffd700;
  padding-top: 20px;
}

/* 右侧乘客信息 */
.vip-header {
  text-align: center;
  margin-bottom: 40px;
}

.vip-text {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.passenger-text {
  color: #1e3a8a;
  font-size: 16px;
  font-weight: bold;
}

.passenger-info .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.name-section {
  margin-bottom: 24px;
}

.passenger-name {
  font-size: 20px;
  font-weight: bold;
  color: #1e3a8a;
  line-height: 1.3;
}

.id-section {
  margin-bottom: 24px;
}

.id-number {
  font-size: 18px;
  font-weight: bold;
  color: #1e3a8a;
}

.vip-number {
  margin-bottom: 32px;
  position: relative;
}

.vip-no {
  font-size: 18px;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 8px;
}

.gold-badge {
  display: inline-block;
  background: #ffd700;
  color: #1e3a8a;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #1e3a8a;
}

/* 二维码区域 */
.qr-section {
  margin: 32px 0;
  text-align: center;
}

.qr-code {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  border: 2px solid #1e3a8a;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-number {
  text-align: center;
}

.ticket-no {
  font-size: 16px;
  font-weight: bold;
  color: #1e3a8a;
}

.star-bottom {
  position: absolute;
  bottom: 40px;
  right: 40px;
  color: #ffd700;
  font-size: 32px;
}

/* 控制面板 */
.controls {
  max-width: 1588px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.controls h3 {
  margin-bottom: 20px;
  color: #1e3a8a;
}

.control-group {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-group label {
  min-width: 100px;
  font-weight: 500;
}

.control-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.download-btn {
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #3730a3;
}
</style>
