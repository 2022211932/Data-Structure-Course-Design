<template>
  <div class="app-container">
    <el-container>
      <el-header height="60px">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <el-footer height="60px">
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      currentUser: null
    }
  },
  created() {
    // 从localStorage获取当前用户信息
    const userInfo = localStorage.getItem('currentUser')
    if (userInfo) {
      this.currentUser = JSON.parse(userInfo)
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'userInfo') {
        this.$message.info('个人信息功能开发中...')
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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-container, .el-container {
  height: 100%;
}

.el-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
}

.el-aside {
  background-color: #f8f8f8;
  border-right: 1px solid #e6e6e6;
}

.el-footer {
  background-color: #f8f8f8;
  color: #666;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-right {
  position: absolute;
  right: 20px;
  line-height: 60px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  align-items: center;
}
</style> 