// 关系图谱引擎：自底向上五层归纳结构
// 项目 → 成果 → 应用方向 → 共性技术 → 学术主张
import { D, dirById, dirName, resByName, isActiveDir, publicProjectName } from './utils.js'
import { t, lKernel, resultTitle } from './i18n_20260822-1705-UTC+0700.js'

const GRAPH_COLORS = {
  claim: '#5b4a8a', base: '#0e7490', direction: '#1a4b8c', result: '#9a7b3c', project: '#2f6b52',
  kernel: '#5b4a8a' // 内核详情页（K scope）仍使用
}
export const GRAPH_BASE_COLOR = GRAPH_COLORS.base
export const GRAPH_TYPE_LABEL = { claim: '学术主张', base: '共性技术', direction: '应用方向', result: '成果', project: '项目' }

const APP_IDS = ['A1', 'A2', 'B1', 'B2']
const BASE_IDS = ['C1', 'C2']
const isBaseDir = d => (d.domain || '').includes('共性')
const dirAppsOf = r => {
  const ds = new Set((r.directions || []).map(x => x.split('｜')[0].trim()))
  if (r.pkg) ds.add(r.pkg)
  return [...ds].filter(x => APP_IDS.includes(x))
}
const dirBasesOf = r => [...new Set((r.directions || []).map(x => x.split('｜')[0].trim()))].filter(x => BASE_IDS.includes(x))

