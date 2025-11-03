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
    const maxRetries = 2 // Reduced retries to fail faster in maintenance mode
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🌐 Making request (attempt ${attempt}/${maxRetries}): ${url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // Reduced timeout to 8 seconds

        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-GB,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            Referer: "https://fantasy.premierleague.com/",
            Origin: "https://fantasy.premierleague.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          signal: controller.signal,
          cache: "no-store", // Disable caching to ensure fresh requests
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("FPL API is currently unavailable. Please try again later.")
          }
          if (response.status === 404) {
            throw new Error("Manager not found")
          }
          if (response.status === 429) {
            throw new Error("Rate limited")
          }
          const bodyText = await response.text().catch(() => "")
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}${bodyText ? ` - ${bodyText.substring(0, 100)}` : ""}`,
          )
        }

        const data = await response.json()
        console.log(`✅ Request successful: ${url}`)
        return data
      } catch (error) {
        lastError = error as Error
        console.warn(`⚠️ Request failed (attempt ${attempt}/${maxRetries}):`, error)

        if (error instanceof Error && error.message.includes("403")) {
          throw error
        }

        if (attempt < maxRetries) {
          const delay = 1500 * attempt // Shorter delays: 1.5s, 3s
          console.log(`⏳ Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError || new Error("Unable to fetch FPL data. Please try again later.")
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
