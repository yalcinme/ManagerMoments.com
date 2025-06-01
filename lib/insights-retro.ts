// Define the structure for insight data
export type InsightData = {
  id: string
  title: string
  getData: (data: any) => {
    mainStat: string
    mainLabel: string
    subtitle: string
    secondaryStats?: Array<{ value: string; label: string }>
    funFact?: string
  }
}

// Badge definitions
type BadgeDetail = {
  icon: string
  description: string
}

const badgeDetails: Record<string, BadgeDetail> = {
  "Early Bird": {
    icon: "🐦",
    description: "Started strong in the first 5 gameweeks, showing excellent early season planning.",
  },
  "Captain Fantastic": {
    icon: "©️",
    description: "Your captain picks were spot on! Above average captain points throughout the season.",
  },
  "Transfer Guru": {
    icon: "🔄",
    description: "Made smart transfers that paid off with immediate points returns.",
  },
  "Chip Master": {
    icon: "🎮",
    description: "Used your chips at optimal times, maximizing their impact.",
  },
  "Consistent Performer": {
    icon: "📈",
    description: "Maintained a steady rank throughout the season with minimal wild swings.",
  },
  "Bench Boost Pro": {
    icon: "🪑",
    description: "Your bench boost chip scored above the average of all managers.",
  },
  "Triple Captain Hero": {
    icon: "👑",
    description: "Your triple captain chip scored above the average of all managers.",
  },
  "Free Hit Specialist": {
    icon: "🎯",
    description: "Your free hit chip scored above the average of all managers.",
  },
  "Wildcard Wizard": {
    icon: "🧙‍♂️",
    description: "Your wildcard chip led to significant rank improvements.",
  },
  "Diamond Eye": {
    icon: "💎",
    description: "Picked multiple differential players who outperformed expectations.",
  },
}

export function getBadgeDetails(badge: string): BadgeDetail {
  return (
    badgeDetails[badge] || {
      icon: "🏅",
      description: "Achievement unlocked during your FPL season.",
    }
  )
}

