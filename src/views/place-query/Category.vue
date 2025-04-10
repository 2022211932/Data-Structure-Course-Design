<template>
  <div class="category-container">
    <h2>景点分类查询</h2>
    
    <div class="category-section">
      <el-row :gutter="20">
        <el-col :span="6" v-for="category in categories" :key="category.id">
          <el-card class="category-card" shadow="hover" @click="selectCategory(category)">
            <div class="category-content">
              <el-icon :size="40" class="category-icon">
                <component :is="category.icon" />
              </el-icon>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="places-section" v-if="selectedCategory">
      <h3>{{ selectedCategory.name }}景点</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="place in filteredPlaces" :key="place.id">
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
    </div>
  </div>
</template>

<script>
import {
  Picture,
  Reading,
  Food,
  ShoppingCart,
  Basketball
} from '@element-plus/icons-vue'

export default {
  name: 'Category',
  components: {
    Picture,
    Reading,
    Food,
    ShoppingCart,
    Basketball
  },
  data() {
    return {
      selectedCategory: null,
      categories: [
        {
          id: 1,
          name: '自然风光',
          description: '山水湖泊，自然奇观',
          icon: 'Picture'
        },
        {
          id: 2,
          name: '历史文化',
          description: '古迹遗址，文化传承',
          icon: 'Reading'
        },
        {
          id: 3,
          name: '美食体验',
          description: '特色美食，地方小吃',
          icon: 'Food'
        },
        {
          id: 4,
          name: '购物娱乐',
          description: '购物中心，娱乐场所',
          icon: 'ShoppingCart'
        },
        {
          id: 5,
          name: '户外运动',
          description: '运动场地，户外活动',
          icon: 'Basketball'
        }
      ],
      places: [
        {
          id: 1,
          categoryId: 1,
          name: '示例景点1',
          description: '这是一个示例景点描述',
          image: 'https://via.placeholder.com/300x200'
        },
        {
          id: 2,
          categoryId: 1,
          name: '示例景点2',
          description: '这是另一个示例景点描述',
          image: 'https://via.placeholder.com/300x200'
        }
      ]
    }
  },
  computed: {
    filteredPlaces() {
      if (!this.selectedCategory) return []
      return this.places.filter(place => place.categoryId === this.selectedCategory.id)
    }
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category
    },
    viewDetails(place) {
      // TODO: 实现查看详情逻辑
      console.log('Viewing details for:', place)
    },
    addToPlan(place) {
      // TODO: 实现添加到行程逻辑
      console.log('Adding to plan:', place)
    }
  }
}
</script>

<style scoped>
.category-container {
  padding: 20px;
}

.category-section {
  margin-bottom: 30px;
}

.category-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-content {
  text-align: center;
  padding: 20px;
}

.category-icon {
  color: #409EFF;
  margin-bottom: 10px;
}

.category-content h3 {
  margin: 10px 0;
}

.category-content p {
  color: #909399;
  font-size: 14px;
}

.places-section {
  margin-top: 30px;
}

.place-card {
  margin-bottom: 20px;
}

.place-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.place-info {
  padding: 14px;
}

.place-info h4 {
  margin: 0 0 10px 0;
}

.place-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.place-actions {
  display: flex;
  justify-content: space-between;
}
</style> 