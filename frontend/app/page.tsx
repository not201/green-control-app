import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconSeedlingFilled,
  IconChartBar,
  IconPlant,
  IconBell,
  IconShield,
  IconClock,
} from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-background dark:to-green-950/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <IconSeedlingFilled className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Green Control</span>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
            <Link href="/iniciar-sesion">
              <Button size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/registrarse">
              <Button size="sm" variant="secondary">
                Registrarse
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12 sm:py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance">
            Control total de tus cultivos
            <span className="text-green-600"> en un solo lugar</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground text-pretty">
            Green Control te ayuda a gestionar tus parcelas, tareas,
            contabilidad y analíticas de forma inteligente. Optimiza tus
            cultivos con tecnología de precisión.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/registro" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Comenzar gratis
              </Button>
            </Link>
            <Link href="/iniciar-sesion" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-12 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Todo lo que necesitas para gestionar tus cultivos
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <IconPlant className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Gestión de Parcelas</CardTitle>
                  <CardDescription>
                    Monitorea cada parcela con datos en tiempo real de suelo, pH
                    y cultivos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconClock className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Control de Tareas</CardTitle>
                  <CardDescription>
                    Organiza y prioriza todas las actividades de tu cultivo en
                    un solo lugar
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconChartBar className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Analíticas Avanzadas</CardTitle>
                  <CardDescription>
                    Visualiza el rendimiento y rentabilidad de cada parcela con
                    gráficos detallados
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconBell className="h-10 w-10 text-orange-600 mb-2" />
                  <CardTitle>Notificaciones Inteligentes</CardTitle>
                  <CardDescription>
                    Recibe alertas sobre temperatura, humedad y eventos
                    importantes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconShield className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle>Control Contable</CardTitle>
                  <CardDescription>
                    Lleva un registro detallado de todos tus ingresos y gastos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconSeedlingFilled className="h-10 w-10 text-teal-600 mb-2" />
                  <CardTitle>Soporte Dedicado</CardTitle>
                  <CardDescription>
                    Acceso a soporte técnico y asesoría especializada en
                    agricultura
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
            Acerca de Green Control
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Green Control es una plataforma integral diseñada para agricultores
            modernos que buscan optimizar sus operaciones. Combinamos tecnología
            de precisión con una interfaz intuitiva para que puedas tomar
            decisiones informadas sobre tus cultivos.
          </p>
        </div>
      </section>

      <footer className="border-t py-6 sm:py-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            © 2025 Green Control. Creado por VagosTeam. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
