<template>
  <div class="route-planning-container">
    <h1 class="page-title">路线规划</h1>
    <p class="page-description">
      使用先进的算法为您规划最佳旅游路线，支持景区内部、校园内部导航和多点最短路径规划
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'RoutePlanningIndex'
}
</script>

<style scoped>
.route-planning-container {
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