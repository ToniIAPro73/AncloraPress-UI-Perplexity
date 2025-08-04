"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Palette, Pipette, Shuffle } from "lucide-react"

interface CoverEditorProps {
  bookData: {
    title: string
    subtitle: string
    author: string
    coverImage: string | null
    coverColor: string
  }
  onUpdate: (updates: any) => void
}

// Paleta de colores expandida organizada por familias
const colorPalettes = {
  anclora: {
    name: "Anclora",
    colors: ["#006EE6", "#00B8D9", "#0050A7", "#00829B", "#4A90E2", "#2DD4BF"],
  },
  blues: {
    name: "Azules",
    colors: [
      "#1E3A8A",
      "#1E40AF",
      "#1D4ED8",
      "#2563EB",
      "#3B82F6",
      "#60A5FA",
      "#93C5FD",
      "#BFDBFE",
      "#DBEAFE",
      "#EFF6FF",
      "#0EA5E9",
      "#0284C7",
      "#0369A1",
      "#075985",
      "#0C4A6E",
      "#082F49",
      "#164E63",
      "#155E75",
    ],
  },
  greens: {
    name: "Verdes",
    colors: [
      "#14532D",
      "#166534",
      "#15803D",
      "#16A34A",
      "#22C55E",
      "#4ADE80",
      "#86EFAC",
      "#BBF7D0",
      "#DCFCE7",
      "#F0FDF4",
      "#059669",
      "#047857",
      "#065F46",
      "#064E3B",
      "#10B981",
      "#34D399",
      "#6EE7B7",
      "#A7F3D0",
    ],
  },
  reds: {
    name: "Rojos",
    colors: [
      "#7F1D1D",
      "#991B1B",
      "#B91C1C",
      "#DC2626",
      "#EF4444",
      "#F87171",
      "#FCA5A5",
      "#FECACA",
      "#FEE2E2",
      "#FEF2F2",
      "#E11D48",
      "#BE185D",
      "#9D174D",
      "#831843",
      "#F43F5E",
      "#FB7185",
      "#FDA4AF",
      "#FECDD3",
    ],
  },
  purples: {
    name: "Morados",
    colors: [
      "#581C87",
      "#6B21A8",
      "#7C2D12",
      "#8B5CF6",
      "#A855F7",
      "#C084FC",
      "#DDD6FE",
      "#EDE9FE",
      "#F3E8FF",
      "#FAF5FF",
      "#9333EA",
      "#7C3AED",
      "#6D28D9",
      "#5B21B6",
      "#4C1D95",
      "#A78BFA",
      "#C4B5FD",
      "#E9D5FF",
    ],
  },
  oranges: {
    name: "Naranjas",
    colors: [
      "#9A3412",
      "#C2410C",
      "#DC2626",
      "#EA580C",
      "#F97316",
      "#FB923C",
      "#FDBA74",
      "#FED7AA",
      "#FFEDD5",
      "#FFF7ED",
      "#D97706",
      "#B45309",
      "#92400E",
      "#78350F",
      "#451A03",
      "#FDE68A",
      "#FCD34D",
      "#FBBF24",
    ],
  },
  pinks: {
    name: "Rosas",
    colors: [
      "#831843",
      "#9D174D",
      "#BE185D",
      "#DB2777",
      "#EC4899",
      "#F472B6",
      "#F9A8D4",
      "#FBCFE8",
      "#FCE7F3",
      "#FDF2F8",
      "#E11D48",
      "#BE123C",
      "#9F1239",
      "#881337",
      "#4C0519",
      "#FB7185",
      "#FDA4AF",
      "#FECDD3",
    ],
  },
  yellows: {
    name: "Amarillos",
    colors: [
      "#713F12",
      "#92400E",
      "#B45309",
      "#D97706",
      "#F59E0B",
      "#FBBF24",
      "#FCD34D",
      "#FDE68A",
      "#FEF3C7",
      "#FFFBEB",
      "#EAB308",
      "#CA8A04",
      "#A16207",
      "#854D0E",
      "#422006",
      "#FACC15",
      "#FDE047",
      "#FEF08A",
    ],
  },
  grays: {
    name: "Grises",
    colors: [
      "#111827",
      "#1F2937",
      "#374151",
      "#4B5563",
      "#6B7280",
      "#9CA3AF",
      "#D1D5DB",
      "#E5E7EB",
      "#F3F4F6",
      "#F9FAFB",
      "#0F172A",
      "#1E293B",
      "#334155",
      "#475569",
      "#64748B",
      "#94A3B8",
      "#CBD5E1",
      "#E2E8F0",
    ],
  },
  earth: {
    name: "Tierra",
    colors: [
      "#451A03",
      "#78350F",
      "#92400E",
      "#B45309",
      "#D97706",
      "#F59E0B",
      "#A16207",
      "#CA8A04",
      "#EAB308",
      "#FACC15",
      "#8B4513",
      "#A0522D",
      "#CD853F",
      "#DEB887",
      "#F4A460",
      "#D2691E",
      "#BC8F8F",
      "#F5DEB3",
    ],
  },
  pastels: {
    name: "Pasteles",
    colors: [
      "#FFE4E1",
      "#F0F8FF",
      "#E6E6FA",
      "#F5FFFA",
      "#FFF8DC",
      "#FFFACD",
      "#E0FFFF",
      "#F0FFFF",
      "#F5F5DC",
      "#FDF5E6",
      "#FFB6C1",
      "#DDA0DD",
      "#98FB98",
      "#F0E68C",
      "#FFE4B5",
      "#FFDAB9",
      "#EEE8AA",
      "#D3D3D3",
    ],
  },
  darks: {
    name: "Oscuros",
    colors: [
      "#000000",
      "#1C1C1C",
      "#2D2D2D",
      "#3E3E3E",
      "#4F4F4F",
      "#606060",
      "#1A1A2E",
      "#16213E",
      "#0F3460",
      "#533A71",
      "#6A4C93",
      "#8B5A83",
      "#2C3E50",
      "#34495E",
      "#7F8C8D",
      "#95A5A6",
      "#BDC3C7",
      "#ECF0F1",
    ],
  },
}

