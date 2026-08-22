<template>
  <div>
    <section class="hero">
      <div class="wrap">
        <div class="hero-layout">
          <div class="hero-profile">
            <div class="kicker">{{ t('kicker.profile') }}</div>
            <h1>王潇霈<span class="en">{{ t('home.profileLine') }}</span></h1>
            <div class="role">{{ roles.join(' ｜ ') }}</div>
            <div class="focus">{{ t('home.focus') }}</div>
            <div class="divider"></div>
            <div class="hero-meta">
              <a :href="`mailto:${D.basic.email_permanent}`">✉ {{ D.basic.email_permanent }}</a>
              <a v-if="D.basic.orcid" :href="D.basic.orcid" target="_blank" rel="me noopener noreferrer">ORCID {{ orcidId }}</a>
              <a v-if="D.basic.linkedin" :href="D.basic.linkedin" target="_blank" rel="me noopener noreferrer">LinkedIn</a>
              <span v-if="D.basic.location">📍 {{ basicLocation }}</span>
              <span v-if="D.basic.identity">🎓 {{ basicIdentity }}</span>
            </div>
            <div class="hero-actions">
              <router-link class="hero-action" to="/directions">{{ t('home.viewDirections') }}</router-link>
              <router-link class="hero-action secondary" to="/outputs">{{ t('home.browseOutputs') }}</router-link>
            </div>
          </div>
          <aside class="hero-stats" :aria-label="t('home.statsAria')">
            <div class="stats-label">{{ t('kicker.academicProfile') }}</div>
            <div class="hs"><b>{{ counts.publishedPapers }}</b><span>{{ t('stats.papers') }}</span></div>
            <div class="hs"><b>{{ counts.publicData }}</b><span>{{ t('stats.datasets') }}</span></div>
            <div class="hs"><b>{{ counts.grantedInventionPatents }}</b><span>{{ t('stats.grantedPatents') }}<small>{{ counts.publicInventionApplications }} {{ t('stats.publicApplications') }}</small></span></div>
            <div class="hs"><b>{{ featuredProjects.length }}</b><span>{{ t('stats.representativeProjects') }}</span></div>
          </aside>
        </div>
      </div>
    </section>

    <section class="statement">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-kicker">{{ t('kicker.researchFocus') }}</div>
          <h2>{{ t('home.researchTitle') }}</h2>
          <p>{{ t('home.researchIntro') }}</p>
        </div>
        <div class="application-grid">
          <button v-for="g in applicationGroups" :key="g.title" class="research-card" @click="$router.push('/directions')">
            <span>{{ g.eyebrow }}</span>
            <h3>{{ g.title }}</h3>
            <p>{{ g.summary }}</p>
            <small>{{ g.directions.map(d => dirName(d)).join(' · ') }}</small>
          </button>
        </div>
        <div class="support-bridge"><span>{{ t('home.support') }}</span></div>
        <button class="foundation-card" @click="$router.push('/directions')">
          <span>{{ t('kicker.commonFoundation') }}</span>
          <div>
            <h3>{{ t('home.foundationTitle') }}</h3>
            <p>{{ t('home.foundationSummary') }}</p>
          </div>
          <small>{{ baseDirs.map(d => dirName(d)).join(' · ') }}</small>
        </button>
      </div>
    </section>

    <section class="featured" style="background:#fff;border-top:1px solid var(--line)">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-kicker">{{ t('kicker.selectedWork') }}</div>
          <h2>{{ t('home.selectedTitle') }}</h2>
          <p>{{ t('home.selectedIntro') }}</p>
        </div>
        <div class="featured-columns">
          <div class="featured-column">
            <h3><span class="bar"></span>{{ t('home.selectedOutputs') }}</h3>
            <div class="featured-list">
              <button v-for="r in featuredResults" :key="r.name" class="featured-card" @click="$router.push('/result/' + encodeURIComponent(r.name))">
                <span>{{ typeLabel(r.type) }} · {{ localizedStatusMeta(r.status)[0] }}</span><b>{{ resultTitle(r) }}</b><i>→</i>
              </button>
            </div>
          </div>
          <div v-if="featuredProjects.length" class="featured-column">
            <h3><span class="bar"></span>{{ t('home.selectedProjects') }}</h3>
            <div class="featured-list">
              <button v-for="p in featuredProjects" :key="p.id" class="featured-card project" @click="$router.push('/project/' + p.id)">
                <span>{{ categoryLabel(p.category) }} · {{ timeShort(p.time) }}</span><b>{{ publicProjectName(p) }}</b><i>→</i>
              </button>
            </div>
          </div>
        </div>
        <div class="summary-link"><router-link to="/outputs" class="more">{{ t('home.allOutputs') }}</router-link></div>
      </div>
    </section>

    <section id="cv-home" style="background:#fff;border-top:1px solid var(--line)">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-kicker">{{ t('kicker.background') }}</div>
          <h2>{{ t('home.backgroundTitle') }}</h2>
          <p>{{ t('home.backgroundIntro') }}</p>
        </div>
        <div class="exp-grid">
          <div>
            <h3 class="exp-col-h"><span class="bar"></span>{{ t('home.education') }}</h3>
            <div class="timeline">
              <div v-for="e in educationSummary" :key="e.time + e.school" class="tl-item">
                <h4>{{ lEducation(e, 'school') }}</h4>
                <div class="tl-time">{{ dateLabel(e.time) }}</div>
                <div class="tl-sub">{{ lEducation(e, 'degree') }}<template v-if="lEducation(e, 'advisor') && lEducation(e, 'advisor') !== '—'"> · {{ t('home.advisor') }} {{ lEducation(e, 'advisor') }}</template></div>
                <p>{{ lEducation(e, 'topic') }}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="exp-col-h"><span class="bar"></span>{{ t('home.career') }}</h3>
            <div class="timeline">
              <div v-for="c in careerSummary" :key="c.time + c.org" class="tl-item">
                <h4>{{ careerDisplay(c).name }}</h4>
                <div class="tl-time">{{ dateLabel(c.time) }}</div>
                <div class="tl-sub">{{ lCareer(c, 'role') }}</div>
                <div v-if="careerDisplay(c).detail" class="tl-context">{{ careerDisplay(c).detail }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="academic-visits">
          <h3 class="exp-col-h"><span class="bar"></span>{{ t('home.academicVisits') }}</h3>
          <div class="visit-grid">
            <article v-for="p in academicVisits" :key="p.name" class="visit-card">
              <div class="visit-time">{{ dateLabel(p.time) }}</div>
              <h4>{{ lPartner(p, 'name') }}</h4>
              <div class="visit-role">{{ partnerExperience(p).role }}</div>
              <p v-if="partnerExperience(p).detail">{{ partnerExperience(p).detail }}</p>
            </article>
          </div>
        </div>
        <div class="summary-link">
          <router-link to="/partners" class="more">{{ t('home.partners') }}</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { D, dirName, resultCounts, isFormalResult, localizedStatusMeta, timeShort, publicProjectName } from '../utils.js'
import { t, lBasic, lEducation, lCareer, lPartner, typeLabel, categoryLabel, dateLabel, resultTitle } from '../i18n_20260822-1705-UTC+0700.js'

const counts = resultCounts()
const roles = computed(() => lBasic('roles') || D.basic.roles)
const basicLocation = computed(() => lBasic('location') || D.basic.location)
const basicIdentity = computed(() => lBasic('identity') || D.basic.identity)
const orcidId = computed(() => D.basic.orcid?.replace(/^https?:\/\/orcid\.org\//, '') || '')

const featuredResultNames = [
  'PSO-Based Accuracy Optimization of Parallel Mass Flow Controllers in Multi-Component Gas Mixing Systems',
  '燃料电池的气体加湿装置、方法及计算机可读存储介质',
  '氢燃料电池汽车运行数据',
  'Hardware-in-the-Loop Test of Motor Controller Based on FPGA'
]
const featuredProjectIds = ['R5', 'R6', 'R7', 'R9', 'R11']
const featuredResults = computed(() => featuredResultNames
  .map(name => D.results.find(r => r.name === name))
  .filter(r => r && isFormalResult(r) && r.public === '可公开'))
const featuredProjects = computed(() => featuredProjectIds
  .map(id => D.projects.find(p => p.id === id))
  .filter(Boolean))

// 应用方向与共性技术基座分组
const isBaseDir = d => (d.domain || '').includes('共性')
const baseDirs = computed(() => D.directions.filter(d => isBaseDir(d)))
const applicationGroups = computed(() => [
  {
    eyebrow: t('home.app1'),
    title: t('home.app1Title'),
    summary: t('home.app1Summary'),
    directions: D.directions.filter(d => d.id.startsWith('A'))
  },
  {
    eyebrow: t('home.app2'),
    title: t('home.app2Title'),
    summary: t('home.app2Summary'),
    directions: D.directions.filter(d => d.id.startsWith('B'))
  }
])

const educationSummary = computed(() => D.basic.education.slice(0, 3))
const careerSummary = computed(() => D.basic.career.slice(0, 3))
const academicVisitNames = ['河内理工大学', '东京大学', '首尔大学', '国立台湾大学']
const academicVisits = computed(() => academicVisitNames.map(name => D.partners.find(p => p.name === name)).filter(Boolean))

const partnerExperience = partner => {
  const [role, ...detail] = lPartner(partner, 'note').split(' · ')
  return { role, detail: detail.join(' · ') }
}

const careerOrg = org => {
  const match = (org || '').match(/^([^（]+)（(.+)）$/)
  return match ? { name: match[1], detail: match[2] } : { name: org, detail: '' }
}
const careerDisplay = record => {
  const context = lCareer(record, 'context')
  if (context) return { name: lCareer(record, 'org'), detail: context }
  return careerOrg(lCareer(record, 'org'))
}
</script>

<style scoped>
.exp-col-h { font-family: var(--serif); font-size: 19px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px }
.exp-col-h .bar { width: 4px; height: 16px; border-radius: 2px; background: var(--accent) }
.tl-context { margin-top:4px; color:var(--ink-3); font-size:13.5px; line-height:1.65 }
.academic-visits { margin-top:30px; padding-top:26px; border-top:1px solid var(--line) }
.academic-visits .exp-col-h { margin-bottom:14px }
.visit-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px }
.visit-card { min-width:0; padding:15px 16px; border:1px solid var(--line); border-radius:10px; background:linear-gradient(145deg,#fff 0%,#f7f9fb 100%) }
.visit-time { color:var(--accent); font-size:12px; font-weight:700; letter-spacing:.02em }
.visit-card h4 { margin:5px 0 7px; font-family:var(--serif); font-size:16px; line-height:1.4 }
.visit-role { color:var(--ink-2); font-size:13px; font-weight:700; line-height:1.45 }
.visit-card p { margin:4px 0 0; color:var(--ink-3); font-size:12.5px; line-height:1.5 }
.statement, .featured, #cv-home { padding:56px 0 }
.sec-head { margin-bottom:28px }
.hero { padding:112px 0 48px }
.hero-layout { display:grid; grid-template-columns:minmax(0,1fr) 310px; align-items:start; gap:52px }
.hero-profile { min-width:0 }
.hero .role { margin-top:22px }
.hero .focus { margin-top:13px; line-height:1.75 }
.hero .divider { margin-top:20px }
.hero-meta { margin-top:18px }
.hero-actions { margin-top:18px }
.hero-stats { display:grid; grid-template-columns:1fr; align-self:stretch; margin:0; padding:16px 20px; border:1px solid var(--line); border-radius:var(--radius); background:rgba(255,255,255,.82); box-shadow:var(--shadow) }
.stats-label { padding:0 0 9px; color:var(--accent); font-size:10.5px; font-weight:750; letter-spacing:.14em }
.hero-stats .hs { display:grid; grid-template-columns:58px minmax(0,1fr); align-items:center; gap:10px; padding:10px 0; border-top:1px solid var(--line-2); text-align:left }
.hero-stats .hs + .hs { border-left:0 }
.hero-stats .hs b { font-size:25px; text-align:center }
.hero-stats .hs span { font-size:13.5px; line-height:1.35 }
.hero-stats .hs small { margin-top:3px; font-size:10.5px; line-height:1.35 }
.application-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px }
.research-card { border:1px solid var(--line); border-top:3px solid var(--accent); background:var(--surface); border-radius:var(--radius); padding:24px; text-align:left; color:var(--ink); cursor:pointer; transition:.18s }
.research-card:hover { transform:translateY(-3px); box-shadow:var(--shadow); border-color:var(--accent) }
.research-card span { display:block; font-size:11.5px; font-weight:700; letter-spacing:1.3px; color:var(--accent); text-transform:uppercase; margin-bottom:10px }
.research-card h3 { font-family:var(--serif); font-size:20px; line-height:1.45; margin-bottom:10px }
.research-card p { font-size:15.5px; line-height:1.75; color:var(--ink-2); margin-bottom:16px }
.research-card small { display:block; padding-top:13px; border-top:1px solid var(--line-2); color:var(--ink-3); font-size:13.5px; line-height:1.65 }
.support-bridge { position:relative; display:grid; place-items:center; height:46px }
.support-bridge::before { content:''; position:absolute; top:0; bottom:0; left:50%; width:1px; background:#9bbbaa }
.support-bridge span { position:relative; z-index:1; padding:4px 11px; border:1px solid #bfd1c7; border-radius:999px; color:var(--green); background:#f2f7f4; font-size:11px; font-weight:700 }
.foundation-card { display:grid; grid-template-columns:180px minmax(0,1fr) minmax(220px,auto); align-items:center; gap:22px; width:100%; padding:20px 24px; border:1px solid #bcd0c3; border-top:3px solid var(--green); border-radius:var(--radius); color:var(--ink); background:linear-gradient(120deg,#eff7f2 0%,#fff 78%); text-align:left; cursor:pointer; transition:.18s }
.foundation-card:hover { border-color:var(--green); box-shadow:var(--shadow); transform:translateY(-2px) }
.foundation-card > span { color:var(--green); font-size:11px; font-weight:750; letter-spacing:.12em }
.foundation-card h3 { margin:0 0 5px; font-family:var(--serif); font-size:20px }
.foundation-card p { margin:0; color:var(--ink-2); font-size:14.5px; line-height:1.65 }
.foundation-card small { padding-left:18px; border-left:1px solid #ceded4; color:#486657; font-size:13px; line-height:1.6 }
.featured-columns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px }
.featured-column { min-width:0 }
.featured-column h3 { display:flex; align-items:center; gap:9px; margin-bottom:11px; font-family:var(--serif); font-size:18px }
.featured-column h3 .bar { width:4px; height:15px; border-radius:2px; background:var(--accent) }
.featured-list { display:grid; gap:8px }
.featured-card { display:grid; grid-template-columns:118px minmax(0,1fr) 14px; align-items:center; gap:12px; min-height:66px; border:1px solid var(--line); background:var(--surface); border-radius:9px; padding:11px 14px; text-align:left; cursor:pointer; color:var(--ink); transition:.15s }
.featured-card:hover { border-color:var(--accent); box-shadow:var(--shadow); transform:translateY(-2px) }
.featured-card span { color:var(--ink-3); font-size:12px; line-height:1.35 }
.featured-card b { font-family:var(--serif); font-size:15px; line-height:1.45 }
.featured-card i { color:var(--accent); font-size:12px; font-style:normal }
@media (max-width:980px) { .hero-layout { grid-template-columns:minmax(0,1fr) 270px; gap:32px } .featured-card { grid-template-columns:1fr 14px; gap:4px 8px } .featured-card span { grid-column:1 } .featured-card b { grid-column:1 } .featured-card i { grid-column:2; grid-row:1 / span 2 } }
@media (max-width:860px) { .hero-layout { grid-template-columns:1fr } .hero-stats { grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 20px } .hero-stats .hs:last-child { grid-column:auto } .stats-label { grid-column:1 / -1 } .application-grid { grid-template-columns:1fr } .foundation-card { grid-template-columns:1fr; gap:10px } .foundation-card small { padding:10px 0 0; border-top:1px solid #ceded4; border-left:0 } .visit-grid { grid-template-columns:repeat(2,minmax(0,1fr)) } }
@media (max-width:700px) { .hero { padding:96px 0 42px } .hero-layout { gap:28px } .hero-stats { padding:14px 16px } .hero-stats .hs { grid-template-columns:48px minmax(0,1fr); gap:7px; padding:9px 0 } .hero-stats .hs b { font-size:22px } .statement, .featured, #cv-home { padding:44px 0 } .featured-columns { grid-template-columns:1fr } .research-card { padding:20px } }
@media (max-width:520px) { .visit-grid { grid-template-columns:1fr } }
</style>
