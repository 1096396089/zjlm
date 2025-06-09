<template>
  <div class="ticket-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="clouds"></div>
      <div class="flying-planes">
        <div class="plane" v-for="i in 3" :key="i">✈️</div>
      </div>
    </div>

    <!-- 机票主体 -->
    <div class="ticket-wrapper">
      <div class="ticket">
        <!-- 机票头部 -->
        <div class="ticket-header">
          <div class="airport-info">
            <span class="airport-cn">香港国际机场</span>
            <span class="airport-en">HONG KONG INTERNATIONAL AIRPORT</span>
          </div>
          <div class="boarding-pass">
            <span class="boarding-text">BOARDING PASS</span>
            <span class="boarding-cn">登机牌</span>
          </div>
        </div>

        <!-- 机票主要内容 -->
        <div class="ticket-content">
          <!-- 左侧信息 -->
          <div class="left-section">
            <div class="flight-info">
              <div class="flight-number">
                <span class="plane-icon">✈</span>
                <span class="number">MZH315</span>
                <span class="vip-badge">VIP PRIORITY</span>
              </div>
              
              <div class="date-info">
                <span class="date">15 MAR 2000</span>
                <span class="weekday">星期三 WED</span>
              </div>
            </div>

            <div class="route-section">
              <div class="route">
                <div class="departure">
                  <span class="code">HKG</span>
                  <span class="city">香港国际机场</span>
                </div>
                <div class="arrow">
                  <div class="arrow-line"></div>
                  <span class="plane-small">✈</span>
                </div>
                <div class="arrival">
                  <span class="code">CDG</span>
                  <span class="city">法国巴黎</span>
                </div>
              </div>
            </div>

            <div class="time-section">
              <div class="time-group">
                <div class="label">登机时间 BOARDING</div>
                <div class="time">10:30</div>
              </div>
              <div class="time-group">
                <div class="label">起飞 DEPARTURE</div>
                <div class="time">11:13</div>
              </div>
              <div class="time-group">
                <div class="label">到达 ARRIVAL</div>
                <div class="time">次日 01:13</div>
              </div>
            </div>

            <div class="seat-section">
              <div class="seat-group">
                <div class="label">登机口 GATE</div>
                <div class="value">15</div>
              </div>
              <div class="seat-group">
                <div class="label">座位 SEAT</div>
                <div class="value">25A</div>
              </div>
              <div class="seat-group">
                <div class="label">舱位 CLASS</div>
                <div class="value">商务舱</div>
              </div>
            </div>

            <div class="priority-text">
              贵宾通道优先登机 PRIORITY BOARDING THROUGH VIP CHANNEL
            </div>
          </div>

          <!-- 分割线 -->
          <div class="divider">
            <div class="perforation"></div>
          </div>

          <!-- 右侧信息 -->
          <div class="right-section">
            <div class="vip-header">
              <div class="stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <div class="vip-title">贵宾乘客 VIP</div>
              <div class="vip-subtitle">PASSENGER</div>
            </div>

            <div class="passenger-info">
              <div class="name-section">
                <div class="label">姓名 NAME</div>
                <div class="name">秦淑慎</div>
                <div class="name-en">QIN SHU SHEN</div>
              </div>

              <div class="id-section">
                <div class="label">证件号 ID</div>
                <div class="id-number">F5263156152б</div>
              </div>

              <div class="vip-section">
                <div class="label">会员编号 VIP NO.</div>
                <div class="vip-number">VIP88888888</div>
                <div class="gold-badge">GOLD</div>
              </div>
            </div>

            <div class="qr-section">
              <div class="qr-code">
                <div class="qr-pattern"></div>
              </div>
              <div class="ticket-number">票号 TICKET: 5263156152б</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('机票页面加载完成')
})
</script>

<style scoped>
.ticket-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 20%, transparent 21%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 15%, transparent 16%),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 18%, transparent 19%);
  animation: cloudMove 20s linear infinite;
}

@keyframes cloudMove {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(100px); }
}

.flying-planes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.plane {
  position: absolute;
  font-size: 24px;
  color: rgba(255,255,255,0.6);
  animation: flyAcross 15s linear infinite;
}

.plane:nth-child(1) {
  top: 20%;
  animation-delay: 0s;
}

.plane:nth-child(2) {
  top: 60%;
  animation-delay: 5s;
}

.plane:nth-child(3) {
  top: 80%;
  animation-delay: 10s;
}

@keyframes flyAcross {
  0% {
    left: -50px;
    transform: rotate(0deg);
  }
  100% {
    left: calc(100% + 50px);
    transform: rotate(0deg);
  }
}

