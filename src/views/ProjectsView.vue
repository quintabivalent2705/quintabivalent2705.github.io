<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>
      <div class="page-head">
        <div class="kicker">{{ t('kicker.projects') }} · {{ D.stats.projectTotal }}</div>
        <h1>{{ t('projects.title') }}</h1>
        <div class="sub">{{ t('projects.intro') }}</div>
        <div class="out-tools" style="margin-top:18px">
          <button class="of-btn" :class="{ active: activeScope === 'featured' }" @click="activeScope = 'featured'">{{ t('projects.featured') }} {{ featuredIds.size }}</button>
          <button class="of-btn" :class="{ active: activeScope === 'all' }" @click="activeScope = 'all'">{{ t('projects.all') }} {{ D.stats.projectTotal }}</button>
        </div>
      </div>
      <div v-for="d in D.directions" :key="d.id" class="section-block">
        <template v-if="grouped[d.id] && grouped[d.id].length">
          <h3><span class="bar"></span>{{ dirName(d) }} <span class="cnt">{{ grouped[d.id].length }} {{ t('items') }}</span></h3>
          <div class="proj-grid">
            <div v-for="p in grouped[d.id]" :key="p.id" class="rel-item" role="link" tabindex="0" @click="$router.push('/project/' + p.id)" @keydown.enter="$router.push('/project/' + p.id)" @keydown.space.prevent="$router.push('/project/' + p.id)">
              <span class="ri-badge" :class="p.category === '工程交付' ? 'ri-d' : 'ri-r'">{{ p.category === '工程交付' ? categoryShort.engineering : categoryShort.research }}</span>
              <div class="ri-body">
                <h4>{{ publicProjectName(p) }}</h4>
                <div class="ri-sub">{{ timeShort(p.time) }}<template v-if="baseTags(p).length"> · {{ t('projects.commonSupport') }} {{ baseTags(p).length }}</template><template v-if="resCount(p)"> · {{ resCount(p) }} {{ t('output') }}</template></div>
              </div>
              <span class="ri-go">→</span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="others.length" class="section-block">
        <h3><span class="bar"></span>{{ t('projects.other') }} <span class="cnt">{{ others.length }} {{ t('items') }}</span></h3>
        <div class="proj-grid">
          <div v-for="p in others" :key="p.id" class="rel-item" role="link" tabindex="0" @click="$router.push('/project/' + p.id)" @keydown.enter="$router.push('/project/' + p.id)" @keydown.space.prevent="$router.push('/project/' + p.id)">
            <span class="ri-badge" :class="p.category === '工程交付' ? 'ri-d' : 'ri-r'">{{ p.category === '工程交付' ? categoryShort.engineering : categoryShort.research }}</span>
            <div class="ri-body"><h4>{{ publicProjectName(p) }}</h4><div class="ri-sub">{{ timeShort(p.time) }}</div></div>
            <span class="ri-go">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { D, dirName, resByName, timeShort, publicProjectName } from '../utils.js'
import { t, isNonChinese } from '../i18n_20260822-1705-UTC+0700.js'

const activeScope = ref('featured')
const featuredIds = new Set(['R5', 'R6', 'R7', 'R9', 'R11'])
const categoryShort = computed(() => isNonChinese.value ? { engineering: 'ENG', research: 'R&D' } : { engineering: '交付', research: '研发' })
const visibleProjects = computed(() => activeScope.value === 'featured'
  ? D.projects.filter(p => featuredIds.has(p.id))
  : D.projects)

// 按主方向归类，每个项目只出现一次。
const grouped = computed(() => {
  const groups = Object.fromEntries(D.directions.map(d => [d.id, []]))
  visibleProjects.value.forEach(p => {
    if (p.direction && groups[p.direction]) groups[p.direction].push(p)
  })
  Object.values(groups).forEach(list => list.sort((a, b) =>
    (parseInt(a.id.match(/\d+/)?.[0] || 0)) - (parseInt(b.id.match(/\d+/)?.[0] || 0))))
  return groups
})

const others = computed(() => visibleProjects.value.filter(p => !D.directions.some(d => d.id === p.direction)))
const resCount = p => (p.results || []).filter(n => resByName[n]).length
// 项目关联的共性技术基座（directions 里除主方向外的 C 类方向）
const baseTags = p => (p.directions || [])
  .map(x => x.split('｜')[0].trim())
  .filter(x => x.startsWith('C') && x !== p.direction)
</script>

<style scoped>
.proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px }
.proj-grid .rel-item { margin: 0 }
@media (max-width: 860px) { .proj-grid { grid-template-columns: 1fr } }
</style>
