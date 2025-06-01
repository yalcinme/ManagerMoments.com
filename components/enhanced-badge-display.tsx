"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Info, Trophy, Target, Award, Users, Smile } from "lucide-react"

interface EnhancedBadgeDisplayProps {
  earnedBadges?: string[]
  onSelectBadge?: (badge: string) => void
  showProgress?: boolean
}

// Complete badge system with all 50 badges
const ALL_BADGES = {
  // Strategy & Planning Badges (10)
  "Tactical Genius": {
    category: "Strategy & Planning",
    description: "Brilliant captain picks that consistently outperformed the average.",
    calculation: "Most captaincy points gained above average captain score across season.",
    icon: "🧠",
    rarity: "epic" as const,
    color: "from-purple-500 to-indigo-600",
  },
  "Wildcard Warrior": {
    category: "Strategy & Planning",
    description: "Masterful wildcard timing that transformed your season.",
    calculation: "Highest total points gained the week following wildcard use.",
    icon: "🃏",
    rarity: "rare" as const,
    color: "from-blue-500 to-cyan-600",
  },
  "Fixture Expert": {
    category: "Strategy & Planning",
    description: "Expertly exploited favorable fixtures for maximum points.",
    calculation: "Highest points earned against lower FDR-rated teams.",
    icon: "📅",
    rarity: "rare" as const,
    color: "from-green-500 to-emerald-600",
  },
  "Chip Magician": {
    category: "Strategy & Planning",
    description: "Perfect timing with all your FPL chips.",
    calculation: "Highest total points from chip usage weeks.",
    icon: "🎩",
    rarity: "epic" as const,
    color: "from-orange-500 to-red-600",
  },
  "Captain Marvel": {
    category: "Strategy & Planning",
    description: "Exceptional captaincy choices throughout the season.",
    calculation: "Total points gained from captaincy selection over season.",
    icon: "👑",
    rarity: "rare" as const,
    color: "from-yellow-500 to-amber-600",
  },
  "Planning Master": {
    category: "Strategy & Planning",
    description: "Consistent long-term strategic planning paid off.",
    calculation: "Most consistent upward trend in rankings.",
    icon: "📋",
    rarity: "epic" as const,
    color: "from-indigo-500 to-purple-600",
  },
  "Budget Guru": {
    category: "Strategy & Planning",
    description: "Maximized every penny of your squad budget.",
    calculation: "Highest points-per-million squad value.",
    icon: "💰",
    rarity: "rare" as const,
    color: "from-green-600 to-teal-600",
  },
  "Transfer Wizard": {
    category: "Strategy & Planning",
    description: "Every transfer seemed to turn to gold.",
    calculation: "Highest net points gain from transfers.",
    icon: "🔄",
    rarity: "rare" as const,
    color: "from-purple-500 to-pink-600",
  },
  "Formation Master": {
    category: "Strategy & Planning",
    description: "Perfect formation choices for every gameweek.",
    calculation: "Highest average points per gameweek by chosen formation.",
    icon: "⚽",
    rarity: "common" as const,
    color: "from-blue-500 to-indigo-600",
  },
  "Fixture Strategist": {
    category: "Strategy & Planning",
    description: "Masterfully exploited fixture swings.",
    calculation: "Largest points gain from targeted transfers around fixtures.",
    icon: "🎯",
    rarity: "rare" as const,
    color: "from-red-500 to-orange-600",
  },

  // Performance & Luck Badges (10)
  Benchwarmer: {
    category: "Performance & Luck",
    description: "Your bench was so good, it hurt to leave them out.",
    calculation: "Highest total bench points over season.",
    icon: "🪑",
    rarity: "common" as const,
    color: "from-gray-500 to-slate-600",
  },
  "Triple Captain Triumph": {
    category: "Performance & Luck",
    description: "Your triple captain choice was absolutely perfect.",
    calculation: "Highest points from triple captain player.",
    icon: "⚡",
    rarity: "epic" as const,
    color: "from-yellow-500 to-orange-600",
  },
  "Highest Weekly Score": {
    category: "Performance & Luck",
    description: "Achieved the highest single gameweek score.",
    calculation: "Highest total points in a single gameweek.",
    icon: "🏆",
    rarity: "legendary" as const,
    color: "from-yellow-400 to-yellow-600",
  },
  "Lucky Goal": {
    category: "Performance & Luck",
    description: "Fortune favored you with unexpected performances.",
    calculation: "Most points from last-minute or unexpected player performances.",
    icon: "🍀",
    rarity: "common" as const,
    color: "from-green-400 to-emerald-600",
  },
  "Late Winner": {
    category: "Performance & Luck",
    description: "Injury time goals were your specialty.",
    calculation: "Total points gained in injury-time goals.",
    icon: "⏰",
    rarity: "rare" as const,
    color: "from-red-500 to-pink-600",
  },
  "Risk Taker": {
    category: "Performance & Luck",
    description: "Brave differential picks that paid off handsomely.",
    calculation: "Most total points from players with <5% ownership.",
    icon: "🎲",
    rarity: "epic" as const,
    color: "from-purple-500 to-violet-600",
  },
  "Gameweek Hero": {
    category: "Performance & Luck",
    description: "Consistently scored above the average.",
    calculation: "Number of weeks scored above global average.",
    icon: "⭐",
    rarity: "rare" as const,
    color: "from-blue-500 to-cyan-600",
  },
  "Golden Boot": {
    category: "Performance & Luck",
    description: "Your team was a goal-scoring machine.",
    calculation: "Highest total goals from all squad players combined.",
    icon: "👢",
    rarity: "rare" as const,
    color: "from-yellow-500 to-amber-600",
  },
  "Comeback King": {
    category: "Performance & Luck",
    description: "Staged the most dramatic rank recovery.",
    calculation: "Largest difference between lowest and final ranks.",
    icon: "📈",
    rarity: "epic" as const,
    color: "from-green-500 to-teal-600",
  },
  "Hat-trick Hero": {
    category: "Performance & Luck",
    description: "Benefited from multiple player hat-tricks.",
    calculation: "Total points from player hat-tricks.",
    icon: "🎩",
    rarity: "rare" as const,
    color: "from-orange-500 to-red-600",
  },

  // Achievements & Milestones Badges (10)
  "Top 10k Finish": {
    category: "Achievements & Milestones",
    description: "Finished in the elite top 10,000 managers.",
    calculation: "Final rank below 10,000.",
    icon: "🏅",
    rarity: "legendary" as const,
    color: "from-yellow-400 to-amber-600",
  },
  "Top 100 Finish": {
    category: "Achievements & Milestones",
    description: "Achieved the ultimate top 100 finish.",
    calculation: "Final rank below 100.",
    icon: "👑",
    rarity: "legendary" as const,
    color: "from-yellow-300 to-yellow-500",
  },
  "Mini-League Champion": {
    category: "Achievements & Milestones",
    description: "Conquered your mini-league with authority.",
    calculation: "Ranked first in any joined mini-league.",
    icon: "🏆",
    rarity: "epic" as const,
    color: "from-yellow-500 to-orange-600",
  },
  "Consistency King": {
    category: "Achievements & Milestones",
    description: "Maintained steady performance all season long.",
    calculation: "Lowest weekly score variance.",
    icon: "📊",
    rarity: "rare" as const,
    color: "from-blue-500 to-indigo-600",
  },
  "Century Club": {
    category: "Achievements & Milestones",
    description: "Scored 100+ points in a single gameweek.",
    calculation: "Number of weeks scoring 100+ points.",
    icon: "💯",
    rarity: "epic" as const,
    color: "from-purple-500 to-pink-600",
  },
  "Goal Machine": {
    category: "Achievements & Milestones",
    description: "Your players scored goals for fun.",
    calculation: "Highest total goals scored by team.",
    icon: "⚽",
    rarity: "rare" as const,
    color: "from-green-500 to-emerald-600",
  },
  "Defence Legend": {
    category: "Achievements & Milestones",
    description: "Clean sheets were your specialty.",
    calculation: "Total clean sheets from defence and keeper.",
    icon: "🛡️",
    rarity: "rare" as const,
    color: "from-blue-600 to-indigo-600",
  },
  "Attack Maestro": {
    category: "Achievements & Milestones",
    description: "Your attacking players delivered consistently.",
    calculation: "Total goals and assists from midfielders and forwards.",
    icon: "⚔️",
    rarity: "rare" as const,
    color: "from-red-500 to-orange-600",
  },
  "Assist King": {
    category: "Achievements & Milestones",
    description: "Your team was all about creating chances.",
    calculation: "Highest total assists from squad.",
    icon: "🎯",
    rarity: "rare" as const,
    color: "from-cyan-500 to-blue-600",
  },
  "Streak Holder": {
    category: "Achievements & Milestones",
    description: "Maintained the longest scoring streak.",
    calculation: "Longest consecutive weeks scoring above average.",
    icon: "🔥",
    rarity: "epic" as const,
    color: "from-orange-500 to-red-600",
  },

  // Social & Community Badges (10)
  "League Organizer": {
    category: "Social & Community",
    description: "Created and managed a thriving mini-league.",
    calculation: "Mini-league with highest participation.",
    icon: "👥",
    rarity: "rare" as const,
    color: "from-indigo-500 to-purple-600",
  },
  "Community Helper": {
    category: "Social & Community",
    description: "Always ready to help fellow managers.",
    calculation: "Most interactions or advice given within community.",
    icon: "🤝",
    rarity: "common" as const,
    color: "from-green-500 to-teal-600",
  },
  "Advice Guru": {
    category: "Social & Community",
    description: "Your advice led others to FPL success.",
    calculation: "Highest cumulative points gained by others following recommendations.",
    icon: "💡",
    rarity: "epic" as const,
    color: "from-yellow-500 to-amber-600",
  },
  "Fan Favourite": {
    category: "Social & Community",
    description: "The community's most beloved manager.",
    calculation: "Highest community votes or likes.",
    icon: "❤️",
    rarity: "rare" as const,
    color: "from-pink-500 to-red-600",
  },
  Commentator: {
    category: "Social & Community",
    description: "Provided insightful FPL commentary.",
    calculation: "Most frequent or insightful community posts.",
    icon: "📢",
    rarity: "common" as const,
    color: "from-blue-500 to-cyan-600",
  },
  "Rivalry Winner": {
    category: "Social & Community",
    description: "Dominated head-to-head matchups.",
    calculation: "Most head-to-head league wins.",
    icon: "⚔️",
    rarity: "rare" as const,
    color: "from-red-500 to-orange-600",
  },
  "Most Liked Team": {
    category: "Social & Community",
    description: "Your team was admired by the community.",
    calculation: "Highest cumulative likes across season.",
    icon: "👍",
    rarity: "common" as const,
    color: "from-blue-500 to-indigo-600",
  },
  "Social Star": {
    category: "Social & Community",
    description: "FPL social media sensation.",
    calculation: "Highest social engagement metrics.",
    icon: "🌟",
    rarity: "rare" as const,
    color: "from-purple-500 to-pink-600",
  },
  "Team Player": {
    category: "Social & Community",
    description: "Actively engaged in all mini-league activities.",
    calculation: "Highest participation rate in league activities.",
    icon: "🤜",
    rarity: "common" as const,
    color: "from-green-500 to-emerald-600",
  },
  "Banter Champion": {
    category: "Social & Community",
    description: "The funniest manager in the community.",
    calculation: "Community vote or likes on banter content.",
    icon: "😂",
    rarity: "rare" as const,
    color: "from-yellow-500 to-orange-600",
  },

  // Fun & Humorous Badges (10)
  "Injury Jinx": {
    category: "Fun & Humorous",
    description: "Your players seemed to attract injuries.",
    calculation: "Most injuries suffered by owned players.",
    icon: "🏥",
    rarity: "common" as const,
    color: "from-red-400 to-red-600",
  },
  "Red Card Magnet": {
    category: "Fun & Humorous",
    description: "Your players loved getting sent off.",
    calculation: "Highest number of red cards.",
    icon: "🟥",
    rarity: "common" as const,
    color: "from-red-500 to-red-700",
  },
  "VAR Victim": {
    category: "Fun & Humorous",
    description: "VAR decisions always went against you.",
    calculation: "Most points lost from VAR interventions.",
    icon: "📺",
    rarity: "common" as const,
    color: "from-gray-500 to-slate-600",
  },
  "Rotation Roulette": {
    category: "Fun & Humorous",
    description: "Pep's rotation policy was your nemesis.",
    calculation: "Highest number of players benched unexpectedly.",
    icon: "🎰",
    rarity: "common" as const,
    color: "from-orange-500 to-red-600",
  },
  "Missed Deadline": {
    category: "Fun & Humorous",
    description: "Frequently forgot to set your team.",
    calculation: "Most gameweeks with unchanged lineups.",
    icon: "⏰",
    rarity: "common" as const,
    color: "from-yellow-500 to-orange-600",
  },
  "Yellow Card King": {
    category: "Fun & Humorous",
    description: "Your players collected cards like trophies.",
    calculation: "Highest total yellow cards accumulated.",
    icon: "🟨",
    rarity: "common" as const,
    color: "from-yellow-400 to-yellow-600",
  },
  "Own Goal Specialist": {
    category: "Fun & Humorous",
    description: "Your defenders scored... for the wrong team.",
    calculation: "Highest number of own goals by owned players.",
    icon: "🤦",
    rarity: "rare" as const,
    color: "from-red-500 to-pink-600",
  },
  "Bench Blunder": {
    category: "Fun & Humorous",
    description: "Left your best players warming the bench.",
    calculation: "Highest cumulative bench points lost.",
    icon: "🪑",
    rarity: "common" as const,
    color: "from-gray-500 to-slate-600",
  },
  "Captain Fail": {
    category: "Fun & Humorous",
    description: "Your captain choices were... questionable.",
    calculation: "Lowest total captain points gained.",
    icon: "🤷",
    rarity: "common" as const,
    color: "from-red-400 to-red-600",
  },
  "Differential Disaster": {
    category: "Fun & Humorous",
    description: "Your risky picks rarely paid off.",
    calculation: "Lowest points from differential (<5% owned) players.",
    icon: "💥",
    rarity: "common" as const,
    color: "from-orange-500 to-red-600",
  },
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600",
}

