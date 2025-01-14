-- Create the database
CREATE DATABASE nestjs_boilerplate;

-- Grant all privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE nestjs_boilerplate TO root;

-- Connect to the database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
