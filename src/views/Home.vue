<template>
  <div class="home-container">
    <el-carousel height="400px">
      <el-carousel-item v-for="item in carouselItems" :key="item.id">
        <div class="carousel-content" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="carousel-caption">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="features-section">
      <h2 class="section-title">系统功能</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="feature in features" :key="feature.id">
          <el-card shadow="hover" class="feature-card">
            <div class="feature-icon">
              <el-icon :size="40"><component :is="feature.icon" /></el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <el-button type="primary" @click="navigateTo(feature.route)">立即体验</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="popular-section">
      <h2 class="section-title">热门目的地</h2>
      <el-row :gutter="20">
        <el-col :span="8" v-for="destination in topDestinations" :key="destination.id">
          <el-card shadow="hover" class="destination-card">
            <img :src="destination.image" class="destination-image" />
            <h3>{{ destination.name }}</h3>
            <div class="destination-rating">
              <el-rate v-model="destination.rating" disabled show-score />
            </div>
            <p>{{ destination.description }}</p>
            <el-button type="primary" plain @click="viewDestination(destination)">查看详情</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Location, MapLocation, Search, Notebook } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  components: {
    Location,
    MapLocation,
    Search,
    Notebook
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    // 获取热门目的地
    store.dispatch('fetchDestinations')

    const topDestinations = computed(() => {
      return store.getters.topDestinations.map(dest => ({
        ...dest,
        image: `https://source.unsplash.com/300x200/?travel,${dest.name}`
      }))
    })

    const navigateTo = (route) => {
      router.push(route)
    }

    const viewDestination = (destination) => {
      router.push({
        path: '/recommendation/top-destinations',
        query: { id: destination.id }
      })
    }

    return {
      carouselItems: [
        {
          id: 1,
          title: '个性化旅游系统',
          description: '让您的旅行更加便捷、高效、个性化',
          image: 'https://source.unsplash.com/1600x900/?travel,scenery'
        },
        {
          id: 2,
          title: '智能路线规划',
          description: '基于优化算法，为您提供最佳旅游路线',
          image: 'https://source.unsplash.com/1600x900/?travel,map'
        },
        {
          id: 3,
          title: '旅游日记',
          description: '记录精彩瞬间，分享旅行故事',
          image: 'https://source.unsplash.com/1600x900/?travel,diary'
        }
      ],
      features: [
        {
          id: 1,
          title: '旅游推荐',
          description: '基于用户喜好和热度排名的智能景点推荐',
          icon: 'Location',
          route: '/recommendation'
        },
        {
          id: 2,
          title: '路线规划',
          description: '最短路径算法规划最优旅游路线',
          icon: 'MapLocation',
          route: '/route-planning'
        },
        {
          id: 3,
          title: '场所查询',
          description: '快速查询附近设施与服务',
          icon: 'Search',
          route: '/place-query'
        },
        {
          id: 4,
          title: '旅游日记',
          description: '记录并分享您的旅游体验',
          icon: 'Notebook',
          route: '/travel-diary'
        }
      ],
      topDestinations,
      navigateTo,
      viewDestination
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.carousel-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  width: 100%;
  padding: 20px;
}

.carousel-caption h2 {
  margin: 0;
  font-size: 28px;
}

.section-title {
  text-align: center;
  margin: 40px 0 20px;
  color: #409EFF;
}

.features-section, .popular-section {
  margin-top: 40px;
}

.feature-card {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.feature-icon {
  margin-bottom: 15px;
  color: #409EFF;
}

.destination-card {
  height: 380px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.destination-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

.destination-rating {
  margin: 10px 0;
}
</style> 