.ticket-wrapper {
  position: relative;
  z-index: 2;
  animation: slideIn 1s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ticket {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  max-width: 900px;
  min-height: 400px;
  border: 3px solid #1e3c72;
}

.ticket-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #FFD700;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.airport-info {
  display: flex;
  flex-direction: column;
}

.airport-cn {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.airport-en {
  font-size: 1rem;
  opacity: 0.9;
}

.boarding-pass {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.boarding-text {
  font-size: 1.2rem;
  font-weight: bold;
}

.boarding-cn {
  font-size: 1rem;
  opacity: 0.9;
}

.ticket-content {
  display: flex;
  min-height: 350px;
}

.left-section {
  flex: 2;
  padding: 30px;
  background: white;
}

.flight-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.flight-number {
  display: flex;
  align-items: center;
  gap: 10px;
}

.plane-icon {
  font-size: 1.5rem;
  color: #1e3c72;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #1e3c72;
}

.vip-badge {
  background: #1e3c72;
  color: #FFD700;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.date-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3c72;
}

.weekday {
  font-size: 1rem;
  color: #666;
}

.route-section {
  margin-bottom: 30px;
}

.route {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.departure,
.arrival {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.code {
  font-size: 3rem;
  font-weight: bold;
  color: #1e3c72;
  margin-bottom: 5px;
}

.city {
  font-size: 1rem;
  color: #666;
}

.arrow {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 30px;
  position: relative;
}

.arrow-line {
  flex: 1;
  height: 3px;
  background: linear-gradient(to right, #FFD700, #FFA500);
  position: relative;
}

.arrow-line::after {
  content: '';
  position: absolute;
  right: -10px;
  top: -5px;
  width: 0;
  height: 0;
  border-left: 15px solid #FFA500;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.plane-small {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  font-size: 1.5rem;
  color: #1e3c72;
  background: white;
  padding: 5px;
  border-radius: 50%;
}

.time-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.time-group {
  text-align: center;
}

.seat-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.seat-group {
  text-align: center;
}

.label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.time,
.value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3c72;
}

.priority-text {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  padding: 15px;
  border-top: 2px dashed #ddd;
  margin-top: 20px;
}

.divider {
  width: 2px;
  background: #ddd;
  position: relative;
  margin: 0 10px;
}

.perforation {
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-image: repeating-linear-gradient(
    to bottom,
    #ddd 0px,
    #ddd 10px,
    transparent 10px,
    transparent 20px
  );
}

.right-section {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  padding: 30px 25px;
  border-left: 2px dashed #ddd;
}

.vip-header {
  text-align: center;
  margin-bottom: 25px;
}

.stars {
  font-size: 1.5rem;
  color: #FFD700;
  margin-bottom: 10px;
}

.vip-title {
  font-size: 1.2rem;
  color: #FFD700;
  font-weight: bold;
}

.vip-subtitle {
  font-size: 1rem;
  color: #1e3c72;
  font-weight: bold;
}

.passenger-info {
  margin-bottom: 25px;
}

.name-section,
.id-section,
.vip-section {
  margin-bottom: 20px;
}

.name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1e3c72;
  margin-bottom: 5px;
}

.name-en {
  font-size: 1.1rem;
  color: #666;
}

.id-number,
.vip-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1e3c72;
}

.gold-badge {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #1e3c72;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 5px;
  display: inline-block;
}

.qr-section {
  text-align: center;
}

.qr-code {
  width: 100px;
  height: 100px;
  border: 2px solid #1e3c72;
  margin: 0 auto 15px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.qr-pattern {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(45deg, #1e3c72 25%, transparent 25%),
    linear-gradient(-45deg, #1e3c72 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1e3c72 75%),
    linear-gradient(-45deg, transparent 75%, #1e3c72 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}

.ticket-number {
  font-size: 0.9rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ticket {
    max-width: 100%;
    margin: 10px;
  }
  
  .ticket-content {
    flex-direction: column;
  }
  
  .left-section,
  .right-section {
    flex: none;
    padding: 20px;
  }
  
  .divider {
    height: 2px;
    width: auto;
    margin: 0;
  }
  
  .perforation {
    left: 0;
    right: 0;
    top: -1px;
    bottom: auto;
    height: 4px;
    width: auto;
    background-image: repeating-linear-gradient(
      to right,
      #ddd 0px,
      #ddd 10px,
      transparent 10px,
      transparent 20px
    );
  }
  
  .right-section {
    border-left: none;
    border-top: 2px dashed #ddd;
  }
  
  .code {
    font-size: 2rem;
  }
  
  .arrow {
    margin: 0 15px;
  }
}
</style> 