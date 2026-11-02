"use client"

import { useState, useEffect } from "react"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { OpportunitiesHero } from "@/app/components/opportunities/opportunities-hero"
import { OpportunitiesStats } from "@/app/components/opportunities/opportunities-stats"

import { OpportunitiesFiltersSimple } from "@/app/components/opportunities/opportunities-filters-simple"
import { OpportunitiesGrid } from "@/app/components/opportunities/opportunities-grid"
import { sampleOpportunities, getOpportunitiesByType, getExpiringOpportunities, getOpportunitiesStats, type Opportunity } from "@/app/data/sample-opportunities"
import { Heart } from "@phosphor-icons/react"

interface FilterState {
  search: string
  sortBy: string
  activeFilters: string[]
}

export default function OpportunitiesPage() {
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(sampleOpportunities)
  const [loading, setLoading] = useState(false)
  const [stats] = useState(getOpportunitiesStats())

  // Handlers pour les boutons d'action
  const handleTalkToCI360 = () => {
    // Rediriger vers la page d'accueil avec le chat
    window.location.href = '/'
  }

  const handleSeeMoreOpportunities = () => {
    // Afficher toutes les opportunités (supprimer les filtres)
    setFilteredOpportunities(sampleOpportunities)
  }

  const handleExploreOpportunities = () => {
    // Scroll vers la section des opportunités
    const opportunitiesSection = document.querySelector('.opportunities-section')
    if (opportunitiesSection) {
      opportunitiesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHowItWorks = () => {
    // Ouvrir une modal ou rediriger vers une page d'aide
    alert('Fonctionnalité en cours de développement. Contactez-nous pour plus d\'informations.')
  }

  const handleFiltersChange = (filters: FilterState) => {
    setLoading(true)
    
    // Simuler un délai de chargement
    setTimeout(() => {
      let filtered = [...sampleOpportunities]

      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(opp => 
          opp.title.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower) ||
          opp.organization.toLowerCase().includes(searchLower) ||
          opp.sector.toLowerCase().includes(searchLower)
        )
      }

      // Filtre par catégories
      if (filters.activeFilters.length > 0) {
        filtered = filtered.filter(opp => {
          const oppType = opp.type.toLowerCase()
          const isUrgent = opp.isExpiringSoon
          
          return filters.activeFilters.some(filter => {
            if (filter === 'urgent') return isUrgent
            return oppType === filter.toLowerCase()
          })
        })
      }

      // Tri
      switch (filters.sortBy) {
        case 'recent':
          // Utiliser l'ID comme proxy pour la date de création (plus récent = ID plus élevé)
          filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
          break
        case 'oldest':
          // Utiliser l'ID comme proxy pour la date de création (plus ancien = ID plus bas)
          filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id))
          break
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'deadline':
          filtered.sort((a, b) => {
            const dateA = a.deadline ? new Date(a.deadline).getTime() : 0
            const dateB = b.deadline ? new Date(b.deadline).getTime() : 0
            return dateA - dateB
          })
          break
        case 'popular':
          // Utiliser l'ID comme proxy pour la popularité (plus populaire = ID plus élevé)
          filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
          break
      }

      setFilteredOpportunities(filtered)
      setLoading(false)
    }, 300)
  }

  return (
    <MessagesProvider>
    <LayoutApp>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1px;
          border-radius: 12px;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          border-radius: 12px;
          margin: 1px;
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <div className="animate-fade-in-up">
          <OpportunitiesHero 
            onExploreClick={handleExploreOpportunities}
            onHowItWorksClick={handleHowItWorks}
          />
        </div>

        {/* Statistiques */}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-slide-in-left">
            <OpportunitiesStats 
              totalOpportunities={stats.total}
              opportunitiesByType={{
                emploi: stats.emploi,
                formation: stats.formation,
                financement: stats.financement,
                bourse: stats.bourse,
                stage: stats.stage
              }}
              expiringSoon={stats.expiringSoon}
              className="mb-12"
            />
          </div>



          {/* Filtres et recherche */}
          <div className="mb-8 animate-fade-in-up">
            <OpportunitiesFiltersSimple 
              onFiltersChange={handleFiltersChange}
              totalResults={filteredOpportunities.length}
            />
          </div>

          {/* Résultats */}
          <div className="mb-8 opportunities-section animate-fade-in-up">
            <OpportunitiesGrid 
              opportunities={filteredOpportunities} 
              loading={loading}
            />
          </div>

          {/* Section d'appel à l'action */}
          <div className="text-center py-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20 hover-lift animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Notre assistant CI-360 peut vous aider à trouver des opportunités personnalisées 
              selon votre profil et vos aspirations. Posez-lui vos questions !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleTalkToCI360}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover-lift"
              >
                Parler à CI-360
              </button>
              <button 
                onClick={handleSeeMoreOpportunities}
                className="border border-primary/30 text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer hover-lift"
              >
                Voir plus d'opportunités
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer moderne et léger */}
      <footer className="w-full mt-12 py-6 bg-background/80 backdrop-blur-md border-t border-primary/10 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
        <div>
          &copy; {new Date().getFullYear()} CI-360. Tous droits réservés.
        </div>
        <div className="flex items-center gap-1 justify-center">
          Fait avec <Heart className="inline-block text-red-500 mx-1" weight="fill" size={16} /> par <span className="font-semibold text-primary ml-1">ThinkDev</span>
        </div>
        <div>
          Contact : <a href="tel:0788364403" className="underline hover:text-primary">0788364403</a> | <a href="mailto:emmanuelmalan225@gmail.com" className="underline hover:text-primary">emmanuelmalan225@gmail.com</a>
        </div>
      </footer>
    </LayoutApp>
    </MessagesProvider>
  )
} 