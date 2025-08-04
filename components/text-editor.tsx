"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Type, FileText } from "lucide-react"

interface TextEditorProps {
  content: string
  onContentChange: (content: string) => void
}

export default function TextEditor({ content, onContentChange }: TextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "upload">("write")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        onContentChange(text)
      }
      reader.readAsText(file)
    }
  }

  const sampleContent = `# Capítulo 1: El Comienzo

Era una mañana como cualquier otra cuando todo cambió. El sol se filtraba a través de las cortinas de mi pequeño apartamento, creando patrones de luz y sombra en el suelo de madera.

## Una Nueva Perspectiva

No sabía que ese día marcaría el inicio de una aventura extraordinaria. A veces, los momentos más importantes de nuestras vidas llegan disfrazados de días ordinarios.

### Reflexiones

La vida tiene una manera peculiar de sorprendernos cuando menos lo esperamos. Es en esos momentos de quietud cuando las grandes revelaciones tienden a aparecer.

---

*"El futuro pertenece a quienes creen en la belleza de sus sueños."* - Eleanor Roosevelt

## Continuando la Historia

Y así comenzó todo...`

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Contenido del libro</h2>
        <p className="card-subtitle">Escribe tu contenido o sube un archivo de texto</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab("write")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "write"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Type className="h-4 w-4 inline mr-2" />
            Escribir
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Subir archivo
          </button>
        </nav>
      </div>

      <div className="card-body">
        {activeTab === "write" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-small text-gray-600">
                  Palabras: {content.split(" ").filter((word) => word.length > 0).length}
                </p>
              </div>
              <button onClick={() => onContentChange(sampleContent)} className="btn btn-secondary btn-sm">
                Usar contenido de ejemplo
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Comienza a escribir tu libro aquí... Puedes usar Markdown para dar formato al texto."
              className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Consejos de formato</h4>
              <ul className="text-small text-gray-600 space-y-1">
                <li>• Usa # para títulos principales</li>
                <li>• Usa ## para subtítulos</li>
                <li>• Usa **texto** para negrita</li>
                <li>• Usa *texto* para cursiva</li>
                <li>• Usa --- para separadores</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sube tu archivo de texto</h3>
              <p className="text-gray-600 mb-4">Formatos soportados: TXT, MD, DOC, DOCX</p>
              <label className="btn btn-primary cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivo
                <input type="file" accept=".txt,.md,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {content && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Archivo cargado</h4>
                <p className="text-small text-gray-600">
                  {content.split(" ").filter((word) => word.length > 0).length} palabras cargadas correctamente
                </p>
                <div className="mt-3 max-h-32 overflow-y-auto bg-white p-3 rounded border text-small">
                  {content.substring(0, 200)}...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
