create function notify_game_channel(game_id integer, payload text)
returns void as $$
	select pg_notify('games/'||game_id::text, payload);
$$ language sql;



create function notify_player() returns trigger 
as $$
begin
	select notify_game_channel(
		new.game_id, 
		tg_op || '/players/' || new.id::text
	);
	return new;
end;
$$ language plpgsql;

create trigger handle_player
	after insert or update on players
	for each row
	execute function notify_player();



create function notify_rounds() returns trigger
as $$
begin
	select notify_game_channel(
		new.game_id,
		tg_op || '/rounds/' || new.id
	);
	return new;
end;
$$ language plpgsql;

create trigger handle_rounds
	after insert or update on rounds
	for each row
	execute function notify_rounds();



-- TODO is this needed?
create function notify_hand() returns trigger
as $$
begin
	select notify_game_channel(
		new.game_id,
		tg_op || '/hands/' || new.id
	);
	return new;
end;
$$ language plpgsql;

create trigger handle_hand
	after insert or update on hands
	for each row
	execute function notify_hand();



create function notify_bid() returns trigger
as $$
begin
	select notify_game_channel(
		-- Get the bid's game ID.
		(select game_id from rounds where id = new.round_id),
		tg_op || '/bids/' || new.id::text
	);
	return new;
end;
$$ language plpgsql;

create trigger handle_bid
	after insert or update on bids
	for each row
	execute function notify_bid();



create function notify_message() returns trigger
as $$
begin
	select notify_game_channel(
		(select game_id from players where id = new.player_id),
		tg_op || '/messages/' || new.id::text
	);
	return new;
end;
$$ language plpgsql;

create trigger handle_message
	after insert or update on messages
	for each row
	execute function notify_message();
