"use client"

import { useState } from "react"
import { MessageCircle, Users, History, Share2, Eye, Edit, GitBranch, Clock } from "lucide-react"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: Date
  position: { start: number; end: number }
  resolved: boolean
  replies: Comment[]
}

interface Version {
  id: string
  author: string
  timestamp: Date
  message: string
  changes: {
    added: number
    removed: number
    modified: number
  }
}

interface CollaborationPanelProps {
  bookData: {
    title: string
    content: string
  }
  comments: Comment[]
  versions: Version[]
  collaborators: Array<{
    id: string
    name: string
    email: string
    role: "owner" | "editor" | "commenter"
    avatar: string
    status: "online" | "offline"
  }>
  onAddComment: (comment: Omit<Comment, "id" | "timestamp">) => void
  onResolveComment: (commentId: string) => void
  onRevertVersion: (versionId: string) => void
}

export default function CollaborationPanel({
  bookData,
  comments,
  versions,
  collaborators,
  onAddComment,
  onResolveComment,
  onRevertVersion,
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "versions" | "collaborators">("comments")
  const [newComment, setNewComment] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedText) return

    onAddComment({
      author: "Usuario Actual",
      avatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      position: { start: 0, end: selectedText.length },
      resolved: false,
      replies: [],
    })

    setNewComment("")
    setSelectedText("")
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `hace ${minutes}m`
    if (hours < 24) return `hace ${hours}h`
    return `hace ${days}d`
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="card-title">Colaboración</h2>
          </div>
          <button onClick={() => setShowInviteModal(true)} className="btn btn-primary btn-sm">
            <Share2 className="h-4 w-4 mr-2" />
            Invitar
          </button>
        </div>
      </div>

      {/* Collaborators Status */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Colaboradores activos:</span>
          <div className="flex -space-x-2">
            {collaborators.slice(0, 4).map((collaborator) => (
              <div key={collaborator.id} className="relative" title={`${collaborator.name} (${collaborator.role})`}>
                <img
                  src={collaborator.avatar || "/placeholder.svg"}
                  alt={collaborator.name}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
            ))}
            {collaborators.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{collaborators.length - 4}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "comments", name: "Comentarios", icon: MessageCircle, count: comments.length },
            { id: "versions", name: "Versiones", icon: History, count: versions.length },
            { id: "collaborators", name: "Equipo", icon: Users, count: collaborators.length },
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
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="card-body max-h-96 overflow-y-auto">
        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Añadir comentario</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Selecciona texto en el editor..."
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  className="input text-sm"
                />
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input h-20 resize-none text-sm"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || !selectedText}
                  className="btn btn-primary btn-sm"
                >
                  Comentar
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`border rounded-lg p-4 ${
                    comment.resolved ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        {!comment.resolved && (
                          <button
                            onClick={() => onResolveComment(comment.id)}
                            className="text-xs text-green-600 hover:text-green-700"
                          >
                            Resolver
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      {comment.position && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          "{bookData.content.substring(comment.position.start, comment.position.end)}"
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-2">
                              <img
                                src={reply.avatar || "/placeholder.svg"}
                                alt={reply.author}
                                className="w-6 h-6 rounded-full"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-xs">{reply.author}</span>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</span>
                                </div>
                                <p className="text-xs text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comentarios</h3>
                  <p className="text-gray-600">Selecciona texto en el editor y añade el primer comentario</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Versions Tab */}
        {activeTab === "versions" && (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GitBranch className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{version.author}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(version.timestamp)}</span>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Actual</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{version.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="text-green-600">+{version.changes.added}</span>
                        <span className="text-red-600">-{version.changes.removed}</span>
                        <span className="text-blue-600">~{version.changes.modified}</span>
                      </div>
                    </div>
                  </div>
                  {index > 0 && (
                    <button onClick={() => onRevertVersion(version.id)} className="btn btn-tertiary btn-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Revertir
                    </button>
                  )}
                </div>
              </div>
            ))}

            {versions.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay versiones</h3>
                <p className="text-gray-600">Los cambios se guardarán automáticamente como versiones</p>
              </div>
            )}
          </div>
        )}

        {/* Collaborators Tab */}
        {activeTab === "collaborators" && (
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={collaborator.avatar || "/placeholder.svg"}
                      alt={collaborator.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{collaborator.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          collaborator.role === "owner"
                            ? "bg-purple-100 text-purple-800"
                            : collaborator.role === "editor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {collaborator.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {collaborator.role !== "owner" && (
                    <>
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="Ver permisos">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="Editar permisos">
                        <Edit className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Invitar colaboradores</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" placeholder="colaborador@email.com" className="input" />
                </div>
                <div>
                  <label className="input-label">Rol</label>
                  <select className="input">
                    <option value="commenter">Solo comentar</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowInviteModal(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button className="btn btn-primary">Enviar invitación</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Info */}
      <div className="card-footer bg-green-50">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Colaboración en Tiempo Real</h4>
            <p className="text-small text-gray-600">
              Sistema inspirado en Google Docs con comentarios contextuales, historial Git-lite y roles granulares. Los
              cambios se sincronizan automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
