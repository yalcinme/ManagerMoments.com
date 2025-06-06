interface FPLBootstrapData {
  elements: Array<{
    id: number
    web_name: string
    first_name: string
    second_name: string
    total_points: number
    element_type: number
    team: number
    now_cost: number
  }>
  teams: Array<{
    id: number
    name: string
    short_name: string
  }>
  events: Array<{
    id: number
    name: string
    deadline_time: string
    finished: boolean
    is_current: boolean
    is_next: boolean
  }>
}

interface ManagerEntry {
  player_first_name: string
  player_last_name: string
  name: string
  summary_overall_points: number
  summary_overall_rank: number
}

interface ManagerHistory {
  current: Array<{
    event: number
    points: number
    total_points: number
    rank: number
    overall_rank: number
    event_transfers: number
    event_transfers_cost: number
    points_on_bench: number
  }>
  chips: Array<{
    name: string
    event: number
  }>
}

interface GameweekPicks {
  picks: Array<{
    element: number
    position: number
    multiplier: number
    is_captain: boolean
    is_vice_captain: boolean
  }>
  entry_history: {
    event: number
    points: number
    total_points: number
    rank: number
    overall_rank: number
    event_transfers: number
    event_transfers_cost: number
    points_on_bench: number
  }
}

interface GameweekLive {
  elements: Array<{
    id: number
    stats: {
      total_points: number
      minutes: number
      goals_scored: number
      assists: number
      clean_sheets: number
      bonus: number
    }
  }>
}

interface Transfer {
  element_in: number
  element_out: number
  event: number
  time: string
  element_in_cost: number
  element_out_cost: number
}

export class FPLApiClient {
  private baseUrl = "https://fantasy.premierleague.com/api"
  private bootstrapData: FPLBootstrapData | null = null

  async fetchBootstrapData(): Promise<FPLBootstrapData> {
    if (this.bootstrapData) {
      return this.bootstrapData
    }

    try {
      console.log("🔄 Fetching bootstrap data...")
      const response = await this.makeRequest(`${this.baseUrl}/bootstrap-static/`)

      if (!response.elements || !Array.isArray(response.elements)) {
        throw new Error("Invalid bootstrap data structure")
      }

      this.bootstrapData = response
      console.log(`✅ Bootstrap data loaded: ${response.elements.length} players, ${response.teams.length} teams`)
      return response
    } catch (error) {
      console.error("❌ Failed to fetch bootstrap data:", error)
      throw error
    }
  }

  async fetchManagerEntry(managerId: string): Promise<ManagerEntry> {
    try {
      console.log(`🔄 Fetching manager entry for ID: ${managerId}`)
      const response = await this.makeRequest(`${this.baseUrl}/entry/${managerId}/`)

      if (!response.player_first_name || !response.name) {
        throw new Error("Invalid manager data structure")
      }

      console.log(`✅ Manager data loaded: ${response.player_first_name} ${response.player_last_name}`)
      return response
    } catch (error) {
      console.error(`❌ Failed to fetch manager entry for ${managerId}:`, error)
      throw error
    }
  }

  async fetchManagerHistory(managerId: string): Promise<ManagerHistory> {
    try {
      console.log(`🔄 Fetching manager history for ID: ${managerId}`)
      const response = await this.makeRequest(`${this.baseUrl}/entry/${managerId}/history/`)

      if (!response.current || !Array.isArray(response.current)) {
        throw new Error("Invalid history data structure")
      }

      console.log(`✅ History data loaded: ${response.current.length} gameweeks`)
      return response
    } catch (error) {
      console.error(`❌ Failed to fetch manager history for ${managerId}:`, error)
      throw error
    }
  }

  async fetchGameweekPicks(managerId: string, gameweek: number): Promise<GameweekPicks> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/entry/${managerId}/event/${gameweek}/picks/`)

      if (!response.picks || !Array.isArray(response.picks) || response.picks.length !== 15) {
        throw new Error(`Invalid picks data for GW${gameweek}`)
      }

      return response
    } catch (error) {
      console.error(`❌ Failed to fetch GW${gameweek} picks for ${managerId}:`, error)
      throw error
    }
  }

  async fetchGameweekLive(gameweek: number): Promise<GameweekLive> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/event/${gameweek}/live/`)

      if (!response.elements || !Array.isArray(response.elements)) {
        throw new Error(`Invalid live data for GW${gameweek}`)
      }

      return response
    } catch (error) {
      console.error(`❌ Failed to fetch GW${gameweek} live data:`, error)
      throw error
    }
  }

  async fetchTransfers(managerId: string): Promise<Transfer[]> {
    try {
      console.log(`🔄 Fetching transfers for manager: ${managerId}`)
      const response = await this.makeRequest(`${this.baseUrl}/entry/${managerId}/transfers/`)

      if (!Array.isArray(response)) {
        throw new Error("Invalid transfers data structure")
      }

      console.log(`✅ Transfers loaded: ${response.length} transfers`)
      return response
    } catch (error) {
      console.error(`❌ Failed to fetch transfers for ${managerId}:`, error)
      // Return empty array instead of throwing for transfers
      console.log("⚠️ Continuing without transfer data")
      return []
    }
  }

  private async makeRequest(url: string): Promise<any> {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🌐 Making request (attempt ${attempt}/${maxRetries}): ${url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; FPL-DataProcessor/1.0)",
            Accept: "application/json",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Manager not found")
          }
          if (response.status === 429) {
            throw new Error("Rate limited")
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`✅ Request successful: ${url}`)
        return data
      } catch (error) {
        lastError = error as Error
        console.warn(`⚠️ Request failed (attempt ${attempt}/${maxRetries}):`, error)

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000) // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError || new Error("Request failed after all retries")
  }

  getPlayerById(playerId: number): any {
    if (!this.bootstrapData) {
      console.warn("⚠️ Bootstrap data not loaded, cannot get player")
      return null
    }

    const player = this.bootstrapData.elements.find((player) => player.id === playerId)
    if (!player) {
      console.warn(`⚠️ Player not found: ${playerId}`)
    }

    return player
  }

  getTeamById(teamId: number): any {
    if (!this.bootstrapData) {
      console.warn("⚠️ Bootstrap data not loaded, cannot get team")
      return null
    }

    const team = this.bootstrapData.teams.find((team) => team.id === teamId)
    if (!team) {
      console.warn(`⚠️ Team not found: ${teamId}`)
    }

    return team
  }

  getCurrentGameweek(): number {
    if (!this.bootstrapData) {
      console.warn("⚠️ Bootstrap data not loaded, using default gameweek")
      return 20 // Default to a reasonable gameweek
    }

    const currentEvent = this.bootstrapData.events.find((event) => event.is_current)
    const nextEvent = this.bootstrapData.events.find((event) => event.is_next)

    // If there's a current event, use it. Otherwise, use the next event minus 1
    const gameweek = currentEvent?.id || (nextEvent ? nextEvent.id - 1 : 20)

    console.log(`📅 Current gameweek determined: ${gameweek}`)
    return gameweek
  }
}
