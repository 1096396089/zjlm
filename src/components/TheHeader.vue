<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navItems = [
  { name: '關於我們', path: '/about' },
  { name: '核心優勢', path: '/advantages' },
  { name: '投資策略', path: '/strategies' },
  { name: '精英團隊', path: '/team' },
  { name: '戰略合作', path: '/partners' },
  { name: '聯繫我們', path: '/contact' },
]

const navigateTo = (path: string) => {
  router.push(path)
  isMenuOpen.value = false
}

// 监听滚动事件，改变导航栏背景
onMounted(() => {
  const navbar = document.querySelector('.navbar')
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled')
    } else {
      navbar?.classList.remove('scrolled')
    }
  })
})
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo" @click="navigateTo('/')">群倫量化</div>
      <div class="nav-container">
        <ul class="nav-links" :class="{ active: isMenuOpen }">
          <li v-for="item in navItems" :key="item.path">
            <a href="#" @click.prevent="navigateTo(item.path)">{{ item.name }}</a>
          </li>
        </ul>
        <a href="https://investor.tradecoin.dog/" target="_blank" class="login-button">
          <i class="fas fa-user-circle desktop-only"></i>
          <span>登录</span>
        </a>
      </div>
      <button class="mobile-menu-button" @click="toggleMenu">
        <i class="fas fa-bars" v-if="!isMenuOpen"></i>
        <i class="fas fa-times" v-else></i>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
}

.nav-container {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: var(--black);
  margin-left: 20px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--accent-color);
}

.login-button {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  margin-left: 30px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.login-button i {
  margin-right: 8px;
  font-size: 16px;
}

.login-button:hover {
  background-color: var(--secondary-color);
  color: var(--white);
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--primary-color);
  cursor: pointer;
  padding: 10px;
}

.desktop-only {
  display: inline-block;
}

@media (max-width: 768px) {
  .navbar .container {
    padding: 0 15px;
  }

  .logo {
    flex: 1;
  }

  .nav-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .mobile-menu-button {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: var(--white);
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1002;
  }

  .login-button {
    margin: 0;
    padding: 6px 12px;
    font-size: 14px;
  }

  .desktop-only {
    display: none;
  }

  .login-button span {
    display: block !important;
  }

  .nav-links.active {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .nav-links li {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .login-button {
    padding: 6px 10px;
    border-radius: 16px;
  }

  .login-button span {
    display: block !important;
  }
}
</style>
