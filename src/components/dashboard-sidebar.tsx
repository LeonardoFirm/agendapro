"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart,
  Home,
  Scissors,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

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
    <aside className="w-64 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto hidden md:block">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold block mb-6">
          Agenda<span className="text-blue-600">Pro</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
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
    </aside>
  );
}
