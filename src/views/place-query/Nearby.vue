<template>
  <div class="nearby-container">
    <h2>附近景点</h2>
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="搜索附近景点"
        class="search-input"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>
    <div class="places-list">
      <el-empty v-if="!places.length" description="暂无数据" />
      <el-card v-for="place in places" :key="place.id" class="place-card">
        <template #header>
          <div class="card-header">
            <span>{{ place.name }}</span>
            <el-tag type="success">{{ place.distance }}km</el-tag>
          </div>
        </template>
        <div class="place-info">
          <p>{{ place.description }}</p>
          <div class="place-actions">
            <el-button type="primary" size="small" @click="viewDetails(place)">
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nearby',
  data() {
    return {
      searchQuery: '',
      places: []
    }
  },
  methods: {
    handleSearch() {
      // TODO: 实现搜索逻辑
      console.log('Searching for:', this.searchQuery)
    },
    viewDetails(place) {
      // TODO: 实现查看详情逻辑
      console.log('Viewing details for:', place)
    }
  },
  mounted() {
    // TODO: 获取当前位置并加载附近景点
  }
}
</script>

<style scoped>
.nearby-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.places-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.place-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.place-info {
  font-size: 14px;
}

.place-actions {
  margin-top: 10px;
  text-align: right;
}
</style> 