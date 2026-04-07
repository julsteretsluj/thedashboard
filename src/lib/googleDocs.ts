/** Google Docs URL helpers for embed (preview) vs edit. */

const DOC_ID_IN_PATH = /\/document\/d\/([a-zA-Z0-9-_]+)/
const OPEN_ID_PARAM = /[?&]id=([a-zA-Z0-9-_]+)/

export function extractGoogleDocId(raw: string): string | null {
  const url = raw.trim()
  const m = url.match(DOC_ID_IN_PATH)
  if (m) return m[1]
  const open = url.match(OPEN_ID_PARAM)
  if (open && url.includes('docs.google.com')) return open[1]
  return null
}

export function normalizeGoogleDocEditUrl(raw: string): string | null {
  const id = extractGoogleDocId(raw)
  if (!id) return null
  return `https://docs.google.com/document/d/${id}/edit`
}

/** Iframe-friendly view (works when the doc is shared with link viewers). */
export function googleDocPreviewUrl(raw: string): string | null {
  const id = extractGoogleDocId(raw)
  if (!id) return null
  return `https://docs.google.com/document/d/${id}/preview`
}

export function isGoogleDocsUrl(raw: string): boolean {
  return extractGoogleDocId(raw) !== null
}
