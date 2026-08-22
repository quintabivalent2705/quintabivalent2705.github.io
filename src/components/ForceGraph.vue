<template>
  <div class="graph-box">
    <div v-if="nodes.length" ref="scrollEl" class="graph-scroll" tabindex="0" :aria-label="t('graph.scrollAria')">
      <svg class="graph-svg" :style="{ minWidth: `${minWidth}px` }" :viewBox="`0 0 ${W} ${H}`" xmlns="http://www.w3.org/2000/svg" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="dragging=null" @mouseleave="dragging=null">
        <rect :width="W" :height="H" rx="10" fill="#f6f8fa"/>
        <line v-for="e in edges" :key="e.source+'__'+e.target" class="graph-edge"
          :data-e="e.source+'__'+e.target"
          :x1="nodeMap[e.source]?.x" :y1="nodeMap[e.source]?.y"
          :x2="nodeMap[e.target]?.x" :y2="nodeMap[e.target]?.y"
          :style="{opacity: edgeDim.get(e.source+'__'+e.target) ?? 0.32}"/>
        <g v-for="n in nodes" :key="n.id" class="graph-node"
          :data-n="n.id" :data-route="n.route||''"
          :tabindex="n.route ? 0 : undefined" :role="n.route ? 'link' : undefined"
          :aria-label="n.route ? t('graph.view', { label: publicLabel(n) }) : publicLabel(n)"
          :transform="`translate(${n.x},${n.y})`"
          :style="{opacity: nodeDim.get(n.id) ?? 1, cursor: n.route?'pointer':'default'}"
          @mouseenter="onHover(n)" @mouseleave="onUnhover"
          @focus="onHover(n)" @blur="onUnhover"
          @click="openNode(n)" @keydown.enter.prevent="openNode(n)" @keydown.space.prevent="openNode(n)">
          <circle :r="n.r" :fill="GRAPH_COLORS[n.type]" opacity="0.94"/>
          <circle :r="n.r" fill="none" stroke="#fff" stroke-width="2"/>
          <text :y="n.r + 16" text-anchor="middle" class="graph-label">
            <tspan v-for="(line, lineIndex) in labelLines(n)" :key="lineIndex" x="0" :dy="lineIndex ? 14 : 0">{{ line }}</tspan>
          </text>
        </g>
      </svg>
    </div>
    <div v-else class="empty-note">{{ t('graph.empty') }}</div>
    <div class="graph-legend">
      <span class="gl"><i :style="{background: GRAPH_COLORS.claim}"></i>{{ t('graph.claim') }}</span>
      <span class="gl"><i :style="{background: GRAPH_COLORS.base}"></i>{{ t('graph.base') }}</span>
      <span class="gl"><i :style="{background: GRAPH_COLORS.direction}"></i>{{ t('graph.direction') }}</span>
      <span class="gl"><i :style="{background: GRAPH_COLORS.result}"></i>{{ t('graph.output') }}</span>
      <span class="gl"><i :style="{background: GRAPH_COLORS.project}"></i>{{ t('graph.project') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { buildGraphData, layeredLayout, GRAPH_COLORS } from '../graph.js'
import { t, locale } from '../i18n_20260822-1705-UTC+0700.js'

const props = defineProps({
  scope: { type: String, default: 'all' },
  h: { type: Number, default: 440 },
  minWidth: { type: Number, default: 780 }
})
const W = 880
const H = computed(() => props.h)
const nodes = ref([])
const edges = ref([])
const nodeMap = ref({})
const nodeDim = ref(new Map())
const edgeDim = ref(new Map())
const dragging = ref(null)
const scrollEl = ref(null)

function centerScrollableGraph() {
  nextTick(() => {
    const el = scrollEl.value
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  })
}

function render() {
  const data = buildGraphData(props.scope)
  if (!data.nodes.length) { nodes.value = []; edges.value = []; return }
  layeredLayout(data.nodes, data.edges, W, H.value)
  nodes.value = data.nodes
  edges.value = data.edges
  nodeMap.value = {}
  data.nodes.forEach(n => { nodeMap.value[n.id] = n })
  // 邻接表
  const adj = {}
  data.edges.forEach(e => {
    ;(adj[e.source] = adj[e.source] || []).push(e.target)
    ;(adj[e.target] = adj[e.target] || []).push(e.source)
  })
  window.__adj = adj
  centerScrollableGraph()
}

function onHover(n) {
  const adj = window.__adj || {}
  const neigh = new Set(adj[n.id] || [])
  neigh.add(n.id)
  const nd = new Map(), ed = new Map()
  nodes.value.forEach(m => nd.set(m.id, neigh.has(m.id) ? 1 : 0.15))
  edges.value.forEach(e => {
    ed.set(e.source + '__' + e.target, (e.source === n.id || e.target === n.id) ? 0.85 : 0.06)
  })
  nodeDim.value = nd; edgeDim.value = ed
}
function onUnhover() {
  nodeDim.value = new Map()
  edgeDim.value = new Map()
}
function publicLabel(n) {
  if (n.type !== 'project') return n.label
  return t('graph.representativeProject', { count: nodes.value.filter(x => x.type === 'project').indexOf(n) + 1 })
}
function labelLines(n) {
  const label = publicLabel(n)
  const lineLength = n.type === 'claim' ? 12 : 8
  if (label.length <= lineLength) return [label]
  const second = label.slice(lineLength, lineLength * 2)
  return [label.slice(0, lineLength), second + (label.length > lineLength * 2 ? '…' : '')]
}
function openNode(n) {
  if (n.route) window.location.hash = n.route.replace(/^#/, '')
}
function onMouseDown(e) {
  const t = e.target.closest('.graph-node')
  if (!t) return
  const n = nodes.value.find(x => x.id === t.dataset.n)
  if (!n) return
  dragging.value = { n, dx: e.offsetX - n.x, dy: e.offsetY - n.y }
}
function onMouseMove(e) {
  if (!dragging.value) return
  const d = dragging.value
  d.n.x = e.offsetX - d.dx
  d.n.y = e.offsetY - d.dy
}

watch([() => props.scope, locale], render)
onMounted(render)
</script>

<style scoped>
.graph-box { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow) }
.graph-scroll { overflow-x: auto; border-radius: 9px; scrollbar-color: #bac8d4 #eef2f5; scrollbar-width: thin }
.graph-scroll:focus-visible { outline: 3px solid rgba(26,75,140,.22); outline-offset: 3px }
.graph-svg { width: 100%; height: auto; display: block }
.graph-edge { stroke: #aebdca; stroke-width: 1.2; transition: opacity .2s }
.graph-label { font-size: 11.5px; fill: #3f4d5a; font-family: var(--sans); pointer-events: none; font-weight: 650; paint-order: stroke; stroke: #f6f8fa; stroke-width: 4px; stroke-linejoin: round }
.graph-node { transition: opacity .2s }
.graph-legend { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 12px; font-size: 12px; color: var(--ink-2) }
.gl { display: inline-flex; align-items: center; gap: 6px }
.gl i { width: 10px; height: 10px; border-radius: 50%; display: inline-block }
.empty-note { color: var(--ink-3); font-size: 13px; padding: 24px 0; text-align: center }
@media (max-width: 720px) {
  .graph-box { padding: 10px }
  .graph-legend { justify-content: flex-start; gap: 10px 14px; font-size: 11.5px }
}
</style>
