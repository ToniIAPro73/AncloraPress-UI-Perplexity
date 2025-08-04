"use client"

import { useState } from "react"
import { Smartphone, FileText, Tablet, RotateCcw } from "lucide-react"

interface LivePreviewProps {
  bookData: {
    title: string
    subtitle: string
    author: string
    content: string
    template: string
    coverColor: string
  }
}

export default function LivePreview({ bookData }: LivePreviewProps) {
  const [activeView, setActiveView] = useState<"epub" | "pdf" | "kindle">("epub")
  const [deviceOrientation, setDeviceOrientation] = useState<"portrait" | "landscape">("portrait")

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            {line.substring(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-900">
            {line.substring(4)}
          </h3>
        )
      }
      if (line.trim() === "---") {
        return <hr key={index} className="my-8 border-gray-200" />
      }
      if (line.trim() === "") {
        return <div key={index} className="h-4" />
      }
      if (line.startsWith("*") && line.endsWith("*")) {
        return (
          <blockquote key={index} className="italic text-gray-600 border-l-4 border-primary pl-4 my-4">
            {line.slice(1, -1)}
          </blockquote>
        )
      }
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  const getDeviceClass = () => {
    const base = "mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"

    switch (activeView) {
      case "epub":
        return `${base} ${deviceOrientation === "portrait" ? "w-80 h-96" : "w-96 h-80"}`
      case "pdf":
        return `${base} w-full max-w-2xl aspect-[210/297]` // A4 ratio
      case "kindle":
        return `${base} w-72 h-96 bg-gray-100`
      default:
        return base
    }
  }

  const getContentClass = () => {
    switch (activeView) {
      case "epub":
        return "p-6 h-full overflow-y-auto text-sm leading-relaxed"
      case "pdf":
        return "p-8 h-full overflow-y-auto text-base leading-normal"
      case "kindle":
        return "p-4 h-full overflow-y-auto text-sm leading-relaxed bg-gray-50"
      default:
        return "p-6 h-full overflow-y-auto"
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Vista Previa Viva</h2>
            <p className="card-subtitle">Mosaico 3-en-1: EPUB, PDF y Kindle</p>
          </div>

          {/* Device Controls */}
          <div className="flex items-center space-x-2">
            {activeView === "epub" && (
              <button
                onClick={() => setDeviceOrientation(deviceOrientation === "portrait" ? "landscape" : "portrait")}
                className="btn btn-tertiary btn-sm"
                title="Rotar dispositivo"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Format Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "epub", name: "EPUB Móvil", icon: Smartphone, desc: "Texto adaptable" },
            { id: "pdf", name: "PDF A4", icon: FileText, desc: "Página fija" },
            { id: "kindle", name: "Kindle", icon: Tablet, desc: "E-reader" },
          ].map((format) => {
            const Icon = format.icon
            return (
              <button
                key={format.id}
                onClick={() => setActiveView(format.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeView === format.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <div className="text-left">
                  <div>{format.name}</div>
                  <div className="text-xs text-gray-400">{format.desc}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="card-body bg-gray-50">
        {/* Device Preview */}
        <div className="flex justify-center py-8">
          <div className={getDeviceClass()}>
            {/* Device Header */}
            {activeView === "epub" && (
              <div className="bg-gray-800 text-white px-4 py-2 text-xs flex justify-between items-center">
                <span>📱 {deviceOrientation === "portrait" ? "Móvil" : "Tablet"}</span>
                <span>100%</span>
              </div>
            )}

            {activeView === "kindle" && (
              <div className="bg-gray-200 px-4 py-2 text-xs flex justify-between items-center border-b">
                <span>Kindle Paperwhite</span>
                <span>🔋 85%</span>
              </div>
            )}

            {/* Content Area */}
            <div className={getContentClass()}>
              {/* Book Title */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className={`font-bold mb-2 ${activeView === "pdf" ? "text-2xl" : "text-lg"}`}>
                  {bookData.title || "Título del libro"}
                </h1>
                {bookData.subtitle && (
                  <p className={`text-gray-600 mb-2 ${activeView === "pdf" ? "text-lg" : "text-sm"}`}>
                    {bookData.subtitle}
                  </p>
                )}
                <p className={`text-gray-500 ${activeView === "pdf" ? "text-base" : "text-sm"}`}>
                  por {bookData.author || "Autor"}
                </p>
              </div>

              {/* Content */}
              <div className={`prose prose-sm max-w-none ${activeView === "kindle" ? "prose-gray" : ""}`}>
                {formatContent(bookData.content)}
              </div>
            </div>

            {/* Device Footer */}
            {activeView === "epub" && (
              <div className="bg-gray-100 px-4 py-2 text-xs text-center text-gray-600 border-t">
                Página 1 de 24 • 15 min restantes
              </div>
            )}

            {activeView === "kindle" && (
              <div className="bg-gray-200 px-4 py-2 text-xs flex justify-between items-center border-t">
                <span>Loc 1-25 de 1,247</span>
                <span>15%</span>
              </div>
            )}
          </div>
        </div>

        {/* Format-specific Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div
            className={`p-4 rounded-lg border-2 ${
              activeView === "epub" ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="font-medium">EPUB Móvil</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Texto adaptable (reflow)</li>
              <li>• Responsive design</li>
              <li>• Zoom y ajuste de fuente</li>
              <li>• Compatible con apps</li>
            </ul>
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              activeView === "pdf" ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="font-medium">PDF A4</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Formato fijo</li>
              <li>• Ideal para impresión</li>
              <li>• Preserva diseño</li>
              <li>• Universal compatibility</li>
            </ul>
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              activeView === "kindle" ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Tablet className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Kindle</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• E-ink optimizado</li>
              <li>• Batería extendida</li>
              <li>• Ajustes de lectura</li>
              <li>• Sincronización cloud</li>
            </ul>
          </div>
        </div>

        {/* Issues Detection */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-gray-900 mb-2">⚠️ Detección de Problemas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Posibles issues:</span>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• Sin líneas huérfanas detectadas</li>
                <li>• Márgenes correctos en PDF</li>
                <li>• Texto legible en móvil</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-gray-700">Optimizaciones:</span>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• Añadir más saltos de página</li>
                <li>• Considerar imágenes más pequeñas</li>
                <li>• Revisar contraste en Kindle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
