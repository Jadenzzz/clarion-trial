DROP TYPE IF EXISTS call_type;

CREATE TYPE call_type AS ENUM ('inboundPhoneCall', 'outboundPhoneCall', 'webCall');

