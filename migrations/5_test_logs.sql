CREATE TABLE test_logs (
  id bigserial not null,
  created_at timestamp with time zone not null default now(),
  data varchar null,
  PRIMARY KEY (id)
);