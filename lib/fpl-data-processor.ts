// lib/fpl-data-processor.ts

interface FPLData {
  elements: any[]
  events: any[]
  teams: any[]
  element_types: any[]
  phases: any[]
}

interface ManagerData {
  picks: any[]
  transfers: any[]
  summary_overall_points: number
  automatic_subs: any[]
}

interface ProcessedData {
  totalPlayers: number
  topPlayer: { name: string; points: number } | null
  averageScore: number
  highestScore: number
  lowestScore: number
  mostPopularTeam: { name: string; count: number } | null
  chipUsage: { [chipName: string]: number }
  mostCaptainedPlayer: { name: string; count: number } | null
  transferInsights: {
    totalTransfers: number
    mostTransferredIn: { name: string; count: number } | null
    mostTransferredOut: { name: string; count: number } | null
  }
  mvp: {
    playerName: string
    pointsContributed: number
  } | null
}

export function processFPLData(data: FPLData): Omit<ProcessedData, "mvp"> {
  const totalPlayers = data.elements.length
  const averageScore = data.elements.reduce((sum, player) => sum + player.event_points, 0) / totalPlayers

  let topPlayer = null
  if (data.elements.length > 0) {
    topPlayer = data.elements.reduce(
      (max, player) => (player.event_points > max.event_points ? player : max),
      data.elements[0],
    )
    topPlayer = { name: topPlayer.first_name + " " + topPlayer.second_name, points: topPlayer.event_points }
  }

  const highestScore = Math.max(...data.elements.map((player) => player.event_points))
  const lowestScore = Math.min(...data.elements.map((player) => player.event_points))

  const teamCounts: { [teamName: string]: number } = {}
  data.elements.forEach((player) => {
    const teamName = data.teams.find((team) => team.id === player.team)?.name
    if (teamName) {
      teamCounts[teamName] = (teamCounts[teamName] || 0) + 1
    }
  })

  let mostPopularTeam = null
  let maxCount = 0
  for (const teamName in teamCounts) {
    if (teamCounts[teamName] > maxCount) {
      maxCount = teamCounts[teamName]
      mostPopularTeam = { name: teamName, count: teamCounts[teamName] }
    }
  }

  const chipUsage: { [chipName: string]: number } = {}
  data.events.forEach((event) => {
    if (event.chip_plays) {
      event.chip_plays.forEach((chipPlay) => {
        chipUsage[chipPlay.chip_type] = (chipUsage[chipPlay.chip_type] || 0) + chipPlay.number_played
      })
    }
  })

  const playerCaptainCounts: { [playerName: string]: number } = {}
  data.elements.forEach((player) => {
    const playerName = player.first_name + " " + player.second_name
    playerCaptainCounts[playerName] = 0 // Initialize count
  })

  data.events.forEach((event) => {
    if (event.top_element_info) {
      const topElement = data.elements.find((element) => element.id === event.top_element_info.element)
      if (topElement) {
        const playerName = topElement.first_name + " " + topElement.second_name
        // Directly increment the count for the captained player
        playerCaptainCounts[playerName] = (playerCaptainCounts[playerName] || 0) + 1
      }
    }
  })

  let mostCaptainedPlayer = null
  let maxCaptainCount = 0
  for (const playerName in playerCaptainCounts) {
    if (playerCaptainCounts[playerName] > maxCaptainCount) {
      maxCaptainCount = playerCaptainCounts[playerName]
      mostCaptainedPlayer = { name: playerName, count: playerCaptainCounts[playerName] }
    }
  }

  return {
    totalPlayers,
    topPlayer,
    averageScore,
    highestScore,
    lowestScore,
    mostPopularTeam,
    chipUsage,
    mostCaptainedPlayer,
  }
}

export function processManagerData(
  managerData: ManagerData,
  allPlayers: any[],
): {
  transferInsights: {
    totalTransfers: number
    mostTransferredIn: { name: string; count: number } | null
    mostTransferredOut: { name: string; count: number } | null
  }
  mvp: {
    playerName: string
    pointsContributed: number
  } | null
} {
  const transfers = managerData.transfers

  const totalTransfers = transfers.length

  const playerInCounts: { [playerName: string]: number } = {}
  transfers.forEach((transfer) => {
    const playerIn = allPlayers.find((player) => player.id === transfer.element_in)
    if (playerIn) {
      const playerName = playerIn.first_name + " " + playerIn.second_name
      playerInCounts[playerName] = (playerInCounts[playerName] || 0) + 1
    }
  })

  let mostTransferredIn = null
  let maxInCount = 0
  for (const playerName in playerInCounts) {
    if (playerInCounts[playerName] > maxInCount) {
      maxInCount = playerInCounts[playerName]
      mostTransferredIn = { name: playerName, count: playerInCounts[playerName] }
    }
  }

  const playerOutCounts: { [playerName: string]: number } = {}
  transfers.forEach((transfer) => {
    const playerOut = allPlayers.find((player) => player.id === transfer.element_out)
    if (playerOut) {
      const playerName = playerOut.first_name + " " + playerOut.second_name
      playerOutCounts[playerName] = (playerOutCounts[playerName] || 0) + 1
    }
  })

  let mostTransferredOut = null
  let maxOutCount = 0
  for (const playerName in playerOutCounts) {
    if (playerOutCounts[playerName] > maxOutCount) {
      maxOutCount = playerOutCounts[playerName]
      mostTransferredOut = { name: playerName, count: playerOutCounts[playerName] }
    }
  }

  // MVP Logic
  let mvp = null
  let maxPoints = 0

  managerData.picks.forEach((pick) => {
    const player = allPlayers.find((p) => p.id === pick.element)
    if (player) {
      const playerName = player.first_name + " " + player.second_name
      const pointsContributed = pick.points

      if (pointsContributed > maxPoints) {
        maxPoints = pointsContributed
        mvp = {
          playerName: playerName,
          pointsContributed: pointsContributed,
        }
      }
    }
  })

  return {
    transferInsights: {
      totalTransfers: totalTransfers,
      mostTransferredIn: mostTransferredIn,
      mostTransferredOut: mostTransferredOut,
    },
    mvp: mvp,
  }
}

// Export the main processor class
export class FPLDataProcessor {
  static processFPLData = processFPLData
  static processManagerData = processManagerData
}

// Also export as default
export default FPLDataProcessor
