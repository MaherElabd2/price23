"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { startupT } from "@/lib/startup-translations"

export default function Step5InvestorPerspective({ localData, updateLocalData, language }: any) {
  const { t } = useLanguage()
  const st = (key: string) => startupT(language as "ar" | "en", key)

  const goalKeys: Array<"growth" | "sustainability" | "exit"> = ["growth", "sustainability", "exit"]

  const valueKeys: Array<"standard" | "value_added" | "game_changer"> = ["standard", "value_added", "game_changer"]

  const discountKeys: Array<"quantity" | "loyalty" | "seasonal" | "free_trial"> = [
    "quantity",
    "loyalty",
    "seasonal",
    "free_trial",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{st("step5InvestorPerspective.title")}</h3>
        <p className="text-gray-600 text-sm">{st("step5InvestorPerspective.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{st("step5InvestorPerspective.strategicGoal.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goalKeys.map((key) => {
              const data = {
                title: st(`step5InvestorPerspective.strategicGoal.options.${key}.title`),
                description: st(`step5InvestorPerspective.strategicGoal.options.${key}.description`),
              }
              return (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    localData?.strategicGoal === key ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                  }`}
                  onClick={() => updateLocalData({ strategicGoal: key })}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold mb-2">{data.title}</h4>
                    <p className="text-xs text-gray-600">{data.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{st("step5InvestorPerspective.selfAssessment.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{st("step5InvestorPerspective.selfAssessment.question")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {valueKeys.map((key) => {
              const data = {
                label: st(`step5InvestorPerspective.selfAssessment.options.${key}.label`),
                desc: st(`step5InvestorPerspective.selfAssessment.options.${key}.desc`),
              }
              return (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    localData?.valueProposition === key ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                  }`}
                  onClick={() => updateLocalData({ valueProposition: key })}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold">{data.label}</h4>
                    <p className="text-xs text-gray-600">{data.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {localData?.valueProposition === "game_changer" && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <p className="text-sm text-green-800">{st("step5InvestorPerspective.selfAssessment.premiumNotice")}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{st("step5InvestorPerspective.discountsPolicy.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="discounts"
              checked={!!localData?.discounts}
              onChange={(e) => updateLocalData({ discounts: e.target.checked })}
            />
            <label htmlFor="discounts" className="text-sm">
              {st("step5InvestorPerspective.discountsPolicy.offerDiscountsLabel")}
            </label>
          </div>

          {localData?.discounts && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {st("step5InvestorPerspective.discountsPolicy.plannedTypesLabel")}
              </p>
              {discountKeys.map((key) => {
                const label = st(`step5InvestorPerspective.discountsPolicy.types.${key}`)
                const isChecked =
                  (localData?.promotions || []).includes(key) || (localData?.promotions || []).includes(label)
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={isChecked}
                      onChange={(e) => {
                        const current: string[] = Array.isArray(localData?.promotions) ? localData.promotions : []
                        const next = e.target.checked
                          ? Array.from(new Set([...current.filter((p) => p !== label), key]))
                          : current.filter((p) => p !== key && p !== label)
                        updateLocalData({ promotions: next })
                      }}
                    />
                    <label htmlFor={key} className="text-sm">
                      {label}
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
