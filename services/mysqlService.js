import mysql from 'mysql2';
import Logger from "rklogger";

let pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_LIMIT
});

pool.getConnection((err, connection) => {
    if (err)
        Logger.printError(`[DATABASE] Initial Database Connection Error: ${err.message}`);
    Logger.printInfo(`[DATABASE] Initial Database Connection Finalised`);
    connection.release();
});

export default pool;