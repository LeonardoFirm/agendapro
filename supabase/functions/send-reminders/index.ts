import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current time
    const now = new Date();

    // Find reminders that need to be sent
    const { data: reminders, error: remindersError } = await supabase
      .from("appointment_reminders")
      .select("*, appointments(*, users(email, user_metadata))") // Join with appointments and users
      .eq("sent", false)
      .lte("scheduled_for", now.toISOString());

    if (remindersError) {
      throw remindersError;
    }

    // Process each reminder
    const results = [];
    for (const reminder of reminders || []) {
      // Get appointment and user details
      const appointment = reminder.appointments;
      const user = appointment?.users;

      if (!appointment || !user) continue;

      // Create notification
      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: reminder.user_id,
          title: `Lembrete de Agendamento`,
          message: `Você tem um agendamento ${reminder.reminder_type === "24h" ? "amanhã" : "em 1 hora"} para ${appointment.service_name}.`,
          type: "reminder",
          related_id: appointment.id,
        })
        .select()
        .single();

      if (notificationError) {
        results.push({
          id: reminder.id,
          success: false,
          error: notificationError.message,
        });
        continue;
      }

      // Mark reminder as sent
      const { error: updateError } = await supabase
        .from("appointment_reminders")
        .update({ sent: true })
        .eq("id", reminder.id);

      results.push({
        id: reminder.id,
        success: !updateError,
        notification_id: notification?.id,
        error: updateError?.message,
      });
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
