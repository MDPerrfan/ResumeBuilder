import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const normalize = (value = '') => value.replace(/\s+/g, ' ').trim()

const splitList = (value = '') =>
  value
    .split(/[,|•]/)
    .map((item) => item.trim())
    .filter(Boolean)

const monthMap = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
}

const toMonthInput = (raw = '') => {
  const value = normalize(raw)
  const numeric = value.match(/(19|20)\d{2}[-/.](0?[1-9]|1[0-2])/)
  if (numeric) return `${numeric[1]}-${numeric[2].padStart(2, '0')}`

  const word = value.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,-]*(19|20)\d{2}/i
  )
  if (!word) return ''
  const mm = monthMap[word[1].slice(0, 3).toLowerCase()]
  const yy = word[2]
  return `${yy}-${mm}`
}

const pick = (text, regex) => {
  const match = text.match(regex)
  return match?.[1] ? normalize(match[1]) : ''
}

const sectionBlock = (text, title, nextTitles) => {
  const next = nextTitles.length ? `(?=\\n(?:${nextTitles.join('|')})\\b|$)` : '$'
  const regex = new RegExp(
    `(?:^|\\n)(?:${title})\\s*:?[ \\t]*(?:\\n|[-|]\\s*)([\\s\\S]*?)${next}`,
    'i'
  )
  const match = text.match(regex)
  return normalize(match?.[1] || '')
}

export const parseResumeText = (text) => {
  const cleaned = text.replace(/\r/g, '')
  const lines = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const firstLine = lines[0] || ''
  const email = pick(cleaned, /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)
  const phone = pick(cleaned, /(\+?\d[\d\s\-()]{8,}\d)/)
  const linkedin = pick(cleaned, /(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/i)
  const website = pick(
    cleaned,
    /(https?:\/\/(?!www\.linkedin\.com)[^\s]+|www\.(?!linkedin\.com)[^\s]+)/i
  )

  const summarySection =
    sectionBlock(cleaned, 'Professional Summary|Summary|Profile', [
      'Experience',
      'Work Experience',
      'Education',
      'Skills',
      'Projects',
    ])

  const skillsText = sectionBlock(cleaned, 'Skills|Technical Skills|Core Skills', [
    'Experience',
    'Work Experience',
    'Education',
    'Projects',
  ])

  const experienceText = sectionBlock(cleaned, 'Experience|Work Experience', [
    'Education',
    'Skills',
    'Projects',
  ])

  const experience = experienceText
    ? experienceText
        .split(/\n(?=[A-Z][^\n]{2,60}\s[-|,]\s[A-Z])/)
        .slice(0, 3)
        .map((chunk) => {
          const row = normalize(chunk)
          const titleCompany =
            row.match(/^(.{2,60}?)\s[-|,]\s(.{2,60}?)(?:\s|$)/) || []
          const dateRange =
            row.match(
              /((?:\w+\s+\d{4}|\d{4}[-/]\d{2}))\s*(?:-|to)\s*(Present|Current|(?:\w+\s+\d{4}|\d{4}[-/]\d{2}))/i
            ) || []
          return {
            company: titleCompany[2] || '',
            position: titleCompany[1] || '',
            start_date: toMonthInput(dateRange[1] || ''),
            end_date: /present|current/i.test(dateRange[2] || '')
              ? ''
              : toMonthInput(dateRange[2] || ''),
            description: row,
            is_current: /present|current/i.test(dateRange[2] || ''),
          }
        })
        .filter((item) => item.company || item.position || item.description)
    : []

  const summaryFallback = (() => {
    const blocked = /^(skills?|experience|work experience|education|projects?|certifications?)[:\s-]*$/i
    const candidates = lines
      .filter((line) => line.length > 40 && line.length < 280 && !blocked.test(line))
      .slice(0, 3)
      .join(' ')
    return normalize(candidates)
  })()

  const skillsFallback = (() => {
    const joined = lines.join(' | ')
    const directList = joined.match(
      /(?:skills?|technical skills|core skills)\s*:?\s*([A-Za-z0-9+.#,\-/| ]{20,300})/i
    )?.[1]
    if (directList) return splitList(directList)
    const fromCommaLines = lines
      .filter((line) => line.includes(',') && line.length < 160)
      .flatMap((line) => splitList(line))
    return [...new Set(fromCommaLines)].slice(0, 15)
  })()

  const experienceFallback = (() => {
    const rows = lines.filter((line) =>
      /(?:\w+\s+\d{4}|\d{4}[-/]\d{2})\s*(?:-|to)\s*(?:present|current|\w+\s+\d{4}|\d{4}[-/]\d{2})/i.test(
        line
      )
    )
    return rows.slice(0, 3).map((row) => ({
      company: '',
      position: '',
      start_date: toMonthInput(row.split(/-|to/i)[0] || ''),
      end_date: /present|current/i.test(row) ? '' : toMonthInput(row.split(/-|to/i)[1] || ''),
      description: row,
      is_current: /present|current/i.test(row),
    }))
  })()

  const fullNameGuess =
    firstLine &&
    !/@/.test(firstLine) &&
    firstLine.length < 60 &&
    /^[A-Za-z][A-Za-z\s.'-]+$/.test(firstLine)
      ? firstLine
      : ''

  return {
    title: fullNameGuess ? `${fullNameGuess}'s Resume` : 'Uploaded Resume',
    personal_info: {
      full_name: fullNameGuess,
      email,
      phone,
      website: website.replace(/^www\./i, 'https://www.'),
      linkedin,
      profession: lines[1] || '',
    },
    professional_summary: summarySection || summaryFallback,
    skills: splitList(skillsText).length ? splitList(skillsText) : skillsFallback,
    experience: experience.length ? experience : experienceFallback,
  }
}

export const parseResumePdf = async (file) => {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const lineMap = new Map()

    content.items.forEach((item) => {
      const y = Math.round(item.transform?.[5] || 0)
      const x = item.transform?.[4] || 0
      const key = String(y)
      if (!lineMap.has(key)) lineMap.set(key, [])
      lineMap.get(key).push({ text: item.str, x })
    })

    const sortedY = [...lineMap.keys()].map(Number).sort((a, b) => b - a)
    const pageLines = sortedY.map((y) =>
      lineMap
        .get(String(y))
        .sort((a, b) => a.x - b.x)
        .map((piece) => piece.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    )

    pages.push(pageLines.filter(Boolean).join('\n'))
  }

  return parseResumeText(pages.join('\n'))
}
