"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Calendar, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClientList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock clients data
  const clients = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      lastVisit: "10/05/2023",
      totalVisits: 8,
    },
    {
      id: 2,
      name: "Maria Oliveira",
      email: "maria@example.com",
      phone: "(11) 91234-5678",
      lastVisit: "22/06/2023",
      totalVisits: 12,
    },
    {
      id: 3,
      name: "Pedro Santos",
      email: "pedro@example.com",
      phone: "(11) 99876-5432",
      lastVisit: "05/07/2023",
      totalVisits: 5,
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana@example.com",
      phone: "(11) 95555-4444",
      lastVisit: "18/07/2023",
      totalVisits: 3,
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      email: "carlos@example.com",
      phone: "(11) 92222-3333",
      lastVisit: "30/07/2023",
      totalVisits: 7,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Link>
        </Button>
      </header>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                alert("Filtro aplicado!");
              }}
            >
              Filtrar
            </Button>
            <Button
              onClick={() => {
                alert("Busca realizada para: " + searchTerm);
              }}
            >
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Total de Visitas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.lastVisit}</TableCell>
                  <TableCell>{client.totalVisits}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/new-appointment">
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
