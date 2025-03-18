import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/client-calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Calendar as CalendarIcon,
  Users,
  Settings,
  BarChart,
} from "lucide-react";

export default async function SchedulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const date = new Date();
  const defaultDate = date;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Agendamentos</h1>
              <p className="text-muted-foreground">
                Gerencie seus agendamentos e disponibilidade
              </p>
            </div>
            <Button>Novo Agendamento</Button>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Navegação</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Calendário
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <Clock className="mr-2 h-5 w-5" />
                      Agendamentos
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Clientes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Configurações
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <BarChart className="mr-2 h-5 w-5" />
                      Relatórios
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>
                    Selecione uma data para ver os agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={defaultDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Main Calendar/Schedule View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Agenda do Dia</CardTitle>
                    <Tabs defaultValue="day">
                      <TabsList>
                        <TabsTrigger value="day">Dia</TabsTrigger>
                        <TabsTrigger value="week">Semana</TabsTrigger>
                        <TabsTrigger value="month">Mês</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    {date.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Time slots */}
                    {Array.from({ length: 10 }, (_, i) => {
                      const hour = 8 + i;
                      const isBooked = Math.random() > 0.7;
                      return (
                        <div
                          key={hour}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-16 text-right font-medium">
                            {`${hour}:00`}
                          </div>
                          <div
                            className={`flex-1 p-3 rounded-md ${isBooked ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}
                          >
                            {isBooked ? (
                              <div>
                                <div className="font-medium">
                                  {isBooked ? "Corte de Cabelo" : "Disponível"}
                                </div>
                                {isBooked && (
                                  <div className="text-sm text-muted-foreground">
                                    Cliente: João Silva • Duração: 1h • R$ 50,00
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">
                                Disponível
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
