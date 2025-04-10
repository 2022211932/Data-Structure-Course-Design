<template>
  <div class="browse-diary-container">
    <h2>浏览旅行日记</h2>
    
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="地点">
          <el-input v-model="filterForm.location" placeholder="输入地点" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="filterForm.sortBy" placeholder="选择排序方式">
            <el-option label="最新发布" value="latest" />
            <el-option label="最多点赞" value="likes" />
            <el-option label="最多评论" value="comments" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFilters">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="diary-grid">
      <el-empty v-if="!diaries.length" description="暂无日记" />
      
      <el-row :gutter="20" v-else>
        <el-col :span="8" v-for="diary in diaries" :key="diary.id">
          <el-card class="diary-card" shadow="hover">
            <img :src="diary.coverImage" class="diary-cover" />
            <div class="diary-info">
              <h3>{{ diary.title }}</h3>
              <div class="diary-meta">
                <span class="location">
                  <el-icon><Location /></el-icon>
                  {{ diary.location }}
                </span>
                <span class="date">{{ diary.date }}</span>
              </div>
              <p class="diary-excerpt">{{ diary.excerpt }}</p>
              <div class="diary-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ diary.views }}
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ diary.likes }}
                </span>
                <span class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ diary.comments }}
                </span>
              </div>
              <div class="diary-actions">
                <el-button type="primary" size="small" @click="viewDiary(diary)">
                  查看详情
                </el-button>
                <el-button
                  :type="diary.isLiked ? 'danger' : 'default'"
                  size="small"
                  @click="toggleLike(diary)"
                >
                  {{ diary.isLiked ? '取消点赞' : '点赞' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[9, 18, 27, 36]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  Location,
  View,
  Star,
  ChatDotRound
} from '@element-plus/icons-vue'

export default {
  name: 'BrowseDiary',
  components: {
    Location,
    View,
    Star,
    ChatDotRound
  },
  data() {
    return {
      filterForm: {
        location: '',
        dateRange: [],
        sortBy: 'latest'
      },
      currentPage: 1,
      pageSize: 9,
      total: 100,
      diaries: [
        {
          id: 1,
          title: '示例日记1',
          location: '北京',
          date: '2023-05-01',
          excerpt: '这是一篇示例旅行日记的摘要...',
          coverImage: 'https://via.placeholder.com/300x200',
          views: 1234,
          likes: 56,
          comments: 23,
          isLiked: false
        },
        {
          id: 2,
          title: '示例日记2',
          location: '上海',
          date: '2023-04-15',
          excerpt: '这是另一篇示例旅行日记的摘要...',
          coverImage: 'https://via.placeholder.com/300x200',
          views: 987,
          likes: 45,
          comments: 12,
          isLiked: true
        }
      ]
    }
  },
  methods: {
    applyFilters() {
      // TODO: 实现筛选逻辑
      console.log('Applying filters:', this.filterForm)
    },
    resetFilters() {
      this.filterForm = {
        location: '',
        dateRange: [],
        sortBy: 'latest'
      }
    },
    viewDiary(diary) {
      // TODO: 实现查看日记详情逻辑
      console.log('Viewing diary:', diary)
    },
    toggleLike(diary) {
      // TODO: 实现点赞/取消点赞逻辑
      diary.isLiked = !diary.isLiked
      diary.likes += diary.isLiked ? 1 : -1
    },
    handleSizeChange(val) {
      this.pageSize = val
      // TODO: 重新加载数据
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // TODO: 重新加载数据
    }
  }
}
</script>

<style scoped>
.browse-diary-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.diary-grid {
  margin-bottom: 30px;
}

.diary-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.diary-card:hover {
  transform: translateY(-5px);
}

.diary-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.diary-info {
  padding: 14px;
}

.diary-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.diary-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.diary-excerpt {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 14px;
}

.diary-actions {
  display: flex;
  justify-content: space-between;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 