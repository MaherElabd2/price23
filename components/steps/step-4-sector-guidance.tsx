"use client"

import type { PricingData } from "@/lib/types"
import { t } from "@/lib/translations"

interface Step4Props {
  data: PricingData
  onDataChange: (updates: Partial<PricingData>) => void
  errors: Record<string, string>
  language: "ar" | "en"
}

export function Step4SectorGuidance({ data, onDataChange, errors, language }: Step4Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{t(language, "sectorGuidance.title")}</h2>

        <div className="bg-[#f1f5f9] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-3">{t(language, "sectorGuidance.whatIs")}</h3>
          <p className="text-[#64748b] mb-4">{t(language, "sectorGuidance.description")}</p>
          <ul className="text-sm text-[#64748b] space-y-2">
            <li>• {t(language, "sectorGuidance.feature1")}</li>
            <li>• {t(language, "sectorGuidance.feature2")}</li>
            <li>• {t(language, "sectorGuidance.feature3")}</li>
            <li>• {t(language, "sectorGuidance.feature4")}</li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-6 bg-white border border-[#e5e7eb] rounded-lg">
          <div>
            <h4 className="font-semibold text-[#0f172a] mb-2">{t(language, "sectorGuidance.autoApply")}</h4>
            <p className="text-sm text-[#64748b]">{t(language, "sectorGuidance.autoApplyDesc")}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.sectorGuidanceEnabled}
              onChange={(e) => onDataChange({ sectorGuidanceEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e5e7eb] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3b82f6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
          </label>
        </div>

        <div className="mt-6 p-4 bg-[#fef3c7] border border-[#f59e0b] rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-[#f59e0b] text-xl">ℹ️</div>
            <div>
              <h4 className="font-semibold text-[#92400e] mb-1">{t(language, "sectorGuidance.importantNote")}</h4>
              <p className="text-sm text-[#92400e]">{t(language, "sectorGuidance.noteDescription")}</p>
            </div>
          </div>
        </div>

        {data.sectorGuidanceEnabled && (
          <div className="mt-6 p-4 bg-[#dcfce7] border border-[#16a34a] rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-[#16a34a] text-xl">✅</div>
              <div>
                <h4 className="font-semibold text-[#15803d] mb-1">{t(language, "sectorGuidance.enabled")}</h4>
                <p className="text-sm text-[#15803d]">
                  {t(language, "sectorGuidance.enabledDescription")} "{data.sector}"{" "}
                  {t(language, "sectorGuidance.inNextSteps")}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
