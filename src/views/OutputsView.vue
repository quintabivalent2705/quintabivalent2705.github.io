<template>
  <div class="page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>
      <div class="page-head">
        <div class="kicker">{{ t('kicker.outputs') }} · {{ D.results.length }}</div>
        <h1>{{ t('outputs.title') }}</h1>
        <div class="sub">{{ t('outputs.intro') }}</div>
        <div class="out-tools" style="margin-top:18px">
          <button v-for="f in statusFilters" :key="f.v" class="of-btn" :class="{active: f.v === activeStatus}" @click="activeStatus = f.v; activeType = '全部'">{{ f.label }}</button>
        </div>
        <div class="out-tools" style="margin-top:8px">
          <button v-for="f in typeFilters" :key="f.t" class="of-btn" :class="{active: f.t === activeType}" @click="activeType = f.t">{{ f.label }}</button>
        </div>
      </div>
      <div class="section-block">
        <h3><span class="bar"></span>{{ t('outputs.list') }} <span class="cnt">{{ filtered.length }} {{ t('items') }}</span></h3>
        <div class="rel-list">
          <div v-for="r in filtered" :key="r.name" class="rel-item" role="link" tabindex="0" @click="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.enter="$router.push('/result/' + encodeURIComponent(r.name))" @keydown.space.prevent="$router.push('/result/' + encodeURIComponent(r.name))">
            <span class="ri-badge" :style="badgeStyle(r)">{{ typeLabel(r.type) }}</span>
            <div class="ri-body">
              <h4>{{ resultTitle(r) }}</h4>
              <div class="ri-sub">{{ resultKernel(r) }}</div>
            </div>
            <span class="ri-badge" :style="statusStyle(r)">{{ localizedStatusMeta(r.status)[0] }}</span>
            <span class="ri-go">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { D, typeColor, typeOrder, localizedStatusMeta, isFormalResult } from '../utils.js'
import { t, typeLabel, resultTitle, resultKernel } from '../i18n_20260822-1705-UTC+0700.js'

const activeType = ref('全部')
const activeStatus = ref('正式')
const formalCount = D.results.filter(isFormalResult).length
const statusFilters = computed(() => [
  { v: '正式', label: `${t('outputs.formal')} ${formalCount}` },
  { v: '在途', label: `${t('outputs.progress')} ${D.results.length - formalCount}` },
  { v: '全部', label: `${t('outputs.all')} ${D.results.length}` }
])

const typeFilters = computed(() => {
  const cnt = {}
  const statusItems = activeStatus.value === '全部' ? D.results : D.results.filter(r => activeStatus.value === '正式' ? isFormalResult(r) : !isFormalResult(r))
  statusItems.forEach(r => { cnt[r.type] = (cnt[r.type] || 0) + 1 })
  return [
    { t: '全部', label: t('outputs.allTypes') },
    ...typeOrder.filter(type => cnt[type]).map(type => ({ t: type, label: `${typeLabel(type)} ${cnt[type]}` }))
  ]
})
const filtered = computed(() => {
  let items = activeStatus.value === '全部' ? D.results : D.results.filter(r => activeStatus.value === '正式' ? isFormalResult(r) : !isFormalResult(r))
  if (activeType.value !== '全部') items = items.filter(r => r.type === activeType.value)
  return items
})
const badgeStyle = r => {
  const [c1, c2] = typeColor[r.type] || ['#55606e', '#f0f1f3']
  return { background: c2, color: c1 }
}
const statusStyle = r => {
  const [, textColor, backgroundColor] = localizedStatusMeta(r.status)
  return { background: backgroundColor, color: textColor }
}
</script>
