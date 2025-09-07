"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TestTube, RotateCcw, TrendingUp, AlertCircle } from "lucide-react"
import type { LocalData } from "@/types/startup"
import { useLanguage } from "@/contexts/language-context"

interface Step7TestingIterationProps {
  localData: LocalData
  updateLocalData: (updates: Partial<LocalData>) => void
  language: "ar" | "en"
}

export default function Step7TestingIteration({ localData, updateLocalData, language }: Step7TestingIterationProps) {
  const { t } = useLanguage()

  const testingData = localData.testingIteration || {
    testingMethods: [],
    iterationCycles: [],
    keyMetrics: [],
    learnings: "",
    nextSteps: "",
  }

  const addTestingMethod = () => {
    const newMethod = {
      id: Date.now().toString(),
      name: "",
      description: "",
      status: "planned" as const,
      results: "",
    }

    updateLocalData({
      testingIteration: {
        ...testingData,
        testingMethods: [...(testingData.testingMethods || []), newMethod],
      },
    })
  }

  const updateTestingMethod = (id: string, updates: any) => {
    const updatedMethods = (testingData.testingMethods || []).map((method) =>
      method.id === id ? { ...method, ...updates } : method,
    )

    updateLocalData({
      testingIteration: {
        ...testingData,
        testingMethods: updatedMethods,
      },
    })
  }

  const removeTestingMethod = (id: string) => {
    updateLocalData({
      testingIteration: {
        ...testingData,
        testingMethods: (testingData.testingMethods || []).filter((method) => method.id !== id),
      },
    })
  }

  const addIterationCycle = () => {
    const newCycle = {
      id: Date.now().toString(),
      name: "",
      hypothesis: "",
      results: "",
      changes: "",
      date: new Date().toISOString().split("T")[0],
    }

    updateLocalData({
      testingIteration: {
        ...testingData,
        iterationCycles: [...(testingData.iterationCycles || []), newCycle],
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            {t.step7TestingIteration?.title || "Testing & Iteration"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Testing Methods Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t.step7TestingIteration?.testingMethods || "Testing Methods"}</h3>
              <Button onClick={addTestingMethod} size="sm">
                {t.step7TestingIteration?.addMethod || "Add Method"}
              </Button>
            </div>

            <div className="space-y-4">
              {(testingData.testingMethods || []).map((method) => (
                <Card key={method.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`method-name-${method.id}`}>
                          {t.step7TestingIteration?.methodName || "Method Name"}
                        </Label>
                        <Input
                          id={`method-name-${method.id}`}
                          value={method.name}
                          onChange={(e) => updateTestingMethod(method.id, { name: e.target.value })}
                          placeholder={t.step7TestingIteration?.methodNamePlaceholder || "e.g., A/B Price Test"}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`method-status-${method.id}`}>
                          {t.step7TestingIteration?.status || "Status"}
                        </Label>
                        <select
                          id={`method-status-${method.id}`}
                          value={method.status}
                          onChange={(e) => updateTestingMethod(method.id, { status: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="planned">{t.step7TestingIteration?.statusPlanned || "Planned"}</option>
                          <option value="in-progress">
                            {t.step7TestingIteration?.statusInProgress || "In Progress"}
                          </option>
                          <option value="completed">{t.step7TestingIteration?.statusCompleted || "Completed"}</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`method-description-${method.id}`}>
                          {t.step7TestingIteration?.description || "Description"}
                        </Label>
                        <Textarea
                          id={`method-description-${method.id}`}
                          value={method.description}
                          onChange={(e) => updateTestingMethod(method.id, { description: e.target.value })}
                          placeholder={
                            t.step7TestingIteration?.descriptionPlaceholder || "Describe the testing method..."
                          }
                          rows={2}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`method-results-${method.id}`}>
                          {t.step7TestingIteration?.results || "Results"}
                        </Label>
                        <Textarea
                          id={`method-results-${method.id}`}
                          value={method.results}
                          onChange={(e) => updateTestingMethod(method.id, { results: e.target.value })}
                          placeholder={t.step7TestingIteration?.resultsPlaceholder || "Document the results..."}
                          rows={2}
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => removeTestingMethod(method.id)}>
                          {t.step7TestingIteration?.remove || "Remove"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!testingData.testingMethods || testingData.testingMethods.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t.step7TestingIteration?.noMethods || "No testing methods added yet"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Learnings Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.step7TestingIteration?.keyLearnings || "Key Learnings"}
            </h3>

            <Textarea
              value={testingData.learnings || ""}
              onChange={(e) =>
                updateLocalData({
                  testingIteration: {
                    ...testingData,
                    learnings: e.target.value,
                  },
                })
              }
              placeholder={t.step7TestingIteration?.learningsPlaceholder || "What have you learned from your tests?"}
              rows={4}
              className="w-full"
            />
          </div>

          {/* Next Steps Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              {t.step7TestingIteration?.nextSteps || "Next Steps"}
            </h3>

            <Textarea
              value={testingData.nextSteps || ""}
              onChange={(e) =>
                updateLocalData({
                  testingIteration: {
                    ...testingData,
                    nextSteps: e.target.value,
                  },
                })
              }
              placeholder={t.step7TestingIteration?.nextStepsPlaceholder || "What are your next steps?"}
              rows={4}
              className="w-full"
            />
          </div>

          {/* Summary Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {t.step7TestingIteration?.summaryTitle || "Testing Summary"}
                  </h4>
                  <p className="text-sm text-blue-800">
                    {t.step7TestingIteration?.summaryDescription ||
                      "Regular testing and iteration are key to finding the optimal pricing strategy."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
