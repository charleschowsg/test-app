'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filename, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filename)

      // Save to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({ filename, filepath: publicUrl })

      if (dbError) throw dbError

      setMessage('Upload successful!')
      // Clear the input
      e.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <span className="text-gray-600">
          {uploading ? 'Uploading...' : 'Click to upload a photo'}
        </span>
      </label>
      {message && (
        <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}
