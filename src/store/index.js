import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    destinations: [],
    favoriteDestinations: [],
    travelDiaries: [],
    currentLocation: {
      lat: 0,
      lng: 0
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    userName: state => state.user ? state.user.name : '',
    topDestinations: state => {
      return [...state.destinations].sort((a, b) => b.rating - a.rating).slice(0, 10)
    },
    favoriteDestinations: state => state.favoriteDestinations,
    userDiaries: state => state.travelDiaries.filter(diary => 
      state.user && diary.userId === state.user.id
    ),
    nearbyFacilities: (state) => (category, maxDistance) => {
      // 这里会实现一个根据当前位置、类别和距离筛选设施的逻辑
      // 实际项目中会调用更复杂的算法
      return []
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setDestinations(state, destinations) {
      state.destinations = destinations
    },
    addFavoriteDestination(state, destination) {
      if (!state.favoriteDestinations.find(d => d.id === destination.id)) {
        state.favoriteDestinations.push(destination)
      }
    },
    removeFavoriteDestination(state, destinationId) {
      state.favoriteDestinations = state.favoriteDestinations.filter(d => d.id !== destinationId)
    },
    addTravelDiary(state, diary) {
      state.travelDiaries.push(diary)
    },
    updateTravelDiary(state, updatedDiary) {
      const index = state.travelDiaries.findIndex(diary => diary.id === updatedDiary.id)
      if (index !== -1) {
        state.travelDiaries[index] = updatedDiary
      }
    },
    deleteTravelDiary(state, diaryId) {
      state.travelDiaries = state.travelDiaries.filter(diary => diary.id !== diaryId)
    },
    setCurrentLocation(state, location) {
      state.currentLocation = location
    }
  },
  actions: {
    login({ commit }, credentials) {
      // 这里会添加实际的登录逻辑，调用API等
      return new Promise((resolve) => {
        // 模拟登录成功
        const user = {
          id: 1,
          name: '测试用户',
          email: 'test@example.com'
        }
        commit('setUser', user)
        resolve(user)
      })
    },
    logout({ commit }) {
      // 退出登录
      commit('setUser', null)
    },
    fetchDestinations({ commit }) {
      // 这里会添加实际的API调用，获取目的地数据
      return new Promise((resolve) => {
        // 模拟数据
        const destinations = [
          { id: 1, name: '故宫', rating: 4.8, description: '中国明清两代的皇家宫殿' },
          { id: 2, name: '长城', rating: 4.9, description: '中国古代的伟大防御工程' },
          { id: 3, name: '西湖', rating: 4.7, description: '杭州著名的风景名胜' },
          // 更多目的地...
        ]
        commit('setDestinations', destinations)
        resolve(destinations)
      })
    },
    planRoute({ state }, { destinations, transportType }) {
      // 这里会调用路径规划算法，例如最短路径算法
      return new Promise((resolve) => {
        // 实际项目中会实现复杂的算法逻辑
        resolve({
          path: [],
          distance: 0,
          duration: 0
        })
      })
    },
    searchPlaces({ state }, { keyword, category, maxDistance }) {
      // 这里会搜索指定条件的场所
      return new Promise((resolve) => {
        // 实际项目中会实现搜索算法
        resolve([])
      })
    }
  },
  modules: {
    // 可以添加更多模块化的store
  }
}) 