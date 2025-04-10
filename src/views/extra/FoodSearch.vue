<template>
  <div class="food-search-container">
    <h2>美食搜索</h2>
    
    <div class="search-section">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="输入美食名称或类型" />
        </el-form-item>
        <el-form-item label="价格区间">
          <el-select v-model="searchForm.priceRange" placeholder="选择价格区间">
            <el-option label="全部" value="" />
            <el-option label="¥" value="cheap" />
            <el-option label="¥¥" value="medium" />
            <el-option label="¥¥¥" value="expensive" />
          </el-select>
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="searchForm.rating" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFood">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="food-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="food in foods" :key="food.id">
          <el-card class="food-card" shadow="hover">
            <img :src="food.image" class="food-image" />
            <div class="food-info">
              <h4>{{ food.name }}</h4>
              <p>{{ food.description }}</p>
              <div class="food-meta">
                <el-rate v-model="food.rating" disabled />
                <span class="price">{{ food.price }}</span>
              </div>
              <div class="food-actions">
                <el-button type="primary" size="small" @click="viewDetails(food)">
                  查看详情
                </el-button>
                <el-button size="small" @click="addToFavorites(food)">
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
export default {
  name: 'FoodSearch',
  data() {
    return {
      searchForm: {
        keyword: '',
        priceRange: '',
        rating: 0
      },
      foods: [
        {
          id: 1,
          name: '示例美食1',
          description: '这是一个示例美食描述',
          image: 'https://via.placeholder.com/300x200',
          rating: 4,
          price: '¥¥'
        },
        {
          id: 2,
          name: '示例美食2',
          description: '这是另一个示例美食描述',
          image: 'https://via.placeholder.com/300x200',
          rating: 5,
          price: '¥¥¥'
        }
      ]
    }
  },
  methods: {
    searchFood() {
      // TODO: 实现美食搜索逻辑
      console.log('Searching food with:', this.searchForm)
    },
    resetForm() {
      this.searchForm = {
        keyword: '',
        priceRange: '',
        rating: 0
      }
    },
    viewDetails(food) {
      // TODO: 实现查看详情逻辑
      console.log('Viewing details for:', food)
    },
    addToFavorites(food) {
      // TODO: 实现收藏逻辑
      console.log('Adding to favorites:', food)
    }
  }
}
</script>

<style scoped>
.food-search-container {
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.food-list {
  margin-top: 20px;
}

.food-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.food-card:hover {
  transform: translateY(-5px);
}

.food-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.food-info {
  padding: 14px;
}

.food-info h4 {
  margin: 0 0 10px 0;
}

.food-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.food-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.price {
  color: #F56C6C;
  font-weight: bold;
}

.food-actions {
  display: flex;
  justify-content: space-between;
}
</style> 