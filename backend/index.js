const fs = require('fs');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Get request!');
});

app.post('/questionnaire', (req, res) => {
	console.log(req.body);
	res.json({
		msg: 'Success'
	});
})

http.createServer(app)
	.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
})