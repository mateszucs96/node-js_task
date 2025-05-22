/*
  The file contains the valid credentials to connect to MongoDB locally and in Autocode.

  For local development, please make sure to:
    - use docker-compose.mongodb.yml in the root directory
    - uncomment local development connection credentials below

  For running tests in Autocode:
    - comment out local development connection credentials below and uncomment Autocode ones
*/

// Local development

// export const DB_USER = 'mongo_user';
// export const DB_PASSWORD = 'mongo_user_password';
// export const DB_NAME = 'mongo_db';
// export const DB_HOST = 'localhost';
// export const DB_PORT = 27017;

// Autocode

export const DB_USER = ''; // no user credentials are needed for Autocode
export const DB_PASSWORD = ''; // same as above
export const DB_NAME = 'admin';
export const DB_HOST = 'localhost';
export const DB_PORT = 27017;

export const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
