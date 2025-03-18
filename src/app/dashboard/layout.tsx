import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
// These components are used in layout.client.tsx
import { DashboardLayoutClient } from "./layout.client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
