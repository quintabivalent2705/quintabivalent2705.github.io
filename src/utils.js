// 通用工具与数据辅助函数（从 V6 版提取重写，Vue 组件共用）
import { SITE_DATA } from './data.js'
import { isNonChinese, lDirection, lProject, statusFullLabel, roleLabel, englishKernelLabel } from './i18n_20260822-1705-UTC+0700.js'

export const D = SITE_DATA

// ---------- 转义 ----------
export const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))

// ---------- 方向名称 ----------
export const dirName = d => {
  const name = lDirection(d, 'name') || ''
  return name.includes('｜') ? name.split('｜')[1] : name.includes('|') ? name.split('|').slice(1).join('|').trim() : name
}
export const dirShort = d => {
  const n = dirName(d)
  const parts = n.split(/[、与及,，]/)[0]
  const limit = isNonChinese.value ? 18 : 6
  return parts.length > limit ? parts.slice(0, limit) + '…' : parts
}

// ---------- 时间简化：'2024年1月1日 → 2024年12月31日' → '2024' / '2023–2024' ----------
export const timeShort = t => {
  const ys = (t || '').match(/\d{4}/g) || []
  if (ys.length >= 2) return ys[0] === ys[ys.length - 1] ? ys[0] : ys[0] + '–' + ys[ys.length - 1]
  return ys[0] || t
}

// ---------- 成果内核主题：'K-A1-HUMID｜PEMFC主动加湿…' → 'PEMFC主动加湿…'（去掉内部编码前缀） ----------
export const kernelLabel = k => {
  if (!k) return ''
  if (isNonChinese.value) return englishKernelLabel(k)
  const i = k.indexOf('｜')
  return i > 0 ? k.slice(i + 1) : k
}

