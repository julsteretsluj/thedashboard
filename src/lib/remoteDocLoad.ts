/** Distinguishes “no row / empty doc” from a failed fetch so we never autosave over good remote data. */
export type RemoteDocLoad<T> =
  | { ok: true; doc: T | null }
  | { ok: false; error: string }
