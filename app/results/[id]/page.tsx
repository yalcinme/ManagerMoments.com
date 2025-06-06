export default function Results({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">FPL Results</h1>
        <p className="mb-8">Results for Manager ID: {params.id}</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
