const {Pool} = require('pg')

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'bancosolar',
    port: '5432',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
})

async function agregarUsuario (nombre, balance) {
    try {
        const client = await pool.connect()
        if (balance==null){
            console.log('Debe ingresar un valor numerico');
            return
        }else{
        await client.query({
            text: `insert into usuarios (nombre, balance) values ($1, $2) returning *`,
            values: [nombre, balance]
        })
        client.release()
        }
        
    } catch (error) {
        manejoError(error)
    }
}

async function traerUsuarios(){
    try {
        const client = await pool.connect()
        const {rows} = await client.query({
            text: `select * from usuarios`
        })
        client.release()
        return rows;
        
    } catch (error) {
        manejoError(error)
    }
}

async function traerTransferencias(){
    try {
        const client = await pool.connect()
        const {rows} = await client.query({
            text: `select transferencias.id,usuarios.nombre,users.nombre,transferencias.monto, transferencias.fecha from transferencias join usuarios on transferencias.emisor=usuarios.id join usuarios as users on transferencias.receptor=users.id`,
            rowMode: 'array'
        })
        client.release()
        return rows;
        
    } catch (error) {
        manejoError(error)       
    }
}

async function editarUsuario(id,nombre,balance){
    try {
        const client = await pool.connect()
        await client.query({
            text: `update usuarios set nombre=$2, balance=$3 where id=$1`,
            values: [parseInt(id),nombre,balance]
        })
        client.release()
    } catch (error) {
        manejoError(error)
    }
}
async function eliminarUsuario(id){
    try {
        const client = await pool.connect()
        await client.query({
            text: `delete from transferencias where emisor=$1 or receptor=$1`,
            values: [parseInt(id)]
        })
        await client.query({
            text: `delete from usuarios where id=$1`,
            values: [parseInt(id)]
        })
        client.release()
        
    } catch (error) {
        manejoError(error)
    }
}

async function transferir(emisor,receptor,monto){
    try {
        const client = await pool.connect()
        const obtenerIdEmisor = await client.query({
            text: `select id from usuarios where nombre=$1`,
            values:[emisor]
        })
        const obtenerIdReceptor = await client.query({
            text: `select id from usuarios where nombre=$1`,
            values:[receptor]
        })
        let id_emisor = obtenerIdEmisor.rows[0].id
        let id_receptor= obtenerIdReceptor.rows[0].id
        const obtenerSaldoEmisor = await client.query({
            text: `select balance from usuarios where id=$1`,
            values: [id_emisor]
        })
        const obtenerSaldoReceptor = await client.query({
            text: `select balance from usuarios where id=$1`,
            values: [id_receptor]
        })
        let saldoEmisor = obtenerSaldoEmisor.rows[0].balance
        let saldoReceptor = obtenerSaldoReceptor.rows[0].balance
        client.release()
        if ((saldoEmisor-monto)<0){
            console.log('No hay saldo disponible para la operacion');
            return
        }else if(id_emisor==id_receptor){
            console.log(`Emisor y receptor no pueden ser el mismo`)
            return
        }else{
            await editarUsuario(id_emisor,emisor,(parseInt(saldoEmisor)-parseInt(monto)))
            await editarUsuario(id_receptor,receptor,(parseInt(saldoReceptor)+parseInt(monto)))
            await client.query({
                text: `insert into transferencias (emisor,receptor,monto) values ($1,$2,$3) returning *`,
                values: [id_emisor,id_receptor,monto]
            })
        }
    } catch (error) {
        manejoError(error)       
    }

}

function manejoError(error){
    let codigoError=error.code
    if (codigoError=='ECONNREFUSED'){
        console.log(`Error ${codigoError}, no es posible establecer conexion con la base de datos`);
    }else if (codigoError=='28P01'){
        console.log(`Error ${codigoError}, credenciales de la base de datos incorrectas`);
    }else if (codigoError=='3D000'){
        console.log(`Error ${codigoError}, nombre de la base de datos incorrecta`);
    }else if (codigoError=='EAI_AGAIN'){
        console.log(`Error ${codigoError}, host incorrecto`);
    }else if (codigoError=='23514'){
        console.log(`Error ${codigoError}, el balance no puede ser negativo`);
    }else if (codigoError=='23503'){
        console.log(`Error ${codigoError}, no se puede eliminar un usuario con transferencias`);
    }else if(codigoError=='22P02'){
        console.log(`Error ${codigoError}, tipo de dato incorrecto`);
    }else if(codigoError=='23505'){
        console.log(`Error ${codigoError}, el usuario ya existe`);
    }else{
        console.log(error);
    }  
}


module.exports={
    agregarUsuario,
    traerUsuarios,
    editarUsuario,
    eliminarUsuario,
    traerTransferencias,
    transferir
}