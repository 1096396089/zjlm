<template>
  <div class="stats-container">
    <div class="general-statistics">
      <h2>General Statistics</h2>
      <div class="time-filters">
        <!-- < <el-radio-group v-model="activeFilter" size="small" @change="handleFilterChange">
          <el-radio-button label="week">Last week</el-radio-button>
          <el-radio-button label="month">Last month</el-radio-button>
          <el-radio-button label="sixMonth">Last 6 month</el-radio-button>
          <el-radio-button label="year">Year</el-radio-button>
        </el-radio-group> -->
      </div>

      <div class="chart-container" ref="chartRef"></div>
    </div>

    <!-- 新增的摘要信息组件 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-xl font-semibold text-blue-900 mb-4">Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">年化</span>
          <span class="text-lg font-bold text-blue-900">{{
            summaryData.annualized || '0.523155'
          }}</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">最新净值</span>
          <span class="text-lg font-bold text-blue-900">{{
            summaryData.latestValue || '1.13'
          }}</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">最大回撤度</span>
          <span class="text-lg font-bold text-blue-900">{{ summaryData.drawdown || '0.02' }}</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">最新资产USDT</span>
          <span class="text-lg font-bold text-blue-900">{{
            summaryData.latestAssets || '540112'
          }}</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">当前账号收益</span>
          <span class="text-lg font-bold text-blue-900">{{
            summaryData.currentAccountProfit || '38056'
          }}</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
          <span class="text-sm text-blue-700 mb-1">运行天数</span>
          <span class="text-lg font-bold text-blue-900">{{ summaryData.runningDays || '91' }}</span>
        </div>
      </div>
    </div>

    <div class="strategies-table">
      <el-table
        :data="strategies"
        style="width: 100%"
        :border="false"
        :header-cell-style="{ backgroundColor: '#f1f5f9', color: '#1e3a8a', fontWeight: '600' }"
        :cell-style="{ color: '#1e40af' }"

      >
        <el-table-column label="Vault" prop="name" min-width="100" />

        <el-table-column label="當日損益" min-width="120">
          <template v-slot="props">
            <span :class="{ profit: true, positive: Number(props.row?.daily_rate) > 0 }">
              {{ Number(props.row?.daily_rate).toFixed(4) }}%
            </span>
          </template>
        </el-table-column>

        <el-table-column label="淨值1" min-width="100">
          <template v-slot="props">
            {{ Number(props.row?.daily_volatility).toFixed(4) }}
          </template>
        </el-table-column>

        <el-table-column label="淨值增長率" min-width="120">
          <template v-slot="props"> {{ Number(props.row?.grow_rate).toFixed(4) }}% </template>
        </el-table-column>

        <el-table-column label="策略模型" min-width="120">
          <template v-slot="props">
            <el-tag
              :type="props.row?.strategy_type === 'CTA' ? 'primary' : 'success'"
              effect="light"
              size="small"
            >
              {{ props.row?.strategy_type }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="最大回撤度" min-width="120">
          <template v-slot="props"> {{ Number(props.row?.net_value).toFixed(4) }}% </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { TableColumnCtx } from 'element-plus'
import { ElMessage } from 'element-plus'
import { http } from '@/util/http'
import axios from 'axios'

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const activeFilter = ref('week')

// 添加摘要数据
const summaryData = ref({
  annualized: '0.516662',
  latestValue: '1.15',
  latestAssets: '548719',
  currentAccountProfit: '46663',
  runningDays: '106',
  drawdown: '0.0089',
})


const get_summaryData = async () => {
  const res = await axios.get('https://tradecoin.dog/crypto/admin/api/balance-total/getSummaryData')
  summaryData.value = res.data
}

// Sample data for the strategies
const strategies = ref([
  {
    name: '总策略 ',
    daily_rate: 0.0044,
    daily_volatility: 1.14,
    net_value: 0.89,
    grow_rate: 14.00,
    strategy_type: '中性套利',
    drawdown: 0.89,
    index: 1,
  },
  // {
  //   name: '策略2',
  //   daily_rate: 0,
  //   daily_volatility: 1.0901,
  //   net_value: 1.08,
  //   grow_rate: 9.006,
  //   strategy_type: 'CTA',
  //   drawdown: 1.08,
  //   index: 2,
  // },
  // {
  //   name: '策略3',
  //   daily_rate: 0,
  //   daily_volatility: 1.0425,
  //   net_value: 0.98,
  //   grow_rate: 4.2522,
  //   strategy_type: 'CTA',
  //   drawdown: 0.98,
  //   index: 3,
  // },
 // {
 //   name: '總策略',
 //   daily_rate: 0.007,
 //   daily_volatility: 1.0977,
 //   net_value: 0.886,
  //   strategy_type: '中性套利',
  //   drawdown: 0.886,
  //   index: 4,
  // },
])



// Initialize the chart
const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()

    // Handle window resize
    window.addEventListener('resize', resizeChart)
  }
}