const rarityGlow = {
  common: "shadow-gray-400/20",
  rare: "shadow-blue-400/30",
  epic: "shadow-purple-400/40",
  legendary: "shadow-yellow-400/50",
}

const categoryIcons = {
  "Strategy & Planning": Trophy,
  "Performance & Luck": Target,
  "Achievements & Milestones": Award,
  "Social & Community": Users,
  "Fun & Humorous": Smile,
}

export function EnhancedBadgeDisplay({
  earnedBadges = [],
  onSelectBadge,
  showProgress = true,
}: EnhancedBadgeDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const totalBadges = Object.keys(ALL_BADGES).length
  const earnedCount = earnedBadges.length

  const categories = Object.keys(categoryIcons)

  const getBadgesByCategory = (category: string) => {
    return Object.entries(ALL_BADGES).filter(([_, badge]) => badge.category === category)
  }

  const isEarned = (badgeName: string) => earnedBadges.includes(badgeName)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Header */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fifa-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold fifa-text-primary mb-3">Badge Collection</h3>
          <div className="space-y-3">
            <div className="text-3xl sm:text-4xl font-bold fifa-text-accent">
              {earnedCount} / {totalBadges}
            </div>
            <p className="fifa-text-secondary text-sm sm:text-base">
              You've earned <span className="fifa-text-primary font-semibold">{earnedCount}</span> out of{" "}
              <span className="fifa-text-primary font-semibold">{totalBadges}</span> badges this season!
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[var(--surface-panel)] rounded-full h-3 sm:h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] rounded-full"
              />
            </div>

            <div className="text-xs sm:text-sm fifa-text-secondary">
              {Math.round((earnedCount / totalBadges) * 100)}% Complete
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="fifa-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              selectedCategory === null
                ? "fifa-button-primary border-0"
                : "fifa-glass fifa-text-secondary hover:fifa-text-primary"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
            const categoryBadges = getBadgesByCategory(category)
            const earnedInCategory = categoryBadges.filter(([name]) => isEarned(name)).length

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                  selectedCategory === category
                    ? "fifa-button-primary border-0"
                    : "fifa-glass fifa-text-secondary hover:fifa-text-primary"
                }`}
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{category}</span>
                <span className="sm:hidden">{category.split(" ")[0]}</span>
                <span className="text-xs">
                  ({earnedInCategory}/{categoryBadges.length})
                </span>
              </button>
            )
          })}
        </div>

        {/* Show All Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="fifa-glass px-4 py-2 rounded-xl text-sm fifa-text-secondary hover:fifa-text-primary transition-colors"
          >
            {showAll ? "Show Earned Only" : "Show All Badges"}
          </button>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="space-y-6">
        {categories
          .filter((category) => !selectedCategory || category === selectedCategory)
          .map((category) => {
            const categoryBadges = getBadgesByCategory(category)
            const displayBadges = showAll ? categoryBadges : categoryBadges.filter(([name]) => isEarned(name))

            if (displayBadges.length === 0) return null

            const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
            const earnedInCategory = categoryBadges.filter(([name]) => isEarned(name)).length

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fifa-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 fifa-text-primary" />
                  <h4 className="text-lg sm:text-xl font-bold fifa-text-primary">{category}</h4>
                  <span className="text-sm fifa-text-secondary">
                    ({earnedInCategory}/{categoryBadges.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {displayBadges.map(([badgeName, badgeData], index) => {
                    const earned = isEarned(badgeName)
                    const rarity = badgeData.rarity

                    return (
                      <motion.div
                        key={badgeName}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                        className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer group transition-all duration-300 ${
                          earned
                            ? `bg-gradient-to-br ${badgeData.color} ${rarityGlow[rarity]} shadow-lg hover:scale-105`
                            : "fifa-glass opacity-40 hover:opacity-60"
                        }`}
                        onClick={() => onSelectBadge?.(badgeName)}
                      >
                        {/* Rarity indicator */}
                        <div
                          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            earned ? `bg-gradient-to-r ${rarityColors[rarity]}` : "bg-gray-400"
                          }`}
                        />

                        {/* Badge icon */}
                        <div className="text-center mb-2 sm:mb-3">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                              earned ? "bg-white/20" : "bg-gray-500/20"
                            }`}
                          >
                            <span className="text-lg sm:text-xl">{badgeData.icon}</span>
                          </div>
                        </div>

                        {/* Badge name */}
                        <div className="text-center">
                          <h5
                            className={`text-xs sm:text-sm font-semibold mb-1 leading-tight ${
                              earned ? "text-white" : "fifa-text-secondary"
                            }`}
                          >
                            {badgeName}
                          </h5>
                          <div className={`text-xs capitalize ${earned ? "text-white/80" : "fifa-text-secondary"}`}>
                            {rarity}
                          </div>
                        </div>

                        {/* Hover effect */}
                        <div
                          className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            earned ? "bg-white/10" : "bg-gray-500/10"
                          }`}
                        />

                        {/* Info icon */}
                        <div className="absolute bottom-1 right-1">
                          <Info className={`w-3 h-3 ${earned ? "text-white/60" : "fifa-text-secondary"}`} />
                        </div>

                        {/* Earned indicator */}
                        {earned && (
                          <div className="absolute top-1 left-1">
                            <div className="w-3 h-3 bg-green-400 rounded-full border border-white/50" />
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fifa-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
      >
        <h4 className="text-lg font-bold fifa-text-primary mb-4 text-center">Badge Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(rarityColors).map(([rarity, gradient]) => {
            const count = earnedBadges.filter((badge) => ALL_BADGES[badge]?.rarity === rarity).length
            const total = Object.values(ALL_BADGES).filter((badge) => badge.rarity === rarity).length

            return (
              <div key={rarity} className="text-center">
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r ${gradient}`} />
                <div className="text-lg font-bold fifa-text-primary">
                  {count}/{total}
                </div>
                <div className="text-xs fifa-text-secondary capitalize">{rarity}</div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
