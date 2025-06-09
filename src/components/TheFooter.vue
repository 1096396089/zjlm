<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <h3>群倫量化</h3>
          <p>量化交易的卓越典範</p>
        </div>
        <div class="footer-links">
          <router-link to="/about">關於我們</router-link>
          <router-link to="/advantages">核心優勢</router-link>
          <router-link to="/strategies">投資策略</router-link>
          <router-link to="/team">精英團隊</router-link>
          <router-link to="/partners">戰略合作</router-link>
          <router-link to="/contact">聯繫我們</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} 群倫（湖北）私募基金管理公司. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component logic here if needed
</script>
