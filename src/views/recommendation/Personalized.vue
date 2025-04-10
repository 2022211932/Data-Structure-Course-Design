<template>
  <div class="personalized-container">
    <h2>个性化推荐</h2>
    
    <div class="preferences-section">
      <h3>兴趣偏好设置</h3>
      <el-form :model="preferencesForm" label-width="120px">
        <el-form-item label="旅行类型">
          <el-checkbox-group v-model="preferencesForm.travelTypes">
            <el-checkbox label="自然风光">自然风光</el-checkbox>
            <el-checkbox label="历史文化">历史文化</el-checkbox>
            <el-checkbox label="美食体验">美食体验</el-checkbox>
            <el-checkbox label="购物娱乐">购物娱乐</el-checkbox>
            <el-checkbox label="户外运动">户外运动</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="预算范围">
          <el-radio-group v-model="preferencesForm.budget">
            <el-radio label="经济型">经济型</el-radio>
            <el-radio label="舒适型">舒适型</el-radio>
            <el-radio label="豪华型">豪华型</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="旅行时长">
          <el-select v-model="preferencesForm.duration" placeholder="请选择">
            <el-option label="1-3天" value="short" />
            <el-option label="4-7天" value="medium" />
            <el-option label="8天以上" value="long" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="updatePreferences">更新偏好</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="recommendations-section">
      <h3>为您推荐</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="景点推荐" name="scenic">
          <el-row :gutter="20">
            <el-col :span="8" v-for="place in scenicPlaces" :key="place.id">
              <el-card class="place-card" shadow="hover">
                <img :src="place.image" class="place-image" />
                <div class="place-info">
                  <h4>{{ place.name }}</h4>
                  <p>{{ place.description }}</p>
                  <div class="place-actions">
                    <el-button type="primary" size="small" @click="viewDetails(place)">
                      查看详情
                    </el-button>
                    <el-button size="small" @click="addToPlan(place)">
                      加入行程
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <el-tab-pane label="路线推荐" name="route">
          <el-row :gutter="20">
            <el-col :span="12" v-for="route in routes" :key="route.id">
              <el-card class="route-card" shadow="hover">
                <div class="route-info">
                  <h4>{{ route.name }}</h4>
                  <p>{{ route.description }}</p>
                  <div class="route-details">
                    <span>时长：{{ route.duration }}天</span>
                    <span>预算：{{ route.budget }}</span>
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
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Personalized',
  data() {
    return {
      activeTab: 'scenic',
      preferencesForm: {
        travelTypes: [],
        budget: '',
        duration: ''
      },
      scenicPlaces: [
        {
          id: 1,
          name: '示例景点1',
          description: '这是一个示例景点描述',
          image: 'https://via.placeholder.com/300x200'
        },
        {
          id: 2,
          name: '示例景点2',
          description: '这是另一个示例景点描述',
          image: 'https://via.placeholder.com/300x200'
        }
      ],
      routes: [
        {
          id: 1,
          name: '示例路线1',
          description: '这是一个示例路线描述',
          duration: 3,
          budget: '经济型'
        },
        {
          id: 2,
          name: '示例路线2',
          description: '这是另一个示例路线描述',
          duration: 5,
          budget: '舒适型'
        }
      ]
    }
  },
  methods: {
    updatePreferences() {
      // TODO: 实现偏好更新逻辑
      console.log('Updating preferences:', this.preferencesForm)
    },
    viewDetails(place) {
      // TODO: 实现查看详情逻辑
      console.log('Viewing details for:', place)
    },
    addToPlan(place) {
      // TODO: 实现添加到行程逻辑
      console.log('Adding to plan:', place)
    },
    viewRouteDetails(route) {
      // TODO: 实现查看路线详情逻辑
      console.log('Viewing route details:', route)
    },
    saveRoute(route) {
      // TODO: 实现保存路线逻辑
      console.log('Saving route:', route)
    }
  }
}
</script>

<style scoped>
.personalized-container {
  padding: 20px;
}

.preferences-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.recommendations-section {
  margin-top: 30px;
}

.place-card,
.route-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.place-card:hover,
.route-card:hover {
  transform: translateY(-5px);
}

.place-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.place-info,
.route-info {
  padding: 14px;
}

.place-info h4,
.route-info h4 {
  margin: 0 0 10px 0;
}

.place-info p,
.route-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.place-actions,
.route-actions {
  display: flex;
  justify-content: space-between;
}

.route-details {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}
</style> 