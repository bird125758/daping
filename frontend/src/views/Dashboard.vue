<template>
  <div class="dashboard">
    <!-- 顶部标题 -->
    <header class="dashboard-header">
      <div class="header-bg-animation"></div>
      <div class="header-content">
        <div class="date" :style="{ fontSize: dateFontSize + 'px' }">{{ currentDate }}</div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="dashboard-content">
      <div class="charts-grid">
        <!-- 第一行 -->
        <div class="chart-card">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>产业链长走势图</h3>
            <span class="unit">单位：家</span>
          </div>
          <div ref="industryChainRef" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>用户注册走势图</h3>
            <span class="unit">单位：家</span>
          </div>
          <div ref="userRegistrationRef" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>行业分布top10</h3>
            <span class="unit">单位：家</span>
          </div>
          <div ref="industryDistributionRef" class="chart-container-horizontal"></div>
        </div>

        <!-- 第二行 -->
        <div class="chart-card chart-large">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>云信确权及融资走势图</h3>
            <span class="unit">单位：亿元</span>
          </div>
          <div ref="financingRef" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>合作银行走势图</h3>
            <span class="unit">单位：家</span>
          </div>
          <div ref="cooperationBankRef" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <div class="card-border">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
          <div class="chart-header">
            <h3>银行放款top10</h3>
            <span class="unit">单位：亿元</span>
          </div>
          <div ref="bankLoanRef" class="chart-container-horizontal"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

// 计算当前日期
const currentDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
})

// 日期字体大小（与GIF高度保持固定比例）
const dateFontSize = ref(14)

// 计算日期字体大小
const updateDateFontSize = () => {
  const header = document.querySelector('.dashboard-header')
  if (header) {
    const headerHeight = header.offsetHeight
    // 字体大小设置为标题栏高度的 20%（205px时约41px）
    dateFontSize.value = Math.round(headerHeight * 0.20)
  }
}

const industryChainRef = ref()
const userRegistrationRef = ref()
const cooperationBankRef = ref()
const industryDistributionRef = ref()
const financingRef = ref()
const bankLoanRef = ref()

let charts = []

// 数据
const chartData = ref({
  industryChain: { years: [], values: [] },
  userRegistration: { years: [], values: [] },
  cooperationBank: { years: [], values: [] },
  industryDistribution: [],
  financing: { years: [], industryConfirmation: [], financingLoan: [] },
  bankLoan: []
})

// 从后端加载数据
const loadData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const response = await axios.get(`${apiUrl}/api/data`)
    chartData.value = response.data
    refreshCharts()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 刷新所有图表
const refreshCharts = () => {
  charts.forEach(chart => chart.dispose())
  charts = []
  initIndustryChainChart()
  initUserRegistrationChart()
  initCooperationBankChart()
  initIndustryDistributionChart()
  initFinancingChart()
  initBankLoanChart()
}

// 计算Y轴最大值（向上取整到合适的刻度间隔）
const calculateYAxisMax = (values) => {
  const maxValue = Math.max(...values)
  if (maxValue <= 0) return 100
  
  // 找到数据的数量级
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
  
  // 计算数据在数量级的哪个区间
  const ratio = maxValue / magnitude
  
  // 计算高一个数量级的合理值
  let yMax
  
  if (ratio <= 1) {
    yMax = magnitude
  } else if (ratio <= 1.2) {
    yMax = magnitude * 1.2
  } else if (ratio <= 1.5) {
    yMax = magnitude * 1.5
  } else if (ratio <= 2) {
    yMax = magnitude * 2
  } else if (ratio <= 2.5) {
    yMax = magnitude * 2.5
  } else if (ratio <= 3) {
    yMax = magnitude * 3
  } else if (ratio <= 4) {
    yMax = magnitude * 4
  } else if (ratio <= 5) {
    yMax = magnitude * 5
  } else if (ratio <= 6) {
    yMax = magnitude * 6
  } else if (ratio <= 7) {
    yMax = magnitude * 7
  } else if (ratio <= 8) {
    yMax = magnitude * 8
  } else if (ratio <= 9) {
    yMax = magnitude * 9
  } else {
    yMax = magnitude * 10
  }
  
  const result = Math.ceil(yMax)
  return result
}

