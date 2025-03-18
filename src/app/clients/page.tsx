import { createClient } from "../../../supabase/server";
import ClientList from "./client-list";

export default async function ClientsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ClientList />
      </main>
    </div>
  );
}
