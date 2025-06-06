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
  element_types: Array<{
    id: number
    singular_name: string
    plural_name: string
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
    bank: number
    value: number
    event_transfers: number
    event_transfers_cost: number
    points_on_bench: number
  }
  automatic_subs: Array<{
    element_in: number
    element_out: number
    event: number
  }>
}

interface GameweekLive {
  elements: Array<{
    id: number
    stats: {
      minutes: number
      goals_scored: number
      assists: number
      clean_sheets: number
      goals_conceded: number
      own_goals: number
      penalties_saved: number
      penalties_missed: number
      yellow_cards: number
      red_cards: number
      saves: number
      bonus: number
      bps: number
      influence: string
      creativity: string
      threat: string
      ict_index: string
      total_points: number
    }
  }>
}

interface TransferData {
  element_in: number
  element_out: number
  entry: number
  event: number
  time: string
  element_in_cost: number
  element_out_cost: number
}

export class FPLDataFetcher {
  private baseUrl = "https://fantasy.premierleague.com/api"
  private bootstrapData: FPLBootstrapData | null = null
  private managerId: string

  constructor(managerId: string) {
    this.managerId = managerId
  }

  async fetchBootstrapData(): Promise<FPLBootstrapData> {
    if (this.bootstrapData) {
      return this.bootstrapData
    }

    console.log("🔄 Fetching FPL bootstrap data...")
    const response = await this.makeRequest(`${this.baseUrl}/bootstrap-static/`)
    this.bootstrapData = response
    console.log(`✅ Bootstrap data loaded: ${response.elements.length} players, ${response.teams.length} teams`)
    return response
  }

  async fetchManagerData() {
    console.log(`🔄 Fetching manager data for ID: ${this.managerId}`)
    const response = await this.makeRequest(`${this.baseUrl}/entry/${this.managerId}/`)
    console.log(`✅ Manager data loaded: ${response.player_first_name} ${response.player_last_name}`)
    return response
  }

  async fetchManagerHistory() {
    console.log(`🔄 Fetching manager history for ID: ${this.managerId}`)
    const response = await this.makeRequest(`${this.baseUrl}/entry/${this.managerId}/history/`)
    console.log(`✅ History data loaded: ${response.current?.length} gameweeks, ${response.chips?.length} chips`)
    return response
  }

  async fetchTransfers(): Promise<TransferData[]> {
    console.log(`🔄 Fetching transfers for ID: ${this.managerId}`)
    const response = await this.makeRequest(`${this.baseUrl}/entry/${this.managerId}/transfers/`)
    console.log(`✅ Transfer data loaded: ${response.length} transfers`)
    return response
  }

  async fetchGameweekPicks(gameweek: number): Promise<GameweekPicks> {
    console.log(`🔄 Fetching GW${gameweek} picks for ID: ${this.managerId}`)
    const response = await this.makeRequest(`${this.baseUrl}/entry/${this.managerId}/event/${gameweek}/picks/`)
    console.log(`✅ GW${gameweek} picks loaded: ${response.picks?.length} players`)
    return response
  }

  async fetchGameweekLive(gameweek: number): Promise<GameweekLive> {
    console.log(`🔄 Fetching GW${gameweek} live data`)
    const response = await this.makeRequest(`${this.baseUrl}/event/${gameweek}/live/`)
    console.log(`✅ GW${gameweek} live data loaded: ${response.elements?.length} player stats`)
    return response
  }

  async fetchAllGameweekData(maxGameweek = 38) {
    const bootstrap = await this.fetchBootstrapData()
    const currentGameweek = bootstrap.events.find((event) => event.is_current)?.id || 1
    const lastFinishedGameweek = Math.min(currentGameweek - 1, maxGameweek)

    console.log(`🔄 Fetching data for gameweeks 1-${lastFinishedGameweek}`)

    const gameweekData = []
    for (let gw = 1; gw <= lastFinishedGameweek; gw++) {
      try {
        const [picks, live] = await Promise.all([this.fetchGameweekPicks(gw), this.fetchGameweekLive(gw)])

        gameweekData.push({
          gameweek: gw,
          picks,
          live,
        })

        // Add delay to avoid rate limiting
        if (gw < lastFinishedGameweek) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch GW${gw} data:`, error)
        // Continue with other gameweeks
      }
    }

    console.log(`✅ Fetched data for ${gameweekData.length} gameweeks`)
    return gameweekData
  }

  private async makeRequest(url: string, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; FPL-DataFetcher/2.0)",
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
          },
          keepalive: true,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Data not found: ${url}`)
          }
          if (response.status === 429) {
            throw new Error("Rate limited by FPL API")
          }
          if (response.status >= 500) {
            throw new Error("FPL API server error")
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const text = await response.text()
        if (!text || text.trim() === "") {
          throw new Error("Empty response from FPL API")
        }

        if (text.trim().startsWith("<")) {
          throw new Error("FPL API returned HTML instead of JSON")
        }

        return JSON.parse(text)
      } catch (error) {
        if (attempt === retries) {
          throw error
        }

        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 5000)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  getPlayerById(playerId: number): any {
    if (!this.bootstrapData) {
      throw new Error("Bootstrap data not loaded")
    }
    return this.bootstrapData.elements.find((player) => player.id === playerId)
  }

  getTeamById(teamId: number): any {
    if (!this.bootstrapData) {
      throw new Error("Bootstrap data not loaded")
    }
    return this.bootstrapData.teams.find((team) => team.id === teamId)
  }
}
