<template>
  <div>

    <div class="flex justify-center items-center">
      <Title />
    </div>

    <one />
    <tow />
    <three />
    <four />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import one from './card/one.vue'
import tow from './card/tow.vue'
import three from './card/three.vue'
import four from './card/four.vue'
import Title from './title.vue'

const currentCard = ref(0)

const nextCard = () => {
  if (currentCard.value < 3) {
    currentCard.value++
  } else {
    // 可以重置到第一张卡片或者执行其他逻辑
    currentCard.value = 0
  }
}
</script>

<style scoped>
.cards-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.cards-wrapper {
  display: flex;
  width: 400%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card {
  width: 25%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

/* 卡片1 - 红色主题 */
.card-1 {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

/* 卡片2 - 紫色主题 */
.card-2 {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

/* 卡片3 - 绿色主题 */
.card-3 {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
}

/* 卡片4 - 橘粉色主题 */
.card-4 {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.step-indicator {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-title {
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.2;
}

.category {
  text-align: center;
  margin-bottom: 40px;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.category-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.option-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 200px;
}

.option-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.card-footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.progress-dots {
  display: flex;
  gap: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dot.active {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card {
    padding: 15px;
  }

  .main-title {
    font-size: 24px;
  }

  .category-title {
    font-size: 20px;
  }

  .option-btn {
    min-width: 180px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 20px;
  }

  .option-btn {
    min-width: 160px;
    padding: 10px 20px;
  }
}
</style>