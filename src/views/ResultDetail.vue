<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.back()">{{ t('back') }}</button>
      <template v-if="r">
        <div class="page-head">
          <div class="kicker">{{ t('kicker.output') }} · {{ typeLabel(r.type) }} · {{ localizedStatusMeta(r.status)[0] }}</div>
          <h1 :class="{ 'long-title': resultTitle(r).length > 80 }">{{ resultTitle(r) }}</h1>
          <div v-if="resultReference(r)" class="sub" v-html="linkify(resultReference(r))"></div>
          <div class="meta-row">
            <span v-if="r.kernel">{{ t('result.method') }} <b>{{ resultKernel(r) }}</b></span>
            <span v-if="dirs.length">{{ t('result.directions') }} <b>{{ dirs.map(did => dirById[did] ? dirName(dirById[did]) : did).join(' · ') }}</b></span>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('result.info') }}</h3>
          <table class="info-table">
            <tbody>
            <tr><td>{{ t('result.type') }}</td><td>{{ typeLabel(r.type) }}</td></tr>
            <tr><td>{{ t('result.status') }}</td><td>{{ statusFullLabel(r.status) }}</td></tr>
            <tr v-if="r.date"><td>{{ t('result.date') }}</td><td>{{ dateLabel(r.date) }}</td></tr>
            <tr v-if="roleOf(r)"><td>{{ t('result.role') }}</td><td>{{ roleLabel(roleOf(r)) }}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('result.directions') }}</h3>
          <div class="rel-list">
            <div v-for="did in dirs" :key="did" class="rel-item" role="link" tabindex="0" @click="dirById[did] && $router.push('/direction/' + did)" @keydown.enter="dirById[did] && $router.push('/direction/' + did)" @keydown.space.prevent="dirById[did] && $router.push('/direction/' + did)">
              <span class="ri-badge ri-d">{{ t('direction') }}</span>
              <div class="ri-body"><h4>{{ dirById[did] ? dirName(dirById[did]) : did }}</h4><div class="ri-sub">{{ dirById[did] ? lDirection(dirById[did], 'scope') : '' }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
        </div>
        <div class="section-block">
          <h3><span class="bar"></span>{{ t('result.projects') }} <span class="cnt">{{ projects.length }} {{ t('items') }}</span></h3>
          <div class="rel-list">
            <div v-for="p in projects" :key="p.id" class="rel-item" role="link" tabindex="0" @click="$router.push('/project/' + p.id)" @keydown.enter="$router.push('/project/' + p.id)" @keydown.space.prevent="$router.push('/project/' + p.id)">
              <span class="ri-badge" :class="p.category === '工程交付' ? 'ri-d' : 'ri-r'">{{ p.category === '工程交付' ? categoryShort.engineering : categoryShort.research }}</span>
              <div class="ri-body"><h4>{{ publicProjectName(p) }}</h4><div class="ri-sub">{{ timeShort(p.time) }}</div></div>
              <span class="ri-go">→</span>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-note" style="padding:80px 0">{{ t('result.notFound') }} <router-link to="/outputs">{{ t('result.backList') }}</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { D, dirById, dirName, projByName, linkify, localizedStatusMeta, roleOf, publicProjectName, timeShort } from '../utils.js'
import { t, lDirection, typeLabel, statusFullLabel, roleLabel, dateLabel, isNonChinese, resultTitle, resultReference, resultKernel } from '../i18n_20260822-1705-UTC+0700.js'

const route = useRoute()
const r = computed(() => D.results.find(x => x.name === decodeURIComponent(route.params.name)))
const categoryShort = computed(() => isNonChinese.value ? { engineering: 'ENG', research: 'R&D' } : { engineering: '交付', research: '研发' })
const dirs = computed(() => (r.value?.directions || []).map(x => x.split('｜')[0].trim()).filter(Boolean))
const projects = computed(() => (r.value?.projects || []).map(n => projByName[n]).filter(Boolean))
</script>

<style scoped>
.page-head h1.long-title { font-size: 32px; line-height: 1.42 }
@media (max-width: 720px) {
  .page-head h1.long-title { font-size: 27px; line-height: 1.45 }
}
</style>
