export interface FPLData {
  // Manager Info
  managerName: string
  teamName: string
  totalPoints: number
  overallRank: number | null
  bestRank: number
  averagePointsPerGW: number
  personalizedIntro: string

  // Gameweek Performance
  bestGw: {
    gameweek: number
    points: number
    topContributors: Array<{
      name: string
      points: number
      isCaptain: boolean
    }>
  }
  worstGw: {
    gameweek: number
    points: number
  }

  // Rank Movements
  biggestRankJump: {
    gameweek: number
    places: number
  } | null
  biggestRankDrop: {
    gameweek: number
    places: number
  } | null
  greenArrows: number
  redArrows: number

  // Captain Performance
  captainPerformance: {
    totalPoints: number
    averagePoints: number
    failRate: number
    bestCaptain: {
      name: string
      points: number
      gameweek: number
    }
    worstCaptain: {
      name: string
      points: number
      gameweek: number
    }
  }

  // Transfer Activity
  transferActivity: {
    totalTransfers: number
    totalHits: number
    bestTransferIn: {
      name: string
      pointsGained: number
      gameweek: number
    }
    worstTransferOut: {
      name: string
      pointsLost: number
      gameweek: number
    }
  }

  // Bench Analysis
  benchAnalysis: {
    totalBenchPoints: number
    averagePerGW: number
    worstBenchCall: {
      playerName: string
      gameweek: number
      points: number
    }
    benchBoostImpact: number
  }

  // Player Analysis
  mvpPlayer: {
    name: string
    appearances: number
    totalPoints: number
    percentageOfTeamScore: number
    pointsPerGame: number
  }

  formPlayer: {
    name: string
    last6GWPoints: number
    appearances: number
    pointsPerGame: number
  }

  oneGotAway: {
    playerName: string
    gameweek: number
    pointsMissed: number
    seasonTotal: number
  }

  // Comparisons
  comparisons: {
    topScorerNeverOwned: {
      name: string
      points: number
    }
    benchPointsVsAverage: {
      user: number
      gameAverage: number
    }
    transferHitsVsAverage: {
      user: number
      gameAverage: number
    }
    captainAvgVsTop10k: {
      user: number
      top10k: number
    }
    mostTrustedVsGlobal: {
      user: string
      global: string
    }
  }

  // Chips
  chipsUsed: Array<{
    name: string
    gameweek: number
  }>
  bestChip: {
    name: string
    gameweek: number
    points: number
  } | null

  // Achievements
  managerTitle: string
  badges: string[]

  // Legacy fields for backward compatibility
  bestEarlyGw: any
  earlyTransfers: number
  totalTransfers: number
  totalHits: number
  mostTransferredIn: {
    name: string
    count: number
  }
  aboveAverageWeeks: number
  captainPoints: number
  captainAccuracy: number
  topPlayer: {
    name: string
    points: number
  }
  teamStats: {
    goals: number
    assists: number
    cleanSheets: number
  }
  favoriteFormation: string
  leagueWins: number
  benchPoints: number
  autoSubPoints: number
  maxTeamValue: number
  topScorerMissed: {
    name: string
    points: number
  }
  benchPointsComparison: {
    user: number
    average: number
  }
  transferHitsComparison: {
    user: number
    gameAverage: number
  }
  captainAvgComparison: {
    user: number
    top10k: number
  }
  mostTrustedComparison: {
    user: string
    global: string
  }
}
