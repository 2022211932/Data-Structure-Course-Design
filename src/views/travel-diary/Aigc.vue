<template>
  <div class="aigc-container">
    <h2>AI生成旅行日记</h2>
    
    <div class="generation-form">
      <el-form :model="generationForm" label-width="120px">
        <el-form-item label="旅行主题">
          <el-input v-model="generationForm.theme" placeholder="请输入旅行主题" />
        </el-form-item>
        
        <el-form-item label="目的地">
          <el-input v-model="generationForm.destination" placeholder="请输入目的地" />
        </el-form-item>
        
        <el-form-item label="旅行时长">
          <el-select v-model="generationForm.duration" placeholder="请选择">
            <el-option label="1-3天" value="short" />
            <el-option label="4-7天" value="medium" />
            <el-option label="8天以上" value="long" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="写作风格">
          <el-select v-model="generationForm.style" placeholder="请选择">
            <el-option label="轻松活泼" value="casual" />
            <el-option label="文艺清新" value="literary" />
            <el-option label="专业详细" value="professional" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="额外要求">
          <el-input
            v-model="generationForm.additionalRequirements"
            type="textarea"
            :rows="3"
            placeholder="请输入其他要求（可选）"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="generating"
            @click="generateDiary"
          >
            生成日记
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="generated-diary" v-if="generatedDiary">
      <h3>生成的旅行日记</h3>
      <el-card class="diary-card">
        <template #header>
          <div class="card-header">
            <span>{{ generatedDiary.title }}</span>
            <el-tag type="success">{{ generatedDiary.date }}</el-tag>
          </div>
        </template>
        <div class="diary-content">
          <p class="diary-location">
            <el-icon><Location /></el-icon>
            {{ generatedDiary.location }}
          </p>
          <div v-for="(section, index) in generatedDiary.content" :key="index">
            <h4>{{ section.title }}</h4>
            <p>{{ section.text }}</p>
          </div>
          <div class="diary-actions">
            <el-button type="primary" @click="saveDiary">保存日记</el-button>
            <el-button @click="regenerateDiary">重新生成</el-button>
            <el-button @click="editDiary">编辑</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Location } from '@element-plus/icons-vue'

export default {
  name: 'AigcDiary',
  components: {
    Location
  },
  data() {
    return {
      generating: false,
      generationForm: {
        theme: '',
        destination: '',
        duration: '',
        style: '',
        additionalRequirements: ''
      },
      generatedDiary: null
    }
  },
  methods: {
    generateDiary() {
      this.generating = true
      // TODO: 实现AI生成日记逻辑
      setTimeout(() => {
        this.generatedDiary = {
          title: '示例生成的旅行日记',
          date: '2023-05-01',
          location: '北京',
          content: [
            {
              title: '第一天：初到北京',
              text: '今天终于来到了向往已久的北京...'
            },
            {
              title: '第二天：故宫之旅',
              text: '清晨，我们来到了故宫...'
            }
          ]
        }
        this.generating = false
      }, 2000)
    },
    resetForm() {
      this.generationForm = {
        theme: '',
        destination: '',
        duration: '',
        style: '',
        additionalRequirements: ''
      }
      this.generatedDiary = null
    },
    saveDiary() {
      // TODO: 实现保存日记逻辑
      console.log('Saving diary:', this.generatedDiary)
    },
    regenerateDiary() {
      this.generateDiary()
    },
    editDiary() {
      // TODO: 实现编辑日记逻辑
      console.log('Editing diary:', this.generatedDiary)
    }
  }
}
</script>

<style scoped>
.aigc-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.generation-form {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.generated-diary {
  margin-top: 30px;
}

.diary-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.diary-content {
  padding: 10px 0;
}

.diary-location {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.diary-content h4 {
  margin: 20px 0 10px 0;
}

.diary-content p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.diary-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style> 