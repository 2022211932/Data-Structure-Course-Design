import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  // 旅游推荐路由
  {
    path: '/recommendation',
    name: 'Recommendation',
    component: () => import('../views/recommendation/Index.vue'),
    redirect: '/recommendation/top-destinations',
    children: [
      {
        path: 'top-destinations',
        name: 'TopDestinations',
        component: () => import('../views/recommendation/TopDestinations.vue')
      },
      {
        path: 'personalized',
        name: 'PersonalizedRecommendation',
        component: () => import('../views/recommendation/Personalized.vue')
      }
    ]
  },
  // 路线规划路由
  {
    path: '/route-planning',
    name: 'RoutePlanning',
    component: () => import('../views/route-planning/Index.vue'),
    redirect: '/route-planning/scenic',
    children: [
      {
        path: 'scenic',
        name: 'ScenicRouting',
        component: () => import('../views/route-planning/Scenic.vue')
      },
      {
        path: 'campus',
        name: 'CampusRouting',
        component: () => import('../views/route-planning/Campus.vue')
      },
      {
        path: 'multi-point',
        name: 'MultiPointRouting',
        component: () => import('../views/route-planning/MultiPoint.vue')
      }
    ]
  },
  // 场所查询路由
  {
    path: '/place-query',
    name: 'PlaceQuery',
    component: () => import('../views/place-query/Index.vue'),
    redirect: '/place-query/nearby',
    children: [
      {
        path: 'nearby',
        name: 'NearbyFacilities',
        component: () => import('../views/place-query/Nearby.vue')
      },
      {
        path: 'category',
        name: 'CategoryQuery',
        component: () => import('../views/place-query/Category.vue')
      },
      {
        path: 'keyword',
        name: 'KeywordQuery',
        component: () => import('../views/place-query/Keyword.vue')
      }
    ]
  },
  // 旅游日记路由
  {
    path: '/travel-diary',
    name: 'TravelDiary',
    component: () => import('../views/travel-diary/Index.vue'),
    redirect: '/travel-diary/my',
    children: [
      {
        path: 'my',
        name: 'MyDiary',
        component: () => import('../views/travel-diary/My.vue')
      },
      {
        path: 'create',
        name: 'CreateDiary',
        component: () => import('../views/travel-diary/Create.vue')
      },
      {
        path: 'browse',
        name: 'BrowseDiary',
        component: () => import('../views/travel-diary/Browse.vue')
      },
      {
        path: 'aigc',
        name: 'AiGcAnimation',
        component: () => import('../views/travel-diary/Aigc.vue')
      }
    ]
  },
  // 扩展功能路由
  {
    path: '/extra',
    name: 'ExtraFeatures',
    component: () => import('../views/extra/Index.vue'),
    children: [
      {
        path: 'indoor-navigation',
        name: 'IndoorNavigation',
        component: () => import('../views/extra/IndoorNavigation.vue')
      },
      {
        path: 'food-search',
        name: 'FoodSearch',
        component: () => import('../views/extra/FoodSearch.vue')
      },
      {
        path: 'interest-recommendation',
        name: 'InterestRecommendation',
        component: () => import('../views/extra/InterestRecommendation.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 获取登录状态
  const isLoggedIn = localStorage.getItem('currentUser')
  
  // 如果访问的是登录页，则直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 如果用户未登录且访问的不是登录页，则重定向到登录页
  if (!isLoggedIn && to.path !== '/login') {
    next('/login')
    return
  }
  
  // 否则放行
  next()
})

export default router 