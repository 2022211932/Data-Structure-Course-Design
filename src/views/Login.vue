<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="loginForm" 
        label-width="80px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
          <el-button @click="toggleMode">
            {{ isLogin ? '切换到注册' : '切换到登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    // 验证两次密码是否一致
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      isLogin: true,
      loading: false,
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 初始化时尝试从JSON文件加载用户数据
    this.initUserData()
  },
  methods: {
    // 切换登录/注册模式
    toggleMode() {
      this.isLogin = !this.isLogin
      this.$refs.loginForm.resetFields()
    },
    
    // 处理表单提交
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          
          if (this.isLogin) {
            this.login()
          } else {
            this.register()
          }
        } else {
          return false
        }
      })
    },
    
    // 初始化用户数据
    async initUserData() {
      try {
        // 确保默认账户始终存在
        const defaultData = {
          "users": [
            {
              "id": 1,
              "username": "admin",
              "password": "123456",
              "registrationDate": "2023-04-09T08:00:00.000Z"
            }
          ]
        };
        
        // 获取当前用户数据
        let currentData = JSON.parse(localStorage.getItem('users') || '{"users":[]}');
        
        // 检查是否已存在admin用户
        const adminExists = currentData.users.some(u => u.username === 'admin');
        
        // 如果admin用户不存在，添加它
        if (!adminExists) {
          currentData.users.push(defaultData.users[0]);
          localStorage.setItem('users', JSON.stringify(currentData));
        }
        
        console.log('当前用户数据:', JSON.parse(localStorage.getItem('users')));
      } catch (error) {
        console.error('初始化用户数据失败:', error);
        // 出错时也确保默认用户存在
        localStorage.setItem('users', JSON.stringify({
          "users": [
            {
              "id": 1,
              "username": "admin",
              "password": "123456",
              "registrationDate": "2023-04-09T08:00:00.000Z"
            }
          ]
        }));
      }
    },
    
    // 读取用户数据
    async getUsersData() {
      try {
        const response = await axios.get('/src/assets/users/users.json')
        return response.data
      } catch (error) {
        console.error('无法读取用户数据:', error)
        return { users: [] }
      }
    },
    
    // 保存用户数据
    async saveUsersData(users) {
      // 在实际项目中，这里应该是一个API请求来保存数据
      // 由于前端不能直接写入文件，我们在这里仍然使用localStorage作为后备
      localStorage.setItem('users', JSON.stringify(users))
      
      // 这里仅作模拟，实际项目中应该通过后端API保存
      console.log('保存用户数据:', users)
    },
    
    // 登录功能
    async login() {
      try {
        // 使登录过程更直接，确保能看到关键变量
        this.loading = true;
        
        // 获取用户数据
        const usersData = JSON.parse(localStorage.getItem('users') || '{"users":[]}');
        const users = usersData.users || [];
        
        // 输出调试信息
        console.log('登录尝试 - 用户名:', this.form.username, '密码:', this.form.password);
        console.log('当前用户列表:', JSON.stringify(users));
        
        // 直接比较用户名和密码
        let found = false;
        let matchedUser = null;
        
        for (const user of users) {
          console.log('检查用户:', user.username, '存储的密码:', user.password);
          if (user.username === this.form.username && user.password === this.form.password) {
            found = true;
            matchedUser = user;
            break;
          }
        }
        
        setTimeout(() => {
          this.loading = false;
          
          if (found && matchedUser) {
            // 登录成功
            console.log('找到匹配用户:', matchedUser);
            
            // 存储当前用户信息到localStorage
            localStorage.setItem('currentUser', JSON.stringify({
              id: matchedUser.id,
              username: matchedUser.username,
              loginTime: new Date().toISOString()
            }));
            
            ElMessage.success('登录成功');
            
            // 跳转到首页
            this.$router.push('/');
          } else {
            // 登录失败
            console.log('未找到匹配用户');
            ElMessage.error('用户名或密码错误');
          }
        }, 1000);
      } catch (error) {
        this.loading = false;
        console.error('登录错误:', error);
        ElMessage.error('登录时发生错误');
      }
    },
    
    // 注册功能
    async register() {
      try {
        // 从localStorage获取用户列表（实际项目中应从服务器获取）
        const usersData = JSON.parse(localStorage.getItem('users') || '{"users":[]}')
        const users = usersData.users || []
        
        // 检查用户名是否已存在
        const usernameExists = users.some(u => u.username === this.form.username)
        
        setTimeout(() => {
          this.loading = false
          
          if (usernameExists) {
            ElMessage.error('用户名已存在')
            return
          }
          
          // 添加新用户
          const newUser = {
            id: users.length + 1,
            username: this.form.username,
            password: this.form.password,
            registrationDate: new Date().toISOString()
          }
          
          users.push(newUser)
          
          // 更新用户列表
          usersData.users = users
          
          // 保存用户数据
          this.saveUsersData(usersData)
          
          // 开发调试：确认用户是否添加成功
          console.log('注册的用户数据:', newUser)
          console.log('更新后的用户列表:', usersData)
          
          ElMessage.success('注册成功，请登录')
          
          // 切换到登录模式
          this.isLogin = true
          this.$refs.loginForm.resetFields()
        }, 1000)
      } catch (error) {
        this.loading = false
        ElMessage.error('注册时发生错误')
        console.error('注册错误:', error)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
</style> 