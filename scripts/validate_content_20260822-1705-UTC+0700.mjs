import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('content/site_content_20260822-1705-UTC+0700.md')
const raw = fs.readFileSync(file, 'utf8')

function readJsonBlock(blockName) {
  const start = `<!-- ${blockName}:start -->`
  const end = `<!-- ${blockName}:end -->`
  const from = raw.indexOf(start)
  const to = raw.indexOf(end)
  if (from < 0 || to < 0 || to <= from) throw new Error(`Missing content block: ${blockName}`)
  const match = raw.slice(from + start.length, to).match(/```json\s*([\s\S]*?)\s*```/i)
  if (!match) throw new Error(`Missing JSON fence: ${blockName}`)
  return JSON.parse(match[1])
}

const data = readJsonBlock('site-data-zh')
const english = readJsonBlock('site-data-en')
const vietnamese = readJsonBlock('site-data-vi')

function requireOnlyKeys(label, value, allowed) {
  const extras = Object.keys(value || {}).filter(key => !allowed.includes(key))
  if (extras.length) throw new Error(`${label} contains fields not used by the public site: ${extras.join(', ')}`)
}

requireOnlyKeys('site-data-zh', data, ['basic', 'directions', 'projects', 'results', 'kernels', 'partners', 'stats'])
requireOnlyKeys('site-data-zh.basic', data.basic, ['identity', 'location', 'email_academic', 'orcid', 'roles', 'education', 'career'])
if (!/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(data.basic.orcid || '')) throw new Error('site-data-zh.basic.orcid must be a valid HTTPS ORCID URL')
data.basic.education.forEach((item, index) => requireOnlyKeys(`site-data-zh.basic.education[${index}]`, item, ['time', 'school', 'degree', 'advisor', 'topic']))
data.basic.career.forEach((item, index) => requireOnlyKeys(`site-data-zh.basic.career[${index}]`, item, ['time', 'org', 'role']))
data.directions.forEach(item => requireOnlyKeys(`direction ${item.id}`, item, ['id', 'name', 'domain', 'scope', 'core']))
data.projects.forEach(item => requireOnlyKeys(`project ${item.id}`, item, ['id', 'name', 'category', 'time', 'client', 'role', 'tech', 'work', 'public', 'direction', 'directions', 'results']))
data.results.forEach(item => requireOnlyKeys(`result ${item.name}`, item, ['name', 'type', 'status', 'public', 'date', 'kernel', 'role', 'projects', 'directions', 'pkg', 'publicReference']))
data.kernels.forEach(item => requireOnlyKeys(`kernel ${item.id}`, item, ['id', 'name', 'results', 'directions', 'projectNames', 'count']))
data.partners.forEach(item => requireOnlyKeys(`partner ${item.name}`, item, ['type', 'name', 'en', 'city', 'badge', 'color', 'note']))
requireOnlyKeys('site-data-zh.stats', data.stats, ['projectTotal', 'projectEng', 'projectRnd'])
const requiredArrays = ['directions', 'projects', 'results', 'partners']
requiredArrays.forEach(key => {
  if (!Array.isArray(data[key])) throw new Error(`site-data-zh.${key} must be an array`)
})
if (!data.basic || typeof data.basic !== 'object') throw new Error('site-data-zh.basic is required')

const duplicateIds = data.projects.map(item => item.id).filter((id, index, all) => all.indexOf(id) !== index)
if (duplicateIds.length) throw new Error(`Duplicate project IDs: ${[...new Set(duplicateIds)].join(', ')}`)

const projectNames = new Set(data.projects.map(item => item.name))
const resultNames = new Set(data.results.map(item => item.name))
const directionIds = new Set(data.directions.map(item => item.id))
const errors = []

data.projects.forEach(project => {
  if (!project.id || !project.name) errors.push('Every project requires id and name')
  if (!['可公开', '脱敏公开'].includes(project.public)) errors.push(`${project.id}: project is not approved for public display`)
  if (project.public !== '可公开' && project.client) errors.push(`${project.id}: a de-identified project must not retain a client field`)
  if (project.direction && !directionIds.has(project.direction)) errors.push(`${project.id}: unknown direction ${project.direction}`)
  ;(project.results || []).forEach(name => {
    if (!resultNames.has(name)) errors.push(`${project.id}: unknown result ${name}`)
  })
})