// Define the insights
export const retroInsights: InsightData[] = [
  {
    id: "season-kickoff",
    title: "Season Kickoff",
    getData: (data) => ({
      mainStat: data.bestEarlyGw?.points || "72",
      mainLabel: `Best early gameweek (GW${data.bestEarlyGw?.gameweek || 3})`,
      subtitle: `You started the season with confidence, making ${
        data.earlyTransfers || 8
      } transfers in the first 5 gameweeks to optimize your team.`,
      secondaryStats: [
        { value: data.earlyTransfers?.toString() || "8", label: "Early transfers" },
        { value: data.bestEarlyGw?.gameweek?.toString() || "3", label: "Best early GW" },
      ],
      funFact:
        "The first 5 gameweeks often set the tone for the entire FPL season, with early decisions having long-term impacts.",
    }),
  },
  {
    id: "transfer-market",
    title: "Transfer Market",
    getData: (data) => ({
      mainStat: data.totalTransfers?.toString() || "45",
      mainLabel: "Total transfers made",
      subtitle: `You made ${data.totalHits || 8} transfers that cost points (-4), showing your willingness to take calculated risks.`,
      secondaryStats: [
        { value: data.totalHits?.toString() || "8", label: "Hits taken" },
        {
          value: data.mostTransferredIn?.name || "Salah",
          label: "Most transferred in",
        },
      ],
      funFact:
        "The average FPL manager makes around 30 transfers per season, with the most active making over 100 including hits.",
    }),
  },
  {
    id: "captaincy-masterclass",
    title: "Captaincy Choices",
    getData: (data) => ({
      mainStat: data.captainPoints?.toString() || "486",
      mainLabel: "Captain points",
      subtitle: `Your captain picks were successful ${data.captainAccuracy || 68}% of the time, outperforming the average player's selection.`,
      secondaryStats: [
        { value: `${data.captainAccuracy || 68}%`, label: "Success rate" },
        { value: data.topPlayer?.name || "Salah", label: "Top captain" },
      ],
      funFact:
        "Captaincy choices can account for up to 25% of your total points in a season - making it one of the most crucial weekly decisions.",
    }),
  },
  {
    id: "chip-effectiveness",
    title: "Chip Strategy",
    getData: (data) => ({
      mainStat: data.bestChip?.points?.toString() || "36",
      mainLabel: `${data.bestChip?.name || "Triple Captain"} points (GW${data.bestChip?.gameweek || 15})`,
      subtitle: `You used your chips strategically, with your ${
        data.bestChip?.name || "Triple Captain"
      } in GW${data.bestChip?.gameweek || 15} being the most effective.`,
      secondaryStats: data.chipsUsed?.slice(0, 2).map((chip) => ({
        value: `GW${chip.gameweek}`,
        label: chip.name,
      })) || [
        { value: "GW15", label: "Triple Captain" },
        { value: "GW29", label: "Bench Boost" },
      ],
      funFact:
        "The most successful FPL managers often save their chips for double gameweeks, potentially doubling their points haul.",
    }),
  },
  {
    id: "bench-management",
    title: "Bench Management",
    getData: (data) => ({
      mainStat: data.benchPoints?.toString() || "187",
      mainLabel: "Points left on bench",
      subtitle: `Your bench players were auto-substituted ${data.autoSubPoints || 34} times, adding valuable points when your starters didn't play.`,
      secondaryStats: [
        { value: data.autoSubPoints?.toString() || "34", label: "Auto-sub points" },
        { value: `£${data.maxTeamValue?.toString() || "103.2"}m`, label: "Max team value" },
      ],
      funFact:
        "The average FPL manager leaves around 200 points on their bench throughout a season - that's equivalent to 5-6 good gameweeks!",
    }),
  },
  {
    id: "consistency-check",
    title: "Consistency Check",
    getData: (data) => ({
      mainStat: data.aboveAverageWeeks?.toString() || "24",
      mainLabel: "Weeks above average",
      subtitle: `You scored above the gameweek average ${data.aboveAverageWeeks || 24} times, showing consistent performance throughout the season.`,
      secondaryStats: [
        { value: data.greenArrows?.toString() || "22", label: "Green arrows" },
        { value: data.redArrows?.toString() || "16", label: "Red arrows" },
      ],
      funFact:
        "Consistency is key in FPL - managers who score above the average in 60% or more gameweeks typically finish in the top 10% overall.",
    }),
  },
  {
    id: "peak-performance",
    title: "Peak Performance",
    getData: (data) => ({
      mainStat: data.bestGw?.points?.toString() || "143",
      mainLabel: `Best gameweek (GW${data.bestGw?.gameweek || 15})`,
      subtitle: `Your highest scoring gameweek came in GW${
        data.bestGw?.gameweek || 15
      }, where your team significantly outperformed the average.`,
      secondaryStats: [
        { value: data.worstGw?.points?.toString() || "28", label: `Worst (GW${data.worstGw?.gameweek || 8})` },
        {
          value: `${data.biggestRankJump?.places?.toLocaleString() || "180,000"}`,
          label: "Biggest rank jump",
        },
      ],
      funFact: "The highest ever recorded gameweek score in FPL history is 202 points, achieved in the 2018/19 season.",
    }),
  },
  {
    id: "season-recap",
    title: "Season Recap",
    getData: (data) => ({
      mainStat: data.totalPoints?.toLocaleString() || "2,156",
      mainLabel: "Total points",
      subtitle: `You finished with a rank of ${
        data.overallRank?.toLocaleString() || "234,567"
      }, placing you in the top ${Math.round((data.overallRank || 234567) / 10000) / 100 || 2.35}% of all managers.`,
      secondaryStats: [
        { value: data.overallRank?.toLocaleString() || "234,567", label: "Final rank" },
        { value: data.managerTitle || "Tactical Genius", label: "Manager title" },
      ],
      funFact:
        "Only about 5% of FPL managers finish a season with more than 2,200 points, putting them in the elite category.",
    }),
  },
]

// Export a default empty array if retroInsights is undefined
export default retroInsights || []
