drop table if exists message;
drop table if exists call_report;
drop table if exists call;

create table call (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    phone_call_transport text,
    type text,
    assistant_id uuid not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table call_report (
    id uuid primary key default uuid_generate_v4(),
    call_id uuid not null unique references call(id),
    recording_url text,
    summary text,
    transcript text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table message (
    id uuid primary key default uuid_generate_v4(),
    call_report_id uuid not null references call_report(id),
    role text not null,
    message text not null,
    start_timestamp double precision not null,
    end_timestamp double precision not null,
    duration double precision not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
