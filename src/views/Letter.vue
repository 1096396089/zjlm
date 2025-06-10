<template>
  <div class="letter-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="stars"></div>
      <div class="floating-hearts">
        <div class="heart" v-for="i in 6" :key="i"></div>
      </div>
      <div class="chocolate-elements">
        <div class="chocolate-piece" v-for="i in 4" :key="i">🍫</div>
        <div class="ice-cream" v-for="i in 3" :key="i">🍦</div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="content-wrapper">
      <!-- 标题部分 -->
      <div class="header">
        <h1 class="title">给最爱的妹妹</h1>
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
        <div class="signature-text">最疼你的哥哥</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
let musicGenerator: any = null

const letterParagraphs = [
  {
    text: "我成日都谂，我哋真系注定有缘。",
    emoji: "✨"
  },
  {
    text: "嗰间孤儿院又旧又破，但你嘅出现，就好似黑暗中突然透进嚟嘅一道温暖曙光。",
    emoji: "🌅"
  },
  {
    text: "从嗰刻开始，我就同自己讲，只要哥哥一日喺度，你一定唔可以再受苦，一定要过得开心幸福。",
    emoji: ""
  },
  {
    text: "我想你食饱着暖，想畀你一个温暖嘅家；我唔想你再受委屈，更加唔想睇到你四围流浪。",
    emoji: "🍚🏡"
  },
  {
    text: "哥哥宁愿自己独自面对黑暗，都要你开心咁走向光明嘅未来。",
    emoji: "🌈"
  },
  {
    text: "哥哥唔想你知道，就算阳光再猛，哥哥嘅世界依然系黑暗嘅，我只能一路摸黑前行。",
    emoji: "☀️"
  },
  {
    text: "哥哥嘅钱究竟点嚟嘅，你唔需要理，只要安心去外国读书，实现你嘅梦想就得。",
    emoji: "📚"
  },
  {
    text: "我知道你一直想做警察，想保护哥哥。",
    emoji: "👮‍♀️"
  },
  {
    text: "但哥哥更想你可以轻松啲，唔使企喺前面挡风雨，好好咁做你钟意嘅事。",
    emoji: ""
  },
  {
    text: "做人好坏，有时并唔系自己可以拣嘅，唯有生存落去，先至可以慢慢拣。",
    emoji: ""
  },
  {
    text: "不过，我真系从来无谂过，你竟然会为咗哥哥咁义无反顾。",
    emoji: ""
  },
  {
    text: "哥哥唔会喊，你都唔好喊。我唯一惊嘅，就系呢个世界咁大，你搵唔到返屋企嘅路。",
    emoji: "😢"
  },
  {
    text: "记住，有哥哥嘅地方，就系你嘅屋企。",
    emoji: "🏠"
  },
  {
    text: "就算有一日哥哥唔喺度，都希望你未来嘅日子平安幸福。",
    emoji: "😊"
  },
  {
    text: "最后，帮哥哥去香港睇一睇黎明。",
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

onMounted(() => {
  // 页面加载完成后的初始化
  console.log('感人H5页面加载完成')
  
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
.letter-container {
  height: 100vh;
  background: linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%);
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
    radial-gradient(2px 2px at 20px 30px, #FFEFD5, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(222,184,135,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #F5DEB3, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(245,222,179,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #DEB887, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 3s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
}

.floating-hearts {
  position: absolute;
  width: 100%;
  height: 100%;
}

.heart {
  position: absolute;
  color: rgba(222,184,135,0.4);
  font-size: 20px;
  animation: float 6s ease-in-out infinite;
}

.heart:nth-child(1) { left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { left: 20%; animation-delay: 1s; }
.heart:nth-child(3) { left: 70%; animation-delay: 2s; }
.heart:nth-child(4) { left: 80%; animation-delay: 3s; }
.heart:nth-child(5) { left: 45%; animation-delay: 4s; }
.heart:nth-child(6) { left: 65%; animation-delay: 5s; }

.heart::before {
  content: '🍫';
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
  background: linear-gradient(45deg, #DEB887, #F5DEB3, #FFEFD5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.date {
  color: rgba(255,239,213,0.9);
  font-size: 1.1rem;
  font-style: italic;
}

.letter-content {
  flex: 1;
  background: rgba(255,248,220,0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(139,69,19,0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  animation: fadeInUp 1.2s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(222,184,135,0.3);
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
  display: flex;
  align-items: flex-start;
  gap: 15px;
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
  color: #654321;
  margin: 0;
  text-indent: 2em;
  flex: 1;
}

.emoji {
  flex-shrink: 0;
  font-size: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(1px 1px 2px rgba(139,69,19,0.3));
  margin-top: 0.2em;
  min-width: 30px;
  text-align: center;
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
  color: #FFEFD5;
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
  background: linear-gradient(135deg, #DEB887, #F5DEB3);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(139,69,19,0.3);
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.3);
}

.music-control:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(139,69,19,0.4);
  background: linear-gradient(135deg, #F5DEB3, #FFEFD5);
}

.music-icon {
  font-size: 1.8rem;
  transition: all 0.3s ease;
  margin-bottom: 2px;
  color: #8B4513;
}

.music-text {
  font-size: 0.7rem;
  color: #654321;
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

.chocolate-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.chocolate-piece {
  position: absolute;
  font-size: 24px;
  animation: chocolateFloat 8s ease-in-out infinite;
  opacity: 0.6;
}

.ice-cream {
  position: absolute;
  font-size: 28px;
  animation: iceCreamFloat 10s ease-in-out infinite;
  opacity: 0.5;
}

.chocolate-piece:nth-child(1) { 
  left: 15%; 
  animation-delay: 0s; 
  animation-duration: 7s;
}
.chocolate-piece:nth-child(2) { 
  left: 35%; 
  animation-delay: 2s; 
  animation-duration: 9s;
}
.chocolate-piece:nth-child(3) { 
  left: 75%; 
  animation-delay: 4s; 
  animation-duration: 8s;
}
.chocolate-piece:nth-child(4) { 
  left: 85%; 
  animation-delay: 6s; 
  animation-duration: 6s;
}

.ice-cream:nth-child(5) { 
  left: 25%; 
  animation-delay: 1s; 
  animation-duration: 12s;
}
.ice-cream:nth-child(6) { 
  left: 55%; 
  animation-delay: 3s; 
  animation-duration: 11s;
}
.ice-cream:nth-child(7) { 
  left: 65%; 
  animation-delay: 5s; 
  animation-duration: 10s;
}

@keyframes chocolateFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(-50px) rotate(360deg);
    opacity: 0.8;
  }
}

@keyframes iceCreamFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg) scale(1);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.5;
  }
  50% {
    transform: translateY(-30px) rotate(180deg) scale(1.1);
    opacity: 0.7;
  }
}
</style> 