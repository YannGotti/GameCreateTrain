
const pg = require('pg');

const config = {
    host: 'localhost',
    user: 'admin',     
    password: 'ADMINADMIN',
    database: 'fawe',
    port: 5432,
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else { queryDatabase(); }
});

function queryDatabase() {
  
    console.log(`Running query to PostgreSQL server: ${config.host}:${config.port}`);

    //const query = 'SELECT * FROM users;';

    /*client.query(query)
        .then(res => {
            const rows = res.rows;

            rows.map(row => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });

            process.exit();
        })
        .catch(err => {
            console.log(err);
        });
    */
}