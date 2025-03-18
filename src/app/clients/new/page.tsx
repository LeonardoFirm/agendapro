"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientSideNavbar from "@/components/client-side-navbar";
import { createClient } from "../../../../supabase/client";
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
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";

export default function NewClientPage() {
  // We'll implement user fetching in a useEffect if needed
  // const [user, setUser] = useState<any>(null);
  //
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const supabase = createClient();
  //     const { data } = await supabase.auth.getUser();
  //     setUser(data.user);
  //   };
  //   fetchUser();
  // }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically save the client data to your database
      // For now, we'll just simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });

      router.push("/clients");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSideNavbar user={null} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          {/* Header Section */}
          <header>
            <h1 className="text-3xl font-bold">Novo Cliente</h1>
            <p className="text-muted-foreground">
              Adicione um novo cliente ao seu sistema
            </p>
          </header>

          {/* Client Form */}
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
                <CardDescription>
                  Preencha os dados do novo cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Nome do cliente"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      placeholder="Endereço completo"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações sobre o cliente"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/clients")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Cliente"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
