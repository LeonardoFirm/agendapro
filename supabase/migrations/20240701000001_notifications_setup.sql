-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment reminders table
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for notifications
alter publication supabase_realtime add table notifications;

-- Create function to generate appointment reminders
CREATE OR REPLACE FUNCTION create_appointment_reminders()
RETURNS TRIGGER AS $$
BEGIN
  -- Create 24-hour reminder
  INSERT INTO appointment_reminders (appointment_id, user_id, reminder_type, scheduled_for)
  VALUES (NEW.id, NEW.user_id, '24h', (NEW.appointment_date - INTERVAL '24 hours'));
  
  -- Create 1-hour reminder
  INSERT INTO appointment_reminders (appointment_id, user_id, reminder_type, scheduled_for)
  VALUES (NEW.id, NEW.user_id, '1h', (NEW.appointment_date - INTERVAL '1 hour'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    NEW.user_id,
    CASE 
      WHEN NEW.status = 'confirmed' THEN 'Agendamento Confirmado'
      WHEN NEW.status = 'cancelled' THEN 'Agendamento Cancelado'
      ELSE 'Novo Agendamento'
    END,
    CASE 
      WHEN NEW.status = 'confirmed' THEN 'Seu agendamento foi confirmado.'
      WHEN NEW.status = 'cancelled' THEN 'Seu agendamento foi cancelado.'
      ELSE 'Você tem um novo agendamento.'
    END,
    'appointment',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