const initIndustryChainChart = () => {
  if (!industryChainRef.value) return
  const chart = echarts.init(industryChainRef.value)
  const values = chartData.value.industryChain.values
  const yMax = calculateYAxisMax(values)
  chart.setOption({
    grid: { top: 30, right: 30, bottom: 35, left: 55 },
    xAxis: {
      type: 'category',
      data: chartData.value.industryChain.years,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { 
        color: '#A3C1E7', 
        fontSize: 11,
        interval: 0,
        rotate: 30
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: yMax,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { color: '#A3C1E7', fontSize: 11 },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(74, 144, 226, 0.15)',
          type: 'dashed'
        } 
      }
    },
    series: [{
      data: chartData.value.industryChain.values,
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#FFA042' },
          { offset: 0.5, color: '#FF7B22' },
          { offset: 1, color: '#E8530E' }
        ]),
        borderRadius: [3, 3, 0, 0],
        shadowColor: 'rgba(255, 123, 34, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 5
      },
      label: {
        show: true,
        position: 'top',
        color: '#FFB347',
        fontSize: 10,
        fontWeight: 'bold'
      }
    }]
  })
  charts.push(chart)
}

const initUserRegistrationChart = () => {
  if (!userRegistrationRef.value) return
  const chart = echarts.init(userRegistrationRef.value)
  const yMax = calculateYAxisMax(chartData.value.userRegistration.values)
  chart.setOption({
    grid: { top: 30, right: 30, bottom: 35, left: 65 },
    xAxis: {
      type: 'category',
      data: chartData.value.userRegistration.years,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { 
        color: '#A3C1E7', 
        fontSize: 11,
        interval: 0,
        rotate: 30
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: yMax,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { color: '#A3C1E7', fontSize: 11 },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(74, 144, 226, 0.15)',
          type: 'dashed'
        } 
      }
    },
    series: [{
      data: chartData.value.userRegistration.values,
      type: 'line',
      smooth: true,
      lineStyle: { 
        color: '#4A90E2', 
        width: 3,
        shadowColor: 'rgba(74, 144, 226, 0.5)',
        shadowBlur: 10,
        shadowOffsetY: 5
      },
      itemStyle: { 
        color: '#4A90E2',
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(74, 144, 226, 0.4)' },
          { offset: 1, color: 'rgba(74, 144, 226, 0.05)' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#A3C1E7',
        fontSize: 9,
        fontWeight: 'bold'
      },
      symbolSize: 6
    }]
  })
  charts.push(chart)
}

const initCooperationBankChart = () => {
  if (!cooperationBankRef.value) return
  const chart = echarts.init(cooperationBankRef.value)
  const yMax = calculateYAxisMax(chartData.value.cooperationBank.values)
  chart.setOption({
    grid: { top: 30, right: 30, bottom: 35, left: 55 },
    xAxis: {
      type: 'category',
      data: chartData.value.cooperationBank.years,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { 
        color: '#A3C1E7', 
        fontSize: 11,
        interval: 0,
        rotate: 30
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: yMax,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { color: '#A3C1E7', fontSize: 11 },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(74, 144, 226, 0.15)',
          type: 'dashed'
        } 
      }
    },
    series: [{
      data: chartData.value.cooperationBank.values,
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#FFB347' },
          { offset: 0.5, color: '#FF8C42' },
          { offset: 1, color: '#E8751E' }
        ]),
        borderRadius: [3, 3, 0, 0],
        shadowColor: 'rgba(255, 140, 66, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 5
      },
      label: {
        show: true,
        position: 'top',
        color: '#FFB347',
        fontSize: 9,
        fontWeight: 'bold'
      }
    }]
  })
  charts.push(chart)
}

const initIndustryDistributionChart = () => {
  if (!industryDistributionRef.value) return
  const chart = echarts.init(industryDistributionRef.value)
  
  const names = chartData.value.industryDistribution.map(d => d.name)
  const values = chartData.value.industryDistribution.map(d => d.value)
  const percents = chartData.value.industryDistribution.map(d => d.percent)
  const maxValue = Math.max(...values)
  
  chart.setOption({
    grid: { 
      top: 30, 
      right: 20, 
      bottom: 20, 
      left: 30
    },
    xAxis: { 
      type: 'value',
      show: false,
      max: maxValue
    },
    yAxis: {
      type: 'category',
      data: names,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: false
      }
    },
    series: [
      // 进度条
      {
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: index < 3 ? 
                ['rgba(255, 87, 34, 0.5)', 'rgba(255, 140, 66, 0.5)', 'rgba(255, 179, 71, 0.5)'][index] : 'rgba(74, 144, 226, 0.5)' },
              { offset: 1, color: index < 3 ? 
                ['#FF5722', '#FF8C42', '#FFB347'][index] : '#4A90E2' }
            ]),
            borderRadius: [0, 5, 5, 0]
          }
        })),
        barWidth: 5,
        barGap: '150%',
        silent: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      },
      // 自定义标签
      {
        type: 'custom',
        data: values.map((value, index) => index),
        renderItem: (params, api) => {
          const index = api.value(0)
          const name = names[index]
          const value = values[index]
          const percent = percents[index]
          
          // 获取坐标位置
          const point = api.coord([value, index])
          const y = point[1]
          const chartWidth = api.getWidth()
          
          // 左侧排名和名称（在条形图上方）
          const rankText = {
            type: 'text',
            style: {
              text: String(index + 1),
              fill: '#fff',
              fontSize: 11,
              fontWeight: 'bold',
              x: 5,
              y: y - 20,
              backgroundColor: index < 3 ? ['#FF5722', '#FF8C42', '#FFB347'][index] : '#4A90E2',
              padding: [2, 5],
              borderRadius: 2
            }
          }
          
          const nameText = {
            type: 'text',
            style: {
              text: name,
              fill: '#A3C1E7',
              fontSize: 12,
              x: 30,
              y: y - 20
            }
          }
          
          // 右侧数值和百分比（在条形图上方，同一行）
          const valueText = {
            type: 'text',
            style: {
              text: value.toLocaleString(),
              fill: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'right',
              x: chartWidth - 70,
              y: y - 20
            }
          }
          
          const percentText = {
            type: 'text',
            style: {
              text: percent,
              fill: '#A3C1E7',
              fontSize: 13,
              textAlign: 'right',
              x: chartWidth - 5,
              y: y - 20
            }
          }
          
          return {
            type: 'group',
            children: [rankText, nameText, valueText, percentText]
          }
        }
      }
    ]
  })
  charts.push(chart)
}

