export interface FPLData {
  managerId: string
  managerName: string
  teamName: string // Added team name field
  totalPoints: number
  overallRank: number | null
  bestRank: number | null
  bestGw: {
    gameweek: number
    points: number
  } | null
  worstGw: {
    gameweek: number
    points: number
  } | null
  biggestRankJump: {
    gameweek: number
    places: number
  } | null
  biggestRankDrop: {
    gameweek: number
    places: number
  } | null
  bestEarlyGw: {
    gameweek: number
    points: number
  } | null
  earlyTransfers: number
  totalTransfers: number
  totalHits: number
  mostTransferredIn: {
    name: string
    count: number
  } | null
  chipsUsed: Array<{
    name: string
    gameweek: number
  }>
  bestChip: {
    name: string
    gameweek: number
    points: number
  } | null
  aboveAverageWeeks: number
  captainPoints: number
  captainAccuracy: number
  topPlayer: {
    name: string
    points: number
  } | null
  teamStats: {
    goals: number
    assists: number
    cleanSheets: number
  } | null
  favoriteFormation: string
  leagueWins: number
  h2hRecord: string | null
  greenArrows: number
  redArrows: number
  managerTitle: string
  badges: string[]
  benchPoints?: number
  autoSubPoints?: number
  maxTeamValue?: number
}
