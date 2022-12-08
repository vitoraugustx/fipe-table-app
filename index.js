// Imports
const express = require('express');
const app = express();
const port = process.env.PORT || 3577
const bodyParser = require('body-parser')
const cors = require('cors');

// Configs Express
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }))
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json( {limit: '200mb'} ));
app.use(express.static('public'));

// Cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors())
    next()
})

// App
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/html/index.html');     
});

app.get('/search', (req, res) =>{
    res.sendFile(__dirname + '/public/html/vehicle_search.html');     
});

app.get('/graph', (req, res) =>{
    res.sendFile(__dirname + '/public/html/vehicle_graph.html');     
});

app.get('/compare', (req, res) =>{
    res.sendFile(__dirname + '/public/html/vehicle_compare.html');     
});

app.listen(port, () => {
    console.log(`Servidor rodando no endereco http://localhost:${port}`);
});