const { request, response } = require('express');
const express = require('express');
const app = express();
const { Routes } = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'basededatos'
});

//middleware.- 
app.use(express.json());//leer e interpretar archivos en formato json
app.use(express.urlencoded());//encriptar la url hacia el servidor y evitar inyeccion de codigos maliciosos
connection.connect((error) => {
    if (error) throw error;
    console.log('Conexion exitosa');
});
//function mensaje(valor){
//    console.log(valor);
//}

//peticiones web : metodo: 
//get= enviar informacion, recuperar datos
//post=  put/patch, delete
//

//rutas
app.get('/',(req, res) => {
    res.send("Ruta principal del proyecto");
});

app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (error, resultados) =>{
        if (error) throw error;
        if (resultados.length > 0) {
            res.json(resultados);
        } else {
            res.send('No hay registros a mostrar');
        }
    });
    //res.send('metodos para ingresar un producto');
});
app.get('/usuarios/:id', (req, res) => {
    const {id } = req.params;
    let sql = `SELECT * FROM usuarios where id = ${id}`;
    connection.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0){
            res.json(resultado);
    }else{
        res.send('No hay registros a mostrar');
    }
    });
});

app.post('/agregarusuarios',(req, res) =>{
    let sql = 'INSERT INTO usuarios SET ?';
    const dataObject = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo
    };
    connection.query(sql, dataObject, (error) =>{
        if(error) throw error;
        res.send('Registro insertado exitosamente');
    })
});

app.put('/modificarusuarios/:id', (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, correo} = req.body;
    const sql = `UPDATE usuarios SET nombre = '${nombre}', apellido = '${apellido}', correo = '${correo}' WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Registro modificado exitosamente');
    });

});

app.delete('/borrarusuarios/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM usuarios WHERE id = ${id}`;
    connection.query(sql, (error) => {
        if (error) throw error;
        res.send('Registro borrado exitosamente');
    });
});


//levaantar servidor
app.listen(4500, (req, res) => {
    console.log("Servidor corriendo exitosamente");
});
