<template>
  <div class="page directions-page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>

      <div class="page-head directions-head">
        <div class="kicker">{{ t('kicker.researchDirections') }}</div>
        <h1>{{ t('directions.title') }}</h1>
        <div class="sub">{{ t('directions.intro') }}</div>
        <div class="meta-row">
          <span>{{ t('directions.domains') }} <b>{{ domainGroups.length }}</b></span>
          <span>{{ t('directions.appDirs') }} <b>{{ appDirs.length }}</b></span>
          <span>{{ t('directions.foundationCount') }} <b>{{ baseDirs.length }}</b></span>
        </div>
      </div>

      <section class="architecture-section" aria-labelledby="architecture-title">
        <div class="section-title-row">
          <div>
            <div class="section-kicker">{{ t('kicker.researchArchitecture') }}</div>
            <h2 id="architecture-title">{{ t('directions.architecture') }}</h2>
          </div>
        </div>

        <div class="research-architecture">
          <div class="domain-map">
            <article v-for="(group, groupIndex) in domainGroups" :key="group.domain" class="domain-cluster" :class="`cluster-${groupIndex + 1}`">
              <header>
                <span>{{ t('directions.domain') }} {{ String(groupIndex + 1).padStart(2, '0') }}</span>
                <h3>{{ group.domain }}</h3>
              </header>
              <div class="domain-directions">
                <router-link v-for="(d, index) in group.directions" :key="d.id" class="map-direction" :to="`/direction/${d.id}`">
                  <span class="map-index">{{ String(index + 1).padStart(2, '0') }}</span>
                  <span class="map-copy">
                    <strong>{{ dirName(d) }}</strong>
                    <small>{{ shortCore(d) }}</small>
                  </span>
                  <span class="map-jump">↗</span>
                </router-link>
              </div>
            </article>
          </div>

          <div class="foundation-connector" aria-hidden="true"><span>{{ t('directions.support') }}</span></div>

          <div class="foundation-band">
            <div class="foundation-heading">
              <span>{{ t('kicker.commonFoundation') }}</span>
              <h3>{{ t('directions.foundation') }}</h3>
              <p>{{ t('directions.foundationIntro') }}</p>
            </div>
            <div class="foundation-links">
              <router-link v-for="d in baseDirs" :key="d.id" class="foundation-link" :to="`/direction/${d.id}`">
                <span class="foundation-code">{{ t('directions.methodBase') }}</span>
                <span>
                  <strong>{{ dirName(d) }}</strong>
                  <small>{{ shortCore(d) }}</small>
                </span>
                <i>↗</i>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <section class="direction-section">
        <div class="section-title-row compact">
          <div>
            <div class="section-kicker">{{ t('kicker.applicationDirections') }}</div>
            <h2>{{ t('directions.application') }}</h2>
          </div>
        </div>

        <div class="direction-detail-grid">
          <router-link
            v-for="(d, index) in appDirs"
            :key="d.id"
            class="direction-detail-card"
            :to="`/direction/${d.id}`"
          >
            <div class="card-rail"><span>{{ String(index + 1).padStart(2, '0') }}</span></div>
            <div class="card-content">
              <div class="card-overline">
                <span>{{ lDirection(d, 'domain') }}</span>
              </div>
              <h3>{{ dirName(d) }}</h3>
              <div class="scope-block">
                <span>{{ t('directions.scope') }}</span>
                <p>{{ lDirection(d, 'scope') }}</p>
              </div>
              <div class="method-block">
                <span>{{ t('directions.methods') }}</span>
                <div class="method-tags">
                  <i v-for="tag in coreTags(d)" :key="tag">{{ tag }}</i>
                </div>
              </div>
              <div class="card-footer">
                <div><b>{{ projectCountFor(d) }}</b><span>{{ t('directions.relatedProjects') }}</span></div>
                <div><b>{{ resultCountFor(d) }}</b><span>{{ t('directions.relatedOutputs') }}</span></div>
                <strong>{{ t('directions.view') }}</strong>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <section class="direction-section foundation-section">
        <div class="section-title-row compact">
          <div>
            <div class="section-kicker green">{{ t('kicker.commonTechnology') }}</div>
            <h2>{{ t('directions.foundationCount') }}</h2>
          </div>
        </div>

        <div class="base-detail-grid">
          <router-link v-for="d in baseDirs" :key="d.id" class="base-detail-card" :to="`/direction/${d.id}`">
            <div class="base-card-head">
              <span>{{ d.id }}</span>
              <b>{{ t('directions.technologyBase') }}</b>
            </div>
            <h3>{{ dirName(d) }}</h3>
            <p>{{ lDirection(d, 'scope') }}</p>
            <div class="method-tags green-tags">
              <i v-for="tag in coreTags(d)" :key="tag">{{ tag }}</i>
            </div>
            <div class="base-card-foot">
              <span><b>{{ projectCountFor(d) }}</b> {{ t('directions.relatedProjects') }}</span>
              <span><b>{{ resultCountFor(d) }}</b> {{ t('directions.relatedOutputs') }}</span>
              <strong>{{ t('directions.enter') }}</strong>
            </div>
          </router-link>
        </div>
      </section>

      <section class="relation-section">
        <details class="relation-overview" @toggle="graphOpen = $event.target.open">
          <summary>
            <span>
              <b>{{ t('directions.graphTitle') }}</b>
              <small>{{ t('directions.graphIntro') }}</small>
            </span>
            <i>{{ graphOpen ? t('directions.collapse') : t('directions.expand') }}</i>
          </summary>
          <div v-if="graphOpen" class="relation-body">
            <div class="graph-toolbar">
              <span>{{ t('directions.range') }}</span>
              <div class="out-tools">
                <button v-for="f in filters" :key="f.scope" class="gf-btn" :class="{ active: f.scope === graphScope }" @click="setScope(f.scope)">{{ f.label }}</button>
              </div>
            </div>
            <ForceGraph ref="graph" :scope="graphScope" :h="680" :min-width="920" />
          </div>
        </details>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { D, dirName, isActiveDir } from '../utils.js'
