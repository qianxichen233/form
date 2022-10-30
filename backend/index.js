const fs = require('fs');
const http = require('http');
const helmet = require('helmet');
const express = require('express');
const cookieSession = require('cookie-session');

require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(helmet());

app.get('/', (req, res) => {
	res.send('Get request!');
})

http.createServer(app)
	.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
})