const express = require('express')
const {agregar, traer} =require('./db.js')

const app = express()
const PORT = 3000
app.use(express.static('static'))

app.get('/canciones', async (req, res) =>{
    console.log('Dentro')
    const data = await traer()
    res.send(data)
})

app.post('/cancion', async(req,res) =>{
    let data
    req.on('data', (contenido)=>{
        data = JSON.parse(contenido)
    })
    req.on('end', async ()=>{
        const cancion = data.cancion
        const artista = data.artista
        const tono = data.tono
        console.log(`Cancion ${cancion}`);
        console.log(`Artista ${artista}`);
        console.log(`Tono ${tono}`);
        const post = await agregar(cancion, artista, tono);
        res.send(post)
    })
})

app.listen(PORT, ()=> console.log(`Ejecutando servidor en el puerto ${PORT}`))