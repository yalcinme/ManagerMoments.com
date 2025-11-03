"use client"

import { motion } from "framer-motion"
import { Wrench } from "lucide-react"

export default function Home() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-600 via-green-700 to-green-800"
      style={{
        backgroundImage: "url('/images/homepage-podium.png'), url('/images/homepage-podium-fallback.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full px-4 sm:px-6"
      >
        {/* Title - Enhanced responsive typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 text-center leading-tight"
        >
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
            Manager Moments
          </span>
        </motion.h1>

        {/* Maintenance Message - Improved responsive padding and spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-amber-500/30 to-orange-600/30 border-2 border-amber-400/50 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-300 animate-pulse" />
            <h2 className="text-amber-100 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center sm:text-left">
              Under Maintenance
            </h2>
          </div>

          <p className="text-amber-100/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 sm:mb-6 text-pretty">
            We're optimizing your experience and getting ready for the mid-season features.
          </p>
          <p className="text-amber-200/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-pretty">
            Thank you for your patience. We'll be back soon with an even better FPL experience!
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
