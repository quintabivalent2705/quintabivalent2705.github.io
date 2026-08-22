<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.back()">{{ t('back') }}</button>
      <template v-if="p">
        <div class="page-head">
          <div class="kicker">{{ p.category === '工程交付' ? t('kicker.engineeringProject') : t('kicker.researchProject') }}</div>
          <h1>{{ publicProjectName(p) }}</h1>
          <div class="sub">{{ publicProjectWork(p) }}</div>
          <div class="meta-row">
            <span v-if="dirs.length">{{ t('project.directions') }} <b>{{ dirs.map(did => dirById[did] ? dirName(dirById[did]) : did).join(' · ') }}</b></span>
            <span v-if="results.length">{{ t('project.relatedOutputs') }} <b>{{ results.length }}</b></span>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('project.info') }}</h3>
          <table class="info-table">
            <tbody>
            <tr><td>{{ t('project.category') }}</td><td>{{ categoryLabel(p.category) }}</td></tr>
            <tr><td>{{ t('project.time') }}</td><td>{{ dateLabel(p.time) }}</td></tr>
            <tr v-if="publicProjectClient(p)"><td>{{ t('project.partner') }}</td><td>{{ clientLabel(publicProjectClient(p)) }}</td></tr>
            <tr v-if="p.role"><td>{{ t('project.role') }}</td><td>{{ roleLabel(p.role) }}</td></tr>
            <tr v-if="p.tech"><td>{{ t('project.tech') }}</td><td>{{ techLabel(p.tech) }}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('project.directions') }}</h3>
          <div class="rel-list">
            <div v-for="did in dirs" :key="did" class="rel-item" role="link" tabindex="0" @click="dirById[did] && $router.push('/direction/' + did)" @keydown.enter="dirById[did] && $router.push('/direction/' + did)" @keydown.space.prevent="dirById[did] && $router.push('/direction/' + did)">
              <span class="ri-badge ri-d">{{ t('direction') }}</span>
              <div class="ri-body"><h4>{{ dirById[did] ? dirName(dirById[did]) : did }}</h4><div class="ri-sub">{{ dirById[did] ? lDirection(dirById[did], 'scope') : '' }}</div></div>
              <span class="ri-go">→</span>
            </div>
            <div v-if="!dirs.length" class="empty-note">{{ t('project.noDirection') }}</div>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('project.relatedOutputs') }} <span class="cnt">{{ results.length }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="r in visibleResults" :key="r.name" class="rel-item" role="link" tabindex="0" @click="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.enter="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.space.prevent="$router.push('/result/' + encodeURIComponent(r.name))">
              <span class="ri-badge ri-r">{{ typeLabel(r.type) }}</span>
              <div class="ri-body"><h4>{{ resultTitle(r) }}</h4><div class="ri-sub">{{ resultKernel(r) }} · {{ localizedStatusMeta(r.status)[0] }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
          <button v-if="rankedResults.length > 6" class="list-toggle" type="button" @click="showAllResults = !showAllResults">{{ showAllResults ? t('detail.collapseOutputs') : t('detail.viewAllOutputs', { count: rankedResults.length }) }}</button>
        </div>
        <div v-if="related.length" class="rel-nav">
          <h3>{{ t('project.similar') }}</h3>
          <div class="rn-grid">
            <div v-for="x in related" :key="x.id" class="rn-item" role="link" tabindex="0" @click="$router.push('/project/' + x.id)" @keydown.enter="$router.push('/project/' + x.id)" @keydown.space.prevent="$router.push('/project/' + x.id)">
              <div class="rn-label">{{ categoryLabel(x.category) }}</div><h4>{{ publicProjectName(x) }}</h4>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-note" style="padding:80px 0">{{ t('project.notFound') }} <router-link to="/projects">{{ t('project.backList') }}</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { D, dirById, dirName, resByName, publicProjectClient, publicProjectName, publicProjectWork, isFormalResult, localizedStatusMeta } from '../utils.js'
import { t, lDirection, categoryLabel, roleLabel, techLabel, clientLabel, dateLabel, typeLabel, resultTitle, resultKernel } from '../i18n_20260822-1705-UTC+0700.js'

const route = useRoute()
const p = computed(() => D.projects.find(x => x.id === route.params.id))
const results = computed(() => (p.value?.results || []).map(n => resByName[n]).filter(Boolean))
const showAllResults = ref(false)
const resultTypes = ['论文', '会议论文', '会议摘要', '专利', '软件著作权', '数据集', '标准', '报告']
const resultRank = r => (isFormalResult(r) ? 0 : 20) + Math.max(0, resultTypes.indexOf(r.type))
const rankedResults = computed(() => results.value.slice().sort((a, b) => resultRank(a) - resultRank(b) || (b.date || '').localeCompare(a.date || '')))
const visibleResults = computed(() => showAllResults.value ? rankedResults.value : rankedResults.value.slice(0, 6))
const dirs = computed(() => (p.value?.directions || []).map(x => x.split('｜')[0].trim()).filter(Boolean))
const related = computed(() => {
  if (!p.value) return []
  const same = D.projects.filter(x => x.id !== p.value.id && x.tech && p.value.tech && x.tech === p.value.tech).slice(0, 2)
    .concat(D.projects.filter(x => x.id !== p.value.id && x.direction === p.value.direction).slice(0, 2))
  const seen = new Set()
  return same.filter(x => { if (seen.has(x.id)) return false; seen.add(x.id); return true }).slice(0, 4)
})
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
