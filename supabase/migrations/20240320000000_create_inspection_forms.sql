-- Create inspection forms table
create table vehicle_inspection_forms (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create inspection sections table
create table vehicle_inspection_sections (
    id uuid default gen_random_uuid() primary key,
    form_id uuid references vehicle_inspection_forms(id) on delete cascade,
    title text not null,
    description text not null,
    "order" integer not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Modify existing questions table to reference sections
alter table vehicle_inspection_questions
    drop column "order",
    add column section_id uuid references vehicle_inspection_sections(id) on delete cascade,
    add column "order" integer not null;

-- Modify existing inspections table to reference forms
alter table vehicle_inspections
    add column form_id uuid references vehicle_inspection_forms(id) on delete restrict;

-- Create updated_at trigger function if it doesn't exist
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_vehicle_inspection_forms_updated_at
    before update on vehicle_inspection_forms
    for each row
    execute function update_updated_at_column();

create trigger update_vehicle_inspection_sections_updated_at
    before update on vehicle_inspection_sections
    for each row
    execute function update_updated_at_column();