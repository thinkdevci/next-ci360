import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapsPage() {
  return (
    <MessagesProvider>
    <LayoutApp>
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cartes CI-360</h1>
          <p className="text-muted-foreground">
            Visualisez les opportunités et services sur une carte interactive
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Carte des opportunités</CardTitle>
              <CardDescription>
                Localisez les opportunités d'emploi, formation et financement par région
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Carte interactive en cours de développement</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Carte des services</CardTitle>
              <CardDescription>
                Trouvez les centres de formation, entreprises et institutions près de chez vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Carte interactive en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Statistiques par région</CardTitle>
            <CardDescription>
              Consultez les statistiques des opportunités disponibles dans chaque région
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">Abidjan</div>
                <div className="text-sm text-muted-foreground">45% des opportunités</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">Bouaké</div>
                <div className="text-sm text-muted-foreground">18% des opportunités</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">Autres régions</div>
                <div className="text-sm text-muted-foreground">37% des opportunités</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutApp>
    </MessagesProvider>
  )
} 