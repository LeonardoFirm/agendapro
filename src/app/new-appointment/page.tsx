import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default async function NewAppointmentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock services data
  const services = [
    { id: 1, name: "Corte de Cabelo", duration: 60, price: 50 },
    { id: 2, name: "Manicure", duration: 45, price: 35 },
    { id: 3, name: "Pedicure", duration: 45, price: 40 },
    { id: 4, name: "Coloração", duration: 120, price: 150 },
    { id: 5, name: "Hidratação", duration: 60, price: 80 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Header Section */}
          <header>
            <h1 className="text-3xl font-bold">Novo Agendamento</h1>
            <p className="text-muted-foreground">Agende um novo serviço</p>
          </header>

          {/* Appointment Form */}
          <Tabs defaultValue="service">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="service">1. Serviço</TabsTrigger>
              <TabsTrigger value="datetime">2. Data e Hora</TabsTrigger>
              <TabsTrigger value="client">3. Cliente</TabsTrigger>
            </TabsList>

            {/* Step 1: Service Selection */}
            <TabsContent value="service" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selecione o Serviço</CardTitle>
                  <CardDescription>
                    Escolha o serviço que deseja agendar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`service-${service.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {service.name}
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {service.duration} min • R${" "}
                            {service.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Próximo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Step 2: Date and Time Selection */}
            <TabsContent value="datetime" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selecione a Data e Hora</CardTitle>
                  <CardDescription>
                    Escolha quando deseja agendar o serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="mb-2 block">Data</Label>
                      <Calendar mode="single" className="rounded-md border" />
                    </div>
                    <div>
                      <Label className="mb-2 block">Horário Disponível</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "08:00",
                          "08:30",
                          "09:00",
                          "09:30",
                          "10:00",
                          "10:30",
                          "11:00",
                          "11:30",
                          "14:00",
                          "14:30",
                          "15:00",
                          "15:30",
                        ].map((time) => (
                          <div
                            key={time}
                            className="p-2 border rounded-md text-center hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Voltar</Button>
                  <Button>Próximo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Step 3: Client Information */}
            <TabsContent value="client" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                  <CardDescription>
                    Preencha as informações do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-type">Tipo de Cliente</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="client-existing" />
                          <Label htmlFor="client-existing">
                            Cliente Existente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="client-new" />
                          <Label htmlFor="client-new">Novo Cliente</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-select">Selecione o Cliente</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">João Silva</SelectItem>
                          <SelectItem value="2">Maria Oliveira</SelectItem>
                          <SelectItem value="3">Pedro Santos</SelectItem>
                          <SelectItem value="4">Ana Costa</SelectItem>
                          <SelectItem value="5">Carlos Ferreira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-name">Nome Completo</Label>
                        <Input id="client-name" placeholder="Nome do cliente" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-phone">Telefone</Label>
                        <Input
                          id="client-phone"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-email">Email</Label>
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Input
                        id="notes"
                        placeholder="Observações sobre o agendamento"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Voltar</Button>
                  <div className="text-right">
                    <div className="text-lg font-bold">Total: R$ 50,00</div>
                    <div className="text-sm text-muted-foreground">
                      Duração: 60 min
                    </div>
                  </div>
                  <Button>Confirmar Agendamento</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
