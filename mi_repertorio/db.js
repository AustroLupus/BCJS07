const {Pool} = require('pg')

const pool = new Pool ({
    user: 'ziggywlz',
    host: 'localhost',
    database: 'repertorio',
    port: '5432',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
})

async function agregar (cancion, artista, tono){
    const client = await pool.connect()
    await client.query({
        text: `insert into repertorio (cancion, artista, tono) values ($1, $2, $3) returning *`,
        values: [cancion,artista,tono]        
    })
    client.release()
}

async function traer(){
    const client = await pool.connect()
    const {rows} = await client.query({
        text: `select * from repertorio`
    })
    client.release()
    return rows;
}

module.exports = {agregar,traer}