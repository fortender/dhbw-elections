CREATE DATABASE dhbw_elections;
CREATE USER election_admin WITH ENCRYPTED PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE dhbw_elections TO election_admin;

create table if not exists "user" (
    id integer primary key,
    username varchar(50) not null,
    password_hash bytea not null
);

create unique index idx_user_username on "user" (username);

insert into "user" (username, password_hash) values ('admin', '\x8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

create table if not exists candidate (
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    photo bytea,
    info json
);

create table if not exists election (
    id serial primary key,
    start_date timestamp not null,
    end_date timestamp not null,
    info json
);

create table if not exists election_candidate (
    id serial primary key,
    election_id integer references election(id),
    candidate_id integer references candidate(id),
    unique (election_id, candidate_id)
);

create table vote (
    id bigserial primary key,
    election_candidate_id integer references election_candidate(id),
    username varchar(50) not null,
    voted_at timestamp default CURRENT_TIMESTAMP,
    unique (election_candidate_id, username)
);

create index idx_vote_username on vote (username);
