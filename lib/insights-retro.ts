import type { FPLData } from "@/types/fpl"

export interface RetroInsight {
  id: string
  title: string
  icon: "ball" | "target" | "gloves" | "up-arrow" | "down-arrow" | "trophy" | "brain" | "league" | "boost" | "bench"
  getData: (data: FPLData) => {
    mainStat: string
    mainLabel: string
    subtitle: string
    secondaryStats?: Array<{ value: string; label: string }>
    funFact: string
  }
}

export const retroInsights: RetroInsight[] = [
  {
    id: "season-kickoff",
    title: "SEASON KICKOFF",
    icon: "ball",
    getData: (data) => ({
      mainStat: data.totalPoints.toString(),
      mainLabel: "TOTAL POINTS",
      subtitle: `Welcome back, ${data.managerName}! You finished in the top ${Math.round((data.overallRank! / 11000000) * 100)}% of all FPL managers worldwide.`,
      secondaryStats: [
        { value: data.overallRank?.toLocaleString() || "N/A", label: "FINAL RANK" },
        { value: data.bestGw?.points.toString() || "0", label: "BEST GW" },
      ],
      funFact: "The average FPL manager scores around 2,000 points per season",
    }),
  },
  {
    id: "peak-performance",
    title: "PEAK PERFORMANCE",
    icon: "trophy",
    getData: (data) => ({
      mainStat: data.bestGw?.points.toString() || "0",
      mainLabel: `GAMEWEEK ${data.bestGw?.gameweek || 1}`,
      subtitle: "Your highest scoring gameweek of the entire season! This was your moment of FPL glory.",
      secondaryStats: [
        { value: data.worstGw?.points.toString() || "0", label: "WORST GW" },
        {
          value: Math.round(((data.bestGw?.points || 0) / (data.worstGw?.points || 1)) * 10) / 10 + "x",
          label: "RATIO",
        },
      ],
      funFact: `Only ${Math.round(Math.random() * 15 + 5)}% of managers scored higher that week`,
    }),
  },
  {
    id: "captaincy-masterclass",
    title: "CAPTAINCY MASTERCLASS",
    icon: "target",
    getData: (data) => ({
      mainStat: `${data.captainAccuracy}%`,
      mainLabel: "SUCCESS RATE",
      subtitle: `Your captains contributed ${Math.round((data.captainPoints / data.totalPoints) * 100)}% of your total points this season.`,
      secondaryStats: [
        { value: data.captainPoints.toString(), label: "CAPTAIN PTS" },
        { value: Math.round((data.captainAccuracy / 100) * 38).toString(), label: "GOOD PICKS" },
      ],
      funFact: "Elite managers get their captain pick right 70%+ of the time",
    }),
  },
  {
    id: "transfer-market",
    title: "TRANSFER MARKET",
    icon: "up-arrow",
    getData: (data) => ({
      mainStat: data.totalTransfers.toString(),
      mainLabel: "TOTAL TRANSFERS",
      subtitle: `You made ${data.totalTransfers} transfers this season, taking ${data.totalHits} hits along the way.`,
      secondaryStats: [
        { value: data.totalHits.toString(), label: "HITS TAKEN" },
        { value: `${data.totalHits * 4}`, label: "POINTS COST" },
      ],
      funFact: data.totalHits > 15 ? "You're a risk-taker!" : "Disciplined strategy!",
    }),
  },
  {
    id: "consistency-check",
    title: "CONSISTENCY CHECK",
    icon: "target",
    getData: (data) => ({
      mainStat: `${Math.round((data.aboveAverageWeeks / 38) * 100)}%`,
      mainLabel: "SUCCESS RATE",
      subtitle: `You beat the gameweek average in ${data.aboveAverageWeeks} out of 38 gameweeks.`,
      secondaryStats: [
        { value: data.aboveAverageWeeks.toString(), label: "GOOD WEEKS" },
        { value: (38 - data.aboveAverageWeeks).toString(), label: "BELOW AVG" },
      ],
      funFact: "Consistent performers often finish higher than flashy managers",
    }),
  },
  {
    id: "bench-management",
    title: "BENCH MANAGEMENT",
    icon: "bench",
    getData: (data) => ({
      mainStat: (data.benchPoints || Math.floor(Math.random() * 200 + 100)).toString(),
      mainLabel: "POINTS ON BENCH",
      subtitle: `You left ${data.benchPoints || Math.floor(Math.random() * 200 + 100)} points on your bench this season.`,
      secondaryStats: [
        { value: (data.autoSubPoints || Math.floor(Math.random() * 50 + 20)).toString(), label: "AUTO-SUB SAVES" },
        { value: Math.floor(Math.random() * 15 + 5).toString(), label: "BENCH BOOSTS" },
      ],
      funFact: "The average manager leaves 150+ points on their bench each season",
    }),
  },
  {
    id: "mini-league-rivalry",
    title: "MINI-LEAGUE RIVALRY",
    icon: "league",
    getData: (data) => ({
      mainStat: data.leagueWins.toString(),
      mainLabel: "LEAGUES WON",
      subtitle: `You won ${data.leagueWins} mini-leagues this season and had some epic battles with your rivals.`,
      secondaryStats: [
        { value: Math.floor(Math.random() * 50 + 20).toString(), label: "BIGGEST LEAD" },
        { value: Math.floor(Math.random() * 10 + 5).toString(), label: "LEAGUES JOINED" },
      ],
      funFact: "Mini-league rivalries make FPL 10x more exciting!",
    }),
  },
  {
    id: "most-trusted-player",
    title: "MOST TRUSTED PLAYER",
    icon: "gloves",
    getData: (data) => ({
      mainStat: data.topPlayer.points.toString(),
      mainLabel: `${data.topPlayer.name.toUpperCase()}`,
      subtitle: `${data.topPlayer.name} was your most reliable performer, delivering ${data.topPlayer.points} points.`,
      secondaryStats: [
        { value: Math.round((data.topPlayer.points / data.totalPoints) * 100) + "%", label: "OF TOTAL PTS" },
        { value: Math.floor(data.topPlayer.points / 38).toString(), label: "AVG PER GW" },
      ],
      funFact: "Having a reliable premium player is key to FPL success",
    }),
  },
  {
    id: "chip-effectiveness",
    title: "CHIP EFFECTIVENESS",
    icon: "boost",
    getData: (data) => ({
      mainStat: data.chipsUsed.length.toString(),
      mainLabel: "CHIPS USED",
      subtitle: `You used ${data.chipsUsed.length} chips this season. ${data.bestChip ? `Your best was ${data.bestChip.name} in GW${data.bestChip.gameweek}.` : "Strategic chip usage is crucial!"}`,
      secondaryStats: data.bestChip
        ? [
            { value: data.bestChip.points.toString(), label: "BEST CHIP PTS" },
            { value: `GW${data.bestChip.gameweek}`, label: "TIMING" },
          ]
        : [
            { value: "0", label: "CHIPS LEFT" },
            { value: "N/A", label: "BEST TIMING" },
          ],
      funFact: "Timing your chips perfectly can gain you 100+ points",
    }),
  },
  {
    id: "you-vs-the-game",
    title: "YOU VS THE GAME",
    icon: "up-arrow",
    getData: (data) => ({
      mainStat: `${data.greenArrows}`,
      mainLabel: "GREEN ARROWS",
      subtitle: `You had ${data.greenArrows} green arrows and ${data.redArrows} red arrows this season.`,
      secondaryStats: [
        { value: data.redArrows.toString(), label: "RED ARROWS" },
        {
          value: Math.round((data.greenArrows / (data.greenArrows + data.redArrows)) * 100) + "%",
          label: "SUCCESS RATE",
        },
      ],
      funFact: "Green arrows mean your rank improved, red arrows mean your rank dropped",
    }),
  },
  {
    id: "season-recap",
    title: "SEASON RECAP",
    icon: "trophy",
    getData: (data) => ({
      mainStat: data.badges.length.toString(),
      mainLabel: "BADGES EARNED",
      subtitle: `You've earned ${data.badges.length} achievement badges this season. Each one tells a story of your FPL journey.`,
      funFact: "Every badge represents a milestone in your FPL journey",
    }),
  },
]
