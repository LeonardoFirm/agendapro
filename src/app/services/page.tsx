import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";

export default async function ServicesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock services data
  const services = [
    {
      id: 1,
      name: "Corte de Cabelo",
      duration: 60,
      price: 50,
      description: "Corte masculino ou feminino com lavagem e finalização.",
    },
    {
      id: 2,
      name: "Manicure",
      duration: 45,
      price: 35,
      description: "Tratamento completo para unhas das mãos.",
    },
    {
      id: 3,
      name: "Pedicure",
      duration: 45,
      price: 40,
      description: "Tratamento completo para unhas dos pés.",
    },
    {
      id: 4,
      name: "Coloração",
      duration: 120,
      price: 150,
      description: "Coloração completa com produtos de alta qualidade.",
    },
    {
      id: 5,
      name: "Hidratação",
      duration: 60,
      price: 80,
      description: "Tratamento intensivo para cabelos danificados.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Serviços</h1>
              <p className="text-muted-foreground">
                Gerencie os serviços oferecidos
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Serviço
            </Button>
          </header>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{service.duration} minutos</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Add/Edit Service Form */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Serviço</CardTitle>
              <CardDescription>
                Preencha os detalhes do serviço abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input id="name" placeholder="Ex: Corte de Cabelo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input id="duration" type="number" placeholder="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input id="price" type="number" placeholder="50.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input id="capacity" type="number" placeholder="1" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      placeholder="Descreva o serviço..."
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Serviço</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
