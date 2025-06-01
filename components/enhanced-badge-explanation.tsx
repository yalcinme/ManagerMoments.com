"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Award, Star, Crown, Zap, Trophy, Target, Users, Smile } from "lucide-react"

interface EnhancedBadgeExplanationProps {
  badge: string
  isOpen: boolean
  onClose: () => void
}

// Import the same badge data structure
const ALL_BADGES = {
  // ... (same as in enhanced-badge-display.tsx - truncated for brevity)
  // You would copy the entire ALL_BADGES object here
}

const rarityIcons = {
  common: Star,
  rare: Award,
  epic: Crown,
  legendary: Zap,
}

const rarityColors = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
}

const categoryIcons = {
  "Strategy & Planning": Trophy,
  "Performance & Luck": Target,
  "Achievements & Milestones": Award,
  "Social & Community": Users,
  "Fun & Humorous": Smile,
}

export function EnhancedBadgeExplanation({ badge, isOpen, onClose }: EnhancedBadgeExplanationProps) {
  const badgeData = ALL_BADGES[badge as keyof typeof ALL_BADGES]
  if (!badgeData) return null

  const RarityIcon = rarityIcons[badgeData.rarity]
  const CategoryIcon = categoryIcons[badgeData.category as keyof typeof categoryIcons]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 fifa-glass flex items-center justify-center p-4 sm:p-6 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fifa-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${badgeData.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}
                >
                  {badgeData.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold fifa-text-primary break-words">{badge}</h3>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <RarityIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${rarityColors[badgeData.rarity]} flex-shrink-0`} />
                    <span className={`text-xs sm:text-sm ${rarityColors[badgeData.rarity]} capitalize`}>
                      {badgeData.rarity}
                    </span>
                    <span className="fifa-text-secondary text-xs">•</span>
                    <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4 fifa-text-secondary flex-shrink-0" />
                    <span className="text-xs fifa-text-secondary">{badgeData.category}</span>
                  </div>
                </div>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="p-1 sm:p-2 rounded-xl flex-shrink-0">
                <X className="w-4 h-4 sm:w-5 sm:h-5 fifa-text-secondary" />
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="font-semibold fifa-text-primary mb-2 text-sm sm:text-base">What this badge means:</h4>
                <p className="fifa-text-secondary text-xs sm:text-sm leading-relaxed">{badgeData.description}</p>
              </div>

              <div>
                <h4 className="font-semibold fifa-text-primary mb-2 text-sm sm:text-base">How it's calculated:</h4>
                <p className="fifa-text-secondary text-xs sm:text-sm leading-relaxed">{badgeData.calculation}</p>
              </div>

              <div className="fifa-card p-3 sm:p-4 rounded-xl sm:rounded-2xl fifa-warning">
                <div className="flex items-start gap-2 sm:gap-3">
                  <RarityIcon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${rarityColors[badgeData.rarity]} flex-shrink-0 mt-0.5`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm fifa-text-primary font-medium block mb-1">
                      {badgeData.rarity.charAt(0).toUpperCase() + badgeData.rarity.slice(1)} Badge
                    </span>
                    <span className="text-xs fifa-text-secondary">
                      {badgeData.rarity === "common"
                        ? "Earned by 30%+ of active managers"
                        : badgeData.rarity === "rare"
                          ? "Earned by 10-30% of active managers"
                          : badgeData.rarity === "epic"
                            ? "Earned by 3-10% of active managers"
                            : "Earned by <3% of active managers - truly elite!"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <div className="fifa-text-secondary text-xs">
                  🏆 {badgeData.rarity === "legendary" ? "Legendary achievement unlocked!" : "Achievement unlocked!"} 🏆
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
