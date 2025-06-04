drop table if exists message;
drop table if exists call_report;

alter table call add column recording_url text;
alter table call add column summary text;
alter table call add column transcript text;

create table message (
    id uuid primary key default uuid_generate_v4(),
    call_id uuid not null references call(id),
    role text not null,
    message text not null,
    start_timestamp double precision not null,
    end_timestamp double precision not null,
    duration double precision not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);
