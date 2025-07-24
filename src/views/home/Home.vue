<template>
  <div class="p-4">
    <div class="mt-10 flex justify-center items-center">
      <Title />
    </div>

    <div class="relative card-container">
      <!-- 动态渲染卡片，支持点击轮播 -->
      <component 
        :is="cardComponents[cardOrder[0]]" 
        ref="card0"
        class="absolute z-40 scale-110 -translate-y-10 cursor-pointer card-item"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[1]]" 
        ref="card1"
        class="absolute z-30 scale-100 translate-y-6 cursor-pointer card-item"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[2]]" 
        ref="card2"
        class="absolute z-20 scale-90 translate-y-20 cursor-pointer card-item"
        @click="nextCard"
      />
      <component 
        :is="cardComponents[cardOrder[3]]" 
        ref="card3"
        class="absolute z-10 translate-y-32 cursor-pointer card-item"
        style="
          --tw-scale-x: 0.8;
          --tw-scale-y: 0.8;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
        "
        @click="nextCard"
      />
    </div>

    <div v-if="removedCount == 4">
      <jindu />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from 'vue-router'

import one from './card/one.vue'
import tow from './card/tow.vue'
import three from './card/three.vue'
import four from './card/four.vue'
import Title from './title.vue'
import jindu from './jindu.vue'

const router = useRouter()

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
const removedCount = ref(0) // 记录已移除的卡片数量

// 卡片元素引用
const card0 = ref()
const card1 = ref()
const card2 = ref()
const card3 = ref()

// 计算卡片居中的X轴偏移量
const calculateCenterOffset = () => {
  if (card0.value?.$el) {
    const container = card0.value.$el.parentElement
    const cardElement = card0.value.$el
    
    if (container && cardElement) {
      const containerWidth = container.offsetWidth
      const cardWidth = cardElement.offsetWidth
      const offset = (containerWidth - cardWidth) / 2
      return offset
    }
  }
  return 0
}

// 卡片位置配置 - 动态计算X轴偏移
const getCardPositions = () => {
  const centerOffset = calculateCenterOffset()
  return [
    { scale: 1.1, x: centerOffset, y: -40, z: 40 },  // 第一张卡片 - 动态居中
    { scale: 1, x: centerOffset, y: 24, z: 30 },     // 第二张卡片
    { scale: 0.9, x: centerOffset, y: 80, z: 20 },   // 第三张卡片
    { scale: 0.8, x: centerOffset, y: 128, z: 10 }   // 第四张卡片
  ]
}

// 移动端检测
const isMobile = () => {
  return window.innerWidth < 768
}

onMounted(() => {
  // 等待DOM渲染完成后初始化卡片位置
  nextTick(() => {
    setTimeout(() => {
      initCardPositions()
    }, 100) // 延迟确保SVG完全加载
  })
  
  // 监听窗口大小变化，重新计算居中
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 处理窗口大小变化
const handleResize = () => {
  setTimeout(() => {
    initCardPositions()
  }, 100)
}

// 初始化卡片位置
const initCardPositions = () => {
  const cards = [card0.value, card1.value, card2.value, card3.value]
  
  cards.forEach((card, index) => {
    if (card?.$el && index < cardOrder.value.length) {
      const pos = getCardPositions()[index] // 使用动态计算的卡片位置
      gsap.set(card.$el, {
        scale: pos.scale,
        x: pos.x,
        y: pos.y,
        zIndex: pos.z,
        opacity: 1
      })
    } else if (card?.$el) {
      // 隐藏已移除的卡片
      gsap.set(card.$el, {
        opacity: 0,
        scale: 0
      })
    }
  })
}

// 切换到下一张卡片
const nextCard = async () => {
  if (isAnimating.value || removedCount.value >= 4) return // 防止动画期间重复点击或已执行完4次
  
  isAnimating.value = true
  
  const cards = [card0.value, card1.value, card2.value, card3.value]
  const remainingCards = cardOrder.value.length
  
  // 创建时间线
  const tl = gsap.timeline({
    onComplete: () => {
      // 动画完成后移除第一张卡片
      cardOrder.value.shift()
      removedCount.value++
      
      // 等待Vue更新DOM后重新初始化位置
      nextTick(() => {
        initCardPositions()
        isAnimating.value = false
        
        // 如果是第4次点击，2秒后跳转到model页面
        if (removedCount.value === 4) {
          setTimeout(() => {
            router.push('/model')
          }, 2000)
        }
      })
    }
  })
  
  // 第一张卡片：淡出并向上消失
  if (cards[0]?.$el) {
    tl.to(cards[0].$el, {
      opacity: 0,
      scale: 0.6,
      y: -100,
      rotation: 15,
      duration: 0.8,
      ease: "power2.inOut"
    }, 0)
  }
  
  // 其他卡片：向前移动一个位置
  for (let i = 1; i < remainingCards; i++) {
    if (cards[i]?.$el) {
      const targetPos = getCardPositions()[i - 1] // 移动到前一个位置
      tl.to(cards[i].$el, {
        scale: targetPos.scale,
        x: targetPos.x,
        y: targetPos.y,
        zIndex: targetPos.z,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0.2) // 稍微延迟，让消失动画先开始
    }
  }
}
</script>

<style scoped>

</style>
