export const STEPS = [
  { id: 0, name: "البيانات الأساسية" },
  { id: 1, name: "نوع العميل" },
  { id: 2, name: "طبيعة المنتج/الخدمة" },
  { id: 3, name: "تعريف المنتجات" },
  { id: 4, name: "تفعيل الاسترشاد القطاعي" },
  { id: 5, name: "المنافسة" },
  { id: 6, name: "التكاليف المتغيرة + الهالك" },
  { id: 7, name: "التكاليف الثابتة + الاهلاك + R&D" },
  { id: 8, name: "توزيع التكاليف" },
  { id: 9, name: "المبيعات/الدورية" },
  { id: 10, name: "أهداف الربح" },
  { id: 11, name: "محرك الاستراتيجية" },
  { id: 12, name: "النتائج والتصدير" },
]

export const STEPS_EN = [
  { id: 0, name: "Basic Information" },
  { id: 1, name: "Customer Type" },
  { id: 2, name: "Product/Service Nature" },
  { id: 3, name: "Product Definition" },
  { id: 4, name: "Enable Sector Guidance" },
  { id: 5, name: "Competition" },
  { id: 6, name: "Variable Costs + Waste" },
  { id: 7, name: "Fixed Costs + Depreciation + R&D" },
  { id: 8, name: "Cost Allocation" },
  { id: 9, name: "Sales/Periodicity" },
  { id: 10, name: "Profit Targets" },
  { id: 11, name: "Strategy Engine" },
  { id: 12, name: "Results & Export" },
]

export function getSteps(language: "ar" | "en") {
  return language === "ar" ? STEPS : STEPS_EN
}
