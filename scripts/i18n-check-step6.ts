import { startupTranslations } from "../lib/startup-translations"

const langs = ["ar", "en"] as const
const paths: Array<[string[], "string" | "string[]"]> = [
  [["step6StrategicGoals", "title"], "string"],
  [["step6StrategicGoals", "primaryTitle"], "string"],
  [["step6StrategicGoals", "secondaryTitle"], "string"],

  // تحذيرات
  [["step6StrategicGoals", "warnings", "mixedPricing"], "string"],
  [["step6StrategicGoals", "warnings", "belowCost"], "string"],
  [["step6StrategicGoals", "warnings", "ltvLow"], "string"],

  // جدول المنتجات - رؤوس
  [["step6StrategicGoals", "tables", "products", "header", "product"], "string"],
  [["step6StrategicGoals", "tables", "products", "header", "unitCost"], "string"],
  [["step6StrategicGoals", "tables", "products", "header", "strategy"], "string"],
  [["step6StrategicGoals", "tables", "products", "header", "margin"], "string"],
  [["step6StrategicGoals", "tables", "products", "header", "competitorAvg"], "string"],
  [["step6StrategicGoals", "tables", "products", "header", "finalPrice"], "string"],
  [["step6StrategicGoals", "tables", "products", "empty"], "string"],

  // استراتيجيات أساسية
  [["step6StrategicGoals", "primaryStrategies", "cost_plus", "title"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "cost_plus", "description"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "cost_plus", "pros"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "cost_plus", "cons"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "competitive", "title"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "competitive", "description"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "competitive", "pros"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "competitive", "cons"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "value_based", "title"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "value_based", "description"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "value_based", "pros"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "value_based", "cons"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "penetration", "title"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "penetration", "description"], "string"],
  [["step6StrategicGoals", "primaryStrategies", "penetration", "pros"], "string[]"],
  [["step6StrategicGoals", "primaryStrategies", "penetration", "cons"], "string[]"],

  // استراتيجيات مساندة
  [["step6StrategicGoals", "secondaryStrategies", "psychological", "title"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "psychological", "description"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "psychological", "pros"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "psychological", "cons"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "bundle", "title"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "bundle", "description"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "bundle", "pros"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "bundle", "cons"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "dynamic", "title"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "dynamic", "description"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "dynamic", "pros"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "dynamic", "cons"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "skimming", "title"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "skimming", "description"], "string"],
  [["step6StrategicGoals", "secondaryStrategies", "skimming", "pros"], "string[]"],
  [["step6StrategicGoals", "secondaryStrategies", "skimming", "cons"], "string[]"],
]

function get(obj: any, path: string[]) {
  return path.reduce((o, k) => o?.[k], obj)
}

let errors = 0
for (const [path, kind] of paths) {
  const node = get(startupTranslations, ["ar", ...path])
  if (!node) {
    console.error("Missing node:", path.join("."))
    errors++
    continue
  }
  for (const lang of langs) {
    const fullPath = [lang, ...path]
    const langNode = get(startupTranslations, fullPath)
    const v = langNode
    if (v === undefined) {
      console.error("Missing lang:", path.join("."), lang)
      errors++
      continue
    }
    if (kind === "string" && typeof v !== "string") {
      console.error("Type mismatch (string):", path.join("."), lang)
      errors++
    }
    if (kind === "string[]" && !Array.isArray(v)) {
      console.error("Type mismatch (string[]):", path.join("."), lang)
      errors++
    }
  }
}
if (errors > 0) {
  process.exit(1)
} else {
  console.log("Step6 i18n OK")
}
