create function generate_game_code () returns text as $$
	select substr(md5(''||clock_timestamp()::text), 1, 4);
$$ language sql;

create table games (
  id serial not null primary key,
  code text not null unique default generate_game_code (),
  host_player_id integer not null
);

-- TODO add accounts table
-- TODO add rounds table
create table players (
  id serial not null primary key,
  game_id integer not null references games (id),
  name text not null,
  color varchar(7) not null
);

-- Ensure the color is a valid hex code. https://dba.stackexchange.com/a/306150
alter table players
add constraint color_hex_constraint check (color ~* '^#[a-f0-9]{6}$');

-- Add constraint to games.host
alter table games
add constraint games_host_fkey foreign key (host_player_id) references players (id);

create table rounds (
  id serial not null primary key,
  created_at timestamptz not null default clock_timestamp(),
  game_id integer not null references games (id),
  starting_player_id integer not null references players (id)
);

create table hands (
  id serial not null primary key,
  player_id integer not null references players (id),
  round_id integer not null references rounds (id),
  dice smallint[] not null
);

create table bids (
  id serial not null primary key,
  created_at timestamptz not null default clock_timestamp(),
  player_id integer not null references players (id),
  round_id integer not null references rounds (id),
  type text not null,
  quantity smallint,
  die smallint
);

create table messages (
  id serial not null primary key,
  created_at timestamptz not null default clock_timestamp(),
  player_id integer not null references players (id),
  content text not null
);