import { t, lDirection, isNonChinese } from '../i18n_20260822-1705-UTC+0700.js'
import ForceGraph from '../components/ForceGraph.vue'

const graphScope = ref('all')
const graphOpen = ref(false)
const isBase = d => (d.domain || '').includes('共性')
const appDirs = computed(() => D.directions.filter(d => !isBase(d)))
const baseDirs = computed(() => D.directions.filter(d => isBase(d)))
const projectCountFor = d => D.projects.filter(p => isActiveDir(p, d.id)).length
const resultCountFor = d => D.results.filter(r => r.pkg === d.id || (r.directions || []).some(x => x.startsWith(d.id))).length
const domainGroups = computed(() => {
  const groups = new Map()
  appDirs.value.forEach(d => {
    if (!groups.has(d.domain)) groups.set(d.domain, [])
    groups.get(d.domain).push(d)
  })
  return [...groups.entries()].map(([, directions]) => ({ domain: lDirection(directions[0], 'domain'), directions }))
})

const shortCore = d => coreTags(d).slice(0, 3).join(' · ')
const coreTags = d => lDirection(d, 'core')
  .replace(/[。；;]/g, '、')
  .split(/[、，,]/)
  .map(s => s.trim())
  .filter(Boolean)
  .slice(0, 5)

const shortDirectionName = d => {
  const name = dirName(d)
  const limit = isNonChinese.value ? 24 : 8
  return name.length > limit ? name.slice(0, limit) + '…' : name
}

const filters = computed(() => [
  { scope: 'all', label: t('directions.panorama') },
  ...appDirs.value.map(d => ({ scope: 'D' + d.id, label: shortDirectionName(d) })),
  ...baseDirs.value.map(d => ({ scope: 'D' + d.id, label: t('directions.commonPrefix') + shortDirectionName(d) }))
])
function setScope(scope) { graphScope.value = scope }
</script>

