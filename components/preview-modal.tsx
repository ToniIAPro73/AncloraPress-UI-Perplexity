"use client"

import { X, BookOpen } from "lucide-react"

interface PreviewModalProps {
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

export default function PreviewModal({ bookData, onClose }: PreviewModalProps) {
  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      // Headers
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

      // Separators
      if (line.trim() === "---") {
        return <hr key={index} className="my-8 border-gray-200" />
      }

      // Empty lines
      if (line.trim() === "") {
        return <div key={index} className="h-4" />
      }

      // Quotes
      if (line.startsWith("*") && line.endsWith("*")) {
        return (
          <blockquote key={index} className="italic text-gray-600 border-l-4 border-primary pl-4 my-4">
            {line.slice(1, -1)}
          </blockquote>
        )
      }

      // Regular paragraphs
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Vista previa del libro</h2>
              <p className="text-sm text-gray-600">
                {bookData.title} por {bookData.author}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Book Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-8">
              {/* Cover Page */}
              <div className="mb-12 text-center">
                <div
                  className="w-48 h-64 mx-auto rounded-lg shadow-lg mb-6 relative overflow-hidden"
                  style={{ backgroundColor: bookData.coverColor }}
                >
                  {bookData.coverImage && (
                    <img
                      src={bookData.coverImage || "/placeholder.svg"}
                      alt="Portada"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                    <div className="text-right">
                      <div className="text-xs opacity-75">ANCLORA PRESS</div>
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-lg font-bold leading-tight">{bookData.title}</h1>
                      {bookData.subtitle && <p className="text-xs opacity-90">{bookData.subtitle}</p>}
                      <p className="text-sm font-medium mt-2">{bookData.author}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-gray max-w-none">{formatContent(bookData.content)}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Información del libro</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <p className="text-gray-900">{bookData.title || "Sin título"}</p>
              </div>

              {bookData.subtitle && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Subtítulo</label>
                  <p className="text-gray-900">{bookData.subtitle}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Autor</label>
                <p className="text-gray-900">{bookData.author || "Sin autor"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Plantilla</label>
                <p className="text-gray-900 capitalize">{bookData.template}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Estadísticas</label>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Palabras: {bookData.content.split(" ").filter((word) => word.length > 0).length}</p>
                  <p>Caracteres: {bookData.content.length}</p>
                  <p>Párrafos: {bookData.content.split("\n\n").length}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">💡 Nota</h4>
              <p className="text-sm text-gray-600">
                Esta es una vista previa simplificada. El formato final puede variar según el tipo de exportación
                seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
