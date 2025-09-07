export function tKey<T extends Record<string, any>>(dict: T, path: string[], lang: "ar" | "en"): string | string[] {
  let node: any = dict
  for (const p of path) node = node?.[p]
  const val = node?.[lang]
  if (val === undefined) {
    console.warn("[i18n-miss]", path.join("."), "missing for lang:", lang)
    return ""
  }
  return val
}
