"use client"

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, FileImage, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { UploadService, FilecoinUploadResponse, UploadProgress } from '@/services/upload'
import { UploadProgressBar, FileUploadProgress } from './upload-progress-bar'

interface FileUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (responses: FilecoinUploadResponse[]) => void
  maxFiles?: number
  maxFileSize?: number
  acceptedFileTypes?: string[]
}

export function FileUploadDialog({
  isOpen,
  onClose,
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedFileTypes = ['image/*']
}: FileUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<FilecoinUploadResponse[]>([])
  const [showProgress, setShowProgress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = useCallback(() => {
    setSelectedFiles([])
    setUploadProgress([])
    setIsUploading(false)
    setUploadResults([])
    setShowProgress(false)
  }, [])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      // Check file type
      const isValidType = acceptedFileTypes.some(type => {
        if (type === 'image/*') return file.type.startsWith('image/')
        if (type.includes('*')) {
          const baseType = type.split('/')[0]
          return file.type.startsWith(baseType)
        }
        return file.type === type
      })

      // Check file size
      const isValidSize = file.size <= maxFileSize

      return isValidType && isValidSize
    })

    if (validFiles.length + selectedFiles.length > maxFiles) {
      validFiles.splice(maxFiles - selectedFiles.length)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }, [selectedFiles, acceptedFileTypes, maxFiles, maxFileSize])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const mockEvent = {
      target: { files: files }
    } as React.ChangeEvent<HTMLInputElement>
    handleFileSelect(mockEvent)
  }, [handleFileSelect])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const getUserId = useCallback(() => {
    try {
      const userData = localStorage.getItem("echooUser")
      if (userData) {
        const user = JSON.parse(userData)
        return user.id || user.userId || 'anonymous-user'
      }
    } catch (error) {
      console.error('Failed to get user ID:', error)
    }
    return `user-${Date.now()}`
  }, [])

  const startUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setShowProgress(true)

    // Initialize progress tracking
    const initialProgress: FileUploadProgress[] = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }))
    setUploadProgress(initialProgress)

    const userId = getUserId()
    const results: FilecoinUploadResponse[] = []

    try {
      // Upload files one by one
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Update status to uploading
        setUploadProgress(prev =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'uploading' as const } : item
          )
        )

        try {
          const result = await UploadService.uploadFile(
            file,
            userId,
            (progress: UploadProgress) => {
              setUploadProgress(prev =>
                prev.map((item, index) =>
                  index === i ? { ...item, progress: progress.percentage } : item
                )
              )
            }
          )

          // Mark as completed
          setUploadProgress(prev =>
            prev.map((item, index) =>
              index === i
                ? { ...item, status: 'completed' as const, progress: 100, response: result }
                : item
            )
          )

          results.push(result)

        } catch (error) {
          // Mark as error
          const errorMessage = error instanceof Error ? error.message : 'Upload failed'
          setUploadProgress(prev =>
            prev.map((item, index) =>
              index === i
                ? { ...item, status: 'error' as const, errorMessage }
                : item
            )
          )
          console.error(`Failed to upload ${file.name}:`, error)
        }
      }

      setUploadResults(results)

      if (results.length > 0 && onUploadComplete) {
        onUploadComplete(results)
      }

    } catch (error) {
      console.error('Upload process failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles, onUploadComplete, getUserId])

  const handleClose = useCallback(() => {
    if (!isUploading) {
      resetState()
      onClose()
    }
  }, [isUploading, resetState, onClose])

  const retryUpload = useCallback(async (fileIndex: number) => {
    const file = selectedFiles[fileIndex]
    if (!file) return

    const userId = getUserId()

    // Reset the file status
    setUploadProgress(prev =>
      prev.map((item, index) =>
        index === fileIndex
          ? { ...item, status: 'uploading' as const, progress: 0, errorMessage: undefined }
          : item
      )
    )

    try {
      const result = await UploadService.uploadFile(
        file,
        userId,
        (progress: UploadProgress) => {
          setUploadProgress(prev =>
            prev.map((item, index) =>
              index === fileIndex ? { ...item, progress: progress.percentage } : item
            )
          )
        }
      )

      setUploadProgress(prev =>
        prev.map((item, index) =>
          index === fileIndex
            ? { ...item, status: 'completed' as const, progress: 100, response: result }
            : item
        )
      )

      setUploadResults(prev => [...prev, result])

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadProgress(prev =>
        prev.map((item, index) =>
          index === fileIndex
            ? { ...item, status: 'error' as const, errorMessage }
            : item
        )
      )
    }
  }, [selectedFiles, getUserId])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* File Drop Zone */}
            <Card
              className={`border-2 border-dashed transition-colors ${
                selectedFiles.length > 0
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
            >
              <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose files or drag them here</h3>
                <p className="text-muted-foreground mb-4">
                  Upload up to {maxFiles} files, max {formatFileSize(maxFileSize)} each
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={acceptedFileTypes.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileImage className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      {!isUploading && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Cancel'}
              </Button>
              <Button
                onClick={startUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Overlay */}
      {showProgress && (
        <UploadProgressBar
          files={uploadProgress}
          onClose={() => {
            setShowProgress(false)
            if (!isUploading) {
              handleClose()
            }
          }}
          onRetry={retryUpload}
        />
      )}
    </>
  )
}