const {Client} =require('pg');

const client = new Client('postgresql://<USER>:<PASSWORD>@<HOST>:5432/always_music');

client.connect (err=> {
    if(err){
        console.log('Error en la conexion a Postgress',err)
    }
})
//console.log(client)
//client.end()

async function consulta () {
  
    const { rows } = await client.query(
      "select * from alumnos"
    )
    console.log(`Registro actual`);
    console.log(rows);
    client.end()
}

async function insertar (nombre, rut, curso, nivel) {

    const {rows} = await client.query(
      `insert into alumnos (nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`
    )
    console.log(`Estudiante ${nombre} agregado con exito`);
    client.end()
}

async function editar (nombre, rut, curso, nivel) {

    const {rows} = await client.query(
      `update alumnos set nombre='${nombre}', curso='${curso}', nivel=${nivel} where rut='${rut}' returning *`
    )
    console.log(rows)
    console.log(`Estudiante ${nombre} editado con exito`);
    client.end()
}
async function consulta_rut (rut) {
  
    const { rows } = await client.query(
      `select * from alumnos where rut='${rut}'`
    )
    console.log(rows);
    client.end()
}

async function eliminar (rut) {
  
    const { rows } = await client.query(
      `delete from alumnos where rut='${rut}'`
    )
    console.log(rows);
    console.log(`Regisro de estudiante con rut ${rut} eliminado`)
    client.end()
}


function init () {
    /* if (process.argv.length <3){
        console.log('Faltan argumentos')
        return
    } */
    const accion = process.argv[2]

    if (accion == 'consulta') {
        
        consulta()
  
    } else if (accion == 'nuevo') {
  
      const nombre = process.argv[3]
      const rut = process.argv[4]
      const curso = process.argv[5]
      const nivel = process.argv[6]
  
      insertar(nombre, rut, curso, nivel)

    }else if( accion == 'editar'){
        const nombre = process.argv[3]
        const rut = process.argv[4]
        const curso = process.argv[5]
        const nivel = process.argv[6]

        editar(nombre, rut, curso, nivel)
    }else if(accion == 'rut'){
        const rut =process.argv[3]

        consulta_rut(rut)
    }else if(accion == 'eliminar'){
        const rut =process.argv[3]

        eliminar(rut)
    } else {
      console.log('Esta acción no existe.');
    }
  }
init()