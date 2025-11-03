"use client"

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 sm:p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center space-y-8 sm:space-y-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8 sm:mb-12">Manager Moments</h1>

        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              Thank You, 30,000+ FPL Fans!
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Your FPL Wrapped experience has been visited by over 30,000 passionate managers. We're blown away by your
              enthusiasm.
            </p>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-gray-200 space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Optimizing Your Experience</h3>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We're currently preparing exciting new mid-season features just for you.
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Thank you for your patience. We'll be back soon with an even better FPL experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