// Colores gradientes especiales
const gradientColors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)",
]

export default function CoverEditor({ bookData, onUpdate }: CoverEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(bookData.coverImage)
  const [activeTab, setActiveTab] = useState<string>("anclora")
  const [customColor, setCustomColor] = useState("#006EE6")
  const [showGradients, setShowGradients] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        onUpdate({ coverImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorChange = (color: string) => {
    onUpdate({ coverColor: color })
  }

  const generateRandomColor = () => {
    const allColors = Object.values(colorPalettes).flatMap((palette) => palette.colors)
    const randomColor = allColors[Math.floor(Math.random() * allColors.length)]
    handleColorChange(randomColor)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    handleColorChange(color)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Diseña tu portada</h2>
          <p className="card-subtitle">Personaliza el título, autor y diseño de tu portada</p>
        </div>

        <div className="card-body space-y-6">
          {/* Title */}
          <div className="input-group">
            <label htmlFor="title" className="input-label">
              Título del libro *
            </label>
            <input
              type="text"
              id="title"
              value={bookData.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Ingresa el título de tu libro"
              className="input"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="input-group">
            <label htmlFor="subtitle" className="input-label">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              id="subtitle"
              value={bookData.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Subtítulo o descripción breve"
              className="input"
            />
          </div>

          {/* Author */}
          <div className="input-group">
            <label htmlFor="author" className="input-label">
              Autor *
            </label>
            <input
              type="text"
              id="author"
              value={bookData.author}
              onChange={(e) => onUpdate({ author: e.target.value })}
              placeholder="Tu nombre o seudónimo"
              className="input"
              required
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="input-label">Imagen de portada (opcional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Vista previa"
                    className="w-24 h-32 object-cover mx-auto rounded"
                  />
                  <p className="text-small text-gray-600">Imagen cargada correctamente</p>
                  <label className="btn btn-secondary btn-sm cursor-pointer">
                    Cambiar imagen
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Sube una imagen para tu portada</p>
                  <label className="btn btn-primary btn-sm cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar imagen
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Color Picker Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="input-label flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Paleta de colores
              </label>
              <div className="flex space-x-2">
                <button onClick={generateRandomColor} className="btn btn-tertiary btn-sm" title="Color aleatorio">
                  <Shuffle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowGradients(!showGradients)}
                  className={`btn btn-sm ${showGradients ? "btn-primary" : "btn-tertiary"}`}
                  title="Gradientes"
                >
                  ✨
                </button>
              </div>
            </div>

            {/* Color Palette Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 overflow-x-auto">
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === key
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {palette.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Color Grid */}
            {!showGradients ? (
              <div className="grid grid-cols-6 gap-2">
                {colorPalettes[activeTab as keyof typeof colorPalettes]?.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      bookData.coverColor === color
                        ? "border-gray-900 scale-110 shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ) : (
              /* Gradient Grid */
              <div className="grid grid-cols-3 gap-3">
                {gradientColors.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(gradient)}
                    className={`w-full h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                      bookData.coverColor === gradient
                        ? "border-gray-900 scale-105 shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ background: gradient }}
                    title={`Gradiente ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Custom Color Picker */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3">
                <Pipette className="h-4 w-4 text-gray-500" />
                <label className="text-small font-medium text-gray-700">Color personalizado:</label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#006EE6"
                  className="input text-xs w-24"
                />
              </div>
            </div>

            {/* Current Color Display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-small font-medium text-gray-700">Color actual:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded border border-gray-300" style={{ background: bookData.coverColor }} />
                  <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                    {bookData.coverColor.startsWith("linear-gradient") ? "Gradiente" : bookData.coverColor}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Vista previa</h3>
          <p className="card-subtitle">Así se verá tu portada</p>
        </div>

        <div className="card-body">
          <div className="max-w-sm mx-auto">
            <div
              className="aspect-[3/4] rounded-lg shadow-lg overflow-hidden relative"
              style={{ background: bookData.coverColor }}
            >
              {/* Background Image */}
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Portada"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="text-right">
                  <div className="text-xs opacity-75">ANCLORA PRESS</div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl font-bold leading-tight">{bookData.title || "Título del libro"}</h1>
                  {bookData.subtitle && <p className="text-sm opacity-90 leading-tight">{bookData.subtitle}</p>}
                  <p className="text-sm font-medium mt-4">{bookData.author || "Nombre del autor"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🎨 Consejos de diseño</h4>
            <ul className="text-small text-gray-600 space-y-1">
              <li>• Explora diferentes familias de colores para encontrar el tono perfecto</li>
              <li>• Los gradientes añaden profundidad y modernidad</li>
              <li>• Usa el color personalizado para tonos específicos de tu marca</li>
              <li>• Los colores oscuros contrastan mejor con texto blanco</li>
              <li>• Considera la psicología del color: azul (confianza), verde (naturaleza), rojo (pasión)</li>
            </ul>
          </div>

          {/* Color Psychology Guide */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🧠 Psicología del color</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                • <span className="text-blue-600">Azul:</span> Confianza, profesionalidad
              </div>
              <div>
                • <span className="text-green-600">Verde:</span> Naturaleza, crecimiento
              </div>
              <div>
                • <span className="text-red-600">Rojo:</span> Pasión, energía
              </div>
              <div>
                • <span className="text-purple-600">Morado:</span> Creatividad, lujo
              </div>
              <div>
                • <span className="text-orange-600">Naranja:</span> Entusiasmo, calidez
              </div>
              <div>
                • <span className="text-gray-600">Gris:</span> Elegancia, sofisticación
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
