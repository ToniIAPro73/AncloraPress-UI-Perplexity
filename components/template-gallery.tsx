"use client"

import { useState } from "react"
import { BookOpen, ImageIcon, Palette, Lock, Unlock, Heart, Download, Eye } from "lucide-react"

interface Template {
  id: string
  name: string
  category: "interior" | "cover"
  type: string
  description: string
  preview: string
  isLocked: boolean
  isCustom: boolean
  isFavorite: boolean
  tokens: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    spacing: string
  }
  layers: Array<{
    id: string
    type: "text" | "image" | "quote" | "divider"
    locked: boolean
    content: any
  }>
}

const interiorTemplates: Template[] = [
  {
    id: "tech-book",
    name: "Libro Técnico",
    category: "interior",
    type: "technical",
    description: "Diseño limpio para documentación técnica con bloques de código",
    preview: "/placeholder.svg?height=300&width=200&text=Tech+Book",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "anclora-primary",
      secondaryColor: "anclora-secondary",
      fontFamily: "font-mono",
      spacing: "space-4",
    },
    layers: [
      { id: "header", type: "text", locked: true, content: { style: "h1", alignment: "left" } },
      { id: "code-block", type: "text", locked: false, content: { style: "code", background: "gray-100" } },
      { id: "body", type: "text", locked: false, content: { style: "body", lineHeight: "relaxed" } },
    ],
  },
  {
    id: "novel",
    name: "Novela",
    category: "interior",
    type: "literary",
    description: "Tipografía elegante para narrativa con espaciado óptimo",
    preview: "/placeholder.svg?height=300&width=200&text=Novel",
    isLocked: false,
    isCustom: false,
    isFavorite: true,
    tokens: {
      primaryColor: "anclora-primary",
      secondaryColor: "gray-700",
      fontFamily: "font-serif",
      spacing: "space-6",
    },
    layers: [
      { id: "chapter", type: "text", locked: true, content: { style: "h2", alignment: "center" } },
      { id: "drop-cap", type: "text", locked: false, content: { style: "drop-cap", size: "4xl" } },
      { id: "paragraph", type: "text", locked: false, content: { style: "body", indent: "first-line" } },
    ],
  },
  {
    id: "cookbook",
    name: "Recetario",
    category: "interior",
    type: "recipe",
    description: "Layout estructurado para ingredientes y pasos",
    preview: "/placeholder.svg?height=300&width=200&text=Cookbook",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "green-600",
      secondaryColor: "orange-500",
      fontFamily: "font-sans",
      spacing: "space-4",
    },
    layers: [
      { id: "recipe-title", type: "text", locked: true, content: { style: "h3", color: "green-600" } },
      { id: "ingredients", type: "text", locked: false, content: { style: "list", bulletColor: "green-600" } },
      { id: "steps", type: "text", locked: false, content: { style: "numbered-list" } },
      { id: "recipe-image", type: "image", locked: false, content: { aspectRatio: "16:9", rounded: "lg" } },
    ],
  },
  {
    id: "comic",
    name: "Cómic",
    category: "interior",
    type: "visual",
    description: "Grid flexible para viñetas y globos de diálogo",
    preview: "/placeholder.svg?height=300&width=200&text=Comic",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "yellow-400",
      secondaryColor: "red-500",
      fontFamily: "font-bold",
      spacing: "space-2",
    },
    layers: [
      { id: "panel-grid", type: "image", locked: true, content: { grid: "comic", borders: "thick" } },
      { id: "speech-bubble", type: "text", locked: false, content: { style: "bubble", background: "white" } },
      { id: "sound-effect", type: "text", locked: false, content: { style: "effect", transform: "uppercase" } },
    ],
  },
  {
    id: "whitepaper",
    name: "White Paper",
    category: "interior",
    type: "business",
    description: "Formato profesional para documentos corporativos",
    preview: "/placeholder.svg?height=300&width=200&text=White+Paper",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "blue-900",
      secondaryColor: "gray-600",
      fontFamily: "font-sans",
      spacing: "space-5",
    },
    layers: [
      { id: "executive-summary", type: "text", locked: true, content: { style: "summary", background: "blue-50" } },
      { id: "chart-placeholder", type: "image", locked: false, content: { type: "chart", background: "white" } },
      { id: "body-text", type: "text", locked: false, content: { style: "body", columns: "2" } },
    ],
  },
  {
    id: "workbook",
    name: "Workbook",
    category: "interior",
    type: "educational",
    description: "Plantilla interactiva con espacios para ejercicios",
    preview: "/placeholder.svg?height=300&width=200&text=Workbook",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "purple-600",
      secondaryColor: "pink-500",
      fontFamily: "font-sans",
      spacing: "space-4",
    },
    layers: [
      { id: "lesson-title", type: "text", locked: true, content: { style: "h2", background: "purple-100" } },
      { id: "exercise-box", type: "text", locked: false, content: { style: "box", border: "dashed" } },
      { id: "notes-section", type: "text", locked: false, content: { style: "lines", spacing: "wide" } },
    ],
  },
]

