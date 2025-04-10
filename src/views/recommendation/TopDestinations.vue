<template>
  <div class="top-destinations-container">
    <div class="filter-bar">
      <div class="sort-options">
        <span class="label">排序方式:</span>
        <el-radio-group v-model="sortBy" @change="handleSortChange">
          <el-radio-button label="rating">评分</el-radio-button>
          <el-radio-button label="popularity">热度</el-radio-button>
          <el-radio-button label="alphabetical">名称</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-options">
        <span class="label">筛选条件:</span>
        <el-select v-model="filterType" placeholder="目的地类型" clearable @change="applyFilters">
          <el-option
            v-for="item in destinationTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        
        <el-select v-model="filterRegion" placeholder="地区" clearable @change="applyFilters">
          <el-option
            v-for="item in regions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      
      <div class="algorithm-info">
        <el-popover
          placement="bottom"
          :width="300"
          trigger="hover"
          content="此页面展示了快速排序算法的应用，可根据不同字段对目的地进行排序。在实际项目中，会基于更复杂的用户喜好、季节因素等进行智能推荐。">
          <template #reference>
            <el-button type="info" plain size="small">
              <el-icon><info-filled /></el-icon>
              排序算法说明
            </el-button>
          </template>
        </el-popover>
      </div>
    </div>

    <div class="destinations-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="destination in displayedDestinations" :key="destination.id">
          <el-card shadow="hover" class="destination-card">
            <div class="destination-image">
              <img :src="destination.imageUrl" alt="destination.name">
              <div class="destination-badge" v-if="destination.ranking <= 10">
                TOP {{ destination.ranking }}
              </div>
            </div>
            
            <div class="destination-content">
              <h3 class="destination-name">{{ destination.name }}</h3>
              
              <div class="destination-meta">
                <div class="destination-type">{{ destination.type }}</div>
                <div class="destination-region">{{ destination.region }}</div>
              </div>
              
              <div class="destination-rating">
                <el-rate v-model="destination.rating" disabled show-score text-color="#ff9900"></el-rate>
                <div class="popularity">
                  <el-icon><view /></el-icon>
                  <span>{{ formatNumber(destination.popularity) }}人去过</span>
                </div>
              </div>
              
              <p class="destination-desc">{{ destination.description }}</p>
              
              <div class="destination-features">
                <el-tag v-for="feature in destination.features" :key="feature" size="small">
                  {{ feature }}
                </el-tag>
              </div>
              
              <div class="destination-actions">
                <el-button type="primary" @click="viewDetails(destination)">查看详情</el-button>
                <el-button 
                  type="danger" 
                  :icon="isFavorite(destination.id) ? 'Star' : 'StarFilled'" 
                  circle
                  @click="toggleFavorite(destination)">
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="algorithm-visualization" v-if="showVisualization">
      <el-card>
        <template #header>
          <div class="visualization-header">
            <h3>排序算法可视化</h3>
            <el-button size="small" @click="showVisualization = false">关闭</el-button>
          </div>
        </template>
        
        <div class="sorting-process">
          <div class="step-explanation">
            <p>快速排序是一种高效的排序算法，平均时间复杂度为O(n log n)。以下展示了按{{ getSortLabel() }}排序的过程：</p>
          </div>
          
          <div class="sorting-steps">
            <div v-for="(step, index) in sortingSteps" :key="index" class="sort-step">
              <div class="step-number">步骤 {{ index + 1 }}</div>
              <div class="step-content">
                <div 
                  v-for="(item, itemIndex) in step" 
                  :key="itemIndex" 
                  class="step-item"
                  :class="{ 'pivot': item.isPivot, 'sorted': item.isSorted }">
                  {{ item.name }} ({{ getSortValue(item) }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { InfoFilled, View, Star, StarFilled } from '@element-plus/icons-vue'

export default {
  name: 'TopDestinations',
  components: {
    InfoFilled,
    View,
    Star,
    StarFilled
  },
  setup() {
    const router = useRouter()
    
    // 排序与筛选
    const sortBy = ref('rating')
    const filterType = ref('')
    const filterRegion = ref('')
    
    // 收藏列表
    const favorites = ref([1, 3]) // 模拟已收藏的ID
    
    // 算法可视化
    const showVisualization = ref(false)
    const sortingSteps = ref([])
    
    // 目的地类型和地区选项
    const destinationTypes = ref([
      { value: '自然风光', label: '自然风光' },
      { value: '历史文化', label: '历史文化' },
      { value: '主题公园', label: '主题公园' },
      { value: '城市景观', label: '城市景观' }
    ])
    
    const regions = ref([
      { value: '华北', label: '华北' },
      { value: '华东', label: '华东' },
      { value: '华南', label: '华南' },
      { value: '西南', label: '西南' },
      { value: '西北', label: '西北' },
      { value: '东北', label: '东北' }
    ])
    
    // 目的地数据
    const allDestinations = ref([
      {
        id: 1,
        name: '故宫',
        type: '历史文化',
        region: '华北',
        rating: 4.8,
        popularity: 986543,
        description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
        features: ['世界文化遗产', '博物馆', '古建筑群'],
        imageUrl: 'https://source.unsplash.com/featured/?beijing,palace',
        ranking: 1
      },
      {
        id: 2,
        name: '长城',
        type: '历史文化',
        region: '华北',
        rating: 4.9,
        popularity: 876201,
        description: '中国古代的伟大防御工程，是中华民族的象征之一，也是世界文化遗产。',
        features: ['世界文化遗产', '古代建筑', '登山'],
        imageUrl: require('@/assets/images/长城.jpg'),
        ranking: 2
      },
      {
        id: 3,
        name: '西湖',
        type: '自然风光',
        region: '华东',
        rating: 4.7,
        popularity: 782345,
        description: '杭州著名的风景名胜，以其秀丽的湖光山色和众多的历史遗迹闻名于世。',
        features: ['世界文化遗产', '湖泊', '园林'],
        imageUrl: 'https://source.unsplash.com/featured/?hangzhou,westlake',
        ranking: 3
      },
      {
        id: 4,
        name: '黄山',
        type: '自然风光',
        region: '华东',
        rating: 4.8,
        popularity: 567890,
        description: '安徽省黄山市的著名山脉，以奇松、怪石、云海、温泉、冬雪"五绝"著称。',
        features: ['世界自然遗产', '山脉', '日出'],
        imageUrl: 'https://source.unsplash.com/featured/?huangshan,mountain',
        ranking: 4
      },
      {
        id: 5,
        name: '三亚',
        type: '自然风光',
        region: '华南',
        rating: 4.6,
        popularity: 654321,
        description: '海南省的著名海滨城市，拥有美丽的海岸线和热带风光。',
        features: ['海滩', '热带', '度假'],
        imageUrl: 'https://source.unsplash.com/featured/?sanya,beach',
        ranking: 5
      },
      {
        id: 6,
        name: '九寨沟',
        type: '自然风光',
        region: '西南',
        rating: 4.9,
        popularity: 456789,
        description: '四川省阿坝藏族羌族自治州九寨沟县的国家级自然保护区，以其彩池、瀑布、雪山、森林著称。',
        features: ['世界自然遗产', '彩池', '瀑布'],
        imageUrl: 'https://source.unsplash.com/featured/?jiuzhaigou,valley',
        ranking: 6
      },
      {
        id: 7,
        name: '上海迪士尼',
        type: '主题公园',
        region: '华东',
        rating: 4.5,
        popularity: 876543,
        description: '中国大陆第一个迪士尼主题公园，融合了中国元素的迪士尼乐园。',
        features: ['主题乐园', '游乐设施', '演出'],
        imageUrl: 'https://source.unsplash.com/featured/?shanghai,disney',
        ranking: 7
      },
      {
        id: 8,
        name: '香港',
        type: '城市景观',
        region: '华南',
        rating: 4.6,
        popularity: 765432,
        description: '中国特别行政区，国际大都市，融合了东西方文化的现代化城市。',
        features: ['购物', '美食', '维多利亚港'],
        imageUrl: 'https://source.unsplash.com/featured/?hongkong,city',
        ranking: 8
      },
      {
        id: 9,
        name: '布达拉宫',
        type: '历史文化',
        region: '西南',
        rating: 4.8,
        popularity: 345678,
        description: '西藏拉萨的宫堡式建筑群，是历代达赖喇嘛的冬宫居所，也是西藏政教合一的统治中心。',
        features: ['世界文化遗产', '宫殿', '藏传佛教'],
        imageUrl: 'https://source.unsplash.com/featured/?tibet,palace',
        ranking: 9
      },
      {
        id: 10,
        name: '兵马俑',
        type: '历史文化',
        region: '西北',
        rating: 4.7,
        popularity: 678901,
        description: '秦始皇陵的陪葬坑，世界上规模最大的地下军事博物馆。',
        features: ['世界文化遗产', '考古遗址', '博物馆'],
        imageUrl: 'https://source.unsplash.com/featured/?xian,terracotta',
        ranking: 10
      }
    ])
    
    // 显示的目的地列表（经过排序和筛选）
    const displayedDestinations = ref([])
    
    // 初始化
    onMounted(() => {
      // 应用初始排序
      applySort()
    })
    
    // 处理排序变更
    const handleSortChange = () => {
      applySort()
      showVisualization.value = true
    }
    
    // 应用排序
    const applySort = () => {
      // 先应用筛选
      let filteredDestinations = allDestinations.value.filter(dest => {
        if (filterType.value && dest.type !== filterType.value) return false
        if (filterRegion.value && dest.region !== filterRegion.value) return false
        return true
      })
      
      // 克隆数组，避免修改原始数据
      let toSort = JSON.parse(JSON.stringify(filteredDestinations))
      
      // 记录排序步骤（简化版）
      sortingSteps.value = []
      sortingSteps.value.push(toSort.map(d => ({ ...d })))
      
      // 排序
      const sorted = quickSort(toSort, 0, toSort.length - 1)
      
      // 更新排名
      sorted.forEach((dest, index) => {
        dest.ranking = index + 1
      })
      
      displayedDestinations.value = sorted
    }
    
    // 快速排序算法
    const quickSort = (arr, left, right) => {
      if (left < right) {
        const partitionIndex = partition(arr, left, right)
        quickSort(arr, left, partitionIndex - 1)
        quickSort(arr, partitionIndex + 1, right)
      }
      return arr
    }
    
    // 快速排序分区函数
    const partition = (arr, left, right) => {
      const pivot = arr[right]
      let i = left
      
      for (let j = left; j < right; j++) {
        if (compare(arr[j], pivot) <= 0) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
          i++
        }
      }
      
      [arr[i], arr[right]] = [arr[right], arr[i]]
      
      // 记录排序步骤
      let stepCopy = arr.map(d => ({ ...d }))
      stepCopy[i].isPivot = true
      for (let k = 0; k <= i; k++) {
        stepCopy[k].isSorted = true
      }
      sortingSteps.value.push(stepCopy)
      
      return i
    }
    
    // 比较函数
    const compare = (a, b) => {
      if (sortBy.value === 'rating') {
        return b.rating - a.rating // 降序
      } else if (sortBy.value === 'popularity') {
        return b.popularity - a.popularity // 降序
      } else if (sortBy.value === 'alphabetical') {
        return a.name.localeCompare(b.name) // 升序
      }
      return 0
    }
    
    // 应用筛选
    const applyFilters = () => {
      applySort()
    }
    
    // 检查是否收藏
    const isFavorite = (id) => {
      return favorites.value.includes(id)
    }
    
    // 切换收藏状态
    const toggleFavorite = (destination) => {
      const index = favorites.value.indexOf(destination.id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      } else {
        favorites.value.push(destination.id)
      }
    }
    
    // 查看详情
    const viewDetails = (destination) => {
      router.push({
        path: `/recommendation/destination/${destination.id}`,
        query: { name: destination.name }
      })
    }
    
    // 格式化数字（添加千位分隔符）
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    // 获取排序字段值
    const getSortValue = (item) => {
      if (sortBy.value === 'rating') {
        return item.rating
      } else if (sortBy.value === 'popularity') {
        return formatNumber(item.popularity)
      } else if (sortBy.value === 'alphabetical') {
        return item.name
      }
      return ''
    }
    
    // 获取排序方式的显示名称
    const getSortLabel = () => {
      if (sortBy.value === 'rating') {
        return '评分'
      } else if (sortBy.value === 'popularity') {
        return '热度'
      } else if (sortBy.value === 'alphabetical') {
        return '名称'
      }
      return ''
    }
    
    return {
      sortBy,
      filterType,
      filterRegion,
      destinationTypes,
      regions,
      displayedDestinations,
      showVisualization,
      sortingSteps,
      handleSortChange,
      applyFilters,
      isFavorite,
      toggleFavorite,
      viewDetails,
      formatNumber,
      getSortValue,
      getSortLabel
    }
  }
}
</script>

<style scoped>
.top-destinations-container {
  padding-bottom: 30px;
}

.filter-bar {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.sort-options, .filter-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-size: 14px;
  color: #606266;
}

.destinations-list {
  margin-bottom: 30px;
}

.destination-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  height: 100%;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.destination-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.destination-card:hover .destination-image img {
  transform: scale(1.05);
}

.destination-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f56c6c;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
}

.destination-content {
  padding: 15px;
}

.destination-name {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.destination-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.destination-type {
  font-size: 13px;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.destination-region {
  font-size: 13px;
  color: #67C23A;
  background-color: #f0f9eb;
  padding: 2px 8px;
  border-radius: 10px;
}

.destination-rating {
  margin-bottom: 10px;
}

.popularity {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 13px;
  color: #909399;
}

.destination-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.destination-features {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.destination-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.algorithm-visualization {
  margin-top: 30px;
}

.visualization-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visualization-header h3 {
  margin: 0;
  font-size: 16px;
}

.sorting-process {
  margin-top: 15px;
}

.sorting-steps {
  margin-top: 20px;
}

.sort-step {
  margin-bottom: 20px;
}

.step-number {
  font-weight: bold;
  margin-bottom: 10px;
  color: #409EFF;
}

.step-content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.step-item {
  padding: 8px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.pivot {
  background-color: #ffd04b;
  border-color: #eebe21;
  font-weight: bold;
}

.sorted {
  background-color: #f0f9eb;
  border-color: #c2e7b0;
}

.step-explanation {
  background-color: #f0f9ff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.step-explanation p {
  margin: 0;
  font-size: 14px;
}
</style> 