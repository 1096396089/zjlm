<template>
  <div class="mt-5">
    <div class="chart-row">
      <div class="chart-container">
        <div ref="netValueIndexChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <div ref="dailyReturnChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

// 定义API返回数据的接口
interface ApiDataItem {
  id: string;
  create_date: string;
  createAt: string;
  daily_profit: number;
  daily_return: number;
  initialPrincipal: number | null;
  net_deposit: number;
  net_value: number;
  status: number;
  total_balance: number;
  updateAt: string;
  user: { id: string; status: number; traderName?: string; user_name?: string };
}

// 图表数据
const chartData = reactive<{
  netValueData: { date: string; value: number }[];
  dailyReturnData: { date: string; value: number }[];
}>({
  netValueData: [],
  dailyReturnData: []
})

// 图表引用
const netValueIndexChart = ref<HTMLElement | null>(null)
const dailyReturnChart = ref<HTMLElement | null>(null)

// 图表实例
let netValueIndexChartInstance: echarts.ECharts | null = null
let dailyReturnChartInstance: echarts.ECharts | null = null

// 初始化净值曲线（指数）图表
const initNetValueIndexChart = () => {
  if (!netValueIndexChart.value) return
  
  netValueIndexChartInstance = echarts.init(netValueIndexChart.value)
  updateNetValueIndexChart()
}

// 更新净值曲线（指数）图表
const updateNetValueIndexChart = () => {
  if (!netValueIndexChartInstance) return
  
  // 准备数据
  const dates = chartData.netValueData.map(item => item.date)
  const values = chartData.netValueData.map(item => item.value)
  
  // 计算Y轴范围
  const minValue = Math.min(...values) - 0.01
  const maxValue = Math.max(...values) + 0.01
  
  const option = {
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        // 展示小数点后两位，不进行四舍五入
        const valueStr = params[0].value.toString()
        const dotIndex = valueStr.indexOf('.')
        let formattedValue = valueStr
        if (dotIndex !== -1) {
          // 有小数点，截取到小数点后两位
          formattedValue = valueStr.substring(0, Math.min(dotIndex + 3, valueStr.length))
        }
        
        return [
          params[0].name,
          'net_value: ' + formattedValue
        ].join('\n')
      },
      backgroundColor: '#fff',
      textStyle: {
        fontSize: 12,
        lineHeight: 20
      },
      padding: 8,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666',
        interval: 10,
        align: 'center',
       
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee',
          type: 'solid'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: minValue,
      max: maxValue,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666',
        formatter: function(value: number) {
          // 展示小数点后两位，不进行四舍五入
          const valueStr = value.toString()
          const dotIndex = valueStr.indexOf('.')
          if (dotIndex !== -1) {
            return valueStr.substring(0, Math.min(dotIndex + 3, valueStr.length))
          }
          return valueStr
        },
        showMinLabel: true,
        showMaxLabel: true
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee',
          type: 'solid'
        }
      }
    },
    series: [
      {
        name: 'net_value',
        type: 'line',
        data: values,
        smooth: false,
        showSymbol: false,
        symbol: 'emptyCircle',
        symbolSize: 4,
        itemStyle: {
          color: '#1e40af'
        },
        lineStyle: {
          color: '#1e40af',
          width: 2,
          cap: 'round'
        },
        emphasis: {
          scale: true,
          focus: 'series',
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ]
  }
  
  netValueIndexChartInstance.setOption(option)
}

// 初始化日收益图表
const initDailyReturnChart = () => {
  if (!dailyReturnChart.value) return
  
  dailyReturnChartInstance = echarts.init(dailyReturnChart.value)
  updateDailyReturnChart()
}

// 更新日收益图表
const updateDailyReturnChart = () => {
  if (!dailyReturnChartInstance) return
  
  // 准备数据
  const dates = chartData.dailyReturnData.map(item => item.date)
  const returns = chartData.dailyReturnData.map(item => item.value)
  
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        // 只显示整数部分
        const intValue = Math.floor(params[0].value)
        
        return `
          <div style="font-size: 14px; color: #666; line-height: 1.5">
            <div style="margin-bottom: 5px;"><strong>日期:</strong> ${params[0].name}</div>
            <div><strong>日收益:</strong> ${intValue}</div>
          </div>
        `
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666',
        interval: 10,
        align: 'center',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666',
        formatter: function(value: number) {
          // 只显示整数部分
          return Math.floor(value)
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: 'daily_return',
        type: 'bar',
        data: returns,
        itemStyle: {
          color: function(params: any) {
            // 正值为蓝色，负值为红色
            return params.value >= 0 ? '#409eff' : '#ef4444'
          }
        }
      }
    ]
  }
  
  dailyReturnChartInstance.setOption(option)
}

// 获取数据
const get_date = async () => {
  try {
    const res = await axios.get('https://tradecoin.dog/crypto/admin/api/balance-total', {
      params: {
        query: JSON.stringify({
          limit: 90,
          sort: {"create_date": -1},
          where: {
            status: 1,
            user: '681b133946e89bd20bba7329'
          }
        })
      }
    })
    
    const apiData = res.data.data as ApiDataItem[]
    console.log(apiData)
    
    // 数据处理
    if (Array.isArray(apiData) && apiData.length > 0) {
      // 数据按日期正序排序
      const sortedData = [...apiData].sort((a, b) => {
        return new Date(a.create_date).getTime() - new Date(b.create_date).getTime()
      })
      
      // 准备图表数据
      chartData.netValueData = sortedData.map(item => ({
        date: formatDate(item.create_date),
        value: item.net_value
      }))
      
      chartData.dailyReturnData = sortedData.map(item => ({
        date: formatDate(item.create_date),
        value: item.daily_return
      }))
      
      // 更新图表
      updateNetValueIndexChart()
      updateDailyReturnChart()
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 格式化日期: YYYY-MM-DD HH:MM:SS -> MM/DD
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

// 初始化所有图表
const initCharts = () => {
  initNetValueIndexChart()
  initDailyReturnChart()
}

// 重设图表大小
const resizeCharts = () => {
  netValueIndexChartInstance?.resize()
  dailyReturnChartInstance?.resize()
}

// 生命周期钩子
onMounted(() => {
  get_date()
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  netValueIndexChartInstance?.dispose()
  dailyReturnChartInstance?.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.performance-charts {
  width: 100%;
  margin: 2rem 0;
}

.chart-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

.chart {
  width: 100%;
  height: 280px;
}

@media (max-width: 768px) {
  .chart-row {
    flex-direction: column;
  }
  
  .chart-container {
    margin-bottom: 1rem;
  }
  
  .chart, .single-chart .chart {
    height: 250px;
  }
}
</style> 