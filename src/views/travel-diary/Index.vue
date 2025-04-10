<template>
  <div class="travel-diary-container">
    <h1 class="page-title">旅游日记</h1>
    <p class="page-description">
      记录您的旅行体验，分享精彩瞬间，支持文本、图片和视频形式的内容
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'TravelDiaryIndex'
}
</script>

<style scoped>
.travel-diary-container {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 10px;
}

.page-description {
  color: #666;
  margin-bottom: 20px;
}
</style> 