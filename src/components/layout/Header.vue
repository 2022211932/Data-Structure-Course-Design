<template>
  <div class="header">
    <div class="logo">
      <h1>个性化旅游系统</h1>
    </div>
    <div class="nav">
      <el-menu mode="horizontal" :router="true" background-color="#409EFF" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/recommendation">旅游推荐</el-menu-item>
        <el-menu-item index="/route-planning">路线规划</el-menu-item>
        <el-menu-item index="/place-query">场所查询</el-menu-item>
        <el-menu-item index="/travel-diary">旅游日记</el-menu-item>
        <el-menu-item index="/extra">额外功能</el-menu-item>
      </el-menu>
    </div>
    <div class="user-info">
      <div v-if="currentUser">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <span class="username">{{ currentUser.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-else>
        <el-button type="text" @click="$router.push('/login')" class="login-btn">登录/注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      currentUser: null
    }
  },
  created() {
    // 从localStorage获取当前用户信息
    this.getCurrentUser()
    // 监听storage事件，以便在其他标签页登录/登出时更新状态
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    getCurrentUser() {
      const userInfo = localStorage.getItem('currentUser')
      if (userInfo) {
        this.currentUser = JSON.parse(userInfo)
      } else {
        this.currentUser = null
      }
    },
    handleStorageChange(e) {
      if (e.key === 'currentUser') {
        this.getCurrentUser()
      }
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'userInfo') {
        this.$message.info('个人中心功能开发中...')
      } else if (command === 'favorites') {
        this.$message.info('我的收藏功能开发中...')
      } else if (command === 'settings') {
        this.$message.info('设置功能开发中...')
      }
    },
    logout() {
      localStorage.removeItem('currentUser')
      this.currentUser = null
      this.$message.success('已退出登录')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo h1 {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.nav {
  flex: 1;
  margin: 0 20px;
}

.el-menu--horizontal {
  border: none !important;
}

.user-info {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
}

.username {
  margin-left: 8px;
  color: white;
}

.login-btn {
  color: white;
  font-size: 16px;
}
</style> 