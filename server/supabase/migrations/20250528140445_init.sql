create table if not exists call (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    recipient_phone text not null,
    caller_phone text not null
);