require('dotenv').config();

export const config = {
    port: Number(process.env.PORT),
    baseUrl: process.env.BASE_URL,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    dbPort: Number(process.env.DB_PORT)
}