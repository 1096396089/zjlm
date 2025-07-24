<template>
  <div>
    <div class="mt-10 flex justify-center items-center">
      <Title />
    </div>

    <div class="relative">
      <!-- 动态渲染卡片，支持点击轮播 -->
      <component 
        :is="cardComponents[cardOrder[0]]" 
        ref="card0"
        class="absolute z-40 scale-110 -translate-y-10 cursor-pointer"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[1]]" 
        ref="card1"
        class="absolute z-30 scale-100 translate-y-6 cursor-pointer"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[2]]" 
        ref="card2"
        class="absolute z-20 scale-90 translate-y-20 cursor-pointer"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[3]]" 
        ref="card3"
        class="absolute z-10 translate-y-32 cursor-pointer"
        style="
          --tw-scale-x: 0.8;
          --tw-scale-y: 0.8;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
        "
        @click="nextCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

import one from './card/one.vue'
import tow from './card/tow.vue'
import three from './card/three.vue'
import four from './card/four.vue'
import Title from './title.vue'

// 定义卡片名称类型
type CardName = 'one' | 'tow' | 'three' | 'four'

// 卡片组件映射
const cardComponents = {
  one,
  tow,
  three,
  four
} as const

// 卡片显示顺序（从前到后：one -> tow -> three -> four）
const cardOrder = ref<CardName[]>(['one', 'tow', 'three', 'four'])

// 动画状态
const isAnimating = ref(false)

// 卡片元素引用
const card0 = ref()
const card1 = ref()
const card2 = ref()
const card3 = ref()

// 卡片位置配置
const cardPositions = [
  { scale: 1.1, y: -40, z: 40 },  // 第一张卡片
  { scale: 1, y: 24, z: 30 },     // 第二张卡片
  { scale: 0.9, y: 80, z: 20 },   // 第三张卡片
  { scale: 0.8, y: 128, z: 10 }   // 第四张卡片
]

onMounted(() => {
  // 初始化卡片位置
  initCardPositions()
})

// 初始化卡片位置
const initCardPositions = () => {
  const cards = [card0.value, card1.value, card2.value, card3.value]
  
  cards.forEach((card, index) => {
    if (card?.$el) {
      const pos = cardPositions[index]
      gsap.set(card.$el, {
        scale: pos.scale,
        y: pos.y,
        zIndex: pos.z,
        opacity: 1
      })
    }
  })
}

// 切换到下一张卡片
const nextCard = async () => {
  if (isAnimating.value) return // 防止动画期间重复点击
  
  isAnimating.value = true
  
  const cards = [card0.value, card1.value, card2.value, card3.value]
  
  // 创建时间线
  const tl = gsap.timeline({
    onComplete: () => {
      // 动画完成后更新卡片顺序
      const firstCard = cardOrder.value.shift()
      if (firstCard) {
        cardOrder.value.push(firstCard)
      }
      
      // 等待Vue更新DOM后重新初始化位置
      nextTick(() => {
        initCardPositions()
        isAnimating.value = false
      })
    }
  })
  
  // 第一张卡片：淡出并缩小
  if (cards[0]?.$el) {
    tl.to(cards[0].$el, {
      opacity: 0,
      scale: 0.6,
      y: -60,
      duration: 0.6,
      ease: "power2.inOut"
    }, 0)
  }
  
  // 其他卡片：移动到前一个位置
  cards.slice(1).forEach((card, index) => {
    if (card?.$el) {
      const targetPos = cardPositions[index]
      tl.to(card.$el, {
        scale: targetPos.scale,
        y: targetPos.y,
        zIndex: targetPos.z,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0.1) // 稍微延迟开始，让淡出效果先进行
    }
  })
  
  // 新卡片从底部出现（这里是第四张卡片移动到最后位置）
  if (cards[3]?.$el) {
    const lastPos = cardPositions[3]
    tl.fromTo(cards[3].$el, 
      {
        opacity: 0.5,
        scale: 0.6,
        y: 200
      },
      {
        opacity: 1,
        scale: lastPos.scale,
        y: lastPos.y,
        duration: 0.8,
        ease: "power2.out"
      }, 0.3)
  }
}
</script>

<style scoped>
/* 确保卡片容器有足够的空间 */
.relative {
  min-height: 300px;
}

/* 鼠标悬停效果 */
.cursor-pointer:hover {
  filter: brightness(1.05);
}
</style>
