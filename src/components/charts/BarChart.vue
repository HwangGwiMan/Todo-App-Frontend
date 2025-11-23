<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  BarController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  BarController
)

interface Props {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string | string[]
      borderWidth?: number
      borderColor?: string
    }>
  }
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS<'bar'> | null = null

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new ChartJS(chartCanvas.value, {
      type: 'bar',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}개`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
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

