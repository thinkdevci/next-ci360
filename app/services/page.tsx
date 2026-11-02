import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesPage() {
  return (
    <MessagesProvider>
    <LayoutApp>
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Services CI-360</h1>
          <p className="text-muted-foreground">
            Découvrez nos services pour vous accompagner dans vos projets
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Conseil en orientation</CardTitle>
              <CardDescription>
                Bénéficiez d'un accompagnement personnalisé pour définir votre parcours professionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nos experts vous aident à identifier vos compétences et à choisir la formation ou l'emploi qui vous convient le mieux.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accompagnement CV</CardTitle>
              <CardDescription>
                Optimisez votre CV et votre lettre de motivation pour maximiser vos chances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nous vous aidons à créer un CV professionnel et une lettre de motivation percutante.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préparation entretien</CardTitle>
              <CardDescription>
                Préparez-vous efficacement pour vos entretiens d'embauche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Simulation d'entretiens, conseils et techniques pour réussir vos entretiens professionnels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutApp>
    </MessagesProvider>
  )
} 