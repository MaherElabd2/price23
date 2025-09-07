"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepName: string
  progress: number
  language: "ar" | "en"
}

export function ProgressBar({ currentStep, totalSteps, stepName, progress, language }: ProgressBarProps) {
  return (
    <div className="bg-card text-card-foreground rounded-[20px] p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {language === "ar"
              ? `الخطوة ${currentStep + 1} من ${totalSteps}`
              : `Step ${currentStep + 1} of ${totalSteps}`}
          </h2>
          <p className="text-muted-foreground mt-1">{stepName}</p>
        </div>
        <div className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</div>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
