--
-- PostgreSQL database dump
--

\restrict Qxq9zzBD46VZpikgazT7vTb88sTgegZKrRVdEo14wzJM2O1tLsEae3bEAYa5Bs7

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    description text NOT NULL,
    image_url character varying(255),
    link character varying(255),
    title character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: exchange_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_items (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    description text,
    farm_origin character varying(255),
    image_url character varying(255) NOT NULL,
    item_type character varying(255) NOT NULL,
    last_restocked timestamp(6) without time zone,
    main_category character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    required_points integer NOT NULL,
    stocks integer,
    sub_category character varying(255),
    unit character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    version bigint,
    CONSTRAINT exchange_items_item_type_check CHECK (((item_type)::text = ANY ((ARRAY['PRODUCT'::character varying, 'FARM'::character varying])::text[]))),
    CONSTRAINT exchange_items_main_category_check CHECK (((main_category)::text = ANY ((ARRAY['AGRICULTURAL'::character varying, 'NON_AGRICULTURAL'::character varying])::text[]))),
    CONSTRAINT exchange_items_unit_check CHECK (((unit)::text = ANY ((ARRAY['KG'::character varying, 'PIECE'::character varying, 'BUNDLE'::character varying, 'SACK'::character varying, 'POT'::character varying])::text[])))
);


ALTER TABLE public.exchange_items OWNER TO postgres;

--
-- Name: farm_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farm_types (
    farm_id uuid NOT NULL,
    farm_type character varying(255),
    CONSTRAINT farm_types_farm_type_check CHECK (((farm_type)::text = ANY ((ARRAY['AQUAPONICS'::character varying, 'VERTICAL_GARDEN'::character varying, 'GREENHOUSE'::character varying, 'HYDROPONICS'::character varying, 'BACKYARD_GARDEN'::character varying, 'VEGETABLES'::character varying, 'LIVESTOCK'::character varying, 'FRUITS'::character varying, 'POULTRY'::character varying, 'MIXED'::character varying])::text[])))
);


ALTER TABLE public.farm_types OWNER TO postgres;

--
-- Name: farms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farms (
    id uuid NOT NULL,
    address character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    description character varying(2000),
    established_at date,
    image_url character varying(255),
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name character varying(255) NOT NULL,
    size_unit character varying(255) NOT NULL,
    size_value double precision NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT farms_size_unit_check CHECK (((size_unit)::text = ANY ((ARRAY['HECTARES'::character varying, 'ACRES'::character varying, 'SQUARE_METERS'::character varying, 'SQUARE_FEET'::character varying])::text[])))
);


ALTER TABLE public.farms OWNER TO postgres;

--
-- Name: materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materials (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    description text,
    image_url character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    points_per_kg integer NOT NULL,
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.materials OWNER TO postgres;

--
-- Name: officials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.officials (
    id uuid NOT NULL,
    biography text,
    created_at timestamp(6) without time zone,
    full_name character varying(255) NOT NULL,
    image_url character varying(255) NOT NULL,
    "position" character varying(255) NOT NULL,
    updated_att timestamp(6) without time zone,
    CONSTRAINT officials_position_check CHECK ((("position")::text = ANY ((ARRAY['PUNONG_BARANGAY'::character varying, 'BARANGAY_KAGAWAD'::character varying, 'SK_CHAIRPERSON'::character varying, 'BARANGAY_SECRETARY'::character varying, 'BARANGAY_TREASURER'::character varying, 'SK_KAGAWAD'::character varying, 'BARANGAY_TANOD'::character varying])::text[])))
);


ALTER TABLE public.officials OWNER TO postgres;

--
-- Name: resident_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resident_records (
    id uuid NOT NULL,
    address character varying(255),
    birth_date date,
    contact_number character varying(11),
    created_at timestamp(6) without time zone,
    first_name character varying(255) NOT NULL,
    gender character varying(50) NOT NULL,
    is_resident boolean NOT NULL,
    last_name character varying(255) NOT NULL,
    middle_name character varying(255),
    points numeric(10,2) NOT NULL,
    suffix character varying(10),
    updated_at timestamp(6) without time zone,
    version bigint,
    CONSTRAINT resident_records_gender_check CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying, 'LGBTQIA_PLUS'::character varying, 'PREFER_NOT_TO_SAY'::character varying])::text[])))
);


ALTER TABLE public.resident_records OWNER TO postgres;

--
-- Name: reward_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reward_activities (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    points numeric(10,2) NOT NULL,
    type character varying(255) NOT NULL,
    record_id uuid NOT NULL,
    CONSTRAINT reward_activities_type_check CHECK (((type)::text = ANY ((ARRAY['EARN'::character varying, 'REDEEM'::character varying])::text[])))
);


ALTER TABLE public.reward_activities OWNER TO postgres;

--
-- Name: reward_activity_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reward_activity_materials (
    id uuid NOT NULL,
    points numeric(10,2) NOT NULL,
    weight numeric(10,2) NOT NULL,
    activity_id uuid NOT NULL,
    material_id uuid NOT NULL
);


ALTER TABLE public.reward_activity_materials OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    refresh_token character varying(255),
    refresh_token_exp timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    username character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SUPER_ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: exchange_items exchange_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_items
    ADD CONSTRAINT exchange_items_pkey PRIMARY KEY (id);


--
-- Name: farms farms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_pkey PRIMARY KEY (id);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: officials officials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officials
    ADD CONSTRAINT officials_pkey PRIMARY KEY (id);


--
-- Name: resident_records resident_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resident_records
    ADD CONSTRAINT resident_records_pkey PRIMARY KEY (id);


--
-- Name: reward_activities reward_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_activities
    ADD CONSTRAINT reward_activities_pkey PRIMARY KEY (id);


--
-- Name: reward_activity_materials reward_activity_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_activity_materials
    ADD CONSTRAINT reward_activity_materials_pkey PRIMARY KEY (id);


--
-- Name: farms uk5eca4s3pnujm1syymfk36pkgu; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT uk5eca4s3pnujm1syymfk36pkgu UNIQUE (name);


--
-- Name: officials ukkkaptktehqv4gcergwquhhn26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officials
    ADD CONSTRAINT ukkkaptktehqv4gcergwquhhn26 UNIQUE (full_name);


--
-- Name: exchange_items ukn9oud5mwt74hqnk9use8lop9w; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_items
    ADD CONSTRAINT ukn9oud5mwt74hqnk9use8lop9w UNIQUE (name);


--
-- Name: users ukr43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT ukr43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: reward_activity_materials fk3tl8b6skj3f19x1e4kl6q2cu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_activity_materials
    ADD CONSTRAINT fk3tl8b6skj3f19x1e4kl6q2cu FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- Name: reward_activity_materials fki3s37d1rl9pvdub78xoyvukgs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_activity_materials
    ADD CONSTRAINT fki3s37d1rl9pvdub78xoyvukgs FOREIGN KEY (activity_id) REFERENCES public.reward_activities(id);


--
-- Name: farm_types fkkim6vv3ppk0vsum1o7i2c4gjn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farm_types
    ADD CONSTRAINT fkkim6vv3ppk0vsum1o7i2c4gjn FOREIGN KEY (farm_id) REFERENCES public.farms(id);


--
-- Name: reward_activities fkkovjh02wvc07mbnm03tukdgfb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_activities
    ADD CONSTRAINT fkkovjh02wvc07mbnm03tukdgfb FOREIGN KEY (record_id) REFERENCES public.resident_records(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Qxq9zzBD46VZpikgazT7vTb88sTgegZKrRVdEo14wzJM2O1tLsEae3bEAYa5Bs7

