<template>
  <div class="scenic-route-container">
    <h2>景点路线规划</h2>
    
    <div class="search-section">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="出发地">
          <el-input v-model="searchForm.start" placeholder="请输入出发地" />
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="searchForm.end" placeholder="请输入目的地" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRoutes">搜索路线</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="map-section">
      <!-- 这里可以集成地图组件 -->
      <div class="map-placeholder">
        <el-empty description="地图加载中..." />
      </div>
    </div>
    
    <div class="routes-list">
      <h3>推荐路线</h3>
      <el-card v-for="route in routes" :key="route.id" class="route-card">
        <template #header>
          <div class="card-header">
            <span>路线 {{ route.id }}</span>
            <el-tag type="success">{{ route.duration }}小时</el-tag>
          </div>
        </template>
        <div class="route-content">
          <div class="route-steps">
            <div v-for="(step, index) in route.steps" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-info">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-duration">{{ step.duration }}分钟</div>
              </div>
            </div>
          </div>
          <div class="route-actions">
            <el-button type="primary" size="small" @click="viewRouteDetails(route)">
              查看详情
            </el-button>
            <el-button size="small" @click="saveRoute(route)">
              收藏路线
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScenicRoute',
  data() {
    return {
      searchForm: {
        start: '',
        end: ''
      },
      routes: [
        {
          id: 1,
          duration: 4,
          steps: [
            { name: '景点A', duration: 60 },
            { name: '景点B', duration: 45 },
            { name: '景点C', duration: 90 }
          ]
        },
        {
          id: 2,
          duration: 5,
          steps: [
            { name: '景点D', duration: 75 },
            { name: '景点E', duration: 60 },
            { name: '景点F', duration: 90 }
          ]
        }
      ]
    }
  },
  methods: {
    searchRoutes() {
      // TODO: 实现路线搜索逻辑
      console.log('Searching routes from', this.searchForm.start, 'to', this.searchForm.end)
    },
    viewRouteDetails(route) {
      // TODO: 实现查看路线详情逻辑
      console.log('Viewing route details:', route)
    },
    saveRoute(route) {
      // TODO: 实现路线收藏逻辑
      console.log('Saving route:', route)
    }
  }
}
</script>

<style scoped>
.scenic-route-container {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.map-section {
  height: 400px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.routes-list {
  margin-top: 20px;
}

.route-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-steps {
  margin-bottom: 15px;
}

.step-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.step-info {
  flex: 1;
}

.step-name {
  font-weight: bold;
}

.step-duration {
  color: #909399;
  font-size: 12px;
}

.route-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 