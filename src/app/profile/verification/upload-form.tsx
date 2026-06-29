'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { saveVideoUrls } from '@/app/actions/verification'

const MAX_FILES = 3
const MIN_FILES = 2
const MAX_SIZE_MB = 100
const ACCEPTED = 'video/mp4,video/quicktime,video/webm,video/x-msvideo,video/mpeg'

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadForm({
  userId,
  existingUrls,
  verificationStatus,
}: {
  userId: string
  existingUrls: string[] | null
  verificationStatus: string | null
}) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setError(null)

    if (selected.length < MIN_FILES || selected.length > MAX_FILES) {
      setError(`Select between ${MIN_FILES} and ${MAX_FILES} videos.`)
      setFiles([])
      return
    }

    const oversized = selected.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`Each video must be under ${MAX_SIZE_MB} MB. ${oversized.map((f) => f.name).join(', ')} exceeded the limit.`)
      setFiles([])
      return
    }

    setFiles(selected)
  }

  async function handleUpload() {
    if (files.length < MIN_FILES) {
      setError(`Select at least ${MIN_FILES} videos first.`)
      return
    }

    setUploading(true)
    setError(null)
    setUploadedCount(0)

    const supabase = createClient()
    const urls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${userId}/${Date.now()}_${safeName}`

      const { data, error: uploadError } = await supabase.storage
        .from('content')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`)
        setUploading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(data.path)

      urls.push(publicUrl)
      setUploadedCount(i + 1)
    }

    const result = await saveVideoUrls(urls)
    setUploading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      setDone(true)
    }
  }

  if (done || verificationStatus === 'pending') {
    return (
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-[#1ee231] text-xl mt-0.5">✓</span>
          <div>
            <p className="text-white font-semibold mb-1">Samples submitted</p>
            <p className="text-[#a3a3a3] text-sm">
              Your videos are with our team. We review all submissions within 3 working days and will email you the outcome.
            </p>
            {existingUrls && existingUrls.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-2">Submitted videos</p>
                {existingUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#1ee231] text-sm hover:underline truncate"
                  >
                    Video {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        {verificationStatus === 'pending' && (
          <button
            onClick={() => setDone(false)}
            className="mt-5 text-sm text-[#a3a3a3] hover:text-white transition-colors"
          >
            Upload new videos instead
          </button>
        )}
      </div>
    )
  }

  if (verificationStatus === 'approved') {
    return (
      <div className="bg-[#1ee231]/10 border border-[#1ee231]/30 rounded-xl p-6">
        <p className="text-[#1ee231] font-semibold mb-1">Verified</p>
        <p className="text-[#d4d4d4] text-sm">Your profile is verified. Your verified badge is visible to brands browsing the creator directory.</p>
      </div>
    )
  }

  if (verificationStatus === 'rejected') {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-6">
          <p className="text-[#ef4444] font-semibold mb-1">Not approved this time</p>
          <p className="text-[#d4d4d4] text-sm">Check the email we sent for feedback from our team. You can re-submit below once you have addressed it.</p>
        </div>
        <UploadSection
          files={files}
          uploading={uploading}
          uploadedCount={uploadedCount}
          error={error}
          inputRef={inputRef}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
        />
      </div>
    )
  }

  return (
    <UploadSection
      files={files}
      uploading={uploading}
      uploadedCount={uploadedCount}
      error={error}
      inputRef={inputRef}
      onFileChange={handleFileChange}
      onUpload={handleUpload}
    />
  )
}

function UploadSection({
  files,
  uploading,
  uploadedCount,
  error,
  inputRef,
  onFileChange,
  onUpload,
}: {
  files: File[]
  uploading: boolean
  uploadedCount: number
  error: string | null
  inputRef: React.RefObject<HTMLInputElement>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* File picker */}
      <div
        className="bg-[#1c1c1c] border-2 border-dashed border-[#2a2a2a] rounded-xl p-8 text-center cursor-pointer hover:border-[#1ee231]/40 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />
        <p className="text-white font-medium mb-1">
          {files.length > 0
            ? `${files.length} video${files.length !== 1 ? 's' : ''} selected`
            : 'Click to select videos'}
        </p>
        <p className="text-[#a3a3a3] text-sm">
          {files.length > 0
            ? files.map((f) => f.name).join(', ')
            : `Select ${MIN_FILES}–${MAX_FILES} UGC sample videos · MP4, MOV, WebM · max ${MAX_SIZE_MB} MB each`}
        </p>
      </div>

      {/* Selected file list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{file.name}</p>
                <p className="text-[#a3a3a3] text-xs">{formatBytes(file.size)}</p>
              </div>
              {uploading && i < uploadedCount ? (
                <span className="text-[#1ee231] text-sm flex-shrink-0 ml-3">Uploaded</span>
              ) : uploading && i === uploadedCount ? (
                <span className="text-[#f59e0b] text-sm flex-shrink-0 ml-3">Uploading...</span>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[#ef4444] text-sm">{error}</p>
      )}

      {uploading && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-4 py-3">
          <p className="text-[#a3a3a3] text-xs uppercase tracking-wider mb-2">
            Uploading {uploadedCount} of {files.length}
          </p>
          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1ee231] rounded-full transition-all duration-300"
              style={{ width: `${(uploadedCount / files.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={onUpload}
        disabled={uploading || files.length < MIN_FILES}
        className="self-start bg-[#1ee231] text-[#151515] font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-[#17c029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Submit for verification'}
      </button>
    </div>
  )
}
