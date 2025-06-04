
ALTER TABLE message 
  ALTER COLUMN start_timestamp DROP NOT NULL,
  ALTER COLUMN end_timestamp DROP NOT NULL;

ALTER TABLE call
  ADD CONSTRAINT unique_call_vapi_id UNIQUE (vapi_id);

ALTER TABLE assistant
  ADD CONSTRAINT unique_assistant_vapi_id UNIQUE (vapi_id);


