require('dotenv').config();         // read environment variables from .env file
const express = require('express'); 
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT;	 	
const host = process.env.HOST;

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- myClinic api' });
});

// routing middleware
app.use('/analises', require('./routes/analises.routes.js'))
app.use('/consultas', require('./routes/consultas.routes.js'))
app.use('/especialidades', require('./routes/especialidades.routes.js'))
app.use('/exames', require('./routes/exames.routes.js'))
app.use('/utilizadores', require('./routes/utilizadores.routes.js'))

// handle invalid routes
app.all('*', function (req, res) {
	res.status(400).json({ success: false, msg: `The API does not recognize the request on ${req.url}` });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));
