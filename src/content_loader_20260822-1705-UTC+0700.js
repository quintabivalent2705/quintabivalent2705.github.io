import rawContent from '../content/site_content_20260822-1705-UTC+0700.md?raw'

function readJsonBlock(blockName) {
  const start = `<!-- ${blockName}:start -->`
  const end = `<!-- ${blockName}:end -->`
  const from = rawContent.indexOf(start)
  const to = rawContent.indexOf(end)
  if (from < 0 || to < 0 || to <= from) {
    throw new Error(`Content block not found: ${blockName}`)
  }
  const section = rawContent.slice(from + start.length, to)
  const match = section.match(/```json\s*([\s\S]*?)\s*```/i)
  if (!match) throw new Error(`JSON fence not found in content block: ${blockName}`)
  return JSON.parse(match[1])
}

export const SITE_DATA = readJsonBlock('site-data-zh')
export const SITE_EN = readJsonBlock('site-data-en')
export const SITE_VI = readJsonBlock('site-data-vi')
