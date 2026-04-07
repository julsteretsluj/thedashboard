import { useState, useEffect } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { googleDocPreviewUrl, normalizeGoogleDocEditUrl, isGoogleDocsUrl } from '../../lib/googleDocs'
import { Plus, Trash2, ExternalLink, Pencil, Check, X } from 'lucide-react'

export default function DelegatePrepGoogleDocs() {
  const { prepGoogleDocs, addPrepGoogleDoc, removePrepGoogleDoc, updatePrepGoogleDoc } = useDelegate()

  const [docName, setDocName] = useState('')
  const [docUrl, setDocUrl] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')

  useEffect(() => {
    if (prepGoogleDocs.length === 0) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !prepGoogleDocs.some((d) => d.id === selectedId)) {
      setSelectedId(prepGoogleDocs[0].id)
    }
  }, [prepGoogleDocs, selectedId])

  const selected = prepGoogleDocs.find((d) => d.id === selectedId) ?? null
  const embedUrl = selected ? googleDocPreviewUrl(selected.url) : null

  const canAdd = docName.trim().length > 0 && normalizeGoogleDocEditUrl(docUrl) !== null

  const add = () => {
    if (!canAdd) return
    addPrepGoogleDoc(docName, docUrl)
    setDocName('')
    setDocUrl('')
  }

  const startEdit = (id: string) => {
    const d = prepGoogleDocs.find((x) => x.id === id)
    if (!d) return
    setEditingId(id)
    setEditName(d.name)
    setEditUrl(d.url)
  }

  const saveEdit = () => {
    if (!editingId) return
    const norm = normalizeGoogleDocEditUrl(editUrl)
    if (!norm || !editName.trim()) return
    updatePrepGoogleDoc(editingId, { name: editName.trim(), url: norm })
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📑 Google prep documents</h2>
        <p className="text-[var(--text-muted)] text-sm max-w-3xl">
          Add each doc with a name and its Google Docs link. They are saved with your conference (sign in for sync across devices). Use the preview below to read;{' '}
          <strong className="text-[var(--text)]">Open in Google Docs</strong> opens the full editor — Google does not allow the full editor inside other websites.
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-2 max-w-3xl">
          Sharing: set each file to <strong className="text-[var(--text)]">Anyone with the link</strong> (Viewer or Editor) so the embed loads for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-4 min-w-0">
          <div className="card-block p-4 space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--accent)] shrink-0" /> Add document
            </h3>
            <div className="space-y-2">
              <label htmlFor="prep-doc-name" className="sr-only">
                Document name
              </label>
              <input
                id="prep-doc-name"
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Name (e.g. Position paper draft)"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <label htmlFor="prep-doc-url" className="sr-only">
                Google Docs link
              </label>
              <input
                id="prep-doc-url"
                type="url"
                inputMode="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://docs.google.com/document/d/…"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {docUrl.trim() && !isGoogleDocsUrl(docUrl) && (
                <p className="text-xs text-[var(--danger)]">That doesn&apos;t look like a Google Docs link.</p>
              )}
              <button
                type="button"
                onClick={add}
                disabled={!canAdd}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Add to profile
              </button>
            </div>
          </div>

          <ul className="card-block divide-y divide-[var(--border)] max-h-[min(50vh,400px)] overflow-y-auto">
            {prepGoogleDocs.length === 0 && (
              <li className="px-4 py-6 text-sm text-[var(--text-muted)] text-center">No documents yet. Add a name and link above.</li>
            )}
            {prepGoogleDocs.map((d) => (
              <li key={d.id} className="p-3 space-y-2">
                {editingId === d.id ? (
                  <div className="space-y-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                      aria-label="Edit document name"
                    />
                    <input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                      aria-label="Edit Google Docs URL"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={!editName.trim() || !normalizeGoogleDocEditUrl(editUrl)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--success)]/15 text-[var(--success)] text-xs font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[var(--text-muted)] text-xs hover:bg-[var(--bg-elevated)]"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(d.id)}
                        className={`flex-1 min-w-0 text-left rounded-lg px-2 py-1.5 -mx-2 -my-1 transition-colors ${
                          selectedId === d.id ? 'bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]' : 'hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <p className="text-sm font-medium text-[var(--text)] truncate">{d.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate" title={d.url}>
                          Google Doc
                        </p>
                      </button>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(d.id)}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)]"
                          aria-label={`Edit ${d.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removePrepGoogleDoc(d.id)
                            if (selectedId === d.id) setSelectedId(null)
                          }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)]"
                          aria-label={`Remove ${d.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-8 card-block overflow-hidden flex flex-col min-h-[min(75vh,620px)] border border-[var(--border)]">
          {embedUrl && selected ? (
            <>
              <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <span className="text-sm font-medium text-[var(--text)] truncate flex-1 min-w-0">{selected.name}</span>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90 shrink-0"
                >
                  <ExternalLink className="w-4 h-4" /> Open in Google Docs
                </a>
              </div>
              <iframe
                title={selected.name}
                src={embedUrl}
                className="flex-1 w-full min-h-[420px] border-0 bg-[var(--bg-base)]"
                allow="clipboard-write; fullscreen"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)] text-sm">
              <p>Select a document from the list, or add a Google Docs link to preview it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