const coverTemplates: Template[] = [
  {
    id: "photographic",
    name: "Fotográfica",
    category: "cover",
    type: "photo",
    description: "Imagen de fondo con overlay de texto elegante",
    preview: "/placeholder.svg?height=400&width=300&text=Photo+Cover",
    isLocked: false,
    isCustom: false,
    isFavorite: true,
    tokens: {
      primaryColor: "white",
      secondaryColor: "black",
      fontFamily: "font-serif",
      spacing: "space-6",
    },
    layers: [
      { id: "background-image", type: "image", locked: true, content: { overlay: "gradient", opacity: "60" } },
      { id: "title", type: "text", locked: false, content: { style: "title", color: "white", shadow: true } },
      { id: "author", type: "text", locked: false, content: { style: "author", color: "white" } },
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "cover",
    type: "clean",
    description: "Diseño limpio con tipografía como protagonista",
    preview: "/placeholder.svg?height=400&width=300&text=Minimal+Cover",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "gray-900",
      secondaryColor: "anclora-primary",
      fontFamily: "font-sans",
      spacing: "space-8",
    },
    layers: [
      { id: "background", type: "text", locked: true, content: { color: "white" } },
      { id: "title", type: "text", locked: false, content: { style: "title", size: "6xl", weight: "light" } },
      { id: "accent-line", type: "divider", locked: false, content: { color: "anclora-primary", width: "thin" } },
    ],
  },
  {
    id: "typographic",
    name: "Tipográfica",
    category: "cover",
    type: "typography",
    description: "Juego tipográfico creativo con múltiples fuentes",
    preview: "/placeholder.svg?height=400&width=300&text=Typography+Cover",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "anclora-primary",
      secondaryColor: "yellow-400",
      fontFamily: "font-display",
      spacing: "space-4",
    },
    layers: [
      { id: "title-main", type: "text", locked: false, content: { style: "display", size: "8xl", weight: "black" } },
      { id: "title-accent", type: "text", locked: false, content: { style: "script", color: "yellow-400" } },
      { id: "author", type: "text", locked: false, content: { style: "mono", size: "sm", tracking: "wide" } },
    ],
  },
  {
    id: "illustrated",
    name: "Ilustrada",
    category: "cover",
    type: "illustration",
    description: "Espacio dedicado para ilustraciones personalizadas",
    preview: "/placeholder.svg?height=400&width=300&text=Illustrated+Cover",
    isLocked: false,
    isCustom: false,
    isFavorite: false,
    tokens: {
      primaryColor: "green-500",
      secondaryColor: "blue-500",
      fontFamily: "font-rounded",
      spacing: "space-5",
    },
    layers: [
      { id: "illustration-area", type: "image", locked: false, content: { type: "illustration", style: "hand-drawn" } },
      { id: "title", type: "text", locked: false, content: { style: "playful", color: "green-500" } },
      { id: "decorative-elements", type: "image", locked: false, content: { type: "ornaments" } },
    ],
  },
]

