"use client"

import { useState } from "react"
import { X, Download, FileText, Book, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ExportModalProps {
  bookData: {
    title: string
    subtitle: string
    author: string
    content: string
    template: string
    coverImage: string | null
    coverColor: string
  }
  onClose: () => void
}

interface ExportProgress {
  stage: string
  progress: number
  message: string
}

export default function ExportModal({ bookData, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "epub">("pdf")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    stage: "idle",
    progress: 0,
    message: "",
  })
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    setExportSuccess(false)

    try {
      if (selectedFormat === "pdf") {
        await exportPDF()
      } else {
        await exportEPUB()
      }

      setExportSuccess(true)
      setTimeout(() => {
        setIsExporting(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Export error:", error)
      setExportError(error instanceof Error ? error.message : "Error desconocido durante la exportación")
      setIsExporting(false)
    }
  }

  const exportPDF = async () => {
    const stages = [
      { stage: "init", message: "Inicializando generador PDF...", progress: 10 },
      { stage: "template", message: "Aplicando plantilla y estilos...", progress: 25 },
      { stage: "cover", message: "Generando portada...", progress: 40 },
      { stage: "content", message: "Procesando contenido...", progress: 60 },
      { stage: "layout", message: "Aplicando diseño y formato...", progress: 80 },
      { stage: "finalize", message: "Finalizando documento...", progress: 95 },
      { stage: "download", message: "Preparando descarga...", progress: 100 },
    ]

    for (const stage of stages) {
      setExportProgress(stage)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Lazy-load only when needed
    const { PDFGenerator } = await import("@/lib/pdf-generator")
    const pdfGenerator = new PDFGenerator({ ...bookData, coverImage: bookData.coverImage ?? undefined })
    const pdfBlob = await pdfGenerator.generatePDF()

    // Download PDF
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${bookData.title || "mi-libro"}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportEPUB = async () => {
    const stages = [
      { stage: "init", message: "Inicializando generador EPUB...", progress: 10 },
      { stage: "structure", message: "Creando estructura EPUB...", progress: 20 },
      { stage: "metadata", message: "Generando metadatos...", progress: 30 },
      { stage: "styles", message: "Aplicando estilos CSS...", progress: 45 },
      { stage: "cover", message: "Procesando portada...", progress: 60 },
      { stage: "chapters", message: "Convirtiendo capítulos...", progress: 75 },
      { stage: "toc", message: "Generando tabla de contenidos...", progress: 85 },
      { stage: "package", message: "Empaquetando EPUB...", progress: 95 },
      { stage: "download", message: "Preparando descarga...", progress: 100 },
    ]

    for (const stage of stages) {
      setExportProgress(stage)
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    // Lazy-load only when needed
    const { EPUBGenerator } = await import("@/lib/epub-generator")
    const epubGenerator = new EPUBGenerator({ ...bookData, coverImage: bookData.coverImage ?? undefined })
    const epubBlob = await epubGenerator.generateEPUB()

    // Download EPUB
    const url = URL.createObjectURL(epubBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${bookData.title || "mi-libro"}.epub`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatOptions = [
    {
      id: "pdf" as const,
      name: "PDF",
      description: "Documento con formato fijo, ideal para impresión",
      icon: FileText,
      features: [
        "Formato profesional con plantillas aplicadas",
        "Portada personalizada integrada",
        "Tabla de contenidos automática",
        "Numeración de páginas",
        "Headers y footers personalizados",
        "Tipografía y colores de la plantilla",
        "Compatible con impresoras",
        "Tamaño optimizado",
      ],
      size: "~2-8 MB",
      compatibility: "Universal - Todos los dispositivos",
      technical: {
        library: "jsPDF + html2canvas",
        features: ["Vector graphics", "Embedded fonts", "High resolution"],
        formats: ["A4", "A5", "Letter"],
      },
    },
    {
      id: "epub" as const,
      name: "EPUB",
      description: "Libro electrónico estándar para e-readers",
      icon: Book,
      features: [
        "Texto adaptable (reflow)",
        "Estilos CSS personalizados",
        "Navegación por capítulos",
        "Metadatos completos",
        "Portada integrada",
        "Tabla de contenidos interactiva",
        "Compatible con modo oscuro",
        "Optimizado para lectura",
      ],
      size: "~500KB-3MB",
      compatibility: "E-readers, tablets, smartphones",
      technical: {
        library: "epub-gen + JSZip",
        features: ["EPUB 3.0", "Responsive design", "Accessibility"],
        formats: ["Standard EPUB", "Fixed layout"],
      },
    },
  ]

  const selectedFormatData = formatOptions.find((f) => f.id === selectedFormat)!

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exportar con Librerías Profesionales</h2>
            <p className="text-sm text-gray-600">Generación real con plantillas aplicadas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isExporting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {!isExporting && !exportSuccess ? (
            <>
              {/* Format Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {formatOptions.map((format) => {
                  const Icon = format.icon
                  return (
                    <div
                      key={format.id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedFormat === format.id
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${format.id === "pdf" ? "bg-red-100" : "bg-blue-100"}`}>
                          <Icon className={`h-6 w-6 ${format.id === "pdf" ? "text-red-600" : "text-blue-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{format.name}</h3>
                            {selectedFormat === format.id && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{format.description}</p>

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {format.features.slice(0, 4).map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-600">
                                <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>

                          {/* Technical Info */}
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>
                              <strong>Tamaño:</strong> {format.size}
                            </p>
                            <p>
                              <strong>Compatibilidad:</strong> {format.compatibility}
                            </p>
                            <p>
                              <strong>Tecnología:</strong> {format.technical.library}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="btn btn-primary w-full"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar ahora
              </button>
            </>
          ) : (
            <>
              {/* Progress */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {exportError ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : exportSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {exportError
                        ? "Error durante la exportación"
                        : exportSuccess
                        ? "Exportación completada"
                        : exportProgress.message || "Preparando exportación..."}
                    </p>
                    {!exportSuccess && !exportError && (
                      <p className="text-sm text-gray-600">Etapa: {exportProgress.stage}</p>
                    )}
                  </div>
                </div>

                {!exportSuccess && !exportError && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${exportProgress.progress}%` }}
                    />
                  </div>
                )}

                {exportError && (
                  <div className="text-sm text-red-600">
                    {exportError}
                  </div>
                )}

                {exportSuccess && (
                  <div className="text-sm text-green-600">Tu archivo está listo para descargar.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
