create table assistant (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    vapi_call_id text not null,
    voice_id text not null,
    voice_provider text not null,
    phone_number text,
    model text not null,
    model_provider text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table call drop column if exists assistant_id;
alter table call add column assistant_id uuid;

alter table call add constraint fk_call_assistant 
    foreign key (assistant_id) references assistant(id);



