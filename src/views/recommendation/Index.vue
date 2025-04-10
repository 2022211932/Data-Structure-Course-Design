<template>
  <div class="recommendation-container">
    <h1 class="page-title">旅游推荐</h1>
    <p class="page-description">
      基于您的喜好、历史和当前热度，为您推荐最适合的旅游目的地
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'RecommendationIndex'
}
</script>

<style scoped>
.recommendation-container {
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