// Configure chart options
const getChartOptions = (data: number[] = []) => {
  // Generate dates for the last 12 days
  const dates: string[] = []
  const today = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(formatDate(date))
  }

  return {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const date = params[0].name
        const value = params[0].value
        return `
          <div style="font-size: 14px; color: #666; line-height: 1.5">
            <div style="margin-bottom: 5px;"><strong>Date:</strong> ${date}</div>
            <div><strong>Value:</strong> ${value.toFixed(2)}</div>
          </div>
        `
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#3b82f6',
        },
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e3a8a',
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
      axisLabel: {
        color: '#64748b',
        formatter: function (value: string) {
          // Only show month and day to avoid clutter
          const parts = value.split('-')
          return `${parts[1]}-${parts[2]}`
        },
      },
      show: true,
    },
    yAxis: {
      type: 'value',
      min: 10,
      max: 11,
      axisLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
      axisLabel: {
        color: '#64748b',
        formatter: function (value: number) {
          return value.toFixed(2)
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      show: true,
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        name: 'Portfolio Value',
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: '#2563eb',
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 5,
          },
        },
        lineStyle: {
          width: 3,
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)',
              },
            ],
          },
        },
      },
    ],
    media: [
      {
        query: {
          maxWidth: 768,
        },
        option: {
          grid: {
            left: '5%',
            right: '5%',
          },
          xAxis: {
            axisLabel: {
              interval: 2,
            },
          },
        },
      },
      {
        query: {
          maxWidth: 480,
        },
        option: {
          grid: {
            left: '2%',
            right: '2%',
          },
          xAxis: {
            axisLabel: {
              interval: 3,
            },
          },
        },
      },
    ],
  }
}

const get_date = async () => {
  try {
    const res = await axios.get('https://tradecoin.dog/crypto/admin/api/balance-total',{params:{
      query:JSON.stringify(
        {
          sort:{"create_date":-1},
          where:{
            status:1,
            user:'681b133946e89bd20bba7329'
          }
        }
      )
    }})
    
    if (res.data && res.data.data) {
      summaryData.value.runningDays = res.data.total
      const balanceData = res.data.data;
      console.log('获取到的余额数据:', balanceData);
      
      // 按日期升序排序数据
      const sortedData = [...balanceData].sort((a, b) => {
        return new Date(a.create_date).getTime() - new Date(b.create_date).getTime();
      });
      
      // 提取日期和net_value数据
      const dates = sortedData.map(item => {
        const date = new Date(item.create_date);
        return formatDate(date);
      });
      
      const netValues = sortedData.map(item => Number(item.net_value));
      
      // 更新摘要数据
      if (sortedData.length > 0) {
        const latestData = sortedData[sortedData.length - 1];
        summaryData.value = {
          ...summaryData.value,
          latestValue: latestData.net_value.toFixed(4),
          latestAssets: Math.round(latestData.total_balance).toString()
        };
      }
      
      // 更新图表数据
      if (chart) {
        // 计算y轴范围
        const minValue = Math.min(...netValues);
        const maxValue = Math.max(...netValues);
        const yMin = minValue - 0.1;
        const yMax = maxValue + 0.1;
        
        const chartOptions = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params: any[]) {
              return `
                <div style="font-size: 14px; color: #666; line-height: 1.5">
                  <div style="margin-bottom: 5px;"><strong>日期:</strong> ${params[0].name}</div>
                  <div><strong>净值:</strong> ${params[0].value.toFixed(4)}</div>
                </div>
              `;
            }
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              formatter: function (value: string) {
                const parts = value.split('-');
                return `${parts[1]}-${parts[2]}`;
              }
            }
          },
          yAxis: {
            type: 'value',
            min: yMin,
            max: yMax,
            axisLabel: {
              formatter: function (value: number) {
                return value.toFixed(4);
              }
            },
            splitNumber: 4
          },
          series: [
            {
              data: netValues,
              type: 'line',
              smooth: true,
              name: '净值',
              symbolSize: 6,
              symbol: 'circle',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(59, 130, 246, 0.5)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(59, 130, 246, 0.05)'
                    }
                  ]
                }
              }
            }
          ],
          grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
          }
        };
        
        chart.setOption(chartOptions);
      }
    }
  } catch (error) {
    console.error('获取余额数据失败:', error);
    ElMessage.error('获取余额数据失败');
  }
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Resize the chart when window size changes
const resizeChart = () => {
  if (chart) {
    chart.resize()
  }
}

// Update chart based on selected time filter
const updateChart = (data: number[] = []) => {
  if (!chart) return

  chart.setOption(getChartOptions(data))
}



// Watch for filter changes
watch(activeFilter, () => {
  updateChart()
})

// Lifecycle hooks
onMounted(() => {
  initChart() // 初始化图表
  get_date() // 获取图表数据并显示
  get_summaryData()
  
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
.stats-container {
  width: 100%;
  color: #1e40af;
}

.general-statistics {
  margin-bottom: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.general-statistics h2 {
  margin-top: 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1e3a8a;
}

.time-filters {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.strategies-table {
  background-color: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.profit {
  color: #ef4444;
}

.profit.positive {
  color: #10b981;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background-color: #f1f5f9;
}

/* Responsive styles */
@media (max-width: 768px) {
  .time-filters {
    justify-content: center;
  }

  .general-statistics {
    padding: 1rem;
  }

  .chart-container {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .general-statistics h2 {
    font-size: 1.25rem;
    text-align: center;
  }

  .time-filters {
    margin-bottom: 0.5rem;
  }

  .chart-container {
    height: 200px;
  }
}

/* 添加摘要容器样式 */
.summary-container {
  margin-bottom: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.summary-container h3 {
  margin-top: 0;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1e3a8a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.item-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.item-value {
  color: #1e3a8a;
  font-size: 1.125rem;
  font-weight: 600;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
