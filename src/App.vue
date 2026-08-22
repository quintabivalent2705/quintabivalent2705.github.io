<template>
  <a class="skip-link" href="#main-content">{{ t('skip') }}</a>
  <header class="topbar" @keydown.esc="menuOpen = false">
    <div class="wrap">
      <button class="brand" type="button" :aria-label="t('homeAria')" @click="$router.push('/')">
        <span>王潇霈</span> <em>Wang Xiaopei</em>
      </button>
      <nav class="nav nav-desktop" :aria-label="t('navAria')">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</router-link>
      </nav>
      <div class="topbar-actions">
        <div class="language-switch" role="group" :aria-label="t('languageAria')">
          <button type="button" :class="{ active: locale === 'zh' }" :aria-pressed="locale === 'zh'" @click="setLocale('zh')">中</button>
          <span aria-hidden="true">/</span>
          <button type="button" :class="{ active: locale === 'en' }" :aria-pressed="locale === 'en'" @click="setLocale('en')">EN</button>
          <span aria-hidden="true">/</span>
          <button type="button" :class="{ active: locale === 'vi' }" :aria-pressed="locale === 'vi'" @click="setLocale('vi')">VI</button>
        </div>
        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="t('menuAria')" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
        </button>
      </div>
      <nav v-if="menuOpen" id="mobile-nav" class="nav nav-mobile" :aria-label="t('mobileNavAria')">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" @click="menuOpen = false">{{ item.label }}</router-link>
      </nav>
    </div>
  </header>
  <main id="main-content">
    <router-view />
  </main>
  <footer>
    <div class="wrap">
      <div>© {{ year }} <b>王潇霈 Wang Xiaopei</b> · {{ t('footer.role') }}</div>
      <div class="flinks">
        <a :href="`mailto:${D.basic.email_academic}`">✉ {{ D.basic.email_academic }}</a>
        <span v-if="D.basic.location">📍 {{ basicLocation }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { D } from './utils.js'
import { locale, setLocale, t, lBasic } from './i18n_20260822-1705-UTC+0700.js'
const year = new Date().getFullYear()
const menuOpen = ref(false)
const route = useRoute()
const basicLocation = computed(() => lBasic('location') || D.basic.location)
const navItems = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/directions', label: t('nav.directions') },
  { to: '/projects', label: t('nav.projects') },
  { to: '/outputs', label: t('nav.outputs') },
  { to: '/partners', label: t('nav.partners') }
])
watch([locale, () => route.fullPath], () => {
  const key = route.meta?.titleKey || 'page.home'
  document.title = `${t(key)} · 王潇霈 Wang Xiaopei`
}, { immediate: true })
</script>
