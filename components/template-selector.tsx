"use client"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const templates = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y minimalista con tipografía elegante",
    preview: "/placeholder.svg?height=300&width=200",
    features: ["Tipografía Inter", "Espaciado amplio", "Diseño minimalista"],
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Estilo tradicional perfecto para literatura y ensayos",
    preview: "/placeholder.svg?height=300&width=200",
    features: ["Tipografía serif", "Márgenes tradicionales", "Estilo académico"],
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño dinámico ideal para contenido visual y creativo",
    preview: "/placeholder.svg?height=300&width=200",
    features: ["Layouts flexibles", "Elementos visuales", "Diseño innovador"],
  },
]

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Selecciona una plantilla</h2>
        <p className="card-subtitle">Elige el diseño que mejor se adapte a tu contenido</p>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="aspect-[3/4] mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`Vista previa de plantilla ${template.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
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

                <p className="text-small text-gray-600">{template.description}</p>

                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-small text-gray-500">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">ℹ️ Personalización</h4>
          <p className="text-small text-gray-600">
            Todas las plantillas son completamente personalizables. Podrás ajustar colores, tipografía y espaciado en
            versiones futuras de Anclora Press.
          </p>
        </div>
      </div>
    </div>
  )
}
