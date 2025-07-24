<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <!-- 背景SVG -->
    <svg 
      class="background-svg" 
      viewBox="0 0 391 845" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g clip-path="url(#clip0_459_188)">
        <rect width="390" height="844" transform="translate(0.211914 0.828125)" fill="#EFE1CF"/>
        <g filter="url(#filter0_f_459_188)">
          <circle cx="228.212" cy="250.711" r="108.5" fill="#DF3344"/>
        </g>
        <g filter="url(#filter1_f_459_188)">
          <circle cx="138.212" cy="385.711" r="85.5" fill="#B5DB6A"/>
        </g>
        <g filter="url(#filter2_f_459_188)">
          <ellipse cx="235.212" cy="487.211" rx="85.5" ry="86" fill="#F36A8C"/>
        </g>
        <g filter="url(#filter3_f_459_188)">
          <circle cx="252.212" cy="580.711" r="85.5" fill="#DB7838"/>
        </g>
        <g filter="url(#filter4_f_459_188)">
          <ellipse cx="155.212" cy="712.211" rx="85.5" ry="86" fill="#BEBBD0"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_f_459_188" x="-104.088" y="-81.5891" width="664.6" height="664.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="111.9" result="effect1_foregroundBlur_459_188"/>
        </filter>
        <filter id="filter1_f_459_188" x="-171.088" y="76.4109" width="618.6" height="618.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="111.9" result="effect1_foregroundBlur_459_188"/>
        </filter>
        <filter id="filter2_f_459_188" x="-74.0881" y="177.411" width="618.6" height="619.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="111.9" result="effect1_foregroundBlur_459_188"/>
        </filter>
        <filter id="filter3_f_459_188" x="-57.0881" y="271.411" width="618.6" height="618.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="111.9" result="effect1_foregroundBlur_459_188"/>
        </filter>
        <filter id="filter4_f_459_188" x="-154.088" y="402.411" width="618.6" height="619.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="111.9" result="effect1_foregroundBlur_459_188"/>
        </filter>
        <clipPath id="clip0_459_188">
          <rect width="390" height="844" fill="white" transform="translate(0.211914 0.828125)"/>
        </clipPath>
      </defs>
    </svg>

    <!-- 内容区域 -->
    <div class="content-wrapper ">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* 背景SVG样式 */
.background-svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .background-svg {
    /* 在小屏幕上可以调整SVG的显示方式 */
    object-position: center;
  }
}

@media (max-width: 480px) {
  .background-svg {
    /* 超小屏幕的额外调整 */
    transform: scale(1.1);
  }
}

.navigation {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 15px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}
</style>
