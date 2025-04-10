<template>
  <div class="extra-features-container">
    <h2>额外功能</h2>
    
    <div class="features-grid">
      <el-row :gutter="20">
        <el-col :span="8" v-for="feature in features" :key="feature.id">
          <el-card class="feature-card" shadow="hover" @click="navigateToFeature(feature)">
            <div class="feature-content">
              <el-icon :size="40" class="feature-icon">
                <component :is="feature.icon" />
              </el-icon>
              <h3>{{ feature.name }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  MapLocation,
  Food,
  Star
} from '@element-plus/icons-vue'

export default {
  name: 'ExtraFeatures',
  components: {
    MapLocation,
    Food,
    Star
  },
  data() {
    return {
      features: [
        {
          id: 1,
          name: '室内导航',
          description: '提供室内场所的导航服务',
          icon: 'MapLocation',
          route: '/extra/indoor-navigation'
        },
        {
          id: 2,
          name: '美食搜索',
          description: '查找附近的美食和餐厅',
          icon: 'Food',
          route: '/extra/food-search'
        },
        {
          id: 3,
          name: '兴趣推荐',
          description: '基于兴趣的个性化推荐',
          icon: 'Star',
          route: '/extra/interest-recommendation'
        }
      ]
    }
  },
  methods: {
    navigateToFeature(feature) {
      this.$router.push(feature.route)
    }
  }
}
</script>

<style scoped>
.extra-features-container {
  padding: 20px;
}

.features-grid {
  margin-top: 30px;
}

.feature-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-content {
  text-align: center;
  padding: 30px 20px;
}

.feature-icon {
  color: #409EFF;
  margin-bottom: 15px;
}

.feature-content h3 {
  margin: 10px 0;
  font-size: 18px;
}

.feature-content p {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
}
</style> 