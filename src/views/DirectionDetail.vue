<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>
      <template v-if="d">
        <div class="page-head">
          <div class="kicker">{{ (d.domain || '').includes('共性') ? t('kicker.commonTechnologyFoundation') : t('kicker.researchDirection') }}</div>
          <h1>{{ dirName(d) }}</h1>
          <div class="sub">{{ lDirection(d, 'scope') }}</div>
          <div class="meta-row">
            <span>{{ t('detail.domain') }} <b>{{ lDirection(d, 'domain') }}</b></span>
            <span>{{ t('project') }} <b>{{ projects.length }}</b></span>
            <span>{{ t('output') }} <b>{{ results.length }}</b></span>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('detail.methods') }}</h3>
          <div class="claim-mini">{{ lDirection(d, 'core') }}</div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('detail.supportProjects') }} <span class="cnt">{{ projects.length }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="p in visibleProjects" :key="p.id" class="rel-item" role="link" tabindex="0" @click="$router.push('/project/' + p.id)" @keydown.enter="$router.push('/project/' + p.id)" @keydown.space.prevent="$router.push('/project/' + p.id)">
              <span class="ri-badge" :class="p.category === '工程交付' ? 'ri-d' : 'ri-r'">{{ p.category === '工程交付' ? categoryShort.engineering : categoryShort.research }}</span>
              <div class="ri-body"><h4>{{ publicProjectName(p) }}</h4><div class="ri-sub">{{ timeShort(p.time) }}<template v-if="p.role"> · {{ roleLabel(p.role) }}</template></div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
          <button v-if="rankedProjects.length > 6" class="list-toggle" type="button" @click="showAllProjects = !showAllProjects">{{ showAllProjects ? t('detail.collapseProjects') : t('detail.viewAllProjects', { count: rankedProjects.length }) }}</button>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('detail.relatedOutputs') }} <span class="cnt">{{ results.length }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="r in visibleResults" :key="r.name" class="rel-item" role="link" tabindex="0" @click="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.enter="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.space.prevent="$router.push('/result/' + encodeURIComponent(r.name))">
              <span class="ri-badge ri-r">{{ typeLabel(r.type) }}</span>
              <div class="ri-body"><h4>{{ resultTitle(r) }}</h4><div class="ri-sub">{{ resultKernel(r) }} · {{ localizedStatusMeta(r.status)[0] }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
          <button v-if="rankedResults.length > 6" class="list-toggle" type="button" @click="showAllResults = !showAllResults">{{ showAllResults ? t('detail.collapseOutputs') : t('detail.viewAllOutputs', { count: rankedResults.length }) }}</button>
        </div>
        <div class="rel-nav">
          <h3>{{ t('detail.relatedDirections') }}</h3>
          <div class="rn-grid">
            <div v-for="x in related" :key="x.id" class="rn-item" role="link" tabindex="0" @click="$router.push('/direction/' + x.id)" @keydown.enter="$router.push('/direction/' + x.id)" @keydown.space.prevent="$router.push('/direction/' + x.id)">
              <div class="rn-label">{{ lDirection(x, 'domain') }}</div><h4>{{ dirName(x) }}</h4>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-note" style="padding:80px 0">{{ t('detail.notFoundDirection') }} <router-link to="/">{{ t('nav.home') }}</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { D, dirById, dirName, timeShort, isActiveDir, publicProjectName, isFormalResult, localizedStatusMeta } from '../utils.js'
import { t, lDirection, typeLabel, roleLabel, isNonChinese, resultTitle, resultKernel } from '../i18n_20260822-1705-UTC+0700.js'

const route = useRoute()
const isBaseDir = d => (d.domain || '').includes('共性')
const d = computed(() => dirById[route.params.id])
const categoryShort = computed(() => isNonChinese.value ? { engineering: 'ENG', research: 'R&D' } : { engineering: '交付', research: '研发' })
const projects = computed(() => d.value ? D.projects.filter(p => isActiveDir(p, d.value.id)) : [])
const results = computed(() => d.value ? D.results.filter(r => r.pkg === d.value.id || (r.directions || []).some(x => x.startsWith(d.value.id))) : [])
const showAllProjects = ref(false)
const showAllResults = ref(false)
const projectRank = p => (p.public === '可公开' ? 0 : 10) + (p.category === '研发项目' ? 0 : 3)
const rankedProjects = computed(() => projects.value.slice().sort((a, b) => projectRank(a) - projectRank(b) || timeShort(b.time).localeCompare(timeShort(a.time))))
const visibleProjects = computed(() => showAllProjects.value ? rankedProjects.value : rankedProjects.value.slice(0, 6))
const resultTypes = ['论文', '会议论文', '会议摘要', '专利', '软件著作权', '数据集', '标准', '报告']
const resultRank = r => (isFormalResult(r) ? 0 : 20) + Math.max(0, resultTypes.indexOf(r.type))
const rankedResults = computed(() => results.value.slice().sort((a, b) => resultRank(a) - resultRank(b) || (b.date || '').localeCompare(a.date || '')))
const visibleResults = computed(() => showAllResults.value ? rankedResults.value : rankedResults.value.slice(0, 6))
const related = computed(() => d.value ? D.directions.filter(x => x.id !== d.value.id).slice(0, 4) : [])
</script>

<style scoped>
.rel-nav { margin-top: 44px; padding-top: 24px; border-top: 1px solid var(--line) }
.rel-nav h3 { font-family: var(--serif); font-size: 16px; font-weight: 700; margin-bottom: 14px }
.rn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }
.rn-item { background: var(--surface); border: 1px solid var(--line); border-radius: 9px; padding: 13px 16px; cursor: pointer; transition: .15s }
.rn-item:hover { border-color: var(--accent); box-shadow: var(--shadow) }
.rn-label { font-size: 11.5px; color: var(--ink-3); letter-spacing: 1px; text-transform: uppercase }
.rn-item h4 { font-size: 15px; font-weight: 600; margin-top: 5px; line-height: 1.5; color: var(--ink) }
.list-toggle { display:block; margin:14px auto 0; padding:8px 14px; border:1px solid var(--line); border-radius:999px; color:var(--accent); background:#fff; font:inherit; font-size:13px; cursor:pointer }
.list-toggle:hover { border-color:var(--accent) }
</style>
