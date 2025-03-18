import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  Calendar,
  Users,
  Scissors,
  Clock,
  BarChart4,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button asChild>
                <Link href="/new-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Link>
              </Button>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Bem-vindo ao seu painel de controle de agendamentos</span>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Agendamentos Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">8</div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +2 comparado a ontem
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clientes Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">124</div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +12 este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Serviços Oferecidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">15</div>
                  <Scissors className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +3 novos serviços
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">R$ 4.250</div>
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +15% comparado ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Próximos Agendamentos</CardTitle>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
              <CardDescription>Agendamentos para hoje e amanhã</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    client: "João Silva",
                    service: "Corte de Cabelo",
                    time: "10:00",
                    date: "Hoje",
                  },
                  {
                    client: "Maria Oliveira",
                    service: "Manicure",
                    time: "14:30",
                    date: "Hoje",
                  },
                  {
                    client: "Pedro Santos",
                    service: "Corte de Cabelo",
                    time: "11:00",
                    date: "Amanhã",
                  },
                  {
                    client: "Ana Costa",
                    service: "Coloração",
                    time: "15:00",
                    date: "Amanhã",
                  },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.service}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{appointment.time}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Mensal</CardTitle>
                <CardDescription>
                  Agendamentos e receita nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md">
                  <BarChart4 className="h-16 w-16 text-muted-foreground/40" />
                  <span className="ml-4 text-muted-foreground">
                    Gráfico de desempenho
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviços Populares</CardTitle>
                <CardDescription>
                  Serviços mais agendados este mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Corte de Cabelo", count: 45, percentage: 30 },
                    { name: "Manicure", count: 32, percentage: 22 },
                    { name: "Coloração", count: 28, percentage: 19 },
                    { name: "Hidratação", count: 24, percentage: 16 },
                    { name: "Pedicure", count: 18, percentage: 13 },
                  ].map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {service.count} agendamentos
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${service.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
