<template>
  <div class="police-letter-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="stars"></div>
      <div class="floating-elements">
        <div class="element" v-for="i in 6" :key="i"></div>
      </div>
      <div class="police-elements">
        <div class="plane-ticket" v-for="i in 3" :key="i">✈️</div>
        <div class="safety-charm" v-for="i in 4" :key="i">🧿</div>
        <div class="jade-pendant" v-for="i in 3" :key="i">🔮</div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="content-wrapper">
      <!-- 标题部分 -->
      <div class="header">
        <h1 class="title">To 曼臻</h1>
        <div class="date">付生 June 15th</div>
      </div>

      <!-- 信件内容 - 可滚动区域 -->
      <div class="letter-content">
        <div class="letter-scroll-area">
          <div 
            v-for="(paragraph, index) in letterParagraphs" 
            :key="index"
            class="paragraph"
          >
            <p v-html="paragraph.text"></p>
            <div class="emoji" v-if="paragraph.emoji">{{ paragraph.emoji }}</div>
          </div>
        </div>
      </div>

      <!-- 签名 -->
      <div class="signature">
        <div class="signature-text">最疼你嘅爹哋</div>
        <div class="signature-heart">❤️</div>
      </div>
    </div>

    <!-- 音乐控制 -->
    <div class="music-control" @click="toggleMusic">
      <div class="music-icon" :class="{ 'playing': isPlaying }">
        {{ isPlaying ? '🔊' : '🔇' }}
      </div>
      <div class="music-text">{{ isPlaying ? '暂停' : '播放' }}</div>
    </div>

    <!-- 回忆碎片 - 独立层级 -->
    <div class="memory-fragments">
      <div 
        v-for="(fragment, index) in memoryFragments" 
        :key="index"
        class="memory-fragment"
        :style="{ left: fragment.position.left, top: fragment.position.top }"
        @click="openMemoryModal(fragment)"
      >
        {{ fragment.icon }}
      </div>
    </div>

    <!-- 回忆碎片弹窗 -->
    <div v-if="showMemoryModal" class="memory-modal-overlay" @click="closeMemoryModal">
      <div class="memory-modal" @click.stop>
        <div class="memory-modal-header">
          <h3>{{ selectedMemory?.title }}</h3>
          <button class="close-btn" @click="closeMemoryModal">×</button>
        </div>
        <div class="memory-modal-content">
          <div class="memory-image">{{ selectedMemory?.icon }}</div>
          <p>{{ selectedMemory?.content }}</p>
          <div class="memory-date">{{ selectedMemory?.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
let musicGenerator: any = null

// 回忆碎片相关状态
const showMemoryModal = ref(false)
const selectedMemory = ref<any>(null)

// 回忆碎片数据 - 警察主题
const memoryFragments = [
{
    icon: '🍼',
    title: '最早的依赖',
    content: '小时候你忙着社团的事，妈妈吸毒发作，我在角落里哭着问你："你到底有没有爱过她？"',
    date: '2006年秋天',
    position: { left: '20%', top: '15%' }
  },
  {
    icon: '🚪',
    title: '角落里的哭声',
    content: '你拒绝回答我关于妈妈的问题，我在门边听你说"我不会爱任何人"。那一刻我失望极了。',
    date: '2006年冬天',
    position: { left: '30%', top: '20%' }
  },
  {
    icon: '✈️',
    title: '机场离别',
    content: '我离开法国那天，你没有出现。我带着行李独自走进登机口，回头看时，仿佛整个世界都空了。',
    date: '1999年8月',
    position: { left: '40%', top: '35%' }
  },
  {
    icon: '💊',
    title: '为你端药',
    content: '你生病那阵子我端水喂你吃药，你却总说公司事多。其实我只想了解你，不是钱能代替的了解。',
    date: '1999年9月',
    position: { left: '65%', top: '25%' }
  },
  {
    icon: '🍲',
    title: '家的味道',
    content: '你为我下厨做饭，笨拙地问好不好吃。那一顿饭，我第一次觉得我们像真正的父女。',
    date: '1999年10月初',
    position: { left: '35%', top: '65%' }
  },
  {
    icon: '🧵',
    title: '遗愿未竟',
    content: '我说想给你做一件西服，那原是我在法国的生日愿望。如今你说"咱们都实现了吧"，我眼圈泛红。',
    date: '1999年10月中旬',
    position: { left: '85%', top: '70%' }
  },
  {
    icon: '🗡️',
    title: '我不是你女儿',
    content: '你对我说，如果你愿意永远当曼臻，我可以当作什么都没发生。我没回答，但眼神已经说了再见。',
    date: '1999年10月下旬',
    position: { left: '75%', top: '80%' }
  }
]

const letterParagraphs = [
  {
    text: "爹哋老咗，心里边却始终有一个简单嘅愿望😊。",
    emoji: "😊"
  },
  {
    text: "我想知你最近过得好唔好呀？食得饱唔饱，瞓觉安唔安稳？",
    emoji: "💭"
  },
  {
    text: "我想亲手教你打高尔夫🏌️，睇住你一次又一次击出美丽嘅弧线；",
    emoji: "🏌️"
  },
  {
    text: "我希望你可以慢慢教我讲外文📚，就算我笨啲，都想你慢慢教我。",
    emoji: "📚"
  },
  {
    text: "我想带住你周围去旅行🌍，陪你过每一年嘅生日🎂；",
    emoji: "🌍"
  },
  {
    text: "我想尽快退休，带你一齐去法国，过我哋简单嘅幸福生活。",
    emoji: "🇫🇷"
  },
  {
    text: "女儿煮嘅牛扒真系好食😋，爹哋知道自己真系老喱。",
    emoji: "😋"
  },
  {
    text: "曼臻，我曾经试过畀你最好嘅宠爱💖，但再多嘅宠爱，都唔及你真正嘅开心同幸福重要。",
    emoji: "💖"
  },
  {
    text: "喺香港，人人都会话你系我付生嘅女儿，",
    emoji: "🏙️"
  },
  {
    text: "但喺法国，我只想好简单咁做你嘅爹哋👨‍👧，做付曼臻嘅父亲。",
    emoji: "👨‍👧"
  },
  {
    text: "睇住你一路长大，我最开心嘅，就系睇住你开心幸福嘅笑容😄。",
    emoji: "😄"
  },
  {
    text: "呢个社会，我经历咗好多风雨，但我好庆幸，你仲有选择自己人生嘅机会。",
    emoji: "🌦️"
  },
  {
    text: "虽然我最憎恨背叛，但系就算知道你唔系真正嘅曼臻，我仍然愿意保护你，直到最后。",
    emoji: "🛡️"
  },
  {
    text: "最后记住，你叫何乐琪，系法国服装设计公司嘅老板👗，你唔识边个付生。",
    emoji: "👗"
  },
  {
    text: "愿你嘅人生，每一个清晨🌅都能够迎来灿烂嘅黎明。",
    emoji: "🌅"
  }
]

const toggleMusic = async () => {
  try {
    if (isPlaying.value) {
      // 停止音乐
      if (musicGenerator) {
        musicGenerator.stop()
      }
      isPlaying.value = false
    } else {
      // 开始播放音乐
      if (!musicGenerator && (window as any).BackgroundMusicGenerator) {
        musicGenerator = new (window as any).BackgroundMusicGenerator()
      }
      
      if (musicGenerator) {
        const success = await musicGenerator.start()
        if (success) {
          isPlaying.value = true
        }
      }
    }
  } catch (error) {
    console.log('音乐播放切换失败:', error)
  }
}

// 打开回忆弹窗
const openMemoryModal = (fragment: any) => {
  selectedMemory.value = fragment
  showMemoryModal.value = true
}

// 关闭回忆弹窗
const closeMemoryModal = () => {
  showMemoryModal.value = false
  selectedMemory.value = null
}

onMounted(() => {
  // 页面加载完成后的初始化
  console.log('卧底警察H5页面加载完成')
  
  // 初始化音乐生成器
  if ((window as any).BackgroundMusicGenerator) {
    musicGenerator = new (window as any).BackgroundMusicGenerator()
  }
})

onUnmounted(() => {
  // 页面卸载时停止音乐
  if (musicGenerator && isPlaying.value) {
    musicGenerator.stop()
  }
})
</script>

<style scoped>
.police-letter-container {
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
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

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #FFD700, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,215,0,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #FFA500, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,165,0,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #FFB347, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 3s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  color: rgba(255,215,0,0.4);
  font-size: 20px;
  animation: float 6s ease-in-out infinite;
}

.element:nth-child(1) { left: 10%; animation-delay: 0s; }
.element:nth-child(2) { left: 20%; animation-delay: 1s; }
.element:nth-child(3) { left: 70%; animation-delay: 2s; }
.element:nth-child(4) { left: 80%; animation-delay: 3s; }
.element:nth-child(5) { left: 45%; animation-delay: 4s; }
.element:nth-child(6) { left: 65%; animation-delay: 5s; }

.element::before {
  content: '🧿';
}

@keyframes float {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

.police-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.plane-ticket {
  position: absolute;
  font-size: 24px;
  animation: ticketFloat 9s ease-in-out infinite;
  opacity: 0.6;
}

.safety-charm {
  position: absolute;
  font-size: 22px;
  animation: charmFloat 8s ease-in-out infinite;
  opacity: 0.7;
}

.jade-pendant {
  position: absolute;
  font-size: 20px;
  animation: jadeFloat 10s ease-in-out infinite;
  opacity: 0.5;
}

.plane-ticket:nth-child(1) { 
  left: 15%; 
  animation-delay: 0s; 
  animation-duration: 8s;
}
.plane-ticket:nth-child(2) { 
  left: 45%; 
  animation-delay: 3s; 
  animation-duration: 9s;
}
.plane-ticket:nth-child(3) { 
  left: 75%; 
  animation-delay: 6s; 
  animation-duration: 7s;
}

.safety-charm:nth-child(4) { 
  left: 25%; 
  animation-delay: 1s; 
  animation-duration: 8s;
}
.safety-charm:nth-child(5) { 
  left: 35%; 
  animation-delay: 2s; 
  animation-duration: 9s;
}
.safety-charm:nth-child(6) { 
  left: 65%; 
  animation-delay: 4s; 
  animation-duration: 7s;
}
.safety-charm:nth-child(7) { 
  left: 85%; 
  animation-delay: 5s; 
  animation-duration: 8s;
}

.jade-pendant:nth-child(8) { 
  left: 20%; 
  animation-delay: 2s; 
  animation-duration: 11s;
}
.jade-pendant:nth-child(9) { 
  left: 55%; 
  animation-delay: 4s; 
  animation-duration: 10s;
}
.jade-pendant:nth-child(10) { 
  left: 80%; 
  animation-delay: 7s; 
  animation-duration: 12s;
}

@keyframes ticketFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) rotate(45deg);
    opacity: 0.8;
  }
}

