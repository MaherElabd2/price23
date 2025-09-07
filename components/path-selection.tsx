"use client"

interface PathSelectionProps {
  language: "ar" | "en"
  onPathSelect: (path: "startup" | "sme" | "freelancer") => void
}

export function PathSelection({ language, onPathSelect }: PathSelectionProps) {
  const paths = [
    {
      id: "startup" as const,
      title: language === "ar" ? "شركة ناشئة" : "Startup",
      subtitle: language === "ar" ? "شركة جديدة أو في مراحل النمو الأولى" : "New company or in early growth stages",
      description: language === "ar"
        ? "مناسب للشركات الناشئة، المشاريع الجديدة، والشركات في مراحل النمو السريع"
        : "Perfect for startups, new ventures, and companies in rapid growth phases",
      features: language === "ar"
        ? ["نماذج تسعير مبتكرة", "تحليل السوق والمنافسة", "استراتيجيات النمو السريع"]
        : ["Innovative pricing models", "Market and competition analysis", "Rapid growth strategies"],
      icon: "🚀",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200 hover:border-green-400"
    },
    {
      id: "sme" as const,
      title: language === "ar" ? "شركة صغيرة ومتوسطة" : "Small & Medium Enterprise",
      subtitle: language === "ar" ? "شركة راسخة مع عمليات منتظمة" : "Established company with regular operations",
      description: language === "ar"
        ? "مناسب للشركات الصغيرة والمتوسطة، المتاجر، المصانع، وشركات الخدمات المؤسسة"
        : "Perfect for SMEs, retail stores, factories, and established service companies",
      features: language === "ar"
        ? ["تحليل التكاليف المفصل", "إدارة منتجات متعددة", "تحسين الهوامش الربحية"]
        : ["Detailed cost analysis", "Multiple product management", "Profit margin optimization"],
      icon: "🏢",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200 hover:border-purple-400"
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${language === "ar" ? "rtl" : "ltr"} content-with-header`}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "اختر مسارك في التسعير" : "Choose Your Pricing Path"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "ar" 
              ? "اختر المسار المناسب لنوع عملك للحصول على استراتيجية تسعير مخصصة ومناسبة لاحتياجاتك"
              : "Select the path that matches your business type to get a customized pricing strategy tailored to your needs"}
          </p>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {paths.map((path) => (
            <div
              key={path.id}
              onClick={() => onPathSelect(path.id)}
              className={`
                relative cursor-pointer group transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                bg-white rounded-2xl border-2 ${path.borderColor} p-8 h-full
                ${path.bgColor} hover:bg-white
              `}
            >
              {/* Icon and gradient background */}
              <div className={`absolute top-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r ${path.color} flex items-center justify-center text-2xl shadow-lg`}>
                {path.icon}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {path.title}
                  </h3>
                  <p className="text-lg text-gray-600 font-medium">
                    {path.subtitle}
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {path.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    {language === "ar" ? "المميزات:" : "Features:"}
                  </h4>
                  <ul className="space-y-2">
                    {path.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to action */}
                <div className="pt-4">
                  <div className={`
                    w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200
                    bg-gradient-to-r ${path.color} text-white
                    group-hover:shadow-lg group-hover:scale-105
                  `}>
                    {language === "ar" ? "ابدأ الآن" : "Get Started"}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-transparent group-hover:from-white/10 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <span className="text-blue-500">💡</span>
            <span className="text-gray-700 font-medium">
              {language === "ar" 
                ? "يمكنك تغيير المسار في أي وقت أثناء العملية"
                : "You can change paths anytime during the process"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
