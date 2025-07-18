/*
  The file contains the valid credentials to connect to MongoDB locally and in Autocode.

  For local development, please make sure to:
    - use docker-compose.postgres.yml in the root directory
    - uncomment local development connection credentials below

  For running tests in Autocode:
    - comment out local development connection credentials below and uncomment Autocode ones
*/

// Local development

// export const DB_USER = 'node_gmp';
// export const DB_PASSWORD = 'password123';
// export const DB_NAME = 'node_gmp';
// export const DB_HOST = 'localhost';
// export const DB_PORT = 5432;

// Autocode

export const DB_USER = 'postgres';
export const DB_PASSWORD = 'postgres';
export const DB_NAME = 'postgres';
export const DB_HOST = 'localhost';
export const DB_PORT = 5432;
