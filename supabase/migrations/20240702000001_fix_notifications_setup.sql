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