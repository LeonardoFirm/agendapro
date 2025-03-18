"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileNav from "./mobile-nav";
import { NotificationBell } from "./notifications/notification-bell";
import { ThemeToggle } from "./theme-toggle";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" prefetch className="text-xl font-bold hidden md:block">
            Agenda<span className="text-blue-600">Pro</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <NotificationBell />
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() => router.push("/new-appointment")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