@keyframes charmFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg) scale(1);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.7;
  }
  50% {
    transform: translateY(-30px) rotate(180deg) scale(1.05);
    opacity: 0.9;
  }
}

@keyframes jadeFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg) scale(1);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.5;
  }
  50% {
    transform: translateY(-50px) rotate(270deg) scale(1.1);
    opacity: 0.7;
  }
}

.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFB347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.date {
  color: rgba(255,215,0,0.9);
  font-size: 1.1rem;
  font-style: italic;
}

.letter-content {
  flex: 1;
  background: rgba(248,248,255,0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(30,60,114,0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  animation: fadeInUp 1.2s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(255,215,0,0.3);
}

.letter-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  scroll-behavior: smooth;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.letter-scroll-area::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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

.paragraph {
  margin-bottom: 25px;
  position: relative;
  animation: slideInLeft 0.8s ease-out forwards;
  animation-delay: calc(var(--paragraph-index, 0) * 0.1s);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.paragraph:nth-child(1) { --paragraph-index: 1; }
.paragraph:nth-child(2) { --paragraph-index: 2; }
.paragraph:nth-child(3) { --paragraph-index: 3; }
.paragraph:nth-child(4) { --paragraph-index: 4; }
.paragraph:nth-child(5) { --paragraph-index: 5; }
.paragraph:nth-child(6) { --paragraph-index: 6; }
.paragraph:nth-child(7) { --paragraph-index: 7; }
.paragraph:nth-child(8) { --paragraph-index: 8; }
.paragraph:nth-child(9) { --paragraph-index: 9; }
.paragraph:nth-child(10) { --paragraph-index: 10; }
.paragraph:nth-child(11) { --paragraph-index: 11; }
.paragraph:nth-child(12) { --paragraph-index: 12; }
.paragraph:nth-child(13) { --paragraph-index: 13; }
.paragraph:nth-child(14) { --paragraph-index: 14; }
.paragraph:nth-child(15) { --paragraph-index: 15; }

.paragraph p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #1e3c72;
  margin: 0;
  text-indent: 2em;
}

.emoji {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(1px 1px 2px rgba(30,60,114,0.3));
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(-50%);
  }
  40% {
    transform: translateY(-60%);
  }
  60% {
    transform: translateY(-55%);
  }
}

.signature {
  text-align: center;
  flex-shrink: 0;
  animation: zoomIn 1s ease-out;
  animation-delay: 2s;
  animation-fill-mode: both;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.signature-text {
  font-size: 1.5rem;
  color: #FFD700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
}

.signature-heart {
  font-size: 2rem;
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.music-control {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(30,60,114,0.3);
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.3);
}

.music-control:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(30,60,114,0.4);
  background: linear-gradient(135deg, #FFA500, #FFB347);
}

.music-icon {
  font-size: 1.8rem;
  transition: all 0.3s ease;
  margin-bottom: 2px;
  color: #1e3c72;
}

.music-text {
  font-size: 0.7rem;
  color: #1e3c72;
  font-weight: 500;
}

.music-icon.playing {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .letter-scroll-area {
    padding: 20px;
  }
  
  .paragraph p {
    font-size: 1.1rem;
  }
  
  .content-wrapper {
    padding: 15px;
  }
  
  .music-control {
    width: 70px;
    height: 70px;
    bottom: 20px;
    right: 20px;
  }
  
  .music-icon {
    font-size: 1.5rem;
  }
  
  .music-text {
    font-size: 0.6rem;
  }
}

.memory-fragments {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.memory-fragment {
  position: absolute;
  font-size: 32px;
  cursor: pointer;
  pointer-events: auto;
  background: rgba(248,248,255,0.95);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(30,60,114,0.4);
  transition: all 0.3s ease;
  animation: memoryFloat 15s ease-in-out infinite;
  backdrop-filter: blur(5px);
  border: 3px solid rgba(255,215,0,0.8);
  z-index: 101;
}

.memory-fragment:nth-child(1) { 
  animation-delay: 0s; 
  animation-duration: 12s;
}
.memory-fragment:nth-child(2) { 
  animation-delay: 0s; 
  animation-duration: 14s;
}
.memory-fragment:nth-child(3) { 
  animation-delay: 0s; 
  animation-duration: 16s;
}
.memory-fragment:nth-child(4) { 
  animation-delay: 0s; 
  animation-duration: 13s;
}
.memory-fragment:nth-child(5) { 
  animation-delay: 0s; 
  animation-duration: 15s;
}
.memory-fragment:nth-child(6) { 
  animation-delay: 0s; 
  animation-duration: 17s;
}
.memory-fragment:nth-child(7) { 
  animation-delay: 0s; 
  animation-duration: 14s;
}

.memory-fragment:active {
  transform: scale(0.95);
  box-shadow: 0 4px 15px rgba(30,60,114,0.6);
}

@keyframes memoryFloat {
  0% { 
    opacity: 0.8;
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% { 
    opacity: 1;
    transform: translate(30px, -20px) scale(1.05) rotate(90deg);
  }
  50% { 
    opacity: 0.9;
    transform: translate(-20px, -40px) scale(1.1) rotate(180deg);
  }
  75% { 
    opacity: 1;
    transform: translate(-40px, 20px) scale(1.05) rotate(270deg);
  }
  100% { 
    opacity: 0.8;
    transform: translate(0, 0) scale(1) rotate(360deg);
  }
}

.memory-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.memory-modal {
  background: linear-gradient(135deg, #F8F8FF, #E6E6FA);
  padding: 30px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 80%;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.4s ease-out;
  border: 2px solid rgba(255,215,0,0.3);
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.memory-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(255,215,0,0.3);
  padding-bottom: 15px;
}

.memory-modal-header h3 {
  font-size: 1.8rem;
  color: #1e3c72;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(30,60,114,0.2);
}

.close-btn {
  background: rgba(255,215,0,0.3);
  border: 2px solid rgba(255,215,0,0.6);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 1.8rem;
  color: #1e3c72;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.close-btn:active {
  background: rgba(255,215,0,0.5);
  transform: scale(0.95);
}

.memory-modal-content {
  text-align: center;
}

.memory-image {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(2px 2px 4px rgba(30,60,114,0.3));
}

.memory-modal-content p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #1e3c72;
  margin: 20px 0;
  text-align: left;
  text-indent: 2em;
}

.memory-date {
  font-size: 1rem;
  color: #4a90e2;
  margin-top: 20px;
  font-style: italic;
  padding: 10px;
  background: rgba(255,215,0,0.2);
  border-radius: 10px;
  border-left: 4px solid #FFD700;
}
</style> 