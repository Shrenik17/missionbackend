import mysql from 'mysql2';
import { config } from "../config/config"

// create the connection to database
export const db = mysql.createPool({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
    debug: false,
    waitForConnections: true,
    connectionLimit: 100, //important
    maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

db.getConnection((err, con) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});