<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
    <!-- 背景音乐 -->
    <audio 
      ref="bgmAudio" 
      loop 
      preload="auto"
      class="hidden"
    >
      <!-- 使用data URL生成简单的BGM -->
    </audio>

    <!-- 像素风格背景 -->
    <div class="pixel-bg absolute inset-0"></div>
    
    <!-- 雨滴动画背景 -->
    <div class="rain-container absolute inset-0 pointer-events-none">
      <div v-for="n in 30" :key="n" class="rain-drop" :style="rainDropStyle(n)"></div>
    </div>

    <!-- 霓虹灯效果的标题 -->
    <div class="relative z-10">
      <header class="text-center py-8 relative">
        <div class="neon-title text-6xl md:text-8xl font-bold mb-4 tracking-wider pixel-font">
          再见黎明
        </div>
        <div class="neon-subtitle text-2xl md:text-3xl font-light tracking-widest opacity-80">
          FAREWELL TO DAWN
        </div>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
      </header>

      <!-- 主要内容区域 -->
      <div class="container mx-auto px-4 py-8">
        <!-- 故事背景 -->
        <section class="mb-16 text-center">
          <div class="backdrop-blur-sm bg-black/30 rounded-lg p-8 border border-red-500/30 fade-in-up pixel-border">
            <h2 class="text-3xl md:text-4xl font-bold mb-6 text-red-400 pixel-font">游戏背景</h2>
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div class="text-left space-y-4 text-lg leading-relaxed">
                <p class="slide-in-left">在这个充满危险与机遇的城市里，黑白两道的界限早已模糊不清。</p>
                <p class="slide-in-left delay-1">九十年代的香港，霓虹闪烁，人心险恶。</p>
                <p class="slide-in-left delay-2">当黎明破晓时，有人会永远告别这个世界...</p>
              </div>
              <div class="slide-in-right">
                <!-- SVG 香港夜景 -->
                <div class="pixel-city-animation">
                  <svg viewBox="0 0 400 200" class="w-full h-48 rounded-lg border-2 border-red-500/50">
                    <defs>
                      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a2e"/>
                        <stop offset="100%" style="stop-color:#16213e"/>
                      </linearGradient>
                    </defs>
                    <!-- 天空背景 -->
                    <rect width="400" height="200" fill="url(#skyGradient)"/>
                    <!-- 建筑物 -->
                    <rect x="50" y="120" width="40" height="80" fill="#2c3e50" class="building-1"/>
                    <rect x="100" y="100" width="30" height="100" fill="#34495e" class="building-2"/>
                    <rect x="140" y="110" width="50" height="90" fill="#2c3e50" class="building-3"/>
                    <rect x="200" y="90" width="35" height="110" fill="#34495e" class="building-4"/>
                    <rect x="250" y="105" width="45" height="95" fill="#2c3e50" class="building-5"/>
                    <rect x="310" y="85" width="40" height="115" fill="#34495e" class="building-6"/>
                    <!-- 窗户灯光 -->
                    <rect x="55" y="130" width="8" height="8" fill="#ffd700" class="window-light"/>
                    <rect x="70" y="145" width="8" height="8" fill="#ffd700" class="window-light delay-1"/>
                    <rect x="105" y="115" width="6" height="6" fill="#ffd700" class="window-light delay-2"/>
                    <rect x="145" y="125" width="8" height="8" fill="#ffd700" class="window-light delay-3"/>
                    <rect x="205" y="105" width="6" height="6" fill="#ffd700" class="window-light"/>
                    <rect x="255" y="120" width="8" height="8" fill="#ffd700" class="window-light delay-1"/>
                    <rect x="315" y="100" width="6" height="6" fill="#ffd700" class="window-light delay-2"/>
                    <!-- 霓虹招牌 -->
                    <rect x="160" y="130" width="20" height="10" fill="#ff0040" class="neon-sign"/>
                    <rect x="270" y="125" width="15" height="8" fill="#00ff88" class="neon-sign delay-1"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 角色装备 -->
        <section class="mb-16">
          <h2 class="text-4xl font-bold text-center mb-12 neon-text pixel-font">角色装备</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 装备卡片 -->
            <div v-for="(item, index) in equipment" :key="index" 
                 class="equipment-card bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg p-6 border border-red-500/30 hover:border-red-500 transition-all duration-300 hover:scale-105 pixel-border"
                 :style="{ animationDelay: `${index * 0.2}s` }">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4 pixel-circle">
                  <span class="text-xl font-bold">{{ index + 1 }}</span>
                </div>
                <h3 class="text-xl font-bold pixel-font">{{ item.name }}</h3>
              </div>
              <p class="text-gray-300 leading-relaxed mb-4">{{ item.description }}</p>
              <div class="mt-4 flex justify-center">
                <!-- SVG 图标替换图片 -->
                <div class="w-24 h-24 border border-red-500/30 rounded-lg flex items-center justify-center bg-gray-700/50 pixel-item">
                  <div v-html="item.icon" class="w-16 h-16"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 故事情节 -->
        <section class="mb-16">
          <h2 class="text-4xl font-bold text-center mb-12 neon-text pixel-font">剧情片段</h2>
          <div class="backdrop-blur-sm bg-black/40 rounded-lg p-8 border border-red-500/30 pixel-border">
            <div class="space-y-6 text-lg leading-relaxed">
              <p class="typewriter">接下来你就可以开始你的表演了，前面你就会体会到被人围困的感觉...</p>
              <p class="typewriter delay-3">你说什么都是什么，内容问sir拿你一点办法都没有，港音腔起来...</p>
              <p class="typewriter delay-6">马雅起来，东兴弟弟，烟熏眼套请上身，记住了要多跷舌合多黏音...</p>
            </div>
          </div>
        </section>

        <!-- 游戏规则 -->
        <section class="mb-16">
          <h2 class="text-4xl font-bold text-center mb-12 neon-text pixel-font">游戏须知</h2>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="rule-card bg-gradient-to-br from-red-900/30 to-black/50 rounded-lg p-6 border border-red-500/30 pixel-border">
              <h3 class="text-2xl font-bold mb-4 text-red-400 pixel-font">入戏要求</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="pixel-bullet">• 保持角色设定</li>
                <li class="pixel-bullet">• 体验港风文化</li>
                <li class="pixel-bullet">• 沉浸式表演</li>
                <li class="pixel-bullet">• 团队协作</li>
              </ul>
            </div>
            <div class="rule-card bg-gradient-to-br from-red-900/30 to-black/50 rounded-lg p-6 border border-red-500/30 pixel-border">
              <h3 class="text-2xl font-bold mb-4 text-red-400 pixel-font">游戏目标</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="pixel-bullet">• 找出真相</li>
                <li class="pixel-bullet">• 完成任务</li>
                <li class="pixel-bullet">• 生存到最后</li>
                <li class="pixel-bullet">• 揭开谜底</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 氛围展示 -->
        <section class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-12 neon-text pixel-font">游戏氛围</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(item, index) in atmosphereItems" :key="index" 
                 class="atmosphere-card bg-gray-800/50 rounded-lg p-4 border border-red-500/30 hover:border-red-500 transition-all duration-300 hover:scale-110 cursor-pointer pixel-border"
                 @click="playSound(item.sound)">
              <div v-html="item.icon" class="w-16 h-16 mx-auto mb-2"></div>
              <p class="text-sm text-gray-300">{{ item.name }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 控制按钮 -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:gap-4">
        <button 
          @click="toggleMusic" 
          class="control-btn bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center gap-2 pixel-border"
        >
          <span v-if="isPlaying">🔊</span>
          <span v-else>🔇</span>
          <span class="btn-text">{{ isPlaying ? '静音' : 'BGM' }}</span>
        </button>
        <button 
          @click="toggleFullscreen" 
          class="control-btn bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center gap-2 pixel-border"
        >
          <span>🖥️</span>
          <span class="btn-text">全屏</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 音频控制
const bgmAudio = ref<HTMLAudioElement>()
const isPlaying = ref(false)

// 装备数据 - 使用SVG图标
const equipment = ref([
  {
    name: "黑色正装",
    description: "标准的黑色西装，彰显身份地位，让你在夜色中更加神秘。",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-gray-800">
      <rect x="20" y="20" width="24" height="40" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
      <rect x="22" y="22" width="20" height="8" fill="#333"/>
      <circle cx="32" cy="18" r="6" fill="#f4c2a1"/>
      <rect x="28" y="30" width="8" height="2" fill="#ff0000"/>
    </svg>`
  },
  {
    name: "雪茄",
    description: "古巴雪茄，点燃后烟雾缭绕，增添几分江湖气息。",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-amber-600">
      <rect x="10" y="30" width="44" height="4" rx="2" fill="#8B4513"/>
      <rect x="8" y="31" width="4" height="2" rx="1" fill="#CD853F"/>
      <circle cx="60" cy="32" r="2" fill="#FF4500" class="animate-pulse"/>
      <path d="M 56 28 Q 58 26 60 28 Q 58 30 56 32" fill="#666" opacity="0.5" class="smoke"/>
    </svg>`
  },
  {
    name: "巧克力雪糕",
    description: "意外的道具，在紧张的氛围中带来一丝甜蜜。",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-amber-700">
      <rect x="24" y="45" width="16" height="15" fill="#DEB887"/>
      <rect x="26" y="20" width="12" height="25" fill="#8B4513"/>
      <circle cx="32" cy="15" r="8" fill="#F4A460"/>
      <circle cx="28" cy="12" r="2" fill="#8B4513"/>
      <circle cx="36" cy="18" r="2" fill="#8B4513"/>
    </svg>`
  },
  {
    name: "手枪",
    description: "最后的依靠，关键时刻可能决定生死。",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-gray-600">
      <rect x="10" y="28" width="20" height="8" fill="#2F4F4F"/>
      <rect x="30" y="30" width="12" height="4" fill="#2F4F4F"/>
      <rect x="42" y="31" width="8" height="2" fill="#2F4F4F"/>
      <rect x="8" y="32" width="4" height="2" fill="#1C1C1C"/>
      <circle cx="45" cy="32" r="1" fill="#FFD700"/>
    </svg>`
  },
  {
    name: "劳力士手表",
    description: "奢华的象征，显示着主人的身份和地位。",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-yellow-500">
      <circle cx="32" cy="32" r="16" fill="#FFD700" stroke="#B8860B" stroke-width="2"/>
      <circle cx="32" cy="32" r="12" fill="#1C1C1C"/>
      <rect x="31" y="20" width="2" height="8" fill="#FFD700"/>
      <rect x="31" y="36" width="2" height="8" fill="#FFD700"/>
      <rect x="44" y="31" width="8" height="2" fill="#FFD700"/>
      <rect x="20" y="31" width="8" height="2" fill="#FFD700"/>
      <circle cx="32" cy="32" r="2" fill="#FFD700"/>
    </svg>`
  }
])

// 氛围元素
const atmosphereItems = ref([
  {
    name: "霓虹灯",
    sound: "neon",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-pink-500 animate-pulse">
      <rect x="8" y="20" width="48" height="24" fill="none" stroke="#FF1493" stroke-width="3"/>
      <text x="32" y="36" text-anchor="middle" fill="#FF1493" font-size="12">NEON</text>
    </svg>`
  },
  {
    name: "雨夜",
    sound: "rain",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-blue-400">
      <path d="M20 10 L22 20 L18 20 Z" fill="#4A90E2"/>
      <path d="M30 15 L32 25 L28 25 Z" fill="#4A90E2"/>
      <path d="M40 12 L42 22 L38 22 Z" fill="#4A90E2"/>
      <path d="M25 25 L27 35 L23 35 Z" fill="#4A90E2"/>
      <path d="M35 20 L37 30 L33 30 Z" fill="#4A90E2"/>
    </svg>`
  },
  {
    name: "香烟",
    sound: "smoke",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-gray-400">
      <rect x="20" y="30" width="20" height="2" fill="#DDD"/>
      <circle cx="18" cy="31" r="1" fill="#FF4500"/>
      <path d="M 16 28 Q 14 26 12 28 Q 14 30 16 32" fill="#666" opacity="0.6"/>
    </svg>`
  },
  {
    name: "城市",
    sound: "city",
    icon: `<svg viewBox="0 0 64 64" fill="currentColor" class="text-gray-600">
      <rect x="10" y="30" width="8" height="20" fill="#2F4F4F"/>
      <rect x="20" y="25" width="8" height="25" fill="#2F4F4F"/>
      <rect x="30" y="35" width="8" height="15" fill="#2F4F4F"/>
      <rect x="40" y="20" width="8" height="30" fill="#2F4F4F"/>
      <rect x="12" y="35" width="2" height="2" fill="#FFD700"/>
      <rect x="22" y="30" width="2" height="2" fill="#FFD700"/>
      <rect x="42" y="25" width="2" height="2" fill="#FFD700"/>
    </svg>`
  }
])

// 雨滴样式生成
const rainDropStyle = (index: number) => {
  const left = Math.random() * 100
  const animationDuration = 0.5 + Math.random() * 1
  const animationDelay = Math.random() * 2
  
  return {
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

// 创建简单的音频
const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = type
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

// 音乐控制
const toggleMusic = () => {
  if (isPlaying.value) {
    isPlaying.value = false
    // 停止播放
  } else {
    isPlaying.value = true
    // 开始播放简单的背景音乐循环
    playBGM()
  }
}

// 播放背景音乐
const playBGM = () => {
  if (!isPlaying.value) return
  
  // 播放简单的和弦进行
  const notes = [220, 277, 330, 277] // A, C#, E, C#
  let index = 0
  
  const playNext = () => {
    if (!isPlaying.value) return
    
    createTone(notes[index], 2, 'sine')
    createTone(notes[index] * 1.5, 2, 'triangle')
    
    index = (index + 1) % notes.length
    setTimeout(playNext, 2000)
  }
  
  playNext()
}

// 播放音效
const playSound = (soundType: string) => {
  switch(soundType) {
    case 'neon':
      createTone(800, 0.3, 'square')
      break
    case 'rain':
      createTone(200, 0.5, 'sawtooth')
      break
    case 'smoke':
      createTone(150, 0.8, 'triangle')
      break
    case 'city':
      createTone(100, 1, 'square')
      break
  }
}

// 全屏控制
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  // 页面加载完成后的初始化
  console.log('再见黎明剧本杀页面已加载')
})

onUnmounted(() => {
  isPlaying.value = false
})
</script>

<style scoped>
/* 像素风格字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.pixel-font {
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
}

/* 像素风格背景 */
.pixel-bg {
  background-image: 
    radial-gradient(circle at 25% 25%, #ff0040 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, #00ff88 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
  animation: pixel-scroll 20s linear infinite;
}

@keyframes pixel-scroll {
  0% { background-position: 0 0, 10px 10px; }
  100% { background-position: 20px 20px, 30px 30px; }
}

/* 像素风格边框 */
.pixel-border {
  border-style: solid;
  border-image: linear-gradient(45deg, #ff0040, #00ff88) 1;
}

.pixel-circle {
  border: 2px solid #ff0040;
  box-shadow: 
    inset 0 0 10px rgba(255, 0, 64, 0.3),
    0 0 10px rgba(255, 0, 64, 0.3);
}

.pixel-item {
  background: 
    linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
    linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
    linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
  background-size: 4px 4px;
  background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
}

.pixel-bullet {
  position: relative;
  padding-left: 20px;
}

.pixel-bullet::before {
  content: "■";
  position: absolute;
  left: 0;
  color: #ff0040;
  animation: blink 2s infinite;
}

/* 霓虹灯效果 */
.neon-title {
  color: #ff0040;
  text-shadow: 
    0 0 5px #ff0040,
    0 0 10px #ff0040,
    0 0 15px #ff0040,
    0 0 20px #ff0040,
    0 0 35px #ff0040,
    0 0 40px #ff0040;
  animation: neon-flicker 2s infinite alternate;
}

.neon-subtitle {
  color: #00ff88;
  text-shadow: 
    0 0 5px #00ff88,
    0 0 10px #00ff88,
    0 0 15px #00ff88;
}

.neon-text {
  color: #ff6b35;
  text-shadow: 
    0 0 5px #ff6b35,
    0 0 10px #ff6b35,
    0 0 15px #ff6b35;
}

@keyframes neon-flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 
      0 0 5px #ff0040,
      0 0 10px #ff0040,
      0 0 15px #ff0040,
      0 0 20px #ff0040,
      0 0 35px #ff0040,
      0 0 40px #ff0040;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 像素城市动画 */
.pixel-city-animation .building-1 { animation: building-sway 3s ease-in-out infinite; }
.pixel-city-animation .building-2 { animation: building-sway 3.5s ease-in-out infinite; }
.pixel-city-animation .building-3 { animation: building-sway 4s ease-in-out infinite; }
.pixel-city-animation .building-4 { animation: building-sway 3.2s ease-in-out infinite; }
.pixel-city-animation .building-5 { animation: building-sway 3.8s ease-in-out infinite; }
.pixel-city-animation .building-6 { animation: building-sway 4.2s ease-in-out infinite; }

@keyframes building-sway {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.window-light {
  animation: window-flicker 2s infinite;
}

.window-light.delay-1 { animation-delay: 0.5s; }
.window-light.delay-2 { animation-delay: 1s; }
.window-light.delay-3 { animation-delay: 1.5s; }

@keyframes window-flicker {
  0%, 80% { opacity: 1; }
  85%, 95% { opacity: 0.3; }
  100% { opacity: 1; }
}

.neon-sign {
  animation: neon-pulse 1.5s infinite;
}

.neon-sign.delay-1 { animation-delay: 0.8s; }

@keyframes neon-pulse {
  0%, 50% { opacity: 1; box-shadow: 0 0 10px currentColor; }
  51%, 100% { opacity: 0.5; box-shadow: none; }
}

/* 雨滴动画 */
.rain-drop {
  position: absolute;
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, transparent, rgba(100, 200, 255, 0.5), transparent);
  animation: rain-fall linear infinite;
}

@keyframes rain-fall {
  to {
    transform: translateY(100vh);
  }
}

/* 烟雾动画 */
.smoke {
  animation: smoke-drift 3s ease-in-out infinite;
}

@keyframes smoke-drift {
  0% { transform: translateY(0) scale(1); opacity: 0.5; }
  50% { transform: translateY(-10px) scale(1.2); opacity: 0.3; }
  100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
}

/* 其他动画保持不变 */
.fade-in-up {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
  opacity: 0;
}

.slide-in-left.delay-1 {
  animation-delay: 0.5s;
}

.slide-in-left.delay-2 {
  animation-delay: 1s;
}

.slide-in-right {
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.equipment-card {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typewriter {
  overflow: hidden;
  border-right: 2px solid #ff0040;
  white-space: nowrap;
  margin: 0 auto;
  animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
}

.typewriter.delay-3 {
  animation-delay: 3s;
  animation-fill-mode: both;
}

.typewriter.delay-6 {
  animation-delay: 6s;
  animation-fill-mode: both;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: #ff0040;
  }
}

.rule-card {
  animation: zoomIn 0.6s ease-out;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.atmosphere-card {
  animation: float 3s ease-in-out infinite;
}

.atmosphere-card:nth-child(2) { animation-delay: 0.5s; }
.atmosphere-card:nth-child(3) { animation-delay: 1s; }
.atmosphere-card:nth-child(4) { animation-delay: 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .neon-title {
    font-size: 3rem;
  }
  
  .neon-subtitle {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 1rem;
    padding-bottom: 120px; /* 为按钮留出空间 */
  }
  
  .pixel-bg {
    background-size: 10px 10px;
  }
  
  /* 移动端按钮样式 */
  .control-btn {
    width: 56px;
    height: 56px;
    padding: 0;
    font-size: 12px;
    min-height: 56px;
    touch-action: manipulation; /* 优化触摸响应 */
  }
  
  .control-btn .btn-text {
    display: none;
  }
  
  .control-btn span:first-child {
    font-size: 24px;
  }
  
  /* 移动端按钮容器 */
  .fixed.bottom-4.right-4 {
    bottom: 20px;
    right: 16px;
  }
  
  /* 优化移动端卡片间距 */
  .equipment-card {
    margin-bottom: 1rem;
  }
  
  .atmosphere-card {
    padding: 12px;
  }
  
  /* 移动端字体调整 */
  .pixel-font {
    letter-spacing: 1px;
  }
  
  /* 移动端霓虹效果优化 */
  .neon-title {
    text-shadow: 
      0 0 3px #ff0040,
      0 0 6px #ff0040,
      0 0 9px #ff0040;
  }
}

/* 桌面端按钮样式 */
@media (min-width: 769px) {
  .control-btn {
    padding: 12px 24px;
    width: auto;
    height: auto;
    min-height: auto;
  }
  
  .control-btn .btn-text {
    display: inline;
  }
}
</style>