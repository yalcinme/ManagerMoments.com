"use client"

import { motion } from "framer-motion"

interface BadgeDisplayProps {
  badges: string[]
  showExplanations?: boolean
  onBadgeClick?: (badge: string) => void
}

const BADGE_INFO: Record<string, { icon: string; description: string; rarity: string; color: string }> = {
  "POINTS MACHINE": {
    icon: "⚡",
    description: "Scored 2500+ points - Elite performance!",
    rarity: "Legendary",
    color: "from-yellow-400 to-orange-500",
  },
  "CENTURY CLUB": {
    icon: "💯",
    description: "Scored 2200+ points - Excellent season!",
    rarity: "Epic",
    color: "from-purple-500 to-purple-700",
  },
  "TOP 100K": {
    icon: "⭐",
    description: "Finished in top 100,000 managers",
    rarity: "Epic",
    color: "from-indigo-500 to-indigo-700",
  },
  "TRIPLE DIGITS": {
    icon: "🔥",
    description: "100+ points in a single gameweek",
    rarity: "Rare",
    color: "from-orange-500 to-red-600",
  },
  "GREEN MACHINE": {
    icon: "🟢",
    description: "20+ green arrows - Consistent climber!",
    rarity: "Epic",
    color: "from-green-500 to-green-700",
  },
  "CAPTAIN MARVEL": {
    icon: "👑",
    description: "75%+ captain success rate",
    rarity: "Rare",
    color: "from-yellow-500 to-yellow-700",
  },
  "ABOVE AVERAGE": {
    icon: "📈",
    description: "55+ average points per gameweek",
    rarity: "Common",
    color: "from-teal-500 to-teal-700",
  },
  "CHIP MASTER": {
    icon: "🎯",
    description: "Used all 4 chips effectively",
    rarity: "Rare",
    color: "from-pink-500 to-pink-700",
  },
  "SET & FORGET": {
    icon: "🧠",
    description: "Minimal transfers strategy",
    rarity: "Common",
    color: "from-blue-500 to-blue-700",
  },
  "TRANSFER KING": {
    icon: "🔄",
    description: "Active in transfer market",
    rarity: "Common",
    color: "from-cyan-500 to-cyan-700",
  },
}

export function BadgeDisplay({ badges, showExplanations = false, onBadgeClick }: BadgeDisplayProps) {
  console.log("BadgeDisplay received badges:", badges)

  if (!badges || badges.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6 sm:py-8">
        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏅</div>
        <p className="text-base sm:text-lg">No badges earned this season</p>
        <p className="text-sm mt-2 opacity-75">Keep playing to unlock achievements!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {badges.map((badge, index) => {
        const badgeInfo = BADGE_INFO[badge] || {
          icon: "🏅",
          description: "Special achievement unlocked",
          rarity: "Common",
          color: "from-gray-500 to-gray-700",
        }

        return (
          <motion.div
            key={badge}
            initial={{ scale: 0, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              duration: 0.6,
            }}
            whileHover={{
              scale: 1.05,
              y: -5,
              rotateY: 10,
            }}
            whileTap={{ scale: 0.95 }}
            className={`relative cursor-pointer group ${onBadgeClick ? "hover:cursor-pointer" : ""}`}
            onClick={() => onBadgeClick?.(badge)}
          >
            {/* Badge Background with Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${badgeInfo.color} rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
            />

            {/* Badge Content */}
            <div className="relative bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/20 hover:border-white/40 transition-all duration-300 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center">
              {/* Rarity Indicator */}
              <div className="absolute top-2 right-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    badgeInfo.rarity === "Legendary"
                      ? "bg-yellow-400"
                      : badgeInfo.rarity === "Epic"
                        ? "bg-purple-400"
                        : badgeInfo.rarity === "Rare"
                          ? "bg-blue-400"
                          : "bg-gray-400"
                  }`}
                />
              </div>

              {/* Badge Icon */}
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {badgeInfo.icon}
              </motion.div>

              {/* Badge Name */}
              <h4 className="font-bold text-white text-xs sm:text-sm mb-2 leading-tight text-center">{badge}</h4>

              {/* Badge Description */}
              {showExplanations && (
                <p className="text-xs text-white/70 leading-relaxed text-center">{badgeInfo.description}</p>
              )}

              {/* Rarity Label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    badgeInfo.rarity === "Legendary"
                      ? "bg-yellow-400/20 text-yellow-300"
                      : badgeInfo.rarity === "Epic"
                        ? "bg-purple-400/20 text-purple-300"
                        : badgeInfo.rarity === "Rare"
                          ? "bg-blue-400/20 text-blue-300"
                          : "bg-gray-400/20 text-gray-300"
                  }`}
                >
                  {badgeInfo.rarity}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
