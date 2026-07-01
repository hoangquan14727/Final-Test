const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { corsOrigin } = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: corsOrigin, credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
