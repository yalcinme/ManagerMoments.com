"use client"

import { motion } from "framer-motion"
import { Sparkles, Heart, TrendingUp } from "lucide-react"

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
      <div className="absolute inset-0 bg-black/80" />

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-2 border-purple-300 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse" />
              <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">30,000+ FPL Fans!</h2>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-200 fill-pink-200" />
              <p className="text-white font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
                Thank You for Your Amazing Support!
              </p>
            </div>
            <p className="text-purple-50 text-sm sm:text-base md:text-lg leading-relaxed text-pretty">
              Your FPL Wrapped experience has been visited by over 30,000 passionate FPL managers. We're blown away by
              your enthusiasm!
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-blue-600 to-cyan-600 border-2 border-blue-300 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
              <TrendingUp className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-200" />
              <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                Leveling Up Your Experience
              </h3>
            </div>
            <p className="text-blue-50 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-3 sm:mb-4 text-pretty">
              We're currently optimizing the platform and preparing exciting new mid-season features just for you.
            </p>
            <p className="text-cyan-100 font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-pretty">
              Thank you for your patience. We'll be back soon with an even better FPL experience!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
