import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import DirectionsView from './views/DirectionsView.vue'
import ProjectsView from './views/ProjectsView.vue'
import OutputsView from './views/OutputsView.vue'
import PartnersView from './views/PartnersView.vue'
import DirectionDetail from './views/DirectionDetail.vue'
import ProjectDetail from './views/ProjectDetail.vue'
import ResultDetail from './views/ResultDetail.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView, meta: { titleKey: 'page.home' } },
    { path: '/directions', component: DirectionsView, meta: { titleKey: 'page.directions' } },
    { path: '/direction/:id', component: DirectionDetail, meta: { titleKey: 'page.directions' } },
    { path: '/projects', component: ProjectsView, meta: { titleKey: 'page.projectList' } },
    { path: '/project/:id', component: ProjectDetail, meta: { titleKey: 'page.projectDetail' } },
    { path: '/outputs', component: OutputsView, meta: { titleKey: 'page.outputs' } },
    { path: '/result/:name', component: ResultDetail, meta: { titleKey: 'page.outputDetail' } },
    { path: '/partners', component: PartnersView, meta: { titleKey: 'page.partners' } },
    // 兼容旧路由
    { path: '/graph', redirect: '/directions' },
    { path: '/cv', redirect: '/' },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router
