require('dotenv').config();

const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(
    {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
);

const query = util.promisify(pool.query).bind(pool);
const end = util.promisify(pool.end).bind(pool);



module.exports = (app) => {
    app.get('/test', async (req, res) => {
        res.json({ res: 'test' });
        return;
    });

    app.get('/tags', async (req, res) => {

        const tags = await query('select tag from tags');

        res.json({ tags });
        return;
    });
};


