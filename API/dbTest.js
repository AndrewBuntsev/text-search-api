require('dotenv').config();

const mysql = require('mysql');
const util = require('util');

// const pool = mysql.createPool(
//     {
//         host: process.env.RDS_HOSTNAME,
//         user: process.env.RDS_USERNAME,
//         password: process.env.RDS_PASSWORD,
//         database: 'til'
//     }
// );

// const query = util.promisify(pool.query).bind(pool);
// const end = util.promisify(pool.end).bind(pool);

// var mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});

// var connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     port: process.env.MYSQL_PORT
// });



module.exports = (app) => {
    app.get('/test', async (req, res) => {
        res.json({ res: 'test' });
        return;
    });



    app.get('/tags', async (req, res) => {

        connection.connect(function (err) {
            if (err) {
                res.json({ error: 'Database connection failed: ' + err.stack });
            }

            connection.query('select til.tag from tags', function (err, result) {
                if (err) {
                    res.json({ error: 'query failed: ' + err.stack });
                }
                res.json({ tags: result });

                connection.end();
            });
        });






        return;
    });



    // app.get('/tags', async (req, res) => {

    //     const tags = await query('select til.tag from tags');

    //     res.json({ tags });
    //     return;
    // });
};


