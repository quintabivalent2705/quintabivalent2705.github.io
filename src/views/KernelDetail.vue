<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>
      <template v-if="k">
        <div class="page-head">
          <div class="kicker">{{ t('kicker.commonResearchMethod') }}</div>
          <h1>{{ lKernel(k) }}</h1>
          <div class="sub">{{ t('kernel.intro') }}</div>
          <div class="meta-row">
            <span>{{ t('kernel.directions') }} <b>{{ k.directions.length }}</b></span>
            <span>{{ t('kernel.outputs') }} <b>{{ k.count }}</b></span>
            <span>{{ t('kernel.projects') }} <b>{{ k.projectNames.length }}</b></span>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('kernel.directions') }} <span class="cnt">{{ k.directions.length }}</span></h3>
          <div class="rel-list">
            <div v-for="did in k.directions" :key="did" class="rel-item" role="link" tabindex="0" @click="$router.push('/direction/' + did)" @keydown.enter="$router.push('/direction/' + did)" @keydown.space.prevent="$router.push('/direction/' + did)">
              <span class="ri-badge ri-d">{{ t('direction') }}</span>
              <div class="ri-body"><h4>{{ dirById[did] ? dirName(dirById[did]) : did }}</h4><div class="ri-sub">{{ dirById[did] ? lDirection(dirById[did], 'scope') : '' }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('kernel.outputs') }} <span class="cnt">{{ k.count }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="r in visibleResults" :key="r.name" class="rel-item" role="link" tabindex="0" @click="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.enter="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.space.prevent="$router.push('/result/' + encodeURIComponent(r.name))">
              <span class="ri-badge ri-r">{{ typeLabel(r.type) }}</span>
              <div class="ri-body"><h4>{{ resultTitle(r) }}</h4><div class="ri-sub">{{ resultKernel(r) }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
          <button v-if="k.results.length > 6" class="list-toggle" type="button" @click="showAllResults = !showAllResults">{{ showAllResults ? t('detail.collapseOutputs') : t('detail.viewAllOutputs', { count: k.results.length }) }}</button>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('kernel.projects') }} <span class="cnt">{{ k.projectNames.length }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="p in visibleProjects" :key="p.id" class="rel-item" role="link" tabindex="0" @click="$router.push('/project/' + p.id)" @keydown.enter="$router.push('/project/' + p.id)" @keydown.space.prevent="$router.push('/project/' + p.id)">
              <span class="ri-badge" :class="p.category === '工程交付' ? 'ri-d' : 'ri-r'">{{ p.category === '工程交付' ? categoryShort.engineering : categoryShort.research }}</span>
              <div class="ri-body"><h4>{{ publicProjectName(p) }}</h4><div class="ri-sub">{{ timeShort(p.time) }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
          <button v-if="kprojs.length > 6" class="list-toggle" type="button" @click="showAllProjects = !showAllProjects">{{ showAllProjects ? t('detail.collapseProjects') : t('detail.viewAllProjects', { count: kprojs.length }) }}</button>
        </div>
      </template>
      <div v-else class="empty-note" style="padding:80px 0">{{ t('kernel.notFound') }} <router-link to="/">{{ t('nav.home') }}</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { D, dirById, dirName, projByName, publicProjectName, timeShort } from '../utils.js'
import { t, lKernel, lDirection, typeLabel, isNonChinese, resultTitle, resultKernel } from '../i18n_20260822-1705-UTC+0700.js'

const route = useRoute()
const k = computed(() => D.kernels.find(x => x.id === route.params.id))
const categoryShort = computed(() => isNonChinese.value ? { engineering: 'ENG', research: 'R&D' } : { engineering: '交付', research: '研发' })
const kprojs = computed(() => (k.value?.projectNames || []).map(n => projByName[n]).filter(Boolean))
const showAllResults = ref(false)
const showAllProjects = ref(false)
const visibleResults = computed(() => showAllResults.value ? (k.value?.results || []) : (k.value?.results || []).slice(0, 6))
const visibleProjects = computed(() => showAllProjects.value ? kprojs.value : kprojs.value.slice(0, 6))
</script>

<style scoped>
.list-toggle { display:block; margin:14px auto 0; padding:8px 14px; border:1px solid var(--line); border-radius:999px; color:var(--accent); background:#fff; font:inherit; font-size:13px; cursor:pointer }
.list-toggle:hover { border-color:var(--accent) }
</style>
