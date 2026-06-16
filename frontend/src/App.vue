<template>
  <div id="app">
    <!-- 切换按钮 -->
    <button @click="toggleView" class="toggle-btn" :aria-label="toggleLabel">
      <span 
        v-for="(char, index) in toggleLabelChars" 
        :key="`${char}-${index}`"
        class="toggle-char"
      >
        {{ char }}
      </span>
    </button>
    
    <Dashboard v-if="!isAdmin" />
    <Admin v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import Dashboard from './views/Dashboard.vue'
import Admin from './views/Admin.vue'

const isAdmin = ref(false)

const toggleLabel = computed(() => isAdmin.value ? '查看大屏' : '后台管理')
const toggleLabelChars = computed(() => toggleLabel.value.split(''))

const toggleView = () => {
  isAdmin.value = !isAdmin.value
}

const stopPageModeWatcher = watchEffect(() => {
  const isDashboard = !isAdmin.value
  document.documentElement.classList.toggle('dashboard-mode', isDashboard)
  document.body.classList.toggle('dashboard-mode', isDashboard)
  document.documentElement.classList.toggle('admin-mode', isAdmin.value)
  document.body.classList.toggle('admin-mode', isAdmin.value)
})

onBeforeUnmount(() => {
  stopPageModeWatcher()
  document.documentElement.classList.remove('dashboard-mode', 'admin-mode')
  document.body.classList.remove('dashboard-mode', 'admin-mode')
})
</script>

<style>
html.dashboard-mode,
body.dashboard-mode {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}

html.admin-mode,
body.admin-mode {
  height: auto;
  min-height: 100vh;
  overflow: auto;
}

#app {
  width: 100vw;
  min-height: 100vh;
  position: relative;
}

body.dashboard-mode #app {
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
}

body.admin-mode #app {
  height: auto;
  min-height: 100vh;
  overflow: visible;
}

.toggle-btn {
  position: fixed;
  top: 53%;
  top: calc(50vh + min(2.7vw, 102px));
  right: -56px; /* 只露出窄把手，避免遮挡右侧图表数据 */
  transform: translateY(-50%);
  z-index: 1000;
  width: 72px;
  min-height: 128px;
  padding: 12px 10px 12px 14px;
  background: rgba(74, 144, 226, 0.9);
  color: white;
  border: none;
  border-radius: 8px 0 0 8px; /* 左侧圆角 */
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: bold;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease, background 0.3s ease; /* 添加过渡动画 */
  letter-spacing: 0;
  touch-action: manipulation;
  user-select: none;
}

.toggle-char {
  display: block;
  white-space: nowrap;
}

.toggle-btn:hover {
  right: 0; /* 鼠标靠近时滑出 */
  background: rgba(74, 144, 226, 1);
}
</style>
