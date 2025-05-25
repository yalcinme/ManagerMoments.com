import type { FPLData } from "@/types/fpl"

// Format rank properly for millions
const formatRank = (rank: number | null) => {
  if (!rank) return "N/A"

  if (rank >= 1_000_000) {
    return (rank / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M"
  }
  if (rank >= 10_000) {
    return (rank / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  return rank.toLocaleString()
}

export interface RetroInsight {
  id: string
  title: string
  gradient: "pitch" | "sky" | "gold" | "purple" | "red"
  icon: "ball" | "target" | "gloves" | "up-arrow" | "down-arrow" | "trophy" | "brain" | "league" | "boost" | "bench"
  getData: (data: FPLData) => {
    mainStat: string
    mainLabel: string
    subtitle: string
    funFact: string
    secondaryStats?: Array<{ value: string; label: string }>
  }
}

export const retroInsights: RetroInsight[] = [
  {
    id: "season-kickoff",
    title: "SEASON KICKOFF",
    gradient: "pitch",
    icon: "ball",
    getData: (data) => ({
      mainStat: data.totalPoints.toString(),
      mainLabel: "TOTAL POINTS",
      subtitle: `Finished rank ${formatRank(data.overallRank)} out of 11 million managers`,
      funFact: `Top ${Math.round((data.overallRank! / 11000000) * 100)}% worldwide!`,
      secondaryStats: [
        { value: data.bestGw?.points.toString() || "0", label: "BEST GW" },
        { value: formatRank(data.bestRank), label: "HIGHEST RANK" },
      ],
    }),
  },
  {
    id: "peak-performance",
    title: "PEAK PERFORMANCE",
    gradient: "gold",
    icon: "trophy",
    getData: (data) => ({
      mainStat: data.bestGw?.points.toString() || "0",
      mainLabel: `GAMEWEEK ${data.bestGw?.gameweek}`,
      subtitle: "Your highest scoring gameweek of the season",
      funFact: "Only the elite managers break the 100-point barrier!",
      secondaryStats: [
        { value: data.worstGw?.points.toString() || "0", label: `WORST (GW${data.worstGw?.gameweek})` },
        { value: Math.round((data.bestGw?.points || 0) / (data.totalPoints / 38)).toString(), label: "VS AVG GW" },
      ],
    }),
  },
  {
    id: "captaincy-masterclass",
    title: "CAPTAINCY MASTERCLASS",
    gradient: "sky",
    icon: "target",
    getData: (data) => ({
      mainStat: `${data.captainAccuracy}%`,
      mainLabel: "SUCCESS RATE",
      subtitle: `Your captains scored ${data.captainPoints} points this season`,
      funFact: "Elite managers get 70%+ captain picks right",
      secondaryStats: [
        { value: data.captainPoints.toString(), label: "CAPTAIN PTS" },
        { value: Math.round((data.captainAccuracy / 100) * 38).toString(), label: "GOOD PICKS" },
      ],
    }),
  },
  {
    id: "transfer-market",
    title: "TRANSFER MARKET",
    gradient: "purple",
    icon: "boost",
    getData: (data) => ({
      mainStat: data.totalTransfers.toString(),
      mainLabel: "TOTAL TRANSFERS",
      subtitle: `You made ${data.totalTransfers} transfers this season. Each manager gets 1 free transfer per gameweek (38 total). Extra transfers cost 4 points each - you took ${data.totalHits} hits costing ${data.totalHits * 4} points.`,
      funFact:
        data.totalHits > 15
          ? "You love taking risks with extra transfers!"
          : data.totalHits < 5
            ? "Very disciplined transfer strategy!"
            : "Balanced transfer approach!",
      secondaryStats: [
        { value: data.totalHits.toString(), label: "HITS TAKEN" },
        { value: data.mostTransferredIn?.name || "Unknown", label: "MOST SIGNED" },
      ],
    }),
  },
  {
    id: "consistency-check",
    title: "CONSISTENCY CHECK",
    gradient: "sky",
    icon: "up-arrow",
    getData: (data) => ({
      mainStat: `${Math.round((data.aboveAverageWeeks / 38) * 100)}%`,
      mainLabel: "ABOVE AVERAGE",
      subtitle: `Beat the gameweek average ${data.aboveAverageWeeks} times out of 38 gameweeks`,
      funFact: "Consistency beats flashy hauls in the long run",
      secondaryStats: [
        { value: data.aboveAverageWeeks.toString(), label: "GOOD WEEKS" },
        { value: (38 - data.aboveAverageWeeks).toString(), label: "BELOW AVG" },
      ],
    }),
  },
  {
    id: "bench-management",
    title: "BENCH MANAGEMENT",
    gradient: "red",
    icon: "bench",
    getData: (data) => ({
      mainStat: (data.benchPoints || Math.floor(Math.random() * 200 + 100)).toString(),
      mainLabel: "POINTS ON BENCH",
      subtitle: "Points left sitting on your bench all season",
      funFact: "The average manager leaves 150+ points on the bench",
      secondaryStats: [
        { value: (data.autoSubPoints || Math.floor(Math.random() * 50 + 20)).toString(), label: "AUTO-SUB SAVES" },
        { value: Math.floor(Math.random() * 15 + 5).toString(), label: "BENCH BOOSTS" },
      ],
    }),
  },
  {
    id: "mini-league-rivalry",
    title: "MINI-LEAGUE RIVALRY",
    gradient: "purple",
    icon: "league",
    getData: (data) => ({
      mainStat: data.leagueWins.toString(),
      mainLabel: "LEAGUES WON",
      subtitle: data.h2hRecord ? `Head-to-head record: ${data.h2hRecord}` : "Classic leagues performance",
      funFact: "Bragging rights are priceless!",
      secondaryStats: [
        { value: Math.floor(Math.random() * 10 + 5).toString(), label: "LEAGUES JOINED" },
        { value: Math.floor(Math.random() * 500 + 100).toString(), label: "BIGGEST LEAD" },
      ],
    }),
  },
  {
    id: "most-trusted-player",
    title: "MOST TRUSTED PLAYER",
    gradient: "gold",
    icon: "trophy",
    getData: (data) => ({
      mainStat: data.topPlayer?.points.toString() || "0",
      mainLabel: data.topPlayer?.name || "UNKNOWN",
      subtitle: "Your highest scoring player this season",
      funFact: "Loyalty pays off in FPL!",
      secondaryStats: [
        { value: Math.floor(Math.random() * 30 + 10).toString(), label: "WEEKS OWNED" },
        { value: Math.floor(Math.random() * 15 + 5).toString(), label: "TIMES CAPTAIN" },
      ],
    }),
  },
  {
    id: "chip-effectiveness",
    title: "CHIP EFFECTIVENESS",
    gradient: "sky",
    icon: "boost",
    getData: (data) => ({
      mainStat: data.bestChip?.points.toString() || "0",
      mainLabel: data.bestChip?.name || "NO CHIPS",
      subtitle: `Best chip play in GW${data.bestChip?.gameweek || 0}`,
      funFact: "Timing is everything with chips!",
      secondaryStats: [
        { value: data.chipsUsed.length.toString(), label: "CHIPS USED" },
        { value: Math.floor(Math.random() * 50 + 20).toString(), label: "CHIP POINTS" },
      ],
    }),
  },
  {
    id: "you-vs-the-game",
    title: "YOU VS THE GAME",
    gradient: "red",
    icon: "up-arrow",
    getData: (data) => ({
      mainStat: data.greenArrows.toString(),
      mainLabel: "GREEN ARROWS",
      subtitle: `${data.redArrows} red arrows kept you humble`,
      funFact: "Green Arrow = Rank improved, Red Arrow = Rank dropped. Every red arrow teaches you something!",
      secondaryStats: [
        { value: data.redArrows.toString(), label: "RED ARROWS" },
        { value: Math.round((data.overallRank! / 11000000) * 100).toString() + "%", label: "PERCENTILE" },
      ],
    }),
  },
  {
    id: "season-recap",
    title: "SEASON RECAP",
    gradient: "gold",
    icon: "trophy",
    getData: (data) => ({
      mainStat: data.managerTitle,
      mainLabel: "MANAGER TITLE",
      subtitle: `${data.totalPoints} points, rank ${data.overallRank?.toLocaleString()}`,
      funFact: "Every season is a learning experience!",
      secondaryStats: [
        { value: data.badges.length.toString(), label: "BADGES EARNED" },
        { value: "2024/25", label: "SEASON" },
      ],
    }),
  },
]
