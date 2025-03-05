create table public.parking_tickets (
  id uuid default gen_random_uuid() primary key,
  booking_id text not null,
  driver_id text not null,
  submission_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null check (status in ('pending_review', 'auto_approved', 'auto_rejected', 'admin_approved', 'admin_rejected')),
  parsed_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index parking_tickets_driver_id_idx on public.parking_tickets(driver_id);
create index parking_tickets_booking_id_idx on public.parking_tickets(booking_id);
create index parking_tickets_status_idx on public.parking_tickets(status);

-- Set up RLS (Row Level Security)
alter table public.parking_tickets enable row level security;

-- Policies
create policy "Users can view their own tickets"
  on public.parking_tickets for select
  using (auth.uid() = driver_id);

create policy "Users can insert their own tickets"
  on public.parking_tickets for insert
  with check (auth.uid() = driver_id);

-- Create storage bucket for parking tickets
insert into storage.buckets (id, name)
values ('parking-tickets', 'parking-tickets')
on conflict do nothing;

-- Storage policies
create policy "Users can upload their own tickets"
  on storage.objects for insert
  with check (
    bucket_id = 'parking-tickets' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own tickets"
  on storage.objects for select
  using (
    bucket_id = 'parking-tickets' and
    auth.uid()::text = (storage.foldername(name))[1]
  ); 