const initFinancingChart = () => {
  if (!financingRef.value) return
  const chart = echarts.init(financingRef.value)
  // 计算两条线的最大值
  const allValues = [
    ...chartData.value.financing.industryConfirmation,
    ...chartData.value.financing.financingLoan
  ]
  const yMax = calculateYAxisMax(allValues)
  chart.setOption({
    grid: { top: 60, right: 30, bottom: 35, left: 65 },
    legend: {
      data: ['产业确权', '融资放款'],
      top: 5,
      right: 0,
      textStyle: { 
        color: '#A3C1E7',
        fontSize: 12
      },
      itemWidth: 20,
      itemHeight: 3
    },
    xAxis: {
      type: 'category',
      data: chartData.value.financing.years,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { 
        color: '#A3C1E7', 
        fontSize: 11,
        interval: 0,
        rotate: 30
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: yMax,
      axisLine: { lineStyle: { color: 'rgba(74, 144, 226, 0.5)' } },
      axisLabel: { color: '#A3C1E7', fontSize: 11 },
      splitLine: { 
        lineStyle: { 
          color: 'rgba(74, 144, 226, 0.15)',
          type: 'dashed'
        } 
      }
    },
    series: [
      {
        name: '产业确权',
        data: chartData.value.financing.industryConfirmation,
        type: 'line',
        smooth: true,
        lineStyle: { 
          color: '#FF5722', 
          width: 3,
          shadowColor: 'rgba(255, 87, 34, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        itemStyle: { 
          color: '#FF5722',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 87, 34, 0.4)' },
            { offset: 1, color: 'rgba(255, 87, 34, 0.05)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          color: '#FFB347',
          fontSize: 9,
          fontWeight: 'bold'
        },
        symbolSize: 6
      },
      {
        name: '融资放款',
        data: chartData.value.financing.financingLoan,
        type: 'line',
        smooth: true,
        lineStyle: { 
          color: '#4CAF50', 
          width: 3,
          shadowColor: 'rgba(76, 175, 80, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        itemStyle: { 
          color: '#4CAF50',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(76, 175, 80, 0.4)' },
            { offset: 1, color: 'rgba(76, 175, 80, 0.05)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          color: '#81C784',
          fontSize: 9,
          fontWeight: 'bold'
        },
        symbolSize: 6
      }
    ]
  })
  charts.push(chart)
}

const initBankLoanChart = () => {
  if (!bankLoanRef.value) return
  const chart = echarts.init(bankLoanRef.value)
  
  const names = chartData.value.bankLoan.map(d => d.name)
  const values = chartData.value.bankLoan.map(d => d.value)
  const percents = chartData.value.bankLoan.map(d => d.percent)
  const maxValue = Math.max(...values)
  
  chart.setOption({
    grid: { 
      top: 30, 
      right: 20, 
      bottom: 20, 
      left: 30
    },
    xAxis: { 
      type: 'value',
      show: false,
      max: maxValue
    },
    yAxis: {
      type: 'category',
      data: names,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: false
      }
    },
    series: [
      // 进度条
      {
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: index < 3 ? 
                ['rgba(255, 87, 34, 0.5)', 'rgba(255, 140, 66, 0.5)', 'rgba(255, 179, 71, 0.5)'][index] : 'rgba(74, 144, 226, 0.5)' },
              { offset: 1, color: index < 3 ? 
                ['#FF5722', '#FF8C42', '#FFB347'][index] : '#4A90E2' }
            ]),
            borderRadius: [0, 5, 5, 0]
          }
        })),
        barWidth: 5,
        barGap: '150%',
        silent: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      },
      // 自定义标签
      {
        type: 'custom',
        data: values.map((value, index) => index),
        renderItem: (params, api) => {
          const index = api.value(0)
          const name = names[index]
          const value = values[index]
          const percent = percents[index]
          
          // 获取坐标位置
          const point = api.coord([value, index])
          const y = point[1]
          const chartWidth = api.getWidth()
          
          // 左侧排名和名称（在条形图上方）
          const rankText = {
            type: 'text',
            style: {
              text: String(index + 1),
              fill: '#fff',
              fontSize: 11,
              fontWeight: 'bold',
              x: 5,
              y: y - 20,
              backgroundColor: index < 3 ? ['#FF5722', '#FF8C42', '#FFB347'][index] : '#4A90E2',
              padding: [2, 5],
              borderRadius: 2
            }
          }
          
          const nameText = {
            type: 'text',
            style: {
              text: name,
              fill: '#A3C1E7',
              fontSize: 12,
              x: 30,
              y: y - 20
            }
          }
          
          // 右侧数值和百分比（在条形图上方，同一行）
          const valueText = {
            type: 'text',
            style: {
              text: Math.round(value).toLocaleString(),
              fill: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'right',
              x: chartWidth - 70,
              y: y - 20
            }
          }
          
          const percentText = {
            type: 'text',
            style: {
              text: percent,
              fill: '#A3C1E7',
              fontSize: 13,
              textAlign: 'right',
              x: chartWidth - 5,
              y: y - 20
            }
          }
          
          return {
            type: 'group',
            children: [rankText, nameText, valueText, percentText]
          }
        }
      }
    ]
  })
  charts.push(chart)
}

