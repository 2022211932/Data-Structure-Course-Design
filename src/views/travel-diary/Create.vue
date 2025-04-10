<template>
  <div class="create-diary-container">
    <h2>创建旅行日记</h2>
    
    <el-form :model="diaryForm" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="diaryForm.title" placeholder="请输入日记标题" />
      </el-form-item>
      
      <el-form-item label="地点">
        <el-input v-model="diaryForm.location" placeholder="请输入旅行地点" />
      </el-form-item>
      
      <el-form-item label="日期">
        <el-date-picker
          v-model="diaryForm.date"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      
      <el-form-item label="内容">
        <el-input
          v-model="diaryForm.content"
          type="textarea"
          :rows="6"
          placeholder="记录您的旅行故事..."
        />
      </el-form-item>
      
      <el-form-item label="图片">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitDiary">保存日记</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'CreateDiary',
  components: {
    Plus
  },
  data() {
    return {
      diaryForm: {
        title: '',
        location: '',
        date: '',
        content: '',
        images: []
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitDiary() {
      // TODO: 实现保存日记逻辑
      console.log('Submitting diary:', this.diaryForm)
    },
    resetForm() {
      this.diaryForm = {
        title: '',
        location: '',
        date: '',
        content: '',
        images: []
      }
    }
  }
}
</script>

<style scoped>
.create-diary-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 30px;
  text-align: center;
}
</style> 