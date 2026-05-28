<template>
  <div id="app">
    <!-- 切换按钮 -->
    <button @click="toggleView" class="toggle-btn">
      {{ isAdmin ? '查看大屏' : '后台管理' }}
    </button>
    
    <Dashboard v-if="!isAdmin" />
    <Admin v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dashboard from './views/Dashboard.vue'
import Admin from './views/Admin.vue'

const isAdmin = ref(false)

const toggleView = () => {
  isAdmin.value = !isAdmin.value
}
</script>

<style>
#app {
  width: 100vw;
  min-height: 100vh;
  position: relative;
}

.toggle-btn {
  position: fixed;
  top: 50%;
  right: -50px; /* 隐藏在页面右侧边缘外 */
  transform: translateY(-50%);
  z-index: 1000;
  padding: 12px 20px;
  background: rgba(74, 144, 226, 0.9);
  color: white;
  border: none;
  border-radius: 8px 0 0 8px; /* 左侧圆角 */
  cursor: pointer;
  font-size: 14px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease, background 0.3s ease; /* 添加过渡动画 */
  writing-mode: vertical-rl; /* 竖排文字 */
  text-orientation: mixed;
  letter-spacing: 4px;
}

.toggle-btn:hover {
  right: 0; /* 鼠标靠近时滑出 */
  background: rgba(74, 144, 226, 1);
}
</style>
