<template>
  <div class="interest-recommendation-container">
    <h2>兴趣推荐</h2>
    
    <div class="interests-section">
      <h3>选择您的兴趣</h3>
      <el-checkbox-group v-model="selectedInterests">
        <el-checkbox
          v-for="interest in interests"
          :key="interest.id"
          :label="interest.id"
          class="interest-checkbox"
        >
          <div class="interest-item">
            <el-icon :size="24" class="interest-icon">
              <component :is="interest.icon" />
            </el-icon>
            <span class="interest-name">{{ interest.name }}</span>
          </div>
        </el-checkbox>
      </el-checkbox-group>
      
      <div class="actions">
        <el-button type="primary" @click="updateInterests">更新兴趣</el-button>
      </div>
    </div>
    
    <div class="recommendations-section">
      <h3>推荐活动</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="activity in recommendedActivities" :key="activity.id">
          <el-card class="activity-card" shadow="hover">
            <img :src="activity.image" class="activity-image" />
            <div class="activity-info">
              <h4>{{ activity.name }}</h4>
              <p>{{ activity.description }}</p>
              <div class="activity-meta">
                <el-tag
                  v-for="tag in activity.tags"
                  :key="tag"
                  size="small"
                  class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="activity-actions">
                <el-button type="primary" size="small" @click="viewDetails(activity)">
                  查看详情
                </el-button>
                <el-button size="small" @click="addToFavorites(activity)">
                  收藏
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  Picture,
  Reading,
  Food,
  ShoppingCart,
  Basketball,
  Camera,
  Music,
  Film
} from '@element-plus/icons-vue'

export default {
  name: 'InterestRecommendation',
  components: {
    Picture,
    Reading,
    Food,
    ShoppingCart,
    Basketball,
    Camera,
    Music,
    Film
  },
  data() {
    return {
      selectedInterests: [],
      interests: [
        {
          id: 1,
          name: '自然风光',
          icon: 'Picture'
        },
        {
          id: 2,
          name: '历史文化',
          icon: 'Reading'
        },
        {
          id: 3,
          name: '美食体验',
          icon: 'Food'
        },
        {
          id: 4,
          name: '购物娱乐',
          icon: 'ShoppingCart'
        },
        {
          id: 5,
          name: '户外运动',
          icon: 'Basketball'
        },
        {
          id: 6,
          name: '摄影',
          icon: 'Camera'
        },
        {
          id: 7,
          name: '音乐',
          icon: 'Music'
        },
        {
          id: 8,
          name: '电影',
          icon: 'Film'
        }
      ],
      recommendedActivities: [
        {
          id: 1,
          name: '示例活动1',
          description: '这是一个示例活动描述',
          image: 'https://via.placeholder.com/300x200',
          tags: ['户外', '运动']
        },
        {
          id: 2,
          name: '示例活动2',
          description: '这是另一个示例活动描述',
          image: 'https://via.placeholder.com/300x200',
          tags: ['文化', '艺术']
        }
      ]
    }
  },
  methods: {
    updateInterests() {
      // TODO: 实现兴趣更新逻辑
      console.log('Updating interests:', this.selectedInterests)
    },
    viewDetails(activity) {
      // TODO: 实现查看详情逻辑
      console.log('Viewing details for:', activity)
    },
    addToFavorites(activity) {
      // TODO: 实现收藏逻辑
      console.log('Adding to favorites:', activity)
    }
  }
}
</script>

<style scoped>
.interest-recommendation-container {
  padding: 20px;
}

.interests-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.interest-checkbox {
  display: block;
  margin-bottom: 15px;
}

.interest-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.interest-icon {
  color: #409EFF;
}

.interest-name {
  font-size: 16px;
}

.actions {
  margin-top: 20px;
  text-align: center;
}

.recommendations-section {
  margin-top: 30px;
}

.activity-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.activity-info {
  padding: 14px;
}

.activity-info h4 {
  margin: 0 0 10px 0;
}

.activity-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.activity-meta {
  margin-bottom: 10px;
}

.tag {
  margin-right: 5px;
}

.activity-actions {
  display: flex;
  justify-content: space-between;
}
</style> 