// 构建图数据：scope = 'all'（五层全景）| 'Dxx' | 'Pxx' | 'Rxx' | 'Kxx'（详情页局部）
export function buildGraphData(scope) {
  const nodes = [], edges = [], seen = new Set(), eSet = new Set()
  const addNode = (id, label, type, route) => {
    const key = type + ':' + id
    if (seen.has(key)) return key
    seen.add(key)
    nodes.push({ id: key, label, type, route, r: type === 'claim' ? 16 : type === 'base' ? 13 : type === 'direction' ? 12 : type === 'result' ? 7 : 8 })
    return key
  }
  const addEdge = (a, b) => {
    const key = a + '|' + b
    if (eSet.has(key)) return
    eSet.add(key); edges.push({ source: a, target: b })
  }
  const short = (s, n) => s.length > n ? s.slice(0, n) + '…' : s

  if (scope === 'all' || scope === 'graph' || scope === 'links') {
    // ============ 五层全景：项目 → 成果 → 应用方向 → 共性技术 → 学术主张 ============
    const claim = addNode('CLAIM', t('graph.claimText'), 'claim', '#/')
    const appNodes = {}, baseNodes = {}
    D.directions.forEach(d => {
      if (isBaseDir(d)) baseNodes[d.id] = addNode('B:' + d.id, short(dirName(d), 14), 'base', '#/direction/' + d.id)
      else appNodes[d.id] = addNode('A:' + d.id, short(dirName(d), 14), 'direction', '#/direction/' + d.id)
    })
    // 全景图只保留代表性项目与成果，避免节点过密影响阅读。
    D.directions.filter(d => !isBaseDir(d)).forEach(d => {
      D.projects.filter(p => p.direction === d.id).slice(0, 3).forEach(p => {
        const pn = addNode('P:' + p.id, short(publicProjectName(p), 10), 'project', '#/project/' + p.id)
        ;(p.results || []).filter(n => resByName[n]).slice(0, 1).forEach(n => {
          const rn = addNode('R:' + n, short(n, 9), 'result', '#/result/' + encodeURIComponent(n))
          addEdge(pn, rn)
        })
      })
    })
    // 只挂共性技术（无应用方向）的代表性成果，补进图谱
    D.results.filter(r => !dirAppsOf(r).length && dirBasesOf(r).length).slice(0, 3).forEach(r => {
      const rn = addNode('R:' + r.name, short(resultTitle(r), 9), 'result', '#/result/' + encodeURIComponent(r.name))
    })
    // L2 成果 → L3 应用方向 / 共性技术
    nodes.filter(n => n.type === 'result').forEach(n => {
      const r = resByName[n.id.slice(2)]
      if (!r) return
      const apps = dirAppsOf(r), bases = dirBasesOf(r)
      if (apps.length) apps.forEach(a => appNodes[a] && addEdge(n, appNodes[a]))
      else bases.forEach(c => baseNodes[c] && addEdge(n, baseNodes[c]))
    })
    // L3 应用方向 → L4 共性技术（该方向下项目挂接的共性方向）
    Object.keys(appNodes).forEach(did => {
      const cs = new Set()
      D.projects.filter(p => p.direction === did).forEach(p => {
        ;(p.directions || []).forEach(x => { const id = x.split('｜')[0].trim(); if (baseNodes[id]) cs.add(id) })
      })
      cs.forEach(c => addEdge(appNodes[did], baseNodes[c]))
    })
    // L3/L4 → L5 学术主张
    Object.values(appNodes).forEach(n => addEdge(n, claim))
    Object.values(baseNodes).forEach(n => addEdge(n, claim))
  } else if (scope.startsWith('D')) {
    // 方向详情页局部图
    const d = dirById[scope.slice(1)]; if (!d) return { nodes: [], edges: [] }
    const dn = addNode('D:' + d.id, short(dirName(d), 14), d.domain.includes('共性') ? 'base' : 'direction', '#/direction/' + d.id)
    if (isBaseDir(d)) {
      // 共性技术：提炼它的应用方向 + 支撑项目 + 成果
      D.directions.filter(x => !isBaseDir(x)).forEach(x => {
        const uses = D.projects.some(p => p.direction === x.id && (p.directions || []).some(s => s.startsWith(d.id)))
        if (uses) {
          const an = addNode('A:' + x.id, short(dirName(x), 14), 'direction', '#/direction/' + x.id)
          addEdge(an, dn)
        }
      })
      D.projects.filter(p => (p.directions || []).some(x => x.startsWith(d.id))).slice(0, 6).forEach(p => {
        const pn = addNode('P:' + p.id, short(publicProjectName(p), 10), 'project', '#/project/' + p.id)
        addEdge(dn, pn)
        ;(p.results || []).filter(n => resByName[n]).slice(0, 2).forEach(n => {
          const rn = addNode('R:' + n, short(n, 10), 'result', '#/result/' + encodeURIComponent(n))
          addEdge(pn, rn)
        })
      })
    } else {
      // 应用方向：支撑项目 + 提炼成果 + 提炼的共性技术
      D.projects.filter(p => p.direction === d.id).slice(0, 8).forEach(p => {
        const pn = addNode('P:' + p.id, short(publicProjectName(p), 10), 'project', '#/project/' + p.id)
        addEdge(dn, pn)
        ;(p.results || []).filter(n => resByName[n]).slice(0, 2).forEach(n => {
          const rn = addNode('R:' + n, short(n, 10), 'result', '#/result/' + encodeURIComponent(n))
          addEdge(pn, rn)
        })
      })
      const cs = new Set()
      D.projects.filter(p => p.direction === d.id).forEach(p => {
        ;(p.directions || []).forEach(x => { const id = x.split('｜')[0].trim(); if (dirById[id] && isBaseDir(dirById[id])) cs.add(id) })
      })
      cs.forEach(c => { const bn = addNode('B:' + c, short(dirName(dirById[c]), 10), 'base', '#/direction/' + c); addEdge(dn, bn) })
    }
  } else if (scope.startsWith('P')) {
    // 项目详情页局部图：项目 → 成果 + 支撑方向 + 提炼共性技术
    const p = D.projects.find(x => x.id === scope.slice(1)); if (!p) return { nodes: [], edges: [] }
    const pn = addNode('P:' + p.id, short(publicProjectName(p), 10), 'project', '#/project/' + p.id)
    ;(p.results || []).filter(n => resByName[n]).slice(0, 8).forEach(n => {
      const rn = addNode('R:' + n, short(n, 10), 'result', '#/result/' + encodeURIComponent(n))
      addEdge(pn, rn)
    })
    // 主方向（应用方向）+ 关联共性技术
    const dirIds = []
    if (p.direction && dirById[p.direction]) dirIds.push(p.direction)
    ;(p.directions || []).forEach(x => {
      const id = x.split('｜')[0].trim()
      if (dirById[id] && isBaseDir(dirById[id]) && !dirIds.includes(id)) dirIds.push(id)
    })
    dirIds.forEach(id => {
      const isB = isBaseDir(dirById[id])
      const key = (isB ? 'B:' : 'A:') + id
      const nn = nodes.find(n => n.id === key) || addNode(key, short(dirName(dirById[id]), 12), isB ? 'base' : 'direction', '#/direction/' + id)
      addEdge(nn, pn)
    })
  } else if (scope.startsWith('R')) {
    // 成果详情页局部图：成果 → 支撑方向 / 共性技术 + 支撑项目
    const name = scope.slice(1); const r = resByName[name]; if (!r) return { nodes: [], edges: [] }
    const rn = addNode('R:' + name, short(name, 12), 'result', '#/result/' + encodeURIComponent(name))
    const apps = dirAppsOf(r), bases = dirBasesOf(r)
    apps.forEach(a => { const an = addNode('A:' + a, short(dirName(dirById[a]), 12), 'direction', '#/direction/' + a); addEdge(rn, an) })
    bases.forEach(c => { const bn = addNode('B:' + c, short(dirName(dirById[c]), 10), 'base', '#/direction/' + c); addEdge(rn, bn) })
    ;(r.projects || []).map(n => D.projects.find(x => x.id === n)).filter(Boolean).slice(0, 6).forEach(p => {
      const pn = addNode('P:' + p.id, short(publicProjectName(p), 10), 'project', '#/project/' + p.id)
      addEdge(pn, rn)
    })
  } else if (scope.startsWith('K')) {
    // 内核详情页（保留原逻辑）
    const k = D.kernels.find(x => x.id === scope); if (!k) return { nodes: [], edges: [] }
    const kn = addNode('K:' + k.id, short(lKernel(k), 12), 'kernel', '#/kernels/' + k.id)
    k.directions.forEach(did => {
      const dn = addNode('D:' + did, dirById[did] ? short(dirName(dirById[did]), 10) : did, 'direction', '#/direction/' + did)
      addEdge(kn, dn)
    })
    k.results.slice(0, 8).forEach(r => {
      const rn = addNode('R:' + r.name, short(resultTitle(r), 10), 'result', '#/result/' + encodeURIComponent(r.name))
      addEdge(kn, rn)
    })
  }
  return { nodes, edges }
}

