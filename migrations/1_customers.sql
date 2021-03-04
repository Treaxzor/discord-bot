CREATE TABLE customers (
  id bigserial not null,
  created_at timestamp with time zone not null default now(),
  modified_at timestamp with time zone null,
  email varchar not null,
  has_krypton boolean not null default false,
  has_telegram boolean not null default false,
  is_manual boolean not null default false,
  krypton_invoice_id varchar null,
  discord_guild_id varchar null,
  discord_id varchar null,
  discord_name varchar null,
  PRIMARY KEY (id)
);