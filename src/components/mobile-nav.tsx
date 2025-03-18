"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart,
  Home,
  Scissors,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/schedule", label: "Agenda", icon: Calendar },
    { href: "/dashboard/appointments", label: "Agendamentos", icon: Clock },
    { href: "/services", label: "Serviços", icon: Scissors },
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
    { href: "/dashboard/reports", label: "Relatórios", icon: BarChart },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6">
          <Link
            href="/"
            className="text-xl font-bold block mb-6"
            onClick={() => setOpen(false)}
          >
            Agenda<span className="text-blue-600">Pro</span>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive(item.href) ? "" : "hover:bg-gray-100"}`}
                    size="lg"
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
