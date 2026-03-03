-- =========================================
-- V1__initial_schema.sql
-- Clean Flyway Migration (H2 Compatible)
-- =========================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    link VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE exchange_items (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP,
    description TEXT,
    farm_origin VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    last_restocked TIMESTAMP,
    main_category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    required_points INTEGER NOT NULL,
    stocks INTEGER,
    sub_category VARCHAR(255),
    unit VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP,
    version BIGINT
);

CREATE TABLE farms (
    id UUID PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    description VARCHAR(2000),
    established_at DATE,
    image_url VARCHAR(255),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    size_unit VARCHAR(255) NOT NULL,
    size_value DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE farm_types (
    farm_id UUID NOT NULL,
    farm_type VARCHAR(255),
    CONSTRAINT fk_farm_types_farm
        FOREIGN KEY (farm_id) REFERENCES farms(id)
);

CREATE TABLE materials (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    points_per_kg INTEGER NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE officials (
    id UUID PRIMARY KEY,
    biography TEXT,
    created_at TIMESTAMP,
    full_name VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    updated_att TIMESTAMP
);

CREATE TABLE resident_records (
    id UUID PRIMARY KEY,
    address VARCHAR(255),
    birth_date DATE,
    contact_number VARCHAR(11),
    created_at TIMESTAMP,
    first_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    is_resident BOOLEAN NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    points NUMERIC(10,2) NOT NULL,
    suffix VARCHAR(10),
    updated_at TIMESTAMP,
    version BIGINT
);

CREATE TABLE reward_activities (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    points NUMERIC(10,2) NOT NULL,
    type VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    CONSTRAINT fk_reward_record
        FOREIGN KEY (record_id) REFERENCES resident_records(id)
);

CREATE TABLE reward_activity_materials (
    id UUID PRIMARY KEY,
    points NUMERIC(10,2) NOT NULL,
    weight NUMERIC(10,2) NOT NULL,
    activity_id UUID NOT NULL,
    material_id UUID NOT NULL,
    CONSTRAINT fk_reward_material
        FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT fk_reward_activity
        FOREIGN KEY (activity_id) REFERENCES reward_activities(id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    refresh_token_exp TIMESTAMP,
    updated_at TIMESTAMP,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL
);