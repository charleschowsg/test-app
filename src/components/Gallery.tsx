'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Photo = {
  id: string
  filename: string
  filepath: string
  created_at: string
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()

    // Subscribe to new photos
    const channel = supabase
      .channel('photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        setPhotos((prev) => [payload.new as Photo, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading photos...</p>
  }

  if (photos.length === 0) {
    return <p className="text-center text-gray-500">No photos yet. Upload one above!</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={photo.filepath}
            alt={photo.filename}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      ))}
    </div>
  )
}
