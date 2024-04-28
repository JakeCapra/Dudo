# Plan

## Data model

Almost all resources relate to a `game`.
Each `game` will have `players`.
Each `player` can have an optional account (TODO). Meaning that a `player` is unique to a `game`.
A `game` will consist of many `rounds`.
Each `round` will have a `hand` for each player in the `game`.
Each `round` will have many `bids`.
Each `bid` will have a `player`.

There are also `messages`. Each message will have a `player` an `game` reference.

## General flow

Postgres will emit events to a channel. The name of the channel will be the game's ID.

Each game will be listening to its channel. From there, it will process events and notify each player.

The channels will work as follows:
Name of the channel: `game/{gameID}`
Payload (text): `[insert|update]/{resource}/{resourceID}`
Deletes will not be supported.
No events will be emitted for game resource changes.
