"use client"

import { motion } from "framer-motion"

interface LoadingFallbackProps {
  message?: string
  className?: string
}

export function LoadingFallback({ message = "Loading...", className = "h-screen w-screen" }: LoadingFallbackProps) {
  return (
    <div className={`${className} bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center`}>
      <div className="text-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full border-4 border-green-200 border-t-green-600"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-green-800 font-medium text-sm sm:text-base"
        >
          {message}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="h-1 bg-green-200 rounded-full mt-4 max-w-xs mx-auto overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="h-full w-1/3 bg-green-600 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingFallback
