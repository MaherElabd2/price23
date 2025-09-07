"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  allocateFixedCosts,
  calculateMonthlyQuantity,
  calculateUnitVariableCost,
  calculateTotalFixedCosts,
} from "@/lib/calculations"
import type { LocalData, Product } from "@/types/startup"
import { useLanguage } from "@/contexts/language-context"
import { startupT } from "@/lib/startup-translations"

interface StepProps {
  localData: LocalData
  updateLocalData: (data: Partial<LocalData>) => void
  language: string; 
}

export default function Step4DetailedCosts({ localData, language }: StepProps) {
  const { t } = useLanguage()
  const st = (key: string) => startupT(language as "ar" | "en", key)
  const products: Product[] = localData.products || []

  const rowsBase = products.map((p) => {
    const qty = calculateMonthlyQuantity(p)
    const unitVar = calculateUnitVariableCost(p)
    const totalVar = unitVar * qty
    const directFixed = (p.productFixedCosts || []).reduce((s, it) => s + (Number(it.monthlyAmount) || 0), 0)
    return {
      id: p.id,
      name: p.name,
      qty,
      unitVar,
      totalVar,
      directFixed,
    }
  })

  const totalMonthlyFixedCosts = calculateTotalFixedCosts(localData.fixedCosts || [])
  const method = localData.allocationMethod || "equal"
  const productsForAlloc = rowsBase.map((r) => ({
    id: r.id,
    name: r.name,
    qty: r.qty,
    cost: r.totalVar,
    unitVarCost: r.unitVar,
  }))
  const allocations = allocateFixedCosts(
    totalMonthlyFixedCosts,
    productsForAlloc,
    method,
    localData.allocationCustom || {},
  )

  const rows = rowsBase.map((r) => {
    const a = allocations.find((x) => x.productId === r.id)
    const sharedFixed = a ? a.allocatedAmount : 0
    const totalFixed = r.directFixed + sharedFixed
    const fixedPerUnit = r.qty > 0 ? totalFixed / r.qty : 0
    const fullUnitCost = r.unitVar + fixedPerUnit
    const totalCost = r.totalVar + totalFixed
    return {
      ...r,
      sharedFixed,
      totalFixed,
      fixedPerUnit,
      fullUnitCost,
      totalCost,
    }
  })

  const totals = rows.reduce(
    (acc, r) => {
      acc.totalVar += r.totalVar || 0
      acc.directFixed += r.directFixed || 0
      acc.sharedFixed += r.sharedFixed || 0
      acc.totalFixed += r.totalFixed || 0
      acc.totalCost += r.totalCost || 0
      return acc
    },
    { totalVar: 0, directFixed: 0, sharedFixed: 0, totalFixed: 0, totalCost: 0 },
  )

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${language === "ar" ? "rtl" : "ltr"}`}>
        <Card>
          <CardHeader className={language === "ar" ? "text-right" : "text-left"}>
            <CardTitle>{st("step4DetailedCosts.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.product")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.unitVariable")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.totalVariable")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.productSpecificFixed")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.sharedFixed")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.totalFixed")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.fixedPerUnit")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.fullUnitCost")}
                    </th>
                    <th className={`border p-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {st("step4DetailedCosts.tableHeaders.totalCosts")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="border p-2">{r.name}</td>
                      <td className="border p-2">{Number.isFinite(r.unitVar) ? r.unitVar.toFixed(2) : "0.00"}</td>
                      <td className="border p-2">
                        {Number.isFinite(r.totalVar) ? Math.round(r.totalVar).toLocaleString() : "0"}
                      </td>
                      <td className="border p-2">
                        {Number.isFinite(r.directFixed) ? Math.round(r.directFixed).toLocaleString() : "0"}
                      </td>
                      <td className="border p-2">
                        {Number.isFinite(r.sharedFixed) ? Math.round(r.sharedFixed).toLocaleString() : "0"}
                      </td>
                      <td className="border p-2">
                        {Number.isFinite(r.totalFixed) ? Math.round(r.totalFixed).toLocaleString() : "0"}
                      </td>
                      <td className="border p-2">
                        {Number.isFinite(r.fixedPerUnit) ? r.fixedPerUnit.toFixed(2) : "0.00"}
                      </td>
                      <td className="border p-2">
                        {Number.isFinite(r.fullUnitCost) ? r.fullUnitCost.toFixed(2) : "0.00"}
                      </td>
                      <td className="border p-2 font-semibold">
                        {Number.isFinite(r.totalCost) ? Math.round(r.totalCost).toLocaleString() : "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="border p-2">{st("step4DetailedCosts.tableHeaders.totalRow")}</td>
                    <td className="border p-2"></td>
                    <td className="border p-2">{Math.round(totals.totalVar).toLocaleString()}</td>
                    <td className="border p-2">{Math.round(totals.directFixed).toLocaleString()}</td>
                    <td className="border p-2">{Math.round(totals.sharedFixed).toLocaleString()}</td>
                    <td className="border p-2">{Math.round(totals.totalFixed).toLocaleString()}</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                    <td className="border p-2">{Math.round(totals.totalCost).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
