const {Client} =require('pg');

//const client = new Client('postgresql://<USER>:<PASSWORD>@<HOST>:5432/jeans');

// conexio usando un objeto
const client = new Client({
    user: '',
    password: '',
    host: '',
    port: '5432',
    database: 'jeans'
})
  

//console.log(client);

client.connect (err=> {
    if(err){
        console.log('Error en la conexion a Postgress',err)
    }
})

/* function insertar () {
    client.query(
        "insert into ropa (nombre, talla, color) values ('polera','M','blanco')",
        function (err,result) {
            console.log('Error',err);
            console.log('Resultado',result)
            client.end()
        }

    )
} */

async function insertar (nombre, talla, color) {

    const res = await client.query(
      `insert into ropa (nombre, talla, color) values ('${nombre}', '${talla}', '${color}') returning *`
    )
    console.log(res);
    client.end()
  
  }

async function leer () {
  
    const { rows } = await client.query(
      "select * from ropa"
    )
    console.log(rows);
    client.end()
}

//leer()

/* async function init () {
    const instruccion = process.argv[2]
    const prenda = process.argv[3]
    const talla = process.argv[4]
    const color = process.argv[5]
    let miInstrtuccion =''

    if (instruccion != 'insertar'){
        console.log('Por ahora solo funcion insertar')
        return
    }else{
        miInstrtuccion ='insert'
    }

    console.log(miInstrtuccion);
    console.log(prenda)
    console.log(talla)
    console.log(color)

    client.connect()

    const res = await client.query(
       `${miInstrtuccion} into ropa (nombre, talla, color) values ('${prenda}', '${talla}', '${color}')`
    )
    console.log(res);

    client.end()


} */
function init () {
    const accion = process.argv[2]
  
    if (accion == 'leer') {
  
      leer()
  
    } else if (accion == 'insertar') {
  
      const nombre = process.argv[3]
      const talla = process.argv[4]
      const color = process.argv[5]
  
      insertar(nombre, talla, color)
  
    } else {
      console.log('Esta acción no existe.');
    }
  }
init()