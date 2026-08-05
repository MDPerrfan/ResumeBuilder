import { parseResumePdf, parseResumeText } from './parseResumePdf'

/** Extract plain text from a .docx (no extra deps — reads XML inside the zip). */
export async function extractDocxText(file) {
  const buffer = await file.arrayBuffer()
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
  const parts = [...raw.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1])
  if (!parts.length) {
    throw new Error('Could not read this Word file. Save as .docx or upload a PDF.')
  }
  return parts.join(' ')
}

/** Parse PDF or DOCX into structured resume data. */
export async function parseResumeFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return parseResumePdf(file)
  if (name.endsWith('.docx')) {
    const text = await extractDocxText(file)
    return parseResumeText(text)
  }
  throw new Error('Supported formats: PDF and DOCX')
}
