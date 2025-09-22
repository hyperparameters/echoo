"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export interface FileUploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  errorMessage?: string
  response?: any
}

interface UploadProgressBarProps {
  files: FileUploadProgress[]
  onCancel?: () => void
  onRetry?: (fileIndex: number) => void
  onClose?: () => void
  className?: string
}

export function UploadProgressBar({
  files,
  onCancel,
  onRetry,
  onClose,
  className = ""
}: UploadProgressBarProps) {
  const totalFiles = files.length
  const completedFiles = files.filter(f => f.status === 'completed').length
  const failedFiles = files.filter(f => f.status === 'error').length
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0
  const allCompleted = completedFiles === totalFiles && failedFiles === 0
  const hasErrors = failedFiles > 0

  const getStatusIcon = (status: FileUploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'uploading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Upload className="w-4 h-4 text-primary" />
          </motion.div>
        )
      default:
        return <Upload className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getProgressColor = (status: FileUploadProgress['status'], progress: number) => {
    if (status === 'error') return 'bg-red-500'
    if (status === 'completed') return 'bg-green-500'
    return 'bg-gradient-to-r from-primary to-secondary'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
      >
        <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-md">
          <CardContent className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  {allCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {allCompleted ? 'Upload Complete!' : 'Uploading Files'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {completedFiles} of {totalFiles} files uploaded
                    {hasErrors && ` • ${failedFiles} failed`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!allCompleted && onCancel && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCancel}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {(allCompleted || hasErrors) && onClose && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    className="hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Individual File Progress */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {files.map((fileProgress, index) => (
                <motion.div
                  key={`${fileProgress.file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(fileProgress.status)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {fileProgress.file.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {(fileProgress.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>

                    {fileProgress.status === 'error' && fileProgress.errorMessage ? (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-red-500">{fileProgress.errorMessage}</p>
                        {onRetry && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRetry(index)}
                            className="h-6 px-2 text-xs hover:bg-red-100 hover:text-red-700"
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {fileProgress.status === 'completed' ? 'Completed' :
                             fileProgress.status === 'pending' ? 'Pending' : 'Uploading'}
                          </span>
                          <span className="font-medium">
                            {fileProgress.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${getProgressColor(fileProgress.status, fileProgress.progress)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${fileProgress.progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}