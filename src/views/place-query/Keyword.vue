<template>
  <div class="keyword-search-container">
    <h2>关键词搜索</h2>
    
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="请输入关键词搜索地点"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      
      <div class="search-filters">
        <el-select v-model="filterType" placeholder="筛选类型" class="filter-select">
          <el-option label="全部" value="" />
          <el-option label="景点" value="scenic" />
          <el-option label="餐厅" value="restaurant" />
          <el-option label="购物" value="shopping" />
        </el-select>
        
        <el-select v-model="sortBy" placeholder="排序方式" class="filter-select">
          <el-option label="距离最近" value="distance" />
          <el-option label="评分最高" value="rating" />
          <el-option label="人气最高" value="popularity" />
        </el-select>
      </div>
    </div>
    
    <div class="search-results">
      <el-empty v-if="!searchResults.length" description="暂无搜索结果" />
      
      <el-row :gutter="20" v-else>
        <el-col :span="8" v-for="place in searchResults" :key="place.id">
          <el-card class="place-card">
            <img :src="place.image" class="place-image" />
            <div class="place-info">
              <h4>{{ place.name }}</h4>
              <p>{{ place.description }}</p>
              <div class="place-meta">
                <el-rate v-model="place.rating" disabled />
                <span class="distance">{{ place.distance }}km</span>
              </div>
              <div class="place-tags">
                <el-tag
                  v-for="tag in place.tags"
                  :key="tag"
                  size="small"
                  class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
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
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'KeywordSearch',
  components: {
    Search
  },
  data() {
    return {
      searchQuery: '',
      filterType: '',
      sortBy: 'distance',
      searchResults: [
        {
          id: 1,
          name: '示例地点1',
          description: '这是一个示例地点描述',
          image: 'https://via.placeholder.com/300x200',
          rating: 4,
          distance: 2.5,
          tags: ['景点', '自然风光']
        },
        {
          id: 2,
          name: '示例地点2',
          description: '这是另一个示例地点描述',
          image: 'https://via.placeholder.com/300x200',
          rating: 5,
          distance: 1.8,
          tags: ['餐厅', '美食']
        }
      ]
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery.trim()) {
        this.$message.warning('请输入搜索关键词')
        return
      }
      // TODO: 实现搜索逻辑
      console.log('Searching for:', this.searchQuery)
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
.keyword-search-container {
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  width: 600px;
  margin-bottom: 20px;
}

.search-filters {
  display: flex;
  gap: 20px;
}

.filter-select {
  width: 150px;
}

.search-results {
  margin-top: 20px;
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

.place-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.distance {
  color: #909399;
  font-size: 14px;
}

.place-tags {
  margin-bottom: 10px;
}

.tag {
  margin-right: 5px;
}

.place-actions {
  display: flex;
  justify-content: space-between;
}
</style> 