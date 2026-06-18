--
-- PostgreSQL database dump
--

-- Dumped from database version 18.4 (48c2093)
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-18 23:51:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16522)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 877 (class 1247 OID 40961)
-- Name: result_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.result_enum AS ENUM (
    'win',
    'lose',
    'unfinished'
);


ALTER TYPE public.result_enum OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16558)
-- Name: heroes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.heroes (
    hero_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    health integer NOT NULL,
    damage integer NOT NULL,
    cost integer NOT NULL
);


ALTER TABLE public.heroes OWNER TO neondb_owner;

--
-- TOC entry 222 (class 1259 OID 16577)
-- Name: items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.items (
    item_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    plus_health integer,
    plus_damage integer,
    cost integer NOT NULL
);


ALTER TABLE public.items OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 57344)
-- Name: matches; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.matches (
    match_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    player_id uuid,
    hero_id uuid,
    enemy_id uuid,
    result_match public.result_enum DEFAULT 'unfinished'::public.result_enum,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.matches OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 16593)
-- Name: player_heroes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.player_heroes (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT heroes_inventory_id_not_null NOT NULL,
    player_id uuid,
    hero_id uuid
);


ALTER TABLE public.player_heroes OWNER TO neondb_owner;

--
-- TOC entry 224 (class 1259 OID 16610)
-- Name: player_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.player_items (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT items_inventory_id_not_null NOT NULL,
    player_id uuid,
    item_id uuid
);


ALTER TABLE public.player_items OWNER TO neondb_owner;

--
-- TOC entry 220 (class 1259 OID 16534)
-- Name: players; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.players (
    player_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username text NOT NULL,
    hashed_password text NOT NULL,
    wins integer DEFAULT 0,
    losses integer DEFAULT 0,
    coins integer DEFAULT 100,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.players OWNER TO neondb_owner;

--
-- TOC entry 3327 (class 2606 OID 16599)
-- Name: player_heroes heroes_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_heroes
    ADD CONSTRAINT heroes_inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16571)
-- Name: heroes heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_pkey PRIMARY KEY (hero_id);


--
-- TOC entry 3329 (class 2606 OID 16616)
-- Name: player_items items_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT items_inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 16587)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);


--
-- TOC entry 3331 (class 2606 OID 57353)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (match_id);


--
-- TOC entry 3319 (class 2606 OID 16547)
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (player_id);


--
-- TOC entry 3321 (class 2606 OID 32773)
-- Name: players players_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_username_key UNIQUE (username);


--
-- TOC entry 3332 (class 2606 OID 16605)
-- Name: player_heroes heroes_inventory_hero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_heroes
    ADD CONSTRAINT heroes_inventory_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.heroes(hero_id) ON DELETE CASCADE;


--
-- TOC entry 3333 (class 2606 OID 16600)
-- Name: player_heroes heroes_inventory_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_heroes
    ADD CONSTRAINT heroes_inventory_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(player_id) ON DELETE CASCADE;


--
-- TOC entry 3334 (class 2606 OID 16622)
-- Name: player_items items_inventory_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT items_inventory_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id) ON DELETE CASCADE;


--
-- TOC entry 3335 (class 2606 OID 16617)
-- Name: player_items items_inventory_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT items_inventory_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(player_id) ON DELETE CASCADE;


--
-- TOC entry 3336 (class 2606 OID 57364)
-- Name: matches matches_enemy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_enemy_id_fkey FOREIGN KEY (enemy_id) REFERENCES public.heroes(hero_id) ON DELETE CASCADE;


--
-- TOC entry 3337 (class 2606 OID 57359)
-- Name: matches matches_hero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.heroes(hero_id) ON DELETE CASCADE;


--
-- TOC entry 3338 (class 2606 OID 57354)
-- Name: matches matches_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(player_id) ON DELETE CASCADE;


--
-- TOC entry 2086 (class 826 OID 16397)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2085 (class 826 OID 16396)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2026-06-18 23:51:10

--
-- PostgreSQL database dump complete
--