// ---------- 文本链接化：CN 专利号 → Google Patents、DOI → doi.org、URL → 链接 ----------
export function linkify(text) {
  if (!text) return ''
  let t = esc(text)
  const tokens = []
  const stash = s => { tokens.push(s); return '\u0001' + (tokens.length - 1) + '\u0002' }
  t = t.replace(/\b(10\.\d{4,9}\/[-._;()\/:A-Za-z0-9]+)/g, (m, d) => stash(`<a href="https://doi.org/${d}" target="_blank" rel="noopener">${d}</a>`))
  t = t.replace(/\b(CN\d{6,12}(?:\.\d+)?[A-Z]?)\b/g, (m, cn) => stash(`<a href="https://patents.google.com/patent/${cn}" target="_blank" rel="noopener">${cn}</a>`))
  t = t.replace(/(https?:\/\/[^\s<>"'）)\]]+)/g, (m, u) => stash(`<a href="${u}" target="_blank" rel="noopener">${u}</a>`))
  return t.replace(/\u0001(\d+)\u0002/g, (m, i) => tokens[+i] || '')
}

// ---------- 作者角色判定 ----------
export const roleOf = r => {
  const s = (r.role || '') + ' ' + (r.contribution || '')
  if (s.includes('通讯作者')) return '通讯作者'
  const rankedAuthor = s.match(/第([一二三四五六七八九十\d]+)作者/)
  if (rankedAuthor) return `第${rankedAuthor[1]}作者`
  if (s.includes('第一发明人')) return '第一发明人'
  if (s.includes('第一作者')) return '第一作者'
  if (s.includes('第一完成人')) return '第一作者'
  if (s.includes('主要发明人')) return '主要发明人'
  if (s.includes('主要开发人')) return '主要开发人'
  return '参与'
}

// ---------- 成果类型与状态 ----------
export const typeColor = {
  '期刊论文': ['#1a4b8c', '#eef3f9'], '会议论文': ['#315f9e', '#edf2f8'],
  '会议摘要': ['#2c5f9e', '#eef3f9'], '发明专利': ['#5b4a8a', '#f1eef7'],
  '实用新型专利': ['#6b5a9a', '#f3f0f8'], '技术报告': ['#8a6a2f', '#faf5ea'],
  '数据集': ['#2f6b52', '#eef4f0'], '标准': ['#8c4a2f', '#f7efe9'],
  '教材': ['#3a6b52', '#eef4f0'], '软件著作权': ['#2f6b52', '#eef4f0']
}
export const typeOrder = ['期刊论文', '会议论文', '会议摘要', '发明专利', '实用新型专利', '软件著作权', '数据集', '技术报告', '标准', '教材']

export const statusMeta = s => s.includes('发表') ? ['已公开', '#2f6b52', '#eef4f0']
  : s.includes('授权') ? ['已授权', '#1a4b8c', '#eef3f9']
  : s.includes('录用') ? ['已录用', '#2f6b52', '#eef4f0']
  : s.includes('编制') ? ['编制中', '#8a6a2f', '#faf5ea']
  : /审核|评审/.test(s) ? ['评审中', '#8a6a2f', '#faf5ea']
  : s.includes('规划') ? ['规划', '#8a94a3', '#f0f1f3']
  : ['在途', '#8a6a2f', '#faf5ea']

export const localizedStatusMeta = s => {
  const [label, color, background] = statusMeta(s)
  if (!isNonChinese.value) return [label, color, background]
  return [statusFullLabel(label), color, background]
}

// 对外展示口径：只有已发表/公开、已授权或已录用才计入正式成果。
export const isFormalResult = r => /发表|公开|授权|录用/.test(r.status || '')
export const isInProgressResult = r => !isFormalResult(r)

// ---------- 索引 ----------
export const resByName = {}; D.results.forEach(r => { resByName[r.name] = r })
export const projByName = {}; D.projects.forEach(p => { projByName[p.name] = p })
export const dirById = {}; D.directions.forEach(d => { dirById[d.id] = d })

export const isActiveDir = (proj, dirId) =>
  proj.direction === dirId || (proj.directions || []).some(x => x.startsWith(dirId))

// ---------- 统计 ----------
export function resultCounts() {
  const formal = D.results.filter(isFormalResult)
  const count = (type, pattern) => formal.filter(r => r.type === type && (!pattern || pattern.test(r.status || ''))).length
  return {
    projectTotal: D.stats?.projectTotal ?? D.projects.length,
    projectRnd: D.stats?.projectRnd ?? D.projects.filter(p => p.category === '研发项目').length,
    projectEng: D.stats?.projectEng ?? D.projects.filter(p => p.category === '工程交付').length,
    publishedPapers: count('期刊论文', /发表|公开/) + count('会议论文', /发表|公开/),
    acceptedAbstracts: count('会议摘要', /录用|发表|公开/),
    inventionPatents: count('发明专利'),
    utilityPatents: count('实用新型专利'),
    authorizedSoftware: count('软件著作权', /授权/),
    publicData: count('数据集', /发表|公开/),
    formal: formal.length,
    inProgress: D.results.length - formal.length
  }
}

// 国际学术页面按高校官方英文地址的地理表达统一公开位置名称。
export const publicLocationText = text => String(text || '')
  .replace(/越南河内/g, '河内，越南')
  .replace(/日本东京/g, '东京，日本')
  .replace(/中国台湾台北|台湾台北/g, '台北，台湾')
  .replace(/韩国首尔/g, '首尔，韩国')

// 脱敏项目不向公开页面暴露具体委托方。
export const publicProjectClient = p => {
  if (!p?.client) return ''
  if (p.public !== '可公开') return ''
  return p.client
}

export const publicProjectText = (p, text) => {
  let output = text || ''
  if (!p || p.public === '可公开' || !p.client) return output
  p.client.split(/[、,，;；/]/).map(x => x.trim()).filter(x => x.length >= 2)
    .forEach(name => { output = output.split(name).join('合作单位') })
  return output
}

export const publicProjectName = p => publicProjectText(p, lProject(p, 'name'))
export const publicProjectWork = p => publicProjectText(p, lProject(p, 'work'))
export const localizedRoleOf = r => roleLabel(roleOf(r))
export const localizedResultStatus = r => statusFullLabel(r?.status || '')
