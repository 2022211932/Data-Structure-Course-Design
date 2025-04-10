<template>
  <div class="my-diary-container">
    <h2>我的旅行日记</h2>
    
    <div class="header-section">
      <el-button type="primary" @click="createNewDiary">
        <el-icon><Plus /></el-icon>
        新建日记
      </el-button>
      
      <el-input
        v-model="searchQuery"
        placeholder="搜索日记"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="diary-list">
      <el-empty v-if="!filteredDiaries.length" description="暂无日记" />
      
      <el-timeline v-else>
        <el-timeline-item
          v-for="diary in filteredDiaries"
          :key="diary.id"
          :timestamp="diary.date"
          placement="top"
        >
          <el-card class="diary-card">
            <template #header>
              <div class="card-header">
                <span>{{ diary.title }}</span>
                <div class="card-actions">
                  <el-button type="primary" size="small" @click="editDiary(diary)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteDiary(diary)">
                    删除
                  </el-button>
                </div>
              </div>
            </template>
            <div class="diary-content">
              <p class="diary-location">
                <el-icon><Location /></el-icon>
                {{ diary.location }}
              </p>
              <p class="diary-text">{{ diary.content }}</p>
              <div class="diary-images" v-if="diary.images && diary.images.length">
                <el-image
                  v-for="(image, index) in diary.images"
                  :key="index"
                  :src="image"
                  :preview-src-list="diary.images"
                  fit="cover"
                  class="diary-image"
                />
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { Plus, Search, Location } from '@element-plus/icons-vue'

export default {
  name: 'MyDiary',
  components: {
    Plus,
    Search,
    Location
  },
  data() {
    return {
      searchQuery: '',
      diaries: [
        {
          id: 1,
          title: '示例日记1',
          date: '2023-05-01',
          location: '北京',
          content: '这是一篇示例旅行日记的内容...',
          images: [
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200'
          ]
        },
        {
          id: 2,
          title: '示例日记2',
          date: '2023-04-15',
          location: '上海',
          content: '这是另一篇示例旅行日记的内容...',
          images: [
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200'
          ]
        }
      ]
    }
  },
  computed: {
    filteredDiaries() {
      if (!this.searchQuery) return this.diaries
      const query = this.searchQuery.toLowerCase()
      return this.diaries.filter(diary =>
        diary.title.toLowerCase().includes(query) ||
        diary.location.toLowerCase().includes(query) ||
        diary.content.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    createNewDiary() {
      // TODO: 实现创建新日记逻辑
      console.log('Creating new diary')
    },
    editDiary(diary) {
      // TODO: 实现编辑日记逻辑
      console.log('Editing diary:', diary)
    },
    deleteDiary(diary) {
      this.$confirm('确定要删除这篇日记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 实现删除日记逻辑
        console.log('Deleting diary:', diary)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.my-diary-container {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.search-input {
  width: 300px;
}

.diary-list {
  margin-top: 20px;
}

.diary-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.diary-content {
  padding: 10px 0;
}

.diary-location {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.diary-text {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.diary-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.diary-image {
  width: 150px;
  height: 100px;
  border-radius: 4px;
}
</style> 