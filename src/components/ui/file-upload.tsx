"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Image, X, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FileUploadComponentProps {
  value?: { url: string; filename: string; size: number; type: string } | null
  onChange: (file: { url: string; filename: string; size: number; type: string } | null) => void
  accept?: string
}

export function FileUploadComponent({ value, onChange, accept = "*/*" }: FileUploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File) => {
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload')
      }

      console.log('✅ Upload concluído:', data)
      onChange({
        url: data.url,
        filename: data.filename,
        size: data.size,
        type: data.type
      })

    } catch (error: any) {
      console.error('❌ Erro no upload:', error)
      setError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeFile = () => {
    onChange(null)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type && type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-500" />
    }
    return <FileText className="h-6 w-6 text-gray-500" />
  }

  if (value) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {getFileIcon(value.type)}
            <div>
              <p className="text-sm font-medium text-green-800">{value.filename}</p>
              <p className="text-xs text-green-600">{formatFileSize(value.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Uploaded ✓
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Preview para imagens */}
        {value.type && value.type.startsWith('image/') && (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={value.url} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-orange-500 bg-orange-50'
            : isUploading
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-3">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isUploading ? 'Enviando arquivo...' : 'Clique ou arraste um arquivo'}
            </p>
            <p className="text-sm text-gray-500">
              {isUploading ? 'Por favor, aguarde' : 'PDF, Imagens, Documentos (máx. 10MB)'}
            </p>
          </div>
          
          {!isUploading && (
            <Button type="button" variant="outline" className="mt-2">
              Selecionar Arquivo
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  )
}