onMounted(() => {
  loadData()
  updateDateFontSize() // 初始化日期字体大小
  
  window.addEventListener('resize', () => {
    charts.forEach(chart => chart.resize())
    updateDateFontSize() // 窗口大小变化时更新日期字体大小
  })
})

onBeforeUnmount(() => {
  charts.forEach(chart => chart.dispose())
})
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  background: #041452;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}

/* 顶部标题栏 */
.dashboard-header {
  position: relative;
  height: auto; /* 自适应高度 */
  max-height: 205px; /* 最大高度不超过GIF原始高度 */
  aspect-ratio: 3840 / 205; /* 保持GIF的宽高比 */
  background: transparent;
  overflow: hidden;
  flex-shrink: 0; /* 不允许缩小 */
}

/* 背景动画层 - 使用GIF动画 */
.header-bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/header-bg.gif');
  background-size: contain; /* 保持比例，完整显示 */
  background-position: center top;
  background-repeat: no-repeat;
  opacity: 0.7;
  pointer-events: none;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, 
    rgba(74, 144, 226, 0.15) 0%, 
    transparent 70%);
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 0; /* 完全对齐右侧 */
}

.date {
  color: #fff;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  /* 字体大小通过JavaScript动态计算 */
}

/* 内容区域 */
.dashboard-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  height: 100%;
}

/* 卡片样式 */
.chart-card {
  position: relative;
  background: linear-gradient(180deg, 
    rgba(13, 31, 60, 0.95) 0%, 
    rgba(10, 25, 50, 0.95) 100%);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(74, 144, 226, 0.1),
              inset 0 0 30px rgba(74, 144, 226, 0.05);
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
}

.corner-tl {
  top: -1px;
  left: -1px;
  border-top: 3px solid #4A90E2;
  border-left: 3px solid #4A90E2;
  border-radius: 8px 0 0 0;
}

.corner-tr {
  top: -1px;
  right: -1px;
  border-top: 3px solid #4A90E2;
  border-right: 3px solid #4A90E2;
  border-radius: 0 8px 0 0;
}

.corner-bl {
  bottom: -1px;
  left: -1px;
  border-bottom: 3px solid #4A90E2;
  border-left: 3px solid #4A90E2;
  border-radius: 0 0 0 8px;
}

.corner-br {
  bottom: -1px;
  right: -1px;
  border-bottom: 3px solid #4A90E2;
  border-right: 3px solid #4A90E2;
  border-radius: 0 0 8px 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(74, 144, 226, 0.2);
}

.chart-header h3 {
  color: #A3C1E7;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(163, 193, 231, 0.3);
  letter-spacing: 1px;
}

.unit {
  color: #4A90E2;
  font-size: 13px;
  font-weight: 500;
}

.chart-container,
.chart-container-horizontal {
  flex: 1;
  min-height: 0;
}
</style>
