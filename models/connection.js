

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgres://postgres:48221105a09748c461ad9f88c2c14bec4c67ef6f8368b2eb@twofaapi-db.internal:5432`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction
});

module.exports =  pool ;

