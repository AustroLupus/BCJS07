const express = require('express')
const {
    agregarUsuario,
    traerUsuarios,
    editarUsuario,
    eliminarUsuario,
    traerTransferencias,
    transferir
} = require('./db.js')

const app = express()
const PORT = 3000
app.use(express.static('static'))

app.get('/usuarios', async (req,res)=>{
    try {
        const data = await traerUsuarios()
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send({error})
        
    }
})

app.post('/usuario', async (req,res)=>{
    let body =''
    req.on('data', data => body += data)
    req.on('end', async () => {
        try {
            body = JSON.parse(body)
            await agregarUsuario(body.nombre, body.balance)
            res.status(200).json({todo: 'ok'})
        } catch (error) {
            res.status(400).send({error})
        }
    })
})

app.put('/usuario', async (req,res) =>{
    let body =''
    req.on('data', data => body += data)
    req.on('end', async () => {
        try {
            body = JSON.parse(body)
            await editarUsuario(req.query.id,body.name,body.balance)
            res.status(200).json({todo: 'ok'})
        } catch (error) {
            res.status(400).send({error})
        }
    })
})

app.delete('/usuario', async (req,res) =>{
    try {
        await eliminarUsuario(req.query.id)
        res.status(200).json({todo: 'ok'})
    } catch (error) {
        res.status(400).send({error})
    }
})

app.get('/transferencias', async (req,res)=>{
    try {
        const data= await traerTransferencias();
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send({error})
    }
})

app.post('/transferencia', async (req,res)=>{
    let body =''
    req.on('data', data => body += data)
    req.on('end', async () => {
        try {
            body = JSON.parse(body)
            await transferir(body.emisor,body.receptor,body.monto)     
            res.status(200).json({todo: 'ok'})
        } catch (error) {
            res.status(400).send({error})            
        }
    })
})

app.get('/favicon.ico', (req, res)=>{
    try {
        res.status(200).send('/favicon.ico')
    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }
});

app.listen(PORT,() => {
    console.log(`Servidor corriendo NodeJS en puerto ${PORT}`)
});