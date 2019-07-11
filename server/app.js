const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const basket = require('./routes/api/basket');

app.use('/api/basket', basket);

const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`Server started on port ${port}`));