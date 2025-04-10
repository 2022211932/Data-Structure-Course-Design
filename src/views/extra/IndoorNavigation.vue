<template>
  <div class="indoor-navigation-container">
    <h2>室内导航</h2>
    
    <div class="navigation-content">
      <div class="map-section">
        <!-- 这里可以集成室内地图组件 -->
        <div class="map-placeholder">
          <el-empty description="室内地图加载中..." />
        </div>
      </div>
      
      <div class="control-section">
        <el-form :model="navigationForm" label-width="100px">
          <el-form-item label="当前位置">
            <el-select v-model="navigationForm.currentLocation" placeholder="请选择当前位置">
              <el-option
                v-for="location in locations"
                :key="location.value"
                :label="location.label"
                :value="location.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="目标位置">
            <el-select v-model="navigationForm.targetLocation" placeholder="请选择目标位置">
              <el-option
                v-for="location in locations"
                :key="location.value"
                :label="location.label"
                :value="location.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="startNavigation">开始导航</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        
        <div class="navigation-steps" v-if="navigationRoute">
          <h3>导航路线</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(step, index) in navigationRoute.steps"
              :key="index"
              :timestamp="step.distance"
              placement="top"
            >
              <el-card>
                <h4>{{ step.name }}</h4>
                <p>{{ step.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndoorNavigation',
  data() {
    return {
      navigationForm: {
        currentLocation: '',
        targetLocation: ''
      },
      locations: [
        { value: 'entrance', label: '入口' },
        { value: 'service_desk', label: '服务台' },
        { value: 'elevator', label: '电梯' },
        { value: 'restroom', label: '洗手间' },
        { value: 'restaurant', label: '餐厅' },
        { value: 'shop', label: '商店' }
      ],
      navigationRoute: null
    }
  },
  methods: {
    startNavigation() {
      if (!this.navigationForm.currentLocation || !this.navigationForm.targetLocation) {
        this.$message.warning('请选择当前位置和目标位置')
        return
      }
      
      // TODO: 实现导航路线生成逻辑
      this.navigationRoute = {
        steps: [
          {
            name: '从当前位置出发',
            description: '向前直行50米',
            distance: '50米'
          },
          {
            name: '到达第一个路口',
            description: '左转',
            distance: '30米'
          },
          {
            name: '到达目标位置',
            description: '目的地就在前方',
            distance: '20米'
          }
        ]
      }
    },
    resetForm() {
      this.navigationForm = {
        currentLocation: '',
        targetLocation: ''
      }
      this.navigationRoute = null
    }
  }
}
</script>

<style scoped>
.indoor-navigation-container {
  padding: 20px;
}

.navigation-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.map-section {
  flex: 2;
  height: 500px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-section {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.navigation-steps {
  margin-top: 30px;
}

.navigation-steps h3 {
  margin-bottom: 20px;
}

.el-timeline-item {
  padding-bottom: 20px;
}

.el-timeline-item:last-child {
  padding-bottom: 0;
}

.el-card {
  margin-bottom: 10px;
}

.el-card h4 {
  margin: 0 0 10px 0;
}

.el-card p {
  color: #606266;
  font-size: 14px;
  margin: 0;
}
</style> 