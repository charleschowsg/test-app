import ImageUploader from '@/components/ImageUploader'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>

        <ImageUploader />

        <Gallery />
      </main>
    </div>
  )
}