<style scoped>
.directions-head { margin-bottom: 24px }
.architecture-section,
.direction-section,
.relation-section { padding: 0; margin-bottom: 28px }
.section-title-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 16px }
.section-title-row.compact { margin-bottom: 15px }
.section-title-row h2 { margin: 4px 0 5px; color: var(--ink); font-family: var(--serif); font-size: 27px; line-height: 1.35 }
.section-title-row p { margin: 0; color: var(--ink-2); font-size: 15px; line-height: 1.65 }
.section-kicker { color: var(--accent); font-size: 11.5px; font-weight: 750; letter-spacing: .15em }
.section-kicker.green { color: var(--green) }
.research-architecture { padding: 18px; border: 1px solid var(--line); border-radius: calc(var(--radius) + 3px); background: linear-gradient(145deg, #fff 0%, #f4f7fa 100%); box-shadow: var(--shadow) }
.mainline-node { display: grid; justify-items: center; max-width: 620px; margin: 0 auto; padding: 17px 24px; border: 1px solid #c3d2e2; border-radius: 10px; background: #f1f6fb; text-align: center }
.mainline-node span { color: var(--accent); font-size: 11px; font-weight: 750; letter-spacing: .14em }
.mainline-node strong { margin-top: 6px; color: var(--ink); font-family: var(--serif); font-size: 24px }
.mainline-node small { margin-top: 5px; color: var(--ink-2); font-size: 13.5px; letter-spacing: .05em }
.architecture-flow { position: relative; height: 32px }
.architecture-flow::before { content: ''; position: absolute; left: 50%; top: 0; width: 1px; height: 20px; background: #adc1d3 }
.architecture-flow::after { content: ''; position: absolute; left: 25%; right: 25%; bottom: 0; height: 1px; background: #adc1d3 }
.architecture-flow i::before,
.architecture-flow i::after { content: ''; position: absolute; bottom: -7px; width: 7px; height: 7px; border-right: 1px solid #829db5; border-bottom: 1px solid #829db5; transform: rotate(45deg) }
.architecture-flow i::before { left: calc(25% - 4px) }
.architecture-flow i::after { right: calc(25% - 4px) }
.domain-map { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px }
.domain-cluster { overflow: hidden; border: 1px solid #d4dee8; border-radius: 10px; background: #fff }
.domain-cluster header { padding: 17px 19px 14px; border-bottom: 1px solid #e4e9ee; background: #f7f9fb }
.domain-cluster header span { color: var(--ink-3); font-size: 10px; font-weight: 750; letter-spacing: .12em }
.domain-cluster header h3 { margin: 4px 0 0; color: var(--ink); font-family: var(--serif); font-size: 19px }
.cluster-2 header { background: #f5f8fb }
.domain-directions { display: grid; gap: 1px; background: #e7ebef }
.map-direction { display: grid; grid-template-columns: 35px minmax(0, 1fr) 18px; align-items: center; gap: 11px; min-height: 76px; padding: 11px 15px; color: inherit; background: #fff; text-decoration: none; transition: background .18s ease }
.map-direction:hover { color: inherit; background: #f2f7fb; text-decoration: none }
.map-direction:focus-visible { position: relative; z-index: 2 }
.map-index { display: grid; place-items: center; width: 33px; height: 33px; border-radius: 50%; color: #fff; background: var(--accent); font-family: var(--serif); font-size: 13px; font-weight: 700 }
.cluster-2 .map-index { background: #3d678e }
.map-copy { min-width: 0 }
.map-copy strong { display: block; color: var(--ink); font-family: var(--serif); font-size: 16px; line-height: 1.4 }
.map-copy small { display: block; margin-top: 4px; overflow: hidden; color: var(--ink-2); font-size: 12.5px; line-height: 1.45; text-overflow: ellipsis; white-space: nowrap }
.map-jump { color: var(--accent); font-size: 14px }
.foundation-connector { position: relative; display: grid; place-items: center; height: 40px }
.foundation-connector::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: #98b8ab }
.foundation-connector span { position: relative; z-index: 1; padding: 3px 9px; border: 1px solid #bfd1c7; border-radius: 999px; color: var(--green); background: #f2f7f4; font-size: 10px; font-weight: 750; letter-spacing: .08em }
.foundation-band { display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: 20px; padding: 20px; border: 1px solid #bcd0c3; border-radius: 10px; background: linear-gradient(120deg, #eff7f2 0%, #f9fbfa 100%) }
.foundation-heading span { color: var(--green); font-size: 10px; font-weight: 750; letter-spacing: .13em }
.foundation-heading h3 { margin: 5px 0 7px; color: var(--ink); font-family: var(--serif); font-size: 18px }
.foundation-heading p { margin: 0; color: var(--ink-2); font-size: 13.5px; line-height: 1.55 }
.foundation-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px }
.foundation-link { display: grid; grid-template-columns: 34px minmax(0, 1fr) 15px; align-items: center; gap: 10px; padding: 13px; border: 1px solid #ccdbd2; border-radius: 8px; color: inherit; background: rgba(255,255,255,.86); text-decoration: none }
.foundation-link:hover { border-color: var(--green); color: inherit; text-decoration: none }
.foundation-code { color: var(--green); font-family: var(--serif); font-weight: 800 }
.foundation-link strong { display: block; color: var(--ink); font-family: var(--serif); font-size: 15px; line-height: 1.4 }
.foundation-link small { display: block; margin-top: 3px; overflow: hidden; color: var(--ink-2); font-size: 12px; text-overflow: ellipsis; white-space: nowrap }
.foundation-link i { color: var(--green); font-style: normal }

.direction-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px }
.direction-detail-card { display: grid; grid-template-columns: 48px minmax(0, 1fr); min-height: 260px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); color: inherit; background: var(--surface); box-shadow: var(--shadow); text-decoration: none; transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease }
.direction-detail-card:hover { border-color: #b4c8da; color: inherit; box-shadow: 0 10px 28px rgba(25,49,70,.08); text-decoration: none; transform: translateY(-2px) }
.card-rail { display: grid; justify-items: center; padding-top: 22px; color: #fff; background: var(--accent) }
.card-rail span { font-family: var(--serif); font-size: 18px; font-weight: 800; writing-mode: vertical-rl }
.card-content { display: flex; min-width: 0; flex-direction: column; padding: 18px 19px }
.card-overline { color: var(--ink-3); font-size: 12.5px }
.card-content h3 { margin: 7px 0 12px; color: var(--ink); font-family: var(--serif); font-size: 20px; line-height: 1.4 }
.scope-block > span,
.method-block > span { display: block; margin-bottom: 5px; color: var(--ink-3); font-size: 10.5px; font-weight: 750; letter-spacing: .08em }
.scope-block p { margin: 0; color: var(--ink-2); font-size: 14.5px; line-height: 1.68 }
.method-block { margin-top: 11px }
.method-tags { display: flex; flex-wrap: wrap; gap: 6px }
.method-tags i { padding: 4px 8px; border: 1px solid #d7e2ec; border-radius: 999px; color: #3f5e79; background: #f4f8fb; font-size: 12px; font-style: normal; line-height: 1.35 }
.card-footer { display: grid; grid-template-columns: auto auto 1fr; align-items: end; gap: 16px; margin-top: auto; padding-top: 12px; border-top: 1px dashed var(--line) }
.card-footer div { display: grid }
.card-footer div b { color: var(--accent); font-family: var(--serif); font-size: 18px; line-height: 1 }
.card-footer div span { margin-top: 3px; color: var(--ink-3); font-size: 11.5px }
.card-footer > strong { justify-self: end; color: var(--accent); font-size: 12px }

.base-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px }
.base-detail-card { display: flex; min-height: 220px; flex-direction: column; padding: 20px; border: 1px solid #bcd0c3; border-radius: var(--radius); color: inherit; background: linear-gradient(155deg, #f0f7f3 0%, #fff 55%); box-shadow: var(--shadow); text-decoration: none; transition: border-color .18s ease, transform .18s ease }
.base-detail-card:hover { border-color: var(--green); color: inherit; text-decoration: none; transform: translateY(-2px) }
.base-card-head { display: flex; align-items: center; justify-content: space-between }
.base-card-head > span { color: var(--green); font-family: var(--serif); font-size: 18px; font-weight: 800 }
.base-card-head > b { padding: 4px 8px; border-radius: 4px; color: #fff; background: var(--green); font-size: 10px }
.base-detail-card h3 { margin: 12px 0 8px; color: var(--ink); font-family: var(--serif); font-size: 20px }
.base-detail-card > p { margin: 0 0 15px; color: var(--ink-2); font-size: 14.5px; line-height: 1.7 }
.green-tags i { border-color: #ceded4; color: #38604e; background: #f2f7f4 }
.base-card-foot { display: flex; align-items: center; gap: 18px; margin-top: auto; padding-top: 15px; border-top: 1px dashed #c9d8cf; color: var(--ink-3); font-size: 12px }
.base-card-foot span b { color: var(--green); font-family: var(--serif); font-size: 16px }
.base-card-foot strong { margin-left: auto; color: var(--green); font-size: 12px }

.relation-section { margin-top: 30px }
.relation-overview { overflow: hidden; border: 1px solid var(--line); border-radius: calc(var(--radius) + 2px); background: rgba(255,255,255,.72) }
.relation-overview summary { padding: 20px 22px; cursor: pointer; list-style: none; color: var(--ink-2); background: #f8fafb }
.relation-overview summary::-webkit-details-marker { display: none }
.relation-overview summary > span { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding-right: 56px }
.relation-overview summary b { color: var(--ink); font-family: var(--serif); font-size: 19px }
.relation-overview summary small { color: var(--ink-3); font-size: 13.5px }
.relation-overview summary > i { float:right; margin-top:-24px; color:var(--accent); font-size:12px; font-style:normal }
.relation-body { padding: 18px }
.graph-toolbar { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px }
.graph-toolbar > span { flex: none; padding-top: 8px; color: var(--ink-3); font-size: 12px; font-weight: 700 }
.graph-toolbar .out-tools { display: flex; flex-wrap: wrap; gap: 7px }
.relation-body .claim-mini { margin-top: 14px }

@media (max-width: 920px) {
  .foundation-band { grid-template-columns: 1fr }
  .direction-detail-grid, .base-detail-grid { grid-template-columns: 1fr }
}

@media (max-width: 720px) {
  .directions-head { margin-bottom: 30px }
  .architecture-section, .direction-section, .relation-section { margin-bottom: 34px }
  .section-title-row { align-items: flex-start; flex-direction: column; gap: 12px }
  .section-title-row h2 { font-size: 23px }
  .research-architecture { padding: 16px }
  .domain-map { grid-template-columns: 1fr }
  .foundation-links { grid-template-columns: 1fr }
  .direction-detail-card { grid-template-columns: 42px minmax(0, 1fr) }
  .card-content { padding: 18px 16px }
  .card-overline { align-items: flex-start; flex-direction: column }
  .card-footer { grid-template-columns: auto auto; }
  .card-footer > strong { grid-column: 1 / -1; justify-self: start; margin-top: 3px }
  .relation-overview summary > span { align-items: flex-start; flex-direction: column; gap: 5px }
  .relation-overview summary small { line-height: 1.5 }
  .relation-body { padding: 12px }
  .graph-toolbar { flex-direction: column; gap: 5px }
  .base-card-foot { flex-wrap: wrap }
  .base-card-foot strong { width: 100%; margin-left: 0 }
}
</style>
