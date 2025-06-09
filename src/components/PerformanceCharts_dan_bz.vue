<template>
  <div class="performance-charts">
    <!-- 添加标题栏 -->
    <div class="dashboard-header">
      <div class="logo" @click="$router.push('/')">群倫量化</div>
      <h2 class="dashboard-title">交易表现分析</h2>
    </div>

    <chat />

    <el-table
      :data="tableData"
      stripe
      border
      height="900"
      style="width: 100%"
      class="account-data-table"
    >
      <el-table-column prop="create_date" label="时间">
        <template #default="scope">
          {{ dayjs(scope.row.create_date).format('YYYY-MM-DD') + ' 08:00:00' }}
        </template>
      </el-table-column>
      <el-table-column prop="total_balance" label="资产/USDT">
        <template #default="scope">
          {{ Math.trunc(scope.row.total_balance) }}
        </template>
      </el-table-column>
      <el-table-column prop="daily_return" label="日收益">
        <template #default="scope">
          <span :class="scope.row.daily_return >= 0 ? 'positive-value' : 'negative-value'">
            {{ Math.trunc(scope.row.daily_return) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="daily_profit" label="日利润">
        <template #default="scope">
          <span :class="scope.row.daily_profit >= 0 ? 'positive-value' : 'negative-value'">
            {{ (scope.row.daily_profit * 100).toFixed(3) }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="net_value" label="净值">
        <template #default="scope">
          {{ scope.row.net_value.toFixed(4) }}
        </template>
      </el-table-column>
      <el-table-column prop="net_deposit" label="净入金">
        <template #default="scope">
          {{ scope.row.net_deposit }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

import chat from './PerformanceCharts.vue'
import axios from 'axios'
import dayjs from 'dayjs'
// 获取路由实例
const tableData = ref([])
const get_table = async () => {
  const res = await axios.get('https://tradecoin.dog/crypto/admin/api/balance-total', {
    params: {
      query: JSON.stringify({
        limit: 365,
        where: {
          status: 1,
          user: '681b133946e89bd20bba7329',
        },
      }),
    },
  })
  tableData.value = res.data.data
}
onMounted(() => {
  get_table()
})
</script>

<style scoped>
.performance-charts {
  width: 100%;
  margin: 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 12px;
  min-height: calc(100vh - 6rem);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  background: linear-gradient(90deg, #1e40af, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
}

.logo:before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e40af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'%3E%3C/path%3E%3Cpath d='M2 17l10 5 10-5'%3E%3C/path%3E%3Cpath d='M2 12l10 5 10-5'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.logo:hover {
  transform: scale(1.05);
}

.dashboard-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  position: relative;
}

.dashboard-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #1e40af, #60a5fa);
  border-radius: 3px;
}

.chart-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 0;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.chart-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to right, #f9fafb, #f3f4f6);
}

.chart-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.chart-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #ebf4ff;
  color: #3b82f6;
  border-radius: 8px;
}

.chart {
  width: 100%;
  height: 300px;
  padding: 1rem;
}

.account-data-container {
  margin-top: 2rem;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 0;
  overflow: hidden;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.35rem 0.75rem;
  background-color: #f9fafb;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.account-data-table {
  width: 100%;
  margin-bottom: 0;
  --el-table-border-color: #f0f0f0;
  --el-table-header-bg-color: #f9fafb;
  --el-table-row-hover-bg-color: #f8fafc;
}

.positive-value {
  color: #10b981;
  font-weight: 500;
}

.negative-value {
  color: #ef4444;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-title {
    margin-bottom: 1rem;
  }

  .chart-row {
    flex-direction: column;
  }

  .chart-container {
    margin-bottom: 1rem;
  }

  .chart {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .performance-charts {
    padding: 1rem;
  }

  .chart-header {
    padding: 0.75rem 1rem;
  }

  .chart {
    height: 220px;
  }
}
</style>
