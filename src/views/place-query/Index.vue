<template>
  <div class="place-query-container">
    <h1 class="page-title">场所查询</h1>
    <p class="page-description">
      快速查找景区或校园内的设施和服务，支持按距离、类别和关键字查询
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'PlaceQueryIndex'
}
</script>

<style scoped>
.place-query-container {
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
