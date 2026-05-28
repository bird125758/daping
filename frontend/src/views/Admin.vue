<template>
  <div class="admin-container">
    <!-- 顶部导航 -->
    <header class="admin-header">
      <h1>数据大屏后台管理系统</h1>
    </header>

    <!-- 主要内容 -->
    <main class="admin-content">
      <!-- 数据模块选择 -->
      <div class="module-tabs">
        <button 
          v-for="module in modules" 
          :key="module.key"
          :class="['tab-btn', { active: currentModule === module.key }]"
          @click="switchModule(module.key)"
        >
          {{ module.name }}
        </button>
      </div>

      <!-- 编辑区域 -->
      <div class="edit-section" v-if="formData">
        <div class="section-header">
          <h2>{{ getCurrentModuleName() }}</h2>
          <div class="header-actions-group">
            <button @click="addItem" class="btn-add">+ 添加项目</button>
            <button @click="removeItem" class="btn-remove" :disabled="!canRemove()">- 删除最后项</button>
            <button @click="saveData" class="btn-save">保存修改</button>
          </div>
        </div>

        <!-- 产业链长走势图 -->
        <div v-if="currentModule === 'industryChain'" class="data-editor">
          <div class="data-row" v-for="(year, index) in formData.years" :key="index">
            <input type="text" v-model="formData.years[index]" class="input-year" placeholder="如: 2016年">
            <input type="number" v-model.number="formData.values[index]" class="input-number">
            <span class="unit">家</span>
          </div>
        </div>

        <!-- 用户注册走势图 -->
        <div v-if="currentModule === 'userRegistration'" class="data-editor">
          <div class="data-row" v-for="(year, index) in formData.years" :key="index">
            <input type="text" v-model="formData.years[index]" class="input-year" placeholder="如: 2016年">
            <input type="number" v-model.number="formData.values[index]" class="input-number">
            <span class="unit">家</span>
          </div>
        </div>

        <!-- 合作银行走势图 -->
        <div v-if="currentModule === 'cooperationBank'" class="data-editor">
          <div class="data-row" v-for="(year, index) in formData.years" :key="index">
            <input type="text" v-model="formData.years[index]" class="input-year" placeholder="如: 2016年">
            <input type="number" v-model.number="formData.values[index]" class="input-number">
            <span class="unit">家</span>
          </div>
        </div>

        <!-- 行业分布top10 -->
        <div v-if="currentModule === 'industryDistribution'" class="data-editor">
          <div class="data-row" v-for="(item, index) in formData" :key="index">
            <div class="row-header">
              <span class="rank">{{ index + 1 }}</span>
              <input type="text" v-model="item.name" class="input-text" placeholder="行业名称">
            </div>
            <div class="row-data">
              <label>数值：</label>
              <input type="number" v-model.number="item.value" class="input-number">
              <label>占比：</label>
              <input type="text" v-model="item.percent" class="input-small" placeholder="如: 28.60%">
              <span class="unit">家</span>
            </div>
          </div>
        </div>

        <!-- 云信确权及融资走势图 -->
        <div v-if="currentModule === 'financing'" class="data-editor">
          <div class="series-tabs">
            <button 
              :class="['series-btn', { active: currentSeries === 'industryConfirmation' }]"
              @click="currentSeries = 'industryConfirmation'"
            >
              产业确权
            </button>
            <button 
              :class="['series-btn', { active: currentSeries === 'financingLoan' }]"
              @click="currentSeries = 'financingLoan'"
            >
              融资放款
            </button>
          </div>
          <div class="data-row" v-for="(year, index) in formData.years" :key="index">
            <input type="text" v-model="formData.years[index]" class="input-year" placeholder="如: 2016年">
            <input 
              type="number" 
              v-model.number="formData[currentSeries][index]" 
              class="input-number"
            >
            <span class="unit">亿元</span>
          </div>
        </div>

        <!-- 银行放款top10 -->
        <div v-if="currentModule === 'bankLoan'" class="data-editor">
          <div class="data-row" v-for="(item, index) in formData" :key="index">
            <div class="row-header">
              <span class="rank">{{ index + 1 }}</span>
              <input type="text" v-model="item.name" class="input-text" placeholder="银行名称">
            </div>
            <div class="row-data">
              <label>数值：</label>
              <input type="number" v-model.number="item.value" class="input-number">
              <label>占比：</label>
              <input type="text" v-model="item.percent" class="input-small" placeholder="如: 30.46%">
              <span class="unit">亿元</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 提示消息 -->
    <div v-if="showMessage" :class="['message', messageType]">
      {{ messageText }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const currentModule = ref('industryChain')
const currentSeries = ref('industryConfirmation')
const formData = ref(null)
const showMessage = ref(false)
const messageText = ref('')
const messageType = ref('success')

const modules = [
  { key: 'industryChain', name: '产业链长走势图' },
  { key: 'userRegistration', name: '用户注册走势图' },
  { key: 'cooperationBank', name: '合作银行走势图' },
  { key: 'industryDistribution', name: '行业分布top10' },
  { key: 'financing', name: '云信确权及融资走势图' },
  { key: 'bankLoan', name: '银行放款top10' }
]

// 加载数据
const loadData = async () => {
  try {
    console.log('开始加载数据，当前模块:', currentModule.value)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const response = await axios.get(`${apiUrl}/api/data`)
    console.log('数据加载成功:', response.data)
    const data = response.data
    setFormData(data[currentModule.value])
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage.value = true
    messageText.value = '加载数据失败，请检查后端服务是否启动'
    messageType.value = 'error'
    setTimeout(() => showMessage.value = false, 3000)
  }
}

// 设置表单数据
const setFormData = (data) => {
  if (Array.isArray(data)) {
    formData.value = data.map(item => ({ ...item }))
  } else {
    formData.value = JSON.parse(JSON.stringify(data))
  }
  console.log('表单数据已设置:', formData.value)
}

// 切换模块
const switchModule = (key) => {
  currentModule.value = key
  if (key === 'financing') {
    currentSeries.value = 'industryConfirmation'
  }
  loadData()
}

// 获取当前模块名称
const getCurrentModuleName = () => {
  const module = modules.find(m => m.key === currentModule.value)
  return module ? module.name : ''
}

// 是否可以删除
const canRemove = () => {
  if (!formData.value) return false
  if (currentModule.value === 'industryDistribution' || currentModule.value === 'bankLoan') {
    return formData.value.length > 1
  }
  if (currentModule.value === 'financing') {
    return formData.value.years && formData.value.years.length > 1
  }
  return formData.value.years && formData.value.years.length > 1
}

// 添加项目
const addItem = () => {
  if (!formData.value) return
  
  if (currentModule.value === 'industryDistribution' || currentModule.value === 'bankLoan') {
    formData.value.push({
      name: '新项目',
      value: 0,
      percent: '0%'
    })
  } else if (currentModule.value === 'financing') {
    // 从最后一年智能递增
    const lastYear = formData.value.years[formData.value.years.length - 1]
    const newYear = getNextYear(lastYear)
    formData.value.years.push(newYear)
    formData.value.industryConfirmation.push(0)
    formData.value.financingLoan.push(0)
  } else {
    // 从最后一年智能递增
    const lastYear = formData.value.years[formData.value.years.length - 1]
    const newYear = getNextYear(lastYear)
    formData.value.years.push(newYear)
    formData.value.values.push(0)
  }
  
  showMessage.value = true
  messageText.value = '已添加新项目'
  messageType.value = 'success'
  setTimeout(() => showMessage.value = false, 2000)
}

// 获取下一个年份
const getNextYear = (currentYear) => {
  // 提取年份数字
  const match = currentYear.match(/(\d{4})/)
  if (match) {
    const year = parseInt(match[1])
    return `${year + 1}年`
  }
  return `${new Date().getFullYear() + 1}年`
}

// 删除项目
const removeItem = () => {
  if (!canRemove()) return
  
  if (currentModule.value === 'industryDistribution' || currentModule.value === 'bankLoan') {
    formData.value.pop()
  } else if (currentModule.value === 'financing') {
    formData.value.years.pop()
    formData.value.industryConfirmation.pop()
    formData.value.financingLoan.pop()
  } else {
    formData.value.years.pop()
    formData.value.values.pop()
  }
  
  showMessage.value = true
  messageText.value = '已删除最后项'
  messageType.value = 'success'
  setTimeout(() => showMessage.value = false, 2000)
}

// 保存数据
const saveData = async () => {
  try {
    console.log('准备保存数据...')
    console.log('当前模块:', currentModule.value)
    console.log('要保存的数据:', JSON.stringify(formData.value, null, 2))
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    // 将驼峰命名转换为连字符格式
    const apiPath = currentModule.value.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    const url = `${apiUrl}/api/data/${apiPath}`
    console.log('请求URL:', url)
    
    const response = await axios.put(url, formData.value)
    
    console.log('保存响应:', response.data)
    
    showMessage.value = true
    messageText.value = '保存成功！'
    messageType.value = 'success'
    setTimeout(() => showMessage.value = false, 2000)
  } catch (error) {
    console.error('保存失败:', error)
    console.error('错误响应:', error.response)
    console.error('错误状态码:', error.response ? error.response.status : '无')
    console.error('错误数据:', error.response ? error.response.data : '无')
    
    let errorMsg = '未知错误'
    if (error.response) {
      errorMsg = error.response.data.error || `HTTP ${error.response.status}`
    } else if (error.request) {
      errorMsg = '服务器无响应，请检查后端服务是否启动'
    } else {
      errorMsg = error.message
    }
    
    showMessage.value = true
    messageText.value = `保存失败: ${errorMsg}`
    messageType.value = 'error'
    setTimeout(() => showMessage.value = false, 5000)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  height: auto;
  background: #f5f7fa;
  overflow-y: auto;
}

.admin-header {
  background: #fff;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.admin-content {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.module-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.tab-btn.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.edit-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.header-actions-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-save {
  padding: 10px 30px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-save:hover {
  background: #45a049;
}

.btn-add {
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add:hover {
  background: #1976D2;
}

.btn-remove {
  padding: 10px 20px;
  background: #FF5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-remove:hover:not(:disabled) {
  background: #E64A19;
}

.btn-remove:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.data-editor {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  flex-wrap: wrap;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}

.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #4A90E2;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.row-data {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

label {
  color: #666;
  font-size: 14px;
  min-width: 60px;
}

.input-number {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
}

.input-year {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100px;
  background: #fff;
}

.input-year:focus {
  outline: none;
  border-color: #4A90E2;
  background: #f0f8ff;
}

.input-text {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
}

.input-small {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100px;
}

.input-number:focus,
.input-text:focus,
.input-small:focus {
  outline: none;
  border-color: #4A90E2;
}

.unit {
  color: #999;
  font-size: 14px;
}

.series-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.series-btn {
  padding: 8px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.series-btn.active {
  background: #FF5722;
  color: white;
  border-color: #FF5722;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.message.success {
  background: #4CAF50;
}

.message.error {
  background: #f44336;
}
</style>
