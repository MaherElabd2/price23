export class SaveExporter {
  constructor(
    private data: any,
    private results: any[],
    private portfolioSummary: any,
    private language: string,
  ) {}

  async saveProject() {
    try {
      const projectData = {
        timestamp: new Date().toISOString(),
        data: this.data,
        results: this.results,
        portfolioSummary: this.portfolioSummary,
        language: this.language,
      }

      const blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `kayan-pricing-project-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert(this.language === "ar" ? "تم حفظ المشروع بنجاح" : "Project saved successfully")
    } catch (error) {
      console.error("Error saving project:", error)
      alert(this.language === "ar" ? "حدث خطأ أثناء حفظ المشروع" : "An error occurred while saving the project")
    }
  }

  generateShareLink() {
    try {
      const projectData = {
        data: this.data,
        results: this.results,
        portfolioSummary: this.portfolioSummary,
      }

      const encodedData = btoa(JSON.stringify(projectData))
      const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`

      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert(this.language === "ar" ? "تم نسخ رابط المشاركة إلى الحافظة" : "Share link copied to clipboard")
        })
        .catch(() => {
          prompt(this.language === "ar" ? "انسخ هذا الرابط للمشاركة:" : "Copy this link to share:", shareUrl)
        })
    } catch (error) {
      console.error("Error generating share link:", error)
      alert(
        this.language === "ar"
          ? "حدث خطأ أثناء إنشاء رابط المشاركة"
          : "An error occurred while generating the share link",
      )
    }
  }
}
