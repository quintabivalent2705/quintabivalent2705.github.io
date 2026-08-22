<template>
  <div class="page partners-page">
    <div class="wrap">
      <button class="back-btn" @click="$router.push('/')">{{ t('backHome') }}</button>

      <div class="page-head">
        <div class="kicker">{{ t('kicker.collaborationNetwork') }}</div>
        <h1>{{ t('partners.title') }}</h1>
        <div class="sub">{{ t('partners.intro') }}</div>
        <div class="meta-row">
          <span>{{ t('partners.universities') }} <b>{{ universities.length }}</b></span>
          <span>{{ t('partners.institutions') }} <b>{{ institutions.length }}</b></span>
        </div>
      </div>

      <section class="partner-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker">{{ t('kicker.universities') }}</div>
            <h2>{{ t('partners.universities') }}</h2>
            <p>{{ t('partners.uniIntro') }}</p>
          </div>
          <span class="section-count">{{ universities.length }} {{ t('partners.uniUnit') }}</span>
        </div>

        <div class="university-grid">
          <article v-for="p in universities" :key="p.name" class="university-card">
            <div class="university-logo-frame" :style="{ background: p.color }">
              <span class="logo-fallback">{{ p.badge }}</span>
              <img v-if="logoFor(p.name)" :src="logoFor(p.name)" :alt="`${lPartner(p, 'name')} ${t('partners.logoAlt')}`">
            </div>
            <div class="partner-copy">
              <div class="card-meta">{{ lPartner(p, 'city') }}<template v-if="p.time"> · {{ dateLabel(p.time) }}</template></div>
              <h3>{{ lPartner(p, 'name') }}</h3>
              <div v-if="locale === 'zh'" class="en-name">{{ p.en }}</div>
              <template v-if="p.time">
                <div class="partner-role">{{ partnerExperience(p).role }}</div>
                <p v-if="partnerExperience(p).detail">{{ partnerExperience(p).detail }}</p>
              </template>
              <p v-else>{{ lPartner(p, 'note') }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="partner-section institution-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker green">{{ t('kicker.institutions') }}</div>
            <h2>{{ t('partners.institutions') }}</h2>
            <p>{{ t('partners.instIntro') }}</p>
          </div>
          <span class="section-count green">{{ institutions.length }} {{ t('partners.instUnit') }}</span>
        </div>

        <div class="institution-grid">
          <article v-for="p in institutions" :key="p.name" class="institution-card">
            <div class="institution-badge" :style="{ background: p.color }">{{ p.badge }}</div>
            <div class="partner-copy">
              <div class="card-meta">{{ lPartner(p, 'city') }}</div>
              <h3>{{ lPartner(p, 'name') }}</h3>
              <p>{{ lPartner(p, 'note') }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { D } from '../utils.js'
import { t, locale, lPartner, dateLabel } from '../i18n_20260822-1705-UTC+0700.js'

import umLogo from '../assets/university-logos_20260810-1016-UTC+0700/um_logo_20260810-1019-UTC+0700.png'
import utokyoLogo from '../assets/university-logos_20260810-1016-UTC+0700/utokyo_logo_20260810-1019-UTC+0700.png'
import hustLogo from '../assets/university-logos_20260810-1016-UTC+0700/hust_logo_20260810-1019-UTC+0700.png'
import ntuLogo from '../assets/university-logos_20260810-1016-UTC+0700/ntu_logo_20260810-1019-UTC+0700.svg'
import tsinghuaLogo from '../assets/university-logos_20260810-1016-UTC+0700/tsinghua_logo_20260810-1019-UTC+0700.png'

const logos = {
  '马来亚大学': umLogo,
  '东京大学': utokyoLogo,
  '河内理工大学': hustLogo,
  '国立台湾大学': ntuLogo,
  '清华大学': tsinghuaLogo
}

const universities = computed(() => D.partners.filter(p => p.type === '高校'))
const institutions = computed(() => D.partners.filter(p => p.type === '合作机构'))
const logoFor = name => logos[name]
const partnerExperience = partner => {
  const [role, ...detail] = lPartner(partner, 'note').split(' · ')
  return { role, detail: detail.join(' · ') }
}
</script>

<style scoped>
.partners-page { padding-bottom:56px }
.partner-section { margin-top:30px }
.institution-section { margin-top:38px; padding-top:30px; border-top:1px solid var(--line) }
.section-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:16px }
.section-kicker { color:var(--accent); font-size:10.5px; font-weight:750; letter-spacing:.14em }
.section-kicker.green { color:var(--green) }
.section-heading h2 { margin:3px 0 3px; font-family:var(--serif); font-size:24px; line-height:1.35 }
.section-heading p { margin:0; color:var(--ink-2); font-size:14px; line-height:1.55 }
.section-count { flex:none; padding:5px 10px; border-radius:999px; color:var(--accent); background:var(--accent-soft); font-size:12px; font-weight:700 }
.section-count.green { color:var(--green); background:var(--green-soft) }
.university-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }
.university-card { display:grid; grid-template-columns:82px minmax(0,1fr); gap:13px; min-height:150px; padding:15px; border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); box-shadow:0 3px 12px rgba(25,49,70,.035) }
.university-logo-frame { position:relative; display:grid; place-items:center; width:82px; height:68px; overflow:hidden; border:1px solid #e1e6eb; border-radius:8px; background:#fff !important }
.university-logo-frame img { position:absolute; inset:7px; width:calc(100% - 14px); height:calc(100% - 14px); object-fit:contain; background:#fff }
.logo-fallback { color:#8794a0; font-size:14px; font-weight:750 }
.partner-copy { min-width:0 }
.card-meta { color:var(--ink-3); font-size:11.5px; line-height:1.4 }
.partner-copy h3 { margin:3px 0 2px; color:var(--ink); font-family:var(--serif); font-size:16.5px; line-height:1.38 }
.en-name { color:var(--ink-3); font-size:11.5px; line-height:1.35 }
.partner-role { display:inline-block; margin-top:7px; padding:3px 7px; border-radius:5px; color:var(--accent); background:var(--accent-soft); font-size:11.5px; font-weight:750; line-height:1.4 }
.partner-copy p { margin:7px 0 0; color:var(--ink-2); font-size:13px; line-height:1.5 }
.institution-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px }
.institution-card { display:grid; grid-template-columns:62px minmax(0,1fr); align-items:center; gap:15px; min-height:112px; padding:16px 18px; border:1px solid #cedbd4; border-radius:var(--radius); background:linear-gradient(145deg,#fff 0%,#f4f8f6 100%) }
.institution-badge { display:grid; place-items:center; width:62px; height:62px; border-radius:10px; color:#fff; font-size:10px; font-weight:800; letter-spacing:.04em }
.institution-card .partner-copy h3 { font-size:17px }
@media (max-width:1000px) { .university-grid { grid-template-columns:repeat(2,minmax(0,1fr)) } }
@media (max-width:720px) { .partners-page { padding-bottom:42px } .partner-section { margin-top:24px } .institution-section { margin-top:30px; padding-top:24px } .section-heading { align-items:flex-start; flex-direction:column; gap:9px } .university-grid, .institution-grid { grid-template-columns:1fr } .university-card { min-height:0 } }
@media (max-width:420px) { .university-card { grid-template-columns:72px minmax(0,1fr); padding:14px } .university-logo-frame { width:72px; height:62px } .institution-card { grid-template-columns:52px minmax(0,1fr); padding:14px } .institution-badge { width:52px; height:52px; font-size:9px } }
</style>
