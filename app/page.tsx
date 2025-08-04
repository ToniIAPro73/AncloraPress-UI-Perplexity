"use client"

import { useState } from "react"
import { BookOpen, Upload, Download, Eye, Palette, Users, Sparkles, Monitor } from "lucide-react"
import TextEditor from "@/components/text-editor"
import TemplateGallery from "@/components/template-gallery"
import CoverEditor from "@/components/cover-editor"
import PreviewModal from "@/components/preview-modal"
import ExportModal from "@/components/export-modal"
import AICopilot from "@/components/ai-copilot"
import LivePreview from "@/components/live-preview"
import CollaborationPanel from "@/components/collaboration-panel"

export default function Home() {
  const [activeStep, setActiveStep] = useState(1)
  const [bookData, setBookData] = useState({
    title: "",
    subtitle: "",
    author: "",
    content: "",
    template: "modern",
    coverImage: null as string | null,
    coverColor: "#006EE6",
    genre: "fiction",
  })
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [userTemplates, setUserTemplates] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([
    {
      id: "v1",
      author: "Usuario Actual",
      timestamp: new Date(),
      message: "Versión inicial del libro",
      changes: { added: 1250, removed: 0, modified: 0 },
    },
  ])
  const [collaborators] = useState([
    {
      id: "1",
      name: "Ana García",
      email: "ana@example.com",
      role: "owner" as const,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online" as const,
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos@example.com",
      role: "editor" as const,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online" as const,
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria@example.com",
      role: "commenter" as const,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "offline" as const,
    },
  ])

  const steps = [
    { id: 1, title: "Contenido", icon: Upload },
    { id: 2, title: "Plantilla", icon: Palette },
    { id: 3, title: "Portada", icon: BookOpen },
    { id: 4, title: "Vista Previa", icon: Monitor },
    { id: 5, title: "Colaborar", icon: Users },
    { id: 6, title: "IA", icon: Sparkles },
    { id: 7, title: "Exportar", icon: Download },
  ]

  const updateBookData = (updates: Partial<typeof bookData>) => {
    setBookData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (activeStep) {
      case 1:
        return bookData.content.length > 100
      case 2:
        return bookData.template !== ""
      case 3:
        return bookData.title !== "" && bookData.author !== ""
      default:
        return true
    }
  }

  const handleSaveTemplate = (template: any) => {
    const customTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      isCustom: true,
      name: `${template.name} (Personalizada)`,
    }
    setUserTemplates((prev) => [...prev, customTemplate])
  }

  const handleAddComment = (comment: any) => {
    const newComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: new Date(),
    }
    setComments((prev) => [...prev, newComment])
  }

  const handleResolveComment = (commentId: string) => {
    setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)))
  }

  const handleRevertVersion = (versionId: string) => {
    console.log(`Reverting to version ${versionId}`)
    // Implementation for version revert
  }

  const handleAISuggestion = (suggestion: any) => {
    console.log("AI Suggestion:", suggestion)
    // Handle different types of AI suggestions
    switch (suggestion.type) {
      case "style-suggestions":
        // Apply color palette suggestions
        break
      case "ai-cover":
        updateBookData({ coverImage: suggestion.data.image })
        break
      case "text-rewrite":
        // Apply text improvements
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-h3 font-bold text-gray-900">Anclora Press</h1>
              <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowPreview(true)} className="btn btn-secondary" disabled={!bookData.content}>
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="btn btn-primary"
                disabled={!canProceed() || activeStep < 3}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Flujo de Trabajo</h2>
              </div>
              <div className="card-body p-0">
                <nav className="space-y-1">
                  {steps.map((step) => {
                    const Icon = step.icon
                    const isActive = activeStep === step.id
                    const isCompleted = activeStep > step.id
                    const isDisabled = activeStep < step.id && !canProceed()

                    return (
                      <button
                        key={step.id}
                        onClick={() => !isDisabled && setActiveStep(step.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : isCompleted
                              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                              : isDisabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{step.title}</span>
                        {isCompleted && <div className="ml-auto w-2 h-2 bg-success rounded-full" />}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="card mt-6">
              <div className="card-header">
                <h3 className="card-title">Tu libro</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div>
                    <span className="text-small text-gray-600">Título:</span>
                    <p className="font-medium text-gray-900 truncate">{bookData.title || "Sin título"}</p>
                  </div>
                  <div>
                    <span className="text-small text-gray-600">Autor:</span>
                    <p className="font-medium text-gray-900 truncate">{bookData.author || "Sin autor"}</p>
                  </div>
                  <div>
                    <span className="text-small text-gray-600">Palabras:</span>
                    <p className="font-medium text-gray-900">
                      {bookData.content.split(" ").filter((word) => word.length > 0).length}
                    </p>
                  </div>
                  <div>
                    <span className="text-small text-gray-600">Plantilla:</span>
                    <p className="font-medium text-gray-900 capitalize">{bookData.template}</p>
                  </div>
                  <div>
                    <span className="text-small text-gray-600">Colaboradores:</span>
                    <p className="font-medium text-gray-900">{collaborators.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeStep === 1 && (
              <TextEditor content={bookData.content} onContentChange={(content) => updateBookData({ content })} />
            )}

            {activeStep === 2 && (
              <TemplateGallery
                selectedTemplate={bookData.template}
                onTemplateChange={(template) => updateBookData({ template: template.id })}
                userTemplates={userTemplates}
                onSaveTemplate={handleSaveTemplate}
              />
            )}

            {activeStep === 3 && <CoverEditor bookData={bookData} onUpdate={updateBookData} />}

            {activeStep === 4 && <LivePreview bookData={bookData} />}

            {activeStep === 5 && (
              <CollaborationPanel
                bookData={bookData}
                comments={comments}
                versions={versions}
                collaborators={collaborators}
                onAddComment={handleAddComment}
                onResolveComment={handleResolveComment}
                onRevertVersion={handleRevertVersion}
              />
            )}

            {activeStep === 6 && <AICopilot bookData={bookData} onSuggestion={handleAISuggestion} />}

            {activeStep === 7 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Exportar tu libro</h2>
                  <p className="card-subtitle">Tu libro está listo para ser exportado en diferentes formatos</p>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <h3 className="text-h4 font-semibold mb-2">PDF</h3>
                      <p className="text-small text-gray-600 mb-4">
                        Formato ideal para impresión y lectura en dispositivos
                      </p>
                      <button onClick={() => setShowExport(true)} className="btn btn-primary w-full">
                        Exportar PDF
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📚</span>
                      </div>
                      <h3 className="text-h4 font-semibold mb-2">EPUB</h3>
                      <p className="text-small text-gray-600 mb-4">Formato estándar para lectores de ebooks</p>
                      <button onClick={() => setShowExport(true)} className="btn btn-primary w-full">
                        Exportar EPUB
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="btn btn-secondary"
              >
                Anterior
              </button>
              <button
                onClick={() => setActiveStep(Math.min(7, activeStep + 1))}
                disabled={!canProceed() || activeStep === 7}
                className="btn btn-primary"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && <PreviewModal bookData={bookData} onClose={() => setShowPreview(false)} />}

      {showExport && <ExportModal bookData={bookData} onClose={() => setShowExport(false)} />}
    </div>
  )
}
