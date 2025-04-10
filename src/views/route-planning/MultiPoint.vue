<template>
  <div class="multi-point-container">
    <el-card class="control-panel">
      <template #header>
        <div class="control-header">
          <h2>多点最短路径规划</h2>
          <el-tooltip content="基于多种算法计算多个目的地之间的最优路径" placement="top">
            <el-icon><info-filled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <div class="destination-selection">
        <h3>选择目的地</h3>
        <div v-for="(destination, index) in selectedDestinations" :key="index" class="destination-item">
          <el-select 
            v-model="destination.id" 
            filterable 
            placeholder="选择目的地"
            @change="handleDestinationChange">
            <el-option
              v-for="item in availableDestinations"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="danger" circle @click="removeDestination(index)" v-if="selectedDestinations.length > 2">
            <el-icon><delete /></el-icon>
          </el-button>
        </div>
        
        <div class="add-destination">
          <el-button type="primary" @click="addDestination" :disabled="selectedDestinations.length >= 10">
            添加目的地
          </el-button>
        </div>
      </div>

      <div class="transport-selection">
        <h3>交通方式</h3>
        <el-radio-group v-model="transportType">
          <el-radio label="walking">步行</el-radio>
          <el-radio label="bicycle">自行车</el-radio>
          <el-radio label="car">电瓶车</el-radio>
        </el-radio-group>
      </div>

      <div class="algorithm-selection">
        <h3>算法选择</h3>
        <el-radio-group v-model="algorithm">
          <el-radio label="dijkstra">Dijkstra算法</el-radio>
          <el-radio label="floyd">Floyd算法</el-radio>
          <el-radio label="tsp">TSP算法</el-radio>
        </el-radio-group>
      </div>

      <div class="action-buttons">
        <el-button type="primary" @click="calculateRoute" :disabled="!isFormValid">计算路线</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>

      <div class="route-details" v-if="routeResult">
        <h3>路线详情</h3>
        <div class="route-stats">
          <div class="stat-item">
            <div class="stat-label">总距离</div>
            <div class="stat-value">{{ routeResult.distance }} km</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">预计时间</div>
            <div class="stat-value">{{ routeResult.duration }} 分钟</div>
          </div>
        </div>
        <div class="route-path">
          <h4>行程路线</h4>
          <div class="path-steps">
            <div v-for="(step, index) in routeResult.steps" :key="index" class="path-step">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-info">{{ step.distance }}km • {{ step.duration }}分钟</div>
              </div>
              <div class="step-arrow" v-if="index < routeResult.steps.length - 1">
                <el-icon><arrow-down /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <div class="map-container">
      <div class="map-placeholder">
        <div class="map-visual">
          <svg width="100%" height="100%" viewBox="0 0 800 600">
            <!-- 地图背景 -->
            <rect x="0" y="0" width="800" height="600" fill="#f0f5ff" />
            
            <!-- 场所节点 -->
            <g v-for="point in mapPoints" :key="point.id">
              <circle 
                :cx="point.x" 
                :cy="point.y" 
                r="8" 
                :fill="isPointInRoute(point.id) ? '#409EFF' : '#ccc'" 
                stroke="#fff" 
                stroke-width="2" />
              <text 
                :x="point.x" 
                :y="point.y + 20" 
                font-size="12" 
                text-anchor="middle" 
                :fill="isPointInRoute(point.id) ? '#409EFF' : '#666'">
                {{ point.name }}
              </text>
            </g>
            
            <!-- 路径线条 -->
            <g v-if="routeResult">
              <path 
                :d="getRoutePath()" 
                stroke="#409EFF" 
                stroke-width="3" 
                fill="none" 
                stroke-dasharray="5,5" />
              
              <!-- 起点和终点标记 -->
              <g v-if="routeResult.steps.length > 0">
                <circle 
                  :cx="getPointCoords(routeResult.steps[0].id).x" 
                  :cy="getPointCoords(routeResult.steps[0].id).y" 
                  r="12" 
                  fill="#67C23A" 
                  stroke="#fff" 
                  stroke-width="2" />
                <text 
                  :x="getPointCoords(routeResult.steps[0].id).x" 
                  :y="getPointCoords(routeResult.steps[0].id).y" 
                  font-size="12" 
                  text-anchor="middle" 
                  fill="#fff" 
                  dominant-baseline="middle">
                  起
                </text>
                
                <circle 
                  :cx="getPointCoords(routeResult.steps[routeResult.steps.length-1].id).x" 
                  :cy="getPointCoords(routeResult.steps[routeResult.steps.length-1].id).y" 
                  r="12" 
                  fill="#F56C6C" 
                  stroke="#fff" 
                  stroke-width="2" />
                <text 
                  :x="getPointCoords(routeResult.steps[routeResult.steps.length-1].id).x" 
                  :y="getPointCoords(routeResult.steps[routeResult.steps.length-1].id).y" 
                  font-size="12" 
                  text-anchor="middle" 
                  fill="#fff" 
                  dominant-baseline="middle">
                  终
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { InfoFilled, Delete, ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'MultiPointRoutePlanning',
  components: {
    InfoFilled,
    Delete,
    ArrowDown
  },
  setup() {
    // 所有可选的目的地
    const allDestinations = ref([
      { id: 1, name: '图书馆', description: '校园中心图书馆' },
      { id: 2, name: '学生中心', description: '学生活动与服务中心' },
      { id: 3, name: '食堂', description: '主校区食堂' },
      { id: 4, name: '体育馆', description: '综合体育馆' },
      { id: 5, name: '音乐厅', description: '大学音乐厅' },
      { id: 6, name: '计算机楼', description: '计算机科学与技术学院' },
      { id: 7, name: '数学楼', description: '数学学院' },
      { id: 8, name: '物理楼', description: '物理学院' },
      { id: 9, name: '校医院', description: '校内医疗服务中心' },
      { id: 10, name: '生活超市', description: '校内便利超市' },
      { id: 11, name: '行政楼', description: '学校行政办公中心' },
      { id: 12, name: '宿舍区', description: '学生宿舍区' }
    ])

    // 当前选择的目的地
    const selectedDestinations = ref([
      { id: 1 },
      { id: 2 }
    ])

    // 交通方式
    const transportType = ref('walking')
    
    // 算法选择
    const algorithm = ref('dijkstra')
    
    // 路线计算结果
    const routeResult = ref(null)
    
    // 可用的目的地（排除已选择的）
    const availableDestinations = computed(() => {
      const selectedIds = selectedDestinations.value.map(d => d.id)
      return allDestinations.value.filter(d => !selectedIds.includes(d.id) || selectedIds.filter(id => id === d.id).length < 2)
    })
    
    // 表单是否有效
    const isFormValid = computed(() => {
      return selectedDestinations.value.every(d => d.id) && selectedDestinations.value.length >= 2
    })
    
    // 地图上的点坐标
    const mapPoints = computed(() => {
      return allDestinations.value.map(dest => {
        // 随机生成坐标，实际项目中应该使用真实坐标
        return {
          ...dest,
          x: 100 + Math.random() * 600,
          y: 100 + Math.random() * 400
        }
      })
    })
    
    // 添加目的地
    const addDestination = () => {
      if (selectedDestinations.value.length < 10) {
        selectedDestinations.value.push({ id: null })
      }
    }
    
    // 移除目的地
    const removeDestination = (index) => {
      if (selectedDestinations.value.length > 2) {
        selectedDestinations.value.splice(index, 1)
      }
    }
    
    // 处理目的地变更
    const handleDestinationChange = () => {
      if (routeResult.value) {
        routeResult.value = null
      }
    }
    
    // 计算路线
    const calculateRoute = () => {
      // 这里通常会调用后端API来执行复杂的路径算法
      // 为了演示，我们模拟结果
      
      const destinations = selectedDestinations.value
        .filter(d => d.id)
        .map(d => {
          const destInfo = allDestinations.value.find(ad => ad.id === d.id)
          return {
            id: destInfo.id,
            name: destInfo.name
          }
        })
      
      // 模拟计算路径结果
      const steps = []
      let totalDistance = 0
      let totalDuration = 0
      
      for (let i = 0; i < destinations.length; i++) {
        const destination = destinations[i]
        
        // 随机生成距离和时间
        const distance = Math.round((0.5 + Math.random() * 1.5) * 10) / 10
        const duration = Math.round(distance * (transportType.value === 'walking' ? 15 : transportType.value === 'bicycle' ? 8 : 5))
        
        totalDistance += distance
        totalDuration += duration
        
        steps.push({
          id: destination.id,
          name: destination.name,
          distance: distance,
          duration: duration
        })
      }
      
      routeResult.value = {
        distance: Math.round(totalDistance * 10) / 10,
        duration: totalDuration,
        steps: steps
      }
    }
    
    // 重置表单
    const resetForm = () => {
      selectedDestinations.value = [{ id: 1 }, { id: 2 }]
      transportType.value = 'walking'
      algorithm.value = 'dijkstra'
      routeResult.value = null
    }
    
    // 检查点是否在路径中
    const isPointInRoute = (pointId) => {
      if (!routeResult.value) return false
      return routeResult.value.steps.some(step => step.id === pointId)
    }
    
    // 获取点的坐标
    const getPointCoords = (pointId) => {
      const point = mapPoints.value.find(p => p.id === pointId)
      return point ? { x: point.x, y: point.y } : { x: 0, y: 0 }
    }
    
    // 获取路径SVG
    const getRoutePath = () => {
      if (!routeResult.value || routeResult.value.steps.length === 0) return ''
      
      let path = ''
      
      for (let i = 0; i < routeResult.value.steps.length; i++) {
        const step = routeResult.value.steps[i]
        const point = getPointCoords(step.id)
        
        if (i === 0) {
          path += `M ${point.x} ${point.y} `
        } else {
          path += `L ${point.x} ${point.y} `
        }
      }
      
      return path
    }
    
    return {
      selectedDestinations,
      availableDestinations,
      transportType,
      algorithm,
      routeResult,
      isFormValid,
      mapPoints,
      addDestination,
      removeDestination,
      handleDestinationChange,
      calculateRoute,
      resetForm,
      isPointInRoute,
      getPointCoords,
      getRoutePath
    }
  }
}
</script>

<style scoped>
.multi-point-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 230px);
}

.control-panel {
  width: 350px;
  overflow-y: auto;
}

.control-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-header h2 {
  margin: 0;
  font-size: 18px;
}

.destination-selection, .transport-selection, .algorithm-selection, .action-buttons {
  margin-bottom: 20px;
}

.destination-selection h3, .transport-selection h3, .algorithm-selection h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.destination-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.destination-item .el-select {
  flex: 1;
}

.add-destination {
  margin-top: 15px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.route-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.route-details h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
}

.route-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.route-path h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
}

.path-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-name {
  font-weight: bold;
}

.step-info {
  font-size: 12px;
  color: #666;
}

.step-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 0 5px 12px;
  color: #ddd;
}

.map-container {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-visual {
  width: 100%;
  height: 100%;
}
</style> 