data.results.forEach(result => {
  if (result.public !== '可公开') errors.push(`${result.name}: result is not approved for public display`)
  ;(result.projects || []).forEach(name => {
    if (!projectNames.has(name)) errors.push(`${result.name}: unknown project ${name}`)
  })
})

const cjk = /[\u3400-\u9fff]/
function validateOverlay(label, overlay) {
  requireOnlyKeys(label, overlay, ['basic', 'directions', 'kernels', 'results', 'projects', 'partners'])
  requireOnlyKeys(`${label}.basic`, overlay.basic, ['identity', 'location', 'roles', 'education', 'career'])
  Object.entries(overlay.basic.education || {}).forEach(([key, value]) => requireOnlyKeys(`${label}.basic.education.${key}`, value, ['school', 'degree', 'advisor', 'topic']))
  Object.entries(overlay.basic.career || {}).forEach(([key, value]) => requireOnlyKeys(`${label}.basic.career.${key}`, value, ['org', 'context', 'role']))
  Object.keys(overlay.projects || {}).forEach(id => {
    if (!data.projects.some(project => project.id === id)) errors.push(`${label} translation has unknown project ID ${id}`)
    requireOnlyKeys(`${label}.projects.${id}`, overlay.projects[id], ['name', 'work'])
  })

  Object.keys(overlay.results || {}).forEach(name => {
    if (!resultNames.has(name)) errors.push(`${label} translation has unknown result ${name}`)
    requireOnlyKeys(`${label}.results.${name}`, overlay.results[name], ['name', 'publicReference', 'kernel'])
  })

  data.projects.forEach(project => {
    const translation = overlay.projects?.[project.id]
    if (!translation?.name) errors.push(`Missing ${label} project title: ${project.id}`)
    if (project.work && !translation?.work) errors.push(`Missing ${label} project description: ${project.id}`)
  })

  data.results.forEach(result => {
    const translation = overlay.results?.[result.name]
    if (!translation?.name) errors.push(`Missing ${label} result title: ${result.name}`)
    ;['name', 'publicReference', 'kernel'].forEach(field => {
      if (translation?.[field] && cjk.test(translation[field])) errors.push(`Chinese text remains in ${label} result ${field}: ${result.name}`)
    })
  })

  data.directions.forEach(direction => {
    const translation = overlay.directions?.[direction.id]
    if (translation) requireOnlyKeys(`${label}.directions.${direction.id}`, translation, ['name', 'domain', 'scope', 'core'])
    ;['name', 'domain', 'scope', 'core'].forEach(field => {
      if (!translation?.[field]) errors.push(`Missing ${label} direction ${field}: ${direction.id}`)
    })
  })

  data.partners.forEach(partner => {
    const translation = overlay.partners?.[partner.name]
    if (translation) requireOnlyKeys(`${label}.partners.${partner.name}`, translation, ['name', 'city', 'note'])
    ;['name', 'city', 'note'].forEach(field => {
      if (!translation?.[field]) errors.push(`Missing ${label} partner ${field}: ${partner.name}`)
    })
  })
}

function collectStringValues(value, path = '', output = []) {
  if (typeof value === 'string') output.push([path, value])
  else if (Array.isArray(value)) value.forEach((item, index) => collectStringValues(item, `${path}[${index}]`, output))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => collectStringValues(item, path ? `${path}.${key}` : key, output))
  return output
}

validateOverlay('English', english)
validateOverlay('Vietnamese', vietnamese)

collectStringValues(vietnamese).forEach(([path, value]) => {
  if (cjk.test(value)) errors.push(`Chinese text remains in Vietnamese value ${path}`)
})

if (errors.length) throw new Error(`Content validation failed:\n- ${errors.join('\n- ')}`)
console.log(`Content OK: ${data.projects.length} projects, ${data.results.length} outputs, ${data.directions.length} directions, ${data.partners.length} partners.`)