// 分层布局：自顶向下 typeOrder（claim → base → direction → result → project）
// 缺失的层不占行；节点多的层自动折行；行内缩放居中避免文字重叠
export function layeredLayout(nodes, edges, W, H) {
  const typeOrder = ['claim', 'base', 'direction', 'result', 'project']
  const maxPerRow = { claim: 1, base: 2, direction: 4, result: 6, project: 6 }
  const minGap = { claim: 0, base: 220, direction: 180, result: 125, project: 112 }

  const parents = {}
  edges.forEach(e => { (parents[e.target] = parents[e.target] || []).push(e.source) })

  const byType = {}
  nodes.forEach(n => { (byType[n.type] = byType[n.type] || []).push(n) })
  const findNode = id => nodes.find(x => x.id === id)

  const rowsOf = {}
  typeOrder.forEach(t => {
    const n = (byType[t] || []).length
    rowsOf[t] = n ? Math.max(1, Math.ceil(n / maxPerRow[t])) : 0
  })
  const totalRows = typeOrder.reduce((s, t) => s + rowsOf[t], 0)
  const topPad = 56, bottomPad = 30
  const rowGap = Math.min(88, (H - topPad - bottomPad) / Math.max(1, totalRows))
  const layerY = {}
  let cursor = topPad
  typeOrder.forEach(t => {
    if (!rowsOf[t]) { layerY[t] = -999; return }
    layerY[t] = cursor + (rowsOf[t] - 1) * rowGap / 2
    cursor += rowsOf[t] * rowGap
  })

  // 顶层均匀分布，其余层 x = 父节点均值
  const firstType = typeOrder.find(t => rowsOf[t] > 0)
  ;(byType[firstType] || []).forEach((n, i, arr) => { n.x = W * (i + 1) / (arr.length + 1); n.y = layerY[firstType] })
  typeOrder.filter(t => t !== firstType && rowsOf[t] > 0).forEach(t => {
    ;(byType[t] || []).forEach(n => {
      const ps = (parents[n.id] || []).map(id => findNode(id)).filter(Boolean)
      n.x = ps.length ? ps.reduce((s, p) => s + p.x, 0) / ps.length : W / 2
      n.y = layerY[t]
    })
  })
  // 折行：节点多的层按 x 排序折成多行
  ;['base', 'direction', 'result', 'project'].forEach(t => {
    if (!rowsOf[t]) return
    const list = (byType[t] || []).slice().sort((a, b) => a.x - b.x)
    const per = maxPerRow[t]
    const nRows = rowsOf[t]
    list.forEach((n, i) => {
      const row = Math.floor(i / per)
      const inRow = i % per
      const rowCount = (row < nRows - 1) ? per : list.length - (nRows - 1) * per
      n.x = W * (inRow + 1) / (rowCount + 1)
      n.y = layerY[t] + (row - (nRows - 1) / 2) * rowGap
    })
  })

  // 防重叠：按行分组 → 行内贪心 → 行中心平移 → 超宽缩放
  typeOrder.forEach(t => {
    const list = (byType[t] || []).slice()
    const groups = {}
    list.forEach(n => { const k = Math.round(n.y); (groups[k] = groups[k] || []).push(n) })
    Object.values(groups).forEach(g => {
      if (g.length < 2) return
      g.sort((a, b) => a.x - b.x)
      for (let i = 1; i < g.length; i++) {
        const minX = g[i - 1].x + minGap[t]
        if (g[i].x < minX) g[i].x = minX
      }
      const span = g[g.length - 1].x - g[0].x
      const center = (g[0].x + g[g.length - 1].x) / 2
      const offset = W / 2 - center
      g.forEach(n => { n.x += offset })
      if (span > W - 48) {
        const scale = (W - 48) / span
        g.forEach(n => { n.x = W / 2 + (n.x - W / 2) * scale })
      }
    })
  })
  return nodes
}

export { GRAPH_COLORS }
