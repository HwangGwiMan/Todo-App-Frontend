<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, PieController)

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
      borderWidth?: number
      borderColor?: string
    }>
  }
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS<'pie'> | null = null

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new ChartJS(chartCanvas.value, {
      type: 'pie',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                return `${label}: ${value}개 (${percentage}%)`
              }
            }
          }
        }
      }
    })
  }
})

watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData
    chartInstance.update()
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

