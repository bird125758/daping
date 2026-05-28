<template>
  <div class="admin-container">
    <h1>后台管理系统 - 测试版</h1>
    <p>如果您能看到这个页面，说明Admin组件加载成功！</p>
    <button @click="testLoad">测试加载数据</button>
    <div v-if="dataLoaded">
      <p>数据加载成功！</p>
      <pre>{{ testData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const dataLoaded = ref(false)
const testData = ref('')

const testLoad = async () => {
  try {
    console.log('开始测试加载数据...')
    const response = await axios.get('http://localhost:3001/api/data')
    testData.value = JSON.stringify(response.data, null, 2)
    dataLoaded.value = true
    console.log('数据加载成功:', response.data)
  } catch (error) {
    console.error('加载失败:', error)
    testData.value = '加载失败: ' + error
  }
}
</script>

<style scoped>
.admin-container {
  padding: 50px;
  background: white;
  min-height: 100vh;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #357ABD;
}

pre {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  overflow: auto;
  margin-top: 20px;
}
</style>
