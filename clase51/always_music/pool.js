const {Client, Pool} =require('pg');


const pool = new Pool({
  user: '',
  password: '',
  host: '',
  port: '5432',
  database: 'always_music',
  max: 20,
  min: 2,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000
})

async function consulta () {
    const client = await pool.connect()  
    const { rows } = await client.query({
      text: `select * from alumnos`,
      rowMode: 'array',
      name: 'consulta-de-todos-alumnos'
    })
    console.log(`Registro actual`);
    console.log(rows);
    client.release()
    pool.end()
}

async function insertar (nombre, rut, curso, nivel) {
    const client = await pool.connect()
    await client.query({
      text: `insert into alumnos (nombre, rut, curso, nivel) values ($1, $2, $3, $4) returning *`,
      values: [nombre,rut,curso,nivel] 
    })
    console.log(`Estudiante ${nombre} agregado con exito`);
    client.release()
    pool.end()
}

async function editar (nombre, rut, curso, nivel) {
    const client = await pool.connect()
    const {rows} = await client.query({
      text: `update alumnos set nombre=$1, curso=$3, nivel=$4 where rut=$2 returning *`,
      values: [nombre,rut, curso,nivel]
    })
    console.log(rows)
    console.log(`Estudiante ${nombre} editado con exito`);
    client.release()
    pool.end()
}
async function consulta_rut (rut) {
    const client = await pool.connect()
    const { rows } = await client.query({
      text: `select * from alumnos where rut=$1`,
      values: [rut]
    })
    console.log(rows);
    client.release()
    pool.end()
}

async function eliminar (rut) {
    const client = await pool.connect()
    const { rows } = await client.query({
      text: `delete from alumnos where rut=$1`,
      values:[rut]
    })
    console.log(rows);
    console.log(`Regisro de estudiante con rut ${rut} eliminado`)
    client.release()
    pool.end()
}


function init () {

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