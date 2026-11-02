// Service pour l'API des opportunités CI-360

export interface OpportunityData {
  _id: string
  date_dexpiration: string
  opportunite: string
  localisation: string
  description: string
  secteur_dactivite: string
  source: string
  type: string
  liens: string
  cible: string
  contacts_de_la_structure: string
  conditions: string
  _i: number
  _rand: number
  _score: number | null
}

export interface ApiResponse {
  total: number
  next?: string
  results: OpportunityData[]
}

class OpportunitiesApiService {
  private baseUrl = 'https://koumoul.com/data-fair/api/v1/datasets/jcup6qw-fecborcepymjujpa/lines'
  private apiKey = process.env.KOUMOUL_API_KEY ?? ''

  private async makeRequest(endpoint: string = '', params: Record<string, string> = {}): Promise<ApiResponse> {
    try {
      const url = new URL(this.baseUrl + endpoint)
      
      // Ajouter les paramètres de requête
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-apiKey': this.apiKey,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error)
      throw error
    }
  }

  // Récupérer toutes les opportunités
  async getAllOpportunities(): Promise<OpportunityData[]> {
    const allOpportunities: OpportunityData[] = []
    let nextUrl: string | undefined = undefined

    do {
      const response = await this.makeRequest('', nextUrl ? { after: nextUrl.split('after=')[1] } : {})
      allOpportunities.push(...response.results)
      nextUrl = response.next
    } while (nextUrl)

    return allOpportunities
  }

  // Rechercher par type d'opportunité
  async getOpportunitiesByType(type: string): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    return allOpportunities.filter(opp => 
      opp.type.toLowerCase().includes(type.toLowerCase())
    )
  }

  // Rechercher par localisation
  async getOpportunitiesByLocation(location: string): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    return allOpportunities.filter(opp => 
      opp.localisation.toLowerCase().includes(location.toLowerCase())
    )
  }

  // Rechercher par secteur d'activité
  async getOpportunitiesBySector(sector: string): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    return allOpportunities.filter(opp => 
      opp.secteur_dactivite.toLowerCase().includes(sector.toLowerCase())
    )
  }

  // Rechercher par cible
  async getOpportunitiesByTarget(target: string): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    return allOpportunities.filter(opp => 
      opp.cible.toLowerCase().includes(target.toLowerCase())
    )
  }

  // Recherche générale
  async searchOpportunities(query: string): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    const searchTerm = query.toLowerCase()

    return allOpportunities.filter(opp => 
      opp.opportunite.toLowerCase().includes(searchTerm) ||
      opp.description.toLowerCase().includes(searchTerm) ||
      opp.localisation.toLowerCase().includes(searchTerm) ||
      opp.secteur_dactivite.toLowerCase().includes(searchTerm) ||
      opp.cible.toLowerCase().includes(searchTerm)
    )
  }

  // Obtenir les opportunités expirant bientôt (dans les 30 prochains jours)
  async getExpiringSoon(): Promise<OpportunityData[]> {
    const allOpportunities = await this.getAllOpportunities()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return allOpportunities.filter(opp => {
      const expirationDate = new Date(opp.date_dexpiration)
      return expirationDate <= thirtyDaysFromNow && expirationDate >= new Date()
    })
  }

  // Obtenir les statistiques
  async getStats(): Promise<{
    total: number
    byType: Record<string, number>
    bySector: Record<string, number>
    expiringSoon: number
  }> {
    const allOpportunities = await this.getAllOpportunities()
    
    const byType: Record<string, number> = {}
    const bySector: Record<string, number> = {}
    
    allOpportunities.forEach(opp => {
      byType[opp.type] = (byType[opp.type] || 0) + 1
      bySector[opp.secteur_dactivite] = (bySector[opp.secteur_dactivite] || 0) + 1
    })

    const expiringSoon = await this.getExpiringSoon()

    return {
      total: allOpportunities.length,
      byType,
      bySector,
      expiringSoon: expiringSoon.length
    }
  }

  // Formater une opportunité pour l'affichage
  formatOpportunity(opp: OpportunityData): {
    id: string
    title: string
    description: string
    location: string
    type: string
    sector: string
    target: string
    conditions: string
    contacts: string
    links: string
    expirationDate: string
    source: string
    isExpiringSoon: boolean
  } {
    const expirationDate = new Date(opp.date_dexpiration)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const isExpiringSoon = expirationDate <= thirtyDaysFromNow && expirationDate >= new Date()

    return {
      id: opp._id,
      title: opp.opportunite,
      description: opp.description,
      location: opp.localisation,
      type: opp.type,
      sector: opp.secteur_dactivite,
      target: opp.cible,
      conditions: opp.conditions,
      contacts: opp.contacts_de_la_structure,
      links: opp.liens,
      expirationDate: opp.date_dexpiration,
      source: opp.source,
      isExpiringSoon
    }
  }
}

// Instance singleton
export const opportunitiesApi = new OpportunitiesApiService()

// Cache pour les données
let opportunitiesCache: OpportunityData[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getCachedOpportunities(): Promise<OpportunityData[]> {
  const now = Date.now()
  
  if (opportunitiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return opportunitiesCache
  }

  try {
    opportunitiesCache = await opportunitiesApi.getAllOpportunities()
    cacheTimestamp = now
    return opportunitiesCache
  } catch (error) {
    console.error('Erreur lors de la récupération des opportunités:', error)
    // Retourner le cache expiré si disponible, sinon tableau vide
    return opportunitiesCache || []
  }
}

export function clearCache(): void {
  opportunitiesCache = null
  cacheTimestamp = 0
} 