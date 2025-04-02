-- Create email groups table
create table public.email_groups (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create email group members table
create table public.email_group_members (
    id uuid default gen_random_uuid() primary key,
    group_id uuid references public.email_groups(id) on delete cascade,
    email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(group_id, email)
);

-- Create sidebar section access control table
create table public.sidebar_section_access (
    id uuid default gen_random_uuid() primary key,
    section_id text not null, -- This will store the section identifier (e.g. 'configMenu', 'financeMenu', etc.)
    group_id uuid references public.email_groups(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(section_id, group_id)
);

-- Add updated_at triggers
create trigger update_email_groups_updated_at
    before update on public.email_groups
    for each row
    execute function update_updated_at_column();

create trigger update_email_group_members_updated_at
    before update on public.email_group_members
    for each row
    execute function update_updated_at_column();

create trigger update_sidebar_section_access_updated_at
    before update on public.sidebar_section_access
    for each row
    execute function update_updated_at_column();

-- Insert initial admin group and member
insert into public.email_groups (id, name, description)
values (
    'c9c3b5a4-7e6d-4b8a-9f0a-5f7b2d0f0f0f',
    'Administrators',
    'Users with full access to all sections'
);

insert into public.email_group_members (group_id, email)
values (
    'c9c3b5a4-7e6d-4b8a-9f0a-5f7b2d0f0f0f',
    'felipe.zuniga@transvip.cl'
);

-- Grant admin group access to configMenu
insert into public.sidebar_section_access (section_id, group_id)
values (
    'configMenu',
    'c9c3b5a4-7e6d-4b8a-9f0a-5f7b2d0f0f0f'
);
