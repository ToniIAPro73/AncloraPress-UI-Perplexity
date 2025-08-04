"use client"

import { useState } from "react"
import { Sparkles, Palette, ImageIcon, Edit3, Lightbulb, Wand2, RefreshCw } from "lucide-react"

interface AICopilotProps {
  bookData: {
    title: string
    content: string
    genre?: string
  }
  onSuggestion: (suggestion: any) => void
}

const colorTrends2025 = [
  {
    name: "Neon Green",
    colors: ["#39FF14", "#32CD32", "#00FF7F"],
    psychology: "Energía, innovación, sostenibilidad",
    trend: "Tech & Startups",
  },
  {
    name: "Electric Blue",
    colors: ["#007FFF", "#0080FF", "#4169E1"],
    psychology: "Confianza digital, futuro, profesionalidad",
    trend: "Corporate & SaaS",
  },
  {
    name: "Sunset Orange",
    colors: ["#FF6B35", "#FF8C42", "#FFA500"],
    psychology: "Optimismo, creatividad, calidez",
    trend: "Lifestyle & Wellness",
  },
  {
    name: "Deep Purple",
    colors: ["#6A0DAD", "#8A2BE2", "#9932CC"],
    psychology: "Lujo, misterio, creatividad",
    trend: "Premium & Luxury",
  },
  {
    name: "Coral Pink",
    colors: ["#FF7F7F", "#FF6B9D", "#FF69B4"],
    psychology: "Empatía, inclusión, modernidad",
    trend: "Social & Community",
  },
]

const genrePrompts = {
  fiction: "Una portada cinematográfica con atmósfera misteriosa",
  technical: "Diseño limpio y profesional con elementos geométricos",
  cookbook: "Imagen apetitosa con ingredientes frescos y colores cálidos",
  business: "Composición moderna y corporativa con tipografía elegante",
  selfhelp: "Diseño inspiracional con colores energéticos y motivacionales",
  academic: "Estilo académico con elementos educativos y paleta seria",
  children: "Ilustración colorida y juguetona con personajes amigables",
  romance: "Diseño romántico con colores suaves y elementos elegantes",
}

export default function AICopilot({ bookData, onSuggestion }: AICopilotProps) {
  const [activeTab, setActiveTab] = useState<"style" | "cover" | "rewrite">("style")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [rewriteMode, setRewriteMode] = useState<"tone" | "clarity" | "seo">("tone")

  const generateStyleSuggestions = async () => {
    setIsGenerating(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const suggestions = colorTrends2025.map((trend) => ({
      type: "color-palette",
      name: trend.name,
      colors: trend.colors,
      reasoning: `Basado en "${bookData.title}", sugiero ${trend.name} porque ${trend.psychology.toLowerCase()}. Tendencia 2025: ${trend.trend}.`,
    }))

    setIsGenerating(false)
    onSuggestion({ type: "style-suggestions", data: suggestions })
  }

  const generateCoverAI = async (genre: string) => {
    setIsGenerating(true)

    const prompt = genrePrompts[genre as keyof typeof genrePrompts] || genrePrompts.fiction

    // Simulate DALL-E/Ideogram API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockGeneratedImage = `/placeholder.svg?height=600&width=400&text=AI+Generated+Cover`

    setIsGenerating(false)
    onSuggestion({
      type: "ai-cover",
      data: {
        image: mockGeneratedImage,
        prompt: `${prompt} para "${bookData.title}"`,
        genre,
      },
    })
  }

  const rewriteText = async (text: string, mode: string) => {
    setIsGenerating(true)

    // Simulate HyperWrite API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const rewrittenText = {
      tone: `${text} [Reescrito con tono más profesional y engaging]`,
      clarity: `${text} [Reescrito para mayor claridad y comprensión]`,
      seo: `${text} [Optimizado para SEO con palabras clave relevantes]`,
    }

    setIsGenerating(false)
    onSuggestion({
      type: "text-rewrite",
      data: {
        original: text,
        rewritten: rewrittenText[mode as keyof typeof rewrittenText],
        mode,
      },
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="card-title">Copiloto IA</h2>
        </div>
        <p className="card-subtitle">Asistente inteligente para diseño y contenido</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "style", name: "Estilo", icon: Palette },
            { id: "cover", name: "Portada IA", icon: ImageIcon },
            { id: "rewrite", name: "Rewrite Coach", icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="card-body">
        {/* Style Copilot */}
        {activeTab === "style" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Análisis de Tendencias 2025</h3>
                  <p className="text-small text-gray-600">
                    Basado en tu título "{bookData.title}", analizaré las tendencias cromáticas y psicología del color
                    para sugerir paletas optimizadas.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={generateStyleSuggestions} disabled={isGenerating} className="btn btn-primary w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analizando tendencias...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generar Sugerencias de Estilo
                </>
              )}
            </button>

            {/* Trend Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorTrends2025.slice(0, 4).map((trend, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {trend.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{trend.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{trend.psychology}</p>
                  <p className="text-xs text-primary font-medium">{trend.trend}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cover AI Generator */}
        {activeTab === "cover" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <ImageIcon className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Generador de Portadas IA</h3>
                  <p className="text-small text-gray-600">
                    Integración con DALL-E/Ideogram para crear portadas únicas basadas en tu género y contenido.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="input-label">Selecciona el género de tu libro:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.keys(genrePrompts).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => generateCoverAI(genre)}
                      disabled={isGenerating}
                      className="btn btn-secondary btn-sm capitalize"
                    >
                      {genre.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  ))}
                </div>
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin mb-4" />
                  <p className="text-gray-600">Generando portada con IA...</p>
                  <p className="text-small text-gray-500">Esto puede tomar 30-60 segundos</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Prompts Prearmados</h4>
              <div className="space-y-2 text-small text-gray-600">
                <p>
                  <strong>Ficción:</strong> "Portada cinematográfica con atmósfera misteriosa"
                </p>
                <p>
                  <strong>Técnico:</strong> "Diseño limpio con elementos geométricos modernos"
                </p>
                <p>
                  <strong>Cocina:</strong> "Imagen apetitosa con ingredientes frescos"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rewrite Coach */}
        {activeTab === "rewrite" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Edit3 className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Rewrite Coach</h3>
                  <p className="text-small text-gray-600">
                    Selecciona texto en tu editor y mejóralo automáticamente para tono, claridad o SEO.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="input-label">Texto a mejorar:</label>
                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Pega aquí el texto que quieres mejorar..."
                  className="input h-24 resize-none"
                />
              </div>

              <div>
                <label className="input-label">Modo de reescritura:</label>
                <div className="flex space-x-2">
                  {[
                    { id: "tone", name: "Tono", desc: "Más profesional y engaging" },
                    { id: "clarity", name: "Claridad", desc: "Más fácil de entender" },
                    { id: "seo", name: "SEO", desc: "Optimizado para buscadores" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setRewriteMode(mode.id as any)}
                      className={`btn btn-sm ${rewriteMode === mode.id ? "btn-primary" : "btn-secondary"}`}
                      title={mode.desc}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => rewriteText(selectedText, rewriteMode)}
                disabled={!selectedText.trim() || isGenerating}
                className="btn btn-primary w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Reescribiendo...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Mejorar Texto
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🚀 Próximamente</h4>
              <ul className="text-small text-gray-600 space-y-1">
                <li>• Integración directa con el editor (seleccionar → mejorar)</li>
                <li>• Análisis de legibilidad en tiempo real</li>
                <li>• Sugerencias de estructura y flow</li>
                <li>• Detección automática de tono inconsistente</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
