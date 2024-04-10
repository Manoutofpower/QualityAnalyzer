import mysql from 'mysql2';


let pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_LIMIT
});

pool.getConnection((err, connection) => {
    if (err)
        console.log(`[DATABASE] Initial Database Connection Error: ${err.message}`);
    console.log(`[DATABASE] Initial Database Connection Finalised`);
    connection.release();
});

export default pool;