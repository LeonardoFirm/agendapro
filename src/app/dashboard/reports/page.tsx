import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  PieChart,
  LineChart,
  Download,
  Calendar,
} from "lucide-react";

export default async function ReportsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground">
                Analise o desempenho do seu negócio
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Período
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </header>

          {/* Report Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total de Agendamentos",
                    value: "156",
                    change: "+12%",
                    period: "este mês",
                  },
                  {
                    title: "Taxa de Ocupação",
                    value: "78%",
                    change: "+5%",
                    period: "este mês",
                  },
                  {
                    title: "Receita Total",
                    value: "R$ 8.450",
                    change: "+15%",
                    period: "este mês",
                  },
                  {
                    title: "Novos Clientes",
                    value: "24",
                    change: "+8%",
                    period: "este mês",
                  },
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span
                          className={
                            stat.change.startsWith("+")
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {stat.change}
                        </span>{" "}
                        {stat.period}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Agendamentos por Serviço</CardTitle>
                    <CardDescription>
                      Distribuição de agendamentos por tipo de serviço
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md">
                      <PieChart className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de pizza
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Receita Mensal</CardTitle>
                    <CardDescription>
                      Receita total por mês nos últimos 6 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md">
                      <BarChart4 className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de barras
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tendência de Agendamentos</CardTitle>
                  <CardDescription>
                    Número de agendamentos diários nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="flex items-center justify-center w-full h-full bg-muted/20 rounded-md">
                    <LineChart className="h-16 w-16 text-muted-foreground/40" />
                    <span className="ml-4 text-muted-foreground">
                      Gráfico de linha
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Agendamentos</CardTitle>
                  <CardDescription>
                    Análise detalhada dos agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: "Total de Agendamentos", value: "156" },
                        { title: "Agendamentos Concluídos", value: "132" },
                        { title: "Agendamentos Cancelados", value: "24" },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 bg-muted/20 rounded-lg text-center"
                        >
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {stat.title}
                          </div>
                          <div className="text-3xl font-bold">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart4 className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de agendamentos por dia da semana
                      </span>
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de tendência de agendamentos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Receita</CardTitle>
                  <CardDescription>
                    Análise detalhada da receita
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: "Receita Total", value: "R$ 8.450" },
                        { title: "Ticket Médio", value: "R$ 64,02" },
                        { title: "Serviço Mais Rentável", value: "Coloração" },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 bg-muted/20 rounded-lg text-center"
                        >
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {stat.title}
                          </div>
                          <div className="text-3xl font-bold">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart4 className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de receita por serviço
                      </span>
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de receita mensal
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Clientes</CardTitle>
                  <CardDescription>
                    Análise detalhada dos clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: "Total de Clientes", value: "124" },
                        { title: "Novos Clientes", value: "24" },
                        { title: "Taxa de Retenção", value: "78%" },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 bg-muted/20 rounded-lg text-center"
                        >
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {stat.title}
                          </div>
                          <div className="text-3xl font-bold">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <PieChart className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de clientes por serviço preferido
                      </span>
                    </div>

                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/40" />
                      <span className="ml-4 text-muted-foreground">
                        Gráfico de aquisição de clientes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