interface TemplateGalleryProps {
  selectedTemplate: string
  onTemplateChange: (template: Template) => void
  userTemplates: Template[]
  onSaveTemplate: (template: Template) => void
}

export default function TemplateGallery({
  selectedTemplate,
  onTemplateChange,
  userTemplates,
  onSaveTemplate,
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<"interior" | "cover" | "custom">("interior")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const getCurrentTemplates = () => {
    switch (activeCategory) {
      case "interior":
        return interiorTemplates
      case "cover":
        return coverTemplates
      case "custom":
        return userTemplates
      default:
        return []
    }
  }

  const toggleLayerLock = (templateId: string, layerId: string) => {
    // Implementation for layer locking
    console.log(`Toggle lock for layer ${layerId} in template ${templateId}`)
  }

  const toggleFavorite = (templateId: string) => {
    // Implementation for favorites
    console.log(`Toggle favorite for template ${templateId}`)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Galería de Plantillas</h2>
            <p className="card-subtitle">Diseños profesionales plug-and-play</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="btn btn-tertiary btn-sm"
            >
              {viewMode === "grid" ? "Lista" : "Grid"}
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "interior", name: "Interior", icon: BookOpen, count: interiorTemplates.length },
            { id: "cover", name: "Portadas", icon: ImageIcon, count: coverTemplates.length },
            { id: "custom", name: "Mis Plantillas", icon: Heart, count: userTemplates.length },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeCategory === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="card-body">
        {/* Templates Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {getCurrentTemplates().map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onTemplateChange(template)}
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`Vista previa de ${template.name}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Controls */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(template.id)
                    }}
                    className={`p-1 rounded-full ${
                      template.isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                    }`}
                  >
                    <Heart className="h-3 w-3" />
                  </button>

                  {template.isLocked && (
                    <div className="p-1 rounded-full bg-yellow-500 text-white">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{template.type}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Preview template
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Vista previa"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSaveTemplate(template)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Guardar como plantilla personal"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-small text-gray-600 mb-3">{template.description}</p>

                {/* Layer Locks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Capas:</span>
                    <span className="text-xs text-gray-500">
                      {template.layers.filter((l) => l.locked).length} bloqueadas
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.layers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLayerLock(template.id, layer.id)
                        }}
                        className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                          layer.locked ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={layer.locked ? "Capa bloqueada" : "Capa editable"}
                      >
                        {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        <span className="capitalize">{layer.type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Tokens */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-3 w-3 text-gray-400" />
                    <div className="flex space-x-1">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: template.tokens.primaryColor.startsWith("#")
                            ? template.tokens.primaryColor
                            : "#006EE6",
                        }}
                        title="Color primario"
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: template.tokens.secondaryColor.startsWith("#")
                            ? template.tokens.secondaryColor
                            : "#00B8D9",
                        }}
                        title="Color secundario"
                      />
                    </div>
                    <span className="text-xs text-gray-500 capitalize">
                      {template.tokens.fontFamily.replace("font-", "")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentTemplates().length === 0 && activeCategory === "custom" && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes plantillas personalizadas</h3>
            <p className="text-gray-600 mb-4">Guarda tus diseños favoritos para reutilizarlos en futuros proyectos</p>
            <button onClick={() => setActiveCategory("interior")} className="btn btn-primary">
              Explorar Plantillas
            </button>
          </div>
        )}
      </div>

      {/* Template Info Panel */}
      <div className="card-footer bg-blue-50">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Layer Locks</h4>
            <p className="text-small text-gray-600">
              Inspirado en Figma, cada elemento puede bloquearse para mantener la estructura del diseño. Los elementos
              bloqueados (amarillos) preservan la retícula profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
