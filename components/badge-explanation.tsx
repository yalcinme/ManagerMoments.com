"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Award } from "lucide-react"

interface BadgeExplanationProps {
  badge: string
  isOpen: boolean
  onClose: () => void
}

const BADGE_EXPLANATIONS: Record<
  string,
  {
    name: string
    description: string
    howToEarn: string
    rarity: string
    icon: string
  }
> = {
  "POINTS MACHINE": {
    name: "Points Machine",
    description: "You scored an incredible 2,500+ points this season!",
    howToEarn: "Score 2,500 or more total points in a single season. Only the most elite managers achieve this.",
    rarity: "Legendary",
    icon: "⚡",
  },
  "CENTURY CLUB": {
    name: "Century Club",
    description: "You scored an excellent 2,200+ points this season!",
    howToEarn: "Score 2,200 or more total points in a single season. Shows consistent high performance.",
    rarity: "Epic",
    icon: "💯",
  },
  "TOP 100K": {
    name: "Top 100K",
    description: "You finished in the top 100,000 managers worldwide!",
    howToEarn: "Finish the season ranked in the top 100,000 out of 11+ million players.",
    rarity: "Epic",
    icon: "⭐",
  },
  "TRIPLE DIGITS": {
    name: "Triple Digits",
    description: "You scored 100+ points in a single gameweek!",
    howToEarn: "Score 100 or more points in any single gameweek. Requires perfect team selection and luck.",
    rarity: "Rare",
    icon: "🔥",
  },
  "GREEN MACHINE": {
    name: "Green Machine",
    description: "You had 20+ green arrows this season!",
    howToEarn: "Achieve 20 or more green arrows (rank improvements) throughout the season.",
    rarity: "Epic",
    icon: "🟢",
  },
  "CAPTAIN MARVEL": {
    name: "Captain Marvel",
    description: "You had a 75%+ captain success rate!",
    howToEarn: "Have your captain score 8+ points in 75% or more of your gameweeks.",
    rarity: "Rare",
    icon: "👑",
  },
  "ABOVE AVERAGE": {
    name: "Above Average",
    description: "You averaged 55+ points per gameweek!",
    howToEarn: "Maintain an average of 55 or more points per gameweek throughout the season.",
    rarity: "Common",
    icon: "📈",
  },
  "CHIP MASTER": {
    name: "Chip Master",
    description: "You used all 4 chips effectively!",
    howToEarn: "Use all four chips (Wildcard, Bench Boost, Free Hit, Triple Captain) during the season.",
    rarity: "Rare",
    icon: "🎯",
  },
}

export function BadgeExplanation({ badge, isOpen, onClose }: BadgeExplanationProps) {
  const badgeInfo = BADGE_EXPLANATIONS[badge]

  if (!badgeInfo) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "from-yellow-400 to-orange-500"
      case "Epic":
        return "from-purple-400 to-blue-500"
      case "Rare":
        return "from-blue-400 to-cyan-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(badgeInfo.rarity)} rounded-2xl blur-xl opacity-60`}
              />

              {/* Modal Content */}
              <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border-2 border-white/20 overflow-hidden">
                {/* Header */}
                <div className={`relative p-6 bg-gradient-to-r ${getRarityColor(badgeInfo.rarity)} bg-opacity-20`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{badgeInfo.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{badgeInfo.name}</h3>
                        <span
                          className={`text-sm uppercase px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(badgeInfo.rarity)} text-white font-medium`}
                        >
                          {badgeInfo.rarity}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Achievement</h4>
                    </div>
                    <p className="text-white leading-relaxed">{badgeInfo.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400">🎯</span>
                      <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">How to Earn</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{badgeInfo.howToEarn}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
