import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      client: "João Silva",
      service: "Corte de Cabelo",
      date: "2023-08-15",
      time: "10:00",
      duration: 60,
      price: 50,
      status: "confirmed",
      notes: "Cliente prefere corte mais curto nas laterais",
    },
    {
      id: 2,
      client: "Maria Oliveira",
      service: "Manicure",
      date: "2023-08-15",
      time: "14:30",
      duration: 45,
      price: 35,
      status: "confirmed",
      notes: "",
    },
    {
      id: 3,
      client: "Pedro Santos",
      service: "Corte de Cabelo",
      date: "2023-08-16",
      time: "11:00",
      duration: 60,
      price: 50,
      status: "pending",
      notes: "Primeira visita",
    },
    {
      id: 4,
      client: "Ana Costa",
      service: "Coloração",
      date: "2023-08-16",
      time: "15:00",
      duration: 120,
      price: 150,
      status: "confirmed",
      notes: "Trazer referência de cor",
    },
    {
      id: 5,
      client: "Carlos Ferreira",
      service: "Hidratação",
      date: "2023-08-17",
      time: "09:30",
      duration: 60,
      price: 80,
      status: "cancelled",
      notes: "Cancelado pelo cliente",
    },
  ];

  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    },
    {} as Record<string, typeof appointments>,
  );

  return (
    <SubscriptionCheck>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Agendamentos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus agendamentos
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Exportar</Button>
              <Button asChild>
                <Link href="/new-appointment">Novo Agendamento</Link>
              </Button>
            </div>
          </header>

          {/* Tabs for different appointment views */}
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="today">Hoje</TabsTrigger>
              <TabsTrigger value="past">Passados</TabsTrigger>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedAppointments).map(
                  ([date, dateAppointments]) => (
                    <div key={date} className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        {new Date(date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dateAppointments.map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="today" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Hoje
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointments.slice(0, 2).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                Nenhum agendamento passado para exibir.
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedAppointments).map(
                  ([date, dateAppointments]) => (
                    <div key={date} className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        {new Date(date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dateAppointments.map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const statusMap = {
    confirmed: {
      label: "Confirmado",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
      label: "Pendente",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    cancelled: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const status = statusMap[appointment.status as keyof typeof statusMap];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{appointment.service}</CardTitle>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <CardDescription>{appointment.client}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {appointment.time} • {appointment.duration} min
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {new Date(appointment.date).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>R$ {appointment.price.toFixed(2)}</span>
          </div>
          {appointment.notes && (
            <div className="mt-4 pt-4 border-t text-sm">
              <p className="text-muted-foreground">{appointment.notes}</p>
            </div>
          )}
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {appointment.status === "confirmed" && (
              <Button variant="outline" size="sm" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluir
              </Button>
            )}
            {appointment.status === "pending" && (
              <Button variant="outline" size="sm" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            )}
            {appointment.status !== "cancelled" && (
              <Button variant="outline" size="sm" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
