<template>
  <div class="sidebar">
    <el-menu
      default-active="1"
      class="el-menu-vertical"
      :router="true"
      background-color="#f8f8f8"
      text-color="#333"
      active-text-color="#409EFF">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>旅游推荐</span>
        </template>
        <el-menu-item index="/recommendation/top-destinations">热门目的地</el-menu-item>
        <el-menu-item index="/recommendation/personalized">个性化推荐</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="2">
        <template #title>
          <el-icon><map-location /></el-icon>
          <span>路线规划</span>
        </template>
        <el-menu-item index="/route-planning/scenic">景区内导航</el-menu-item>
        <el-menu-item index="/route-planning/campus">校园内导航</el-menu-item>
        <el-menu-item index="/route-planning/multi-point">多点最短路径</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="3">
        <template #title>
          <el-icon><search /></el-icon>
          <span>场所查询</span>
        </template>
        <el-menu-item index="/place-query/nearby">附近设施</el-menu-item>
        <el-menu-item index="/place-query/category">按类别查询</el-menu-item>
        <el-menu-item index="/place-query/keyword">关键字查询</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="4">
        <template #title>
          <el-icon><notebook /></el-icon>
          <span>旅游日记</span>
        </template>
        <el-menu-item index="/travel-diary/my">我的日记</el-menu-item>
        <el-menu-item index="/travel-diary/create">创建日记</el-menu-item>
        <el-menu-item index="/travel-diary/browse">浏览日记</el-menu-item>
        <el-menu-item index="/travel-diary/aigc">AI生成动画</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="5">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>扩展功能</span>
        </template>
        <el-menu-item index="/extra/indoor-navigation">室内导航</el-menu-item>
        <el-menu-item index="/extra/food-search">美食搜索</el-menu-item>
        <el-menu-item index="/extra/interest-recommendation">兴趣推荐</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import { Location, MapLocation, Search, Notebook, Setting } from '@element-plus/icons-vue'

export default {
  name: 'Sidebar',
  components: {
    Location,
    MapLocation,
    Search,
    Notebook,
    Setting
  }
}
</script>

<style scoped>
.sidebar {
  height: 100%;
}

.el-menu {
  height: 100%;
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style> 