alter table assistant drop column if exists vapi_call_id;
alter table assistant add column vapi_id text;
alter table call add column vapi